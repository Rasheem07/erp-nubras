import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { SupplierService } from './supplier/supplier.service';
import { SupplierModule } from './supplier/supplier.module';
import { S3Module } from 'src/shared/s3/s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SupplierModule,
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
  controllers: [InventoryController],
  providers: [InventoryService, SupplierService],
})
export class InventoryModule {}
