import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Omit<Users, 'password'>> {
    const { email, name, password } = createUserDto;
    await this.validateUniqueUser(email, name);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async validateUniqueUser(email: string, name: string) {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { name }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }
      if (existingUser.name === name) {
        throw new BadRequestException('이미 존재하는 이름입니다.');
      }
    }
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAllUsers(): Promise<Users[]> {
    return this.usersRepository.find();
  }
}
