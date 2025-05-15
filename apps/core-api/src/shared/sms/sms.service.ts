// src/sms/sms.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { SmsModuleOptions, SMS_MODULE_OPTIONS, TWILIO_CLIENT } from './sms.constants';
import type Twilio from 'twilio';
import type { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class SmsService {
    constructor(
        @Inject(TWILIO_CLIENT)
        private readonly twilioClient: Twilio.Twilio,
        @Inject(SMS_MODULE_OPTIONS)
        private readonly options: SmsModuleOptions,
    ) { }

    /**
     * Send a single SMS.
     */
    async sendSms(to: string, body: string): Promise<MessageInstance> {
        return this.twilioClient.messages.create({
            to,
            from: this.options.from,
            body,
        });
    }

    /**
     * Send bulk SMS messages.
     */
    async sendBulkSms(recipients: string[], body: string): Promise<MessageInstance[]> {
        const promises = recipients.map((to) =>
            this.twilioClient.messages.create({ to, from: this.options.from, body }),
        );
        return Promise.all(promises);
    }
}
