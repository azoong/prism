import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EarnPointDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  reason: string;
}
