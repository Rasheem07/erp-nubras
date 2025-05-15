import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { MAIL_OPTIONS, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService implements OnModuleDestroy {
  private transporter: Transporter;

  constructor(
    @Inject(MAIL_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.transporter = createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure ?? false,
      auth: options.auth,
    });
  }

  async sendMail(mail: SendMailOptions) {
    return this.transporter.sendMail({
      ...mail,
      from: this.options.from,
    });
  }

  onModuleDestroy() {
    this.transporter.close();
  }
}
