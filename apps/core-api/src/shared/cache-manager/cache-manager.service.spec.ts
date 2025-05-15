// src/cache-manager/cache-manager.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheManagerService } from './cache-manager.service';
import { ICacheManager } from './cache-manager.interface';

describe('CacheManagerService', () => {
  let service: CacheManagerService;
  let mockCache: Partial<ICacheManager>;

  beforeEach(async () => {
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheManagerService,
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<CacheManagerService>(CacheManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get() returns stored value or null', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue('foo');
    await expect(service.get('key')).resolves.toBe('foo');

    (mockCache.get as jest.Mock).mockResolvedValue(undefined);
    await expect(service.get('key')).resolves.toBeNull();
  });

  it('set() calls cache.set with ttl option', async () => {
    await service.set('a', 123, 30);
    expect(mockCache.set).toHaveBeenCalledWith('a', 123, { ttl: 30 });

    await service.set('b', 'bar');
    expect(mockCache.set).toHaveBeenCalledWith('b', 'bar', { ttl: undefined });
  });

  it('del() calls cache.del', async () => {
    await service.del('x');
    expect(mockCache.del).toHaveBeenCalledWith('x');
  });

  it('reset() calls cache.reset', async () => {
    await service.reset();
    expect(mockCache.reset).toHaveBeenCalled();
  });
});
