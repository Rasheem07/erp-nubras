import { Test, TestingModule } from '@nestjs/testing';
import { TaxationService } from './taxation.service';

describe('TaxationService', () => {
  let service: TaxationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxationService],
    }).compile();

    service = module.get<TaxationService>(TaxationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
