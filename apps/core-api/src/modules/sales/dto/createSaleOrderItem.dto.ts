// src/sales-orders/dto/sales-order-item.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDecimal,
  IsNotEmpty,
  ValidateNested,
  ValidateIf,
  IsEnum,
} from 'class-validator';

export class CustomItemMeasurement {
  @IsString()
  @IsNotEmpty()
  frontLength: string;

  @IsString()
  @IsNotEmpty()
  backLength: string;

  @IsString()
  @IsNotEmpty()
  shoulder: string;

  @IsString()
  @IsNotEmpty()
  sleeves: string;

  @IsString()
  @IsNotEmpty()
  neck: string;

  @IsString()
  @IsNotEmpty()
  waist: string;

  @IsString()
  @IsNotEmpty()
  chest: string;

  @IsString()
  @IsNotEmpty()
  widthEnd: string;

  @IsOptional()
  @IsString()
  notes: string;
}

export class SalesOrderItemDto {

  @IsEnum(['ready-made', 'custom'])
  type: 'ready-made' | 'custom' = 'ready-made';

  @IsString()
  @MaxLength(100)
  description: string;

  @IsNumber()
  @IsPositive()
  catelogId: number;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsPositive()
  qty: number;

  @IsDecimal()
  price: string;

  @IsOptional()
  @IsDecimal()
  modelPrice?: string;

  @IsDecimal()
  total: string;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomItemMeasurement)
  measurement?: CustomItemMeasurement;
}
