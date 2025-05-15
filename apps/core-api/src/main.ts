import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {ExpressAdapter} from "@nestjs/platform-express"
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableCors(
    {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true
    }
  )


  // somewhere in your initialization file
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new (require('@nestjs/common').ValidationPipe)({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.PORT ?? 5005);
}

bootstrap();
