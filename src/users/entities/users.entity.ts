import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { PointLog } from 'src/points/entities/point-log.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Users extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.user)
  pointLogs: PointLog[];
}
