import { Test, TestingModule } from '@nestjs/testing';
import { TailoringService } from './tailoring.service';

describe('TailoringService', () => {
  let service: TailoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TailoringService],
    }).compile();

    service = module.get<TailoringService>(TailoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
