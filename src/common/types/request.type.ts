import { Request } from 'express';
import { TOKEN_TYPE } from 'src/auth/const/auth.const';
import { Users } from 'src/users/entities/users.entity';

export type RequestWithUser = Request & {
  user: Pick<Users, 'email' | 'password'>;
};

// 이거 다른곳으로 옮기기
export type TokenPayload = {
  email: string;
  id: number;
  type: TOKEN_TYPE.ACCESS | TOKEN_TYPE.REFRESH;
  iat: number;
  exp: number;
};

export type RequestWithAuth = Request & {
  user: { email: string; id: number };
  token: string;
  tokenType: TOKEN_TYPE.ACCESS | TOKEN_TYPE.REFRESH;
};
