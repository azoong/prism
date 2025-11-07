import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TOKEN_TYPE } from './const/auth.const';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entities/users.entity';
import { LoginInputDto } from './dtos/login-user.dto';
import { RequestWithToken } from 'src/common/types/request.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async loginUser(loginUserDto: LoginInputDto) {
    const user = await this.authenticateWithEmailAndPassword(loginUserDto);

    return this.generateTokens({ email: user.email, id: user.id });
  }

  generateTokens(user: Pick<Users, 'email' | 'id'>) {
    return {
      accessToken: this.jwtSign(user, false),
      refreshToken: this.jwtSign(user, true),
    };
  }

  async authenticateWithEmailAndPassword({ email, password }: LoginInputDto) {
    const existingUser = await this.usersService.getUserByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다');
    }

    const pass = await bcrypt.compare(password, existingUser.password);

    if (!pass) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    return existingUser;
  }

  jwtSign(user: Pick<Users, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      id: user.id,
      type: isRefreshToken ? TOKEN_TYPE.REFRESH : TOKEN_TYPE.ACCESS,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  jwtVerify(token: string): RequestWithToken {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('PRIVATE_KEY'),
      });
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다. verifyToken');
    }
  }
}
