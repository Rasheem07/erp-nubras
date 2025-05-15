import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from './users/user.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorAuthModule } from './twoFactorAuth/twoFactorAuth.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        global: true,
        secret: cs.get("JWT_SECRET"),
        signOptions: { expiresIn: '10m' },
      })
    }),
    MailModule.forRootAsync({
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
    }),
    TwoFactorAuthModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
