import { CoreEntity } from 'src/common/core.entity';
import { PointLog } from 'src/points/entities/point-log.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Users extends CoreEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.user)
  pointLogs: PointLog[];
}
