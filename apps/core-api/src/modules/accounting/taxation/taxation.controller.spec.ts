import { Test, TestingModule } from '@nestjs/testing';
import { TaxationController } from './taxation.controller';
import { TaxationService } from './taxation.service';

describe('TaxationController', () => {
  let controller: TaxationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxationController],
      providers: [TaxationService],
    }).compile();

    controller = module.get<TaxationController>(TaxationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
