import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { PointLog } from './entities/point-log.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(PointLog)
    private readonly pointLogsRepository: Repository<PointLog>,
    private readonly dataSource: DataSource,
  ) {}

  async earn({ userId, points, reason }: {
    userId: number;
    points: number;
    reason: string;
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(Users, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      user.balance += points;
      await queryRunner.manager.save(user);

      const pointLog = this.pointLogsRepository.create({ user, points, reason });
      await queryRunner.manager.save(pointLog);

      await queryRunner.commitTransaction();

      return {
        userId: user.id,
        pointsAdded: points,
        currentBalance: user.balance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while processing the transaction.');
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return {
      userId: user.id,
      balance: user.balance,
      lastUpdated: user.updatedAt,
    };
  }

  async getHistory(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const transactions = await this.pointLogsRepository.find({ where: { user: { id: userId } } });

    return {
      userId: user.id,
      transactions: transactions.map(t => ({
        id: t.id,
        type: 'earn', // 현재는 적립만 있으므로 하드코딩
        points: t.points,
        reason: t.reason,
        timestamp: t.createdAt,
      })),
    };
  }
}
