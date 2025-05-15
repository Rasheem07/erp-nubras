
import { Module, DynamicModule, Global } from '@nestjs/common';
import {
  CacheModule,
  CacheModuleOptions,
  CacheModuleAsyncOptions,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CacheManagerService } from './cache-manager.service';

export interface RedisCacheOptions {
  host: string;
  port: number;
  ttl?: number;              // default time-to-live in seconds
  password?: string;
  db?: number;
}

export interface RedisCacheAsyncOptions extends Pick<CacheModuleAsyncOptions, 'imports'> {
  useFactory: (...args: any[]) => Promise<RedisCacheOptions> | RedisCacheOptions;
  inject?: any[];
}

@Global()
@Module({})
export class CacheManagerModule {
  /**
   * Synchronous registration:
   *   CacheManagerModule.forRoot({ host: '...', port: 6379, ttl: 60 })
   */
  static forRoot(options: RedisCacheOptions): DynamicModule {
    const cacheOptions: CacheModuleOptions = {
      store: redisStore,
      host: options.host,
      port: options.port,
      ttl: options.ttl ?? 0,
      password: options.password,
      db: options.db,
    };

    return {
      module: CacheManagerModule,
      imports: [CacheModule.register(cacheOptions)],
      providers: [CacheManagerService],
      exports: [CacheManagerService],
    };
  }

  /**
   * Asynchronous registration:
   *   CacheManagerModule.forRootAsync({
   *     imports: [ConfigModule],
   *     useFactory: (cs: ConfigService) => cs.getRedisConfig(),
   *     inject: [ConfigService],
   *   })
   */
  static forRootAsync(opts: RedisCacheAsyncOptions): DynamicModule {
    const asyncOpts: CacheModuleAsyncOptions = {
      imports: opts.imports,
      useFactory: async (...args) => {
        const cfg = await opts.useFactory(...args);
        return {
          store: redisStore,
          host: cfg.host,
          port: cfg.port,
          ttl: cfg.ttl ?? 0,
          password: cfg.password,
          db: cfg.db,
        };
      },
      inject: opts.inject,
    };

    return {
      module: CacheManagerModule,
      imports: [CacheModule.registerAsync(asyncOpts)],
      providers: [CacheManagerService],
      exports: [CacheManagerService],
    };
  }
}
