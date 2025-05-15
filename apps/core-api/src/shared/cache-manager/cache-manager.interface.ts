// src/cache-manager/cache-manager.interface.ts
export interface ICacheManager {
  get<T = any>(key: string): Promise<T | undefined>;
  set<T = any>(key: string, value: T, options?: { ttl?: number }): Promise<void>;
  del(key: string): Promise<void>;
  reset(): Promise<void>;
}
