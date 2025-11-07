import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dtos/login-user.dto';
import { RefreshTokenGuard } from './guards/token.guard';
import { AuthUser } from './auth-user.decorator';
import { RefreshTokenDto } from './dtos/refresh-token-dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginInputDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@AuthUser() user: RefreshTokenDto) {
    return this.authService.rotateToken(user);
  }
}
