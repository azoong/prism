import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { EarnPointDto } from './dtos/earn-point.dto';
import { AccessTokenGuard } from 'src/auth/guards/token.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Users } from 'src/users/entities/users.entity';

@Controller('api')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('earn')
  @UseGuards(AccessTokenGuard)
  earnPoints(@AuthUser() user: Users, @Body() earnPointDto: EarnPointDto) {
    return this.pointsService.earnPoints(user.id, earnPointDto);
  }

  @Get('balance')
  @UseGuards(AccessTokenGuard)
  getBalance(@AuthUser() user: Users) {
    return this.pointsService.getBalance(user.id);
  }

  @Get('history')
  @UseGuards(AccessTokenGuard)
  getHistory(@AuthUser() user: Users) {
    return this.pointsService.getBalanceHistory(user.id);
  }
}
