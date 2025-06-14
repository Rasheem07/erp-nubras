import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './core/drizzle/drizzle.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as schema from "./core/drizzle/schema";
import { AuthModule } from './modules/auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/auth/users/user.module';
import { RefreshTokenMiddleware } from './modules/auth/middlewares/refreshToken.middleware';
import { TwoFactorAuthModule } from './modules/auth/twoFactorAuth/twoFactorAuth.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { SalesModule } from './modules/sales/sales.module';
import { S3Module } from './shared/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule,
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        connectionString: cs.get('DATABASE_URL')!,
        schema
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        global: true,
        secret: cs.get("JWT_SECRET"),
        signOptions: { expiresIn: '10m' },
      })
    }),
    AuthModule,
    UserModule,
    TwoFactorAuthModule,
    AccountingModule,
    SalesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokenMiddleware)
      .forRoutes('me');
  }
}
