import { Request } from 'express';
import { TOKEN_TYPE } from 'src/auth/const/auth.const';
import { Users } from 'src/users/entities/users.entity';

export type RequestWithUser = Request & {
  user: Pick<Users, 'email' | 'password'>;
};

export type RequestWithToken = Request & {
  user: { email: string; id: number };
  token: string;
  tokenType: TOKEN_TYPE;
};
