// src/cache-manager/cache-manager.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ICacheManager } from './cache-manager.interface';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: ICacheManager,
  ) {}

  async get<T = any>(key: string): Promise<T | null> {
    const val = await this.cache.get<T>(key);
    return val ?? null;
  }

  async set<T = any>(key: string, value: T, ttlSeconds?: number) {
    await this.cache.set(key, value, { ttl: ttlSeconds });
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async reset() {
    await this.cache.reset();
  }
}
