// src/inventory/dto/create-inventory.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumberString,
  IsInt,
  Min,
  IsEnum,
  ValidateNested,
  IsBoolean,
  IsPositive,
  ArrayMinSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CustomModelDto } from './create-custom-model.dto';

export enum ProductType {
  READY_MADE = 'ready-made',
  CUSTOM = 'custom',
}

export class CreateInventoryDto {
  // ——— Inventory fields ———
  @IsString() @IsNotEmpty() @MaxLength(75) name: string;
  @IsOptional() @IsString() @MaxLength(15) sku: string;
  @IsString() @IsNotEmpty() @MaxLength(15) category: string;
  @IsString() @IsOptional() @MaxLength(20) uom?: string;
  @IsString() @IsOptional() description?: string;
  @IsNumberString() @IsNotEmpty() cost: string;
  @Type(() => Number) @IsInt() @Min(0) @IsOptional() stock?: number;
  @Type(() => Number) @IsInt() @Min(1) @IsOptional() minStock?: number;
  @Type(() => Number) @IsInt() @Min(0) reorderPoint: number;
  @Type(() => Number) @IsInt() @IsPositive() @IsOptional() supplierId?: number;
  @IsString() @IsOptional() barcode?: string;
  @IsString() @IsOptional() @MaxLength(12) weight?: string;
  @IsString() @IsOptional() notes?: string;

  // ——— Catalog fields ———
  @IsEnum(ProductType) type: ProductType;
  @IsNumberString() @IsNotEmpty() sellingPrice: string;
  @IsString() @IsNotEmpty() categoryName: string;
  @Type(() => Boolean) @IsBoolean() @IsOptional() enabled?: boolean = true;

  // ——— Optional models for custom/both ———
  @ValidateNested({ each: true })
  @Type(() => CustomModelDto)
  @Transform(({ value }) => {
    // If it's already an object, return as-is; otherwise parse JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsOptional()
  @ArrayMinSize(1)
  models?: CustomModelDto[];
}
