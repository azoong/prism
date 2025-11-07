import { Users } from '../entities/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(Users, ['email', 'name', 'password']) {}
