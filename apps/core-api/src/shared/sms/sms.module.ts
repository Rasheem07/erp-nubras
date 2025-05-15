// src/sms/sms.module.ts
import {
  Module,
  DynamicModule,
  Global,
  Provider,
} from '@nestjs/common';
import { SmsModuleOptions, SmsModuleAsyncOptions, SMS_MODULE_OPTIONS, TWILIO_CLIENT } from './sms.constants';
import { SmsService } from './sms.service';
import * as Twilio from 'twilio';

@Global()
@Module({})
export class SmsModule {
  static forRoot(options: SmsModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: SMS_MODULE_OPTIONS,
      useValue: options,
    };
    const clientProvider: Provider = {
      provide: TWILIO_CLIENT,
      useFactory: (opts: SmsModuleOptions) => new Twilio.Twilio(opts.accountSid, opts.authToken),
      inject: [SMS_MODULE_OPTIONS],
    };

    return {
      module: SmsModule,
      providers: [optionsProvider, clientProvider, SmsService],
      exports: [SmsService],
    };
  }

  static forRootAsync(opts: SmsModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: SMS_MODULE_OPTIONS,
      useFactory: opts.useFactory,
      inject: opts.inject || [],
    };
    const clientProvider: Provider = {
      provide: TWILIO_CLIENT,
      useFactory: (options: SmsModuleOptions) => new Twilio.Twilio(options.accountSid, options.authToken),
      inject: [SMS_MODULE_OPTIONS],
    };

    return {
      module: SmsModule,
      imports: opts.imports || [],
      providers: [optionsProvider, clientProvider, SmsService],
      exports: [SmsService],
    };
  }
}
