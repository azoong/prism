import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { RequestWithAuth } from './types/auth.type';

export const AuthUser = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<RequestWithAuth>();

  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User 정보가 존재하지 않습니다.');
  }

  return user;
});
