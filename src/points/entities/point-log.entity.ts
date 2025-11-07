import { CoreEntity } from 'src/common/entities/core.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PointLog extends CoreEntity {
  @ManyToOne(() => Users, (user) => user.pointLogs)
  user: Users;

  @Column()
  points: number;

  @Column()
  reason: string;
}
