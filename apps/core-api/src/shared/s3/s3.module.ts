// src/common/s3.module.ts

import { DynamicModule, Module, Provider } from '@nestjs/common';
import { S3Service } from './s3.service';

export interface S3ModuleOptions {
  region: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface S3ModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => Promise<S3ModuleOptions> | S3ModuleOptions;
  inject?: any[];
}

const S3_OPTIONS = 'S3_OPTIONS';

@Module({})
export class S3Module {
  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    const asyncProvider: Provider = {
      provide: S3_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: S3Module,
      imports: options.imports || [],
      providers: [
        asyncProvider,
        {
          provide: S3Service,
          useFactory: (opts: S3ModuleOptions) => new S3Service(opts),
          inject: [S3_OPTIONS],
        },
      ],
      exports: [S3Service],
    };
  }
}
