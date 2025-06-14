import { Module } from '@nestjs/common';
import { TaxationService } from './taxation.service';
import { TaxationController } from './taxation.controller';

@Module({
  controllers: [TaxationController],
  providers: [TaxationService],
})
export class TaxationModule {}
