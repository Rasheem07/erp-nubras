import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { S3Service } from 'src/shared/s3/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module } from 'src/shared/s3/s3.module';

@Module({
  imports: [
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        region: cfg.get('AWS_REGION'),
        bucket: cfg.get('AWS_S3_BUCKET'),
        credentials: {
          accessKeyId: cfg.get('AWS_ACCESS_KEY'),
          secretAccessKey: cfg.get('AWS_SECRET_KEY'),
        },
      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
