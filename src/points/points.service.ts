import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { PointLog } from './entities/point-log.entity';
import { EarnPointDto } from './dtos/earn-point.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(PointLog)
    private readonly pointLogsRepository: Repository<PointLog>,
    private readonly dataSource: DataSource,
  ) {}

  async earnPoints(userId: number, { points, reason }: EarnPointDto) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(PointLog, {
        user: { id: userId },
        points,
        reason,
      });

      await transactionalEntityManager.increment(Users, { id: userId }, 'points', points);

      const user = await transactionalEntityManager.findOne(Users, { where: { id: userId } });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      return {
        id: user.id,
        email: user.email,
        points: user.points,
      };
    });
  }

  async getBalance(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, select: ['id', 'points'] });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id,
      points: user.points,
    };
  }

  async getBalanceHistory(userId: number) {
    const pointLogs = await this.pointLogsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (!pointLogs) {
      throw new NotFoundException('포인트 내역을 찾을 수 없습니다.');
    }

    return pointLogs;
  }
}
