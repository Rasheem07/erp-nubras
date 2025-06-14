import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {ExpressAdapter} from "@nestjs/platform-express"
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule
  );

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
    new ValidationPipe({transform: true})
  );


  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.PORT ?? 5005);
}

bootstrap();
