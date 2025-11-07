import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PointsService } from './points.service';
import { EarnPointDto } from './dtos/earn-point.dto';

@Controller('api')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('earn')
  earnPoints(@Body() earnPointDto: EarnPointDto) {
    return this.pointsService.earn(earnPointDto);
  }

  @Get('balance/:userId')
  getBalance(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getBalance(userId);
  }

  @Get('history/:userId')
  getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getHistory(userId);
  }
}
