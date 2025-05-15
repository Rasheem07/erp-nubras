

import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MailModuleOptions, MailModuleAsyncOptions, MAIL_OPTIONS } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: MAIL_OPTIONS,
      useValue: options,
    };

    return {
      module: MailModule,
      providers: [optionsProvider, MailService],
      exports: [MailService],
    };
  }

  static forRootAsync(asyncOptions: MailModuleAsyncOptions): DynamicModule {
    const asyncProvider: Provider = {
      provide: MAIL_OPTIONS,
      useFactory: asyncOptions.useFactory,
      inject: asyncOptions.inject || [],
    };

    return {
      module: MailModule,
      imports: asyncOptions.imports || [],
      providers: [asyncProvider, MailService],
      exports: [MailService],
    };
  }
}
