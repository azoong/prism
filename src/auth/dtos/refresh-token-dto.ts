import { PickType } from '@nestjs/mapped-types';
import { Users } from 'src/users/entities/users.entity';

export class RefreshTokenDto extends PickType(Users, ['email', 'id']) {}
