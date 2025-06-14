import { Test, TestingModule } from '@nestjs/testing';
import { BudgetingService } from './budgeting.service';

describe('BudgetingService', () => {
  let service: BudgetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetingService],
    }).compile();

    service = module.get<BudgetingService>(BudgetingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
