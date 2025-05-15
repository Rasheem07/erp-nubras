import { MailModule } from './mail/mail.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { SmsService } from './sms/sms.service';
import { SmsModule } from './sms/sms.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

export const cacheManagerModule = CacheManagerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT"),
        ttl: 60 * 60 * 5,
        password: config.get("REDIS_PASS"),
        db: config.get("REDIS_DB")
    }),
})

export const smsModule = SmsModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        authToken: config.get("TWILIO_AUTH_TOKEN"),
        accountSid: config.get("TWILIO_ACCOUNT_SID"),
        from: config.get("TWILIO_FROM_PHONE_NUMBER")
    })
})

export const mailModule = MailModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        host: config.get('SMTP_HOST'),
        port: config.get<number>('SMTP_PORT'),
        secure: false,
        auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
        },
        from: config.get('EMAIL_FROM'),
    }),
})

export const rabbitMqModule = RabbitMQModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        uri: config.get("RABBITMQ_URI"),
        queue: config.get("RABBITMQ_QUEUE_NAME"),
        prefetchCount: config.get("RABBITMQ_PREFETCH_COUNT")
    }),
})
