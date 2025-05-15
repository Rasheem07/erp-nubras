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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    // WinstonModule.forRoot({
    //   level: process.env.LOG_LEVEL || 'info',
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.errors({ stack: true }),
    //     winston.format.splat(),
    //     winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    //       const base = `${timestamp} [${level}] ${message}`;
    //       const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
    //       return stack ? `${base} — ${stack}` : `${base} ${extra}`;
    //     }),
    //   ),
    //   transports: [
    //     new winston.transports.Console(),
    //     new winston.transports.File({
    //       filename: 'logs/error.log',
    //       level: 'error',
    //       maxsize: 5_000_000,  // 5MB
    //       maxFiles: 5,
    //     }),
    //     new winston.transports.File({
    //       filename: 'logs/combined.log',
    //       maxsize: 10_000_000, // 10MB
    //       maxFiles: 10,
    //     }),
    //   ],
    // }),
    AuthModule,
    UserModule,
    TwoFactorAuthModule
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
