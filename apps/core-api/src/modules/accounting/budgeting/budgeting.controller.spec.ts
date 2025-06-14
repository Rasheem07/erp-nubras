import { Test, TestingModule } from '@nestjs/testing';
import { BudgetingController } from './budgeting.controller';
import { BudgetingService } from './budgeting.service';

describe('BudgetingController', () => {
  let controller: BudgetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetingController],
      providers: [BudgetingService],
    }).compile();

    controller = module.get<BudgetingController>(BudgetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
