import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestWithAuth } from 'src/common/types/request.type';
import { TOKEN_TYPE } from '../const/auth.const';

@Injectable()
export abstract class BearerTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await Promise.resolve(); // 타입에러 방지 async 처리 위함
    const req = context.switchToHttp().getRequest<RequestWithAuth>();

    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    const [tokenScheme, token] = bearerToken.split(' ');
    if (tokenScheme !== 'Bearer') {
      throw new UnauthorizedException('잘못된 토큰 입니다.');
    }

    const payload = this.authService.jwtVerify(token);

    req.user = { email: payload.email, id: payload.id };
    req.tokenType = payload.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);

    if (!activated) {
      return false;
    }

    const req = context.switchToHttp().getRequest<RequestWithAuth>();
    if (req.tokenType !== TOKEN_TYPE.ACCESS) {
      throw new UnauthorizedException('액세스 토큰이 아닙니다.');
    }
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);

    if (!activated) {
      return false;
    }

    const req = context.switchToHttp().getRequest<RequestWithAuth>();
    if (req.tokenType !== TOKEN_TYPE.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }
    return true;
  }
}
