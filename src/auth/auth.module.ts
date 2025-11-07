import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AccessTokenGuard, RefreshTokenGuard } from './guards/token.guard';

@Global()
@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenGuard, RefreshTokenGuard],
  exports: [AuthService, AccessTokenGuard, RefreshTokenGuard],
})
export class AuthModule {}
