// src/sms/sms.constants.ts
export const SMS_MODULE_OPTIONS = 'SMS_MODULE_OPTIONS';
export const TWILIO_CLIENT = 'TWILIO_CLIENT';

export interface SmsModuleOptions {
  accountSid: string;
  authToken: string;
  from: string;
}

export interface SmsModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<SmsModuleOptions> | SmsModuleOptions;
}
