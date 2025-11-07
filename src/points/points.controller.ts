import { Controller } from '@nestjs/common';
import { PointsService } from './points.service';

@Controller('api')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}
}
