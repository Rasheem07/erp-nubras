export const MAIL_OPTIONS = 'MAIL_OPTIONS';


export interface MailModuleOptions {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface MailModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<MailModuleOptions> | MailModuleOptions;
}