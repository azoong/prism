import { Request } from 'express';
import { TOKEN_TYPE } from 'src/auth/const/auth.const';

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
