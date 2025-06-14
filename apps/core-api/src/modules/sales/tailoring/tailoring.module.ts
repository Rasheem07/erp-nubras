import { Module } from '@nestjs/common';
import { TailoringService } from './tailoring.service';
import { TailoringController } from './tailoring.controller';

@Module({
  controllers: [TailoringController],
  providers: [TailoringService],
})
export class TailoringModule {}
