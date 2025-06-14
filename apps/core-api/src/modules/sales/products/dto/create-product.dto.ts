import {
  IsIn,
  IsString,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
  IsInt,
  IsPositive,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CustomModelDto } from './create-custom-model.dto';

export class CreateProductDto {
  @IsIn(['ready-made', 'custom'])
  type: 'ready-made' | 'custom';

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  sku: string;

  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ValidateIf((o) => o.type === 'ready-made')
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  itemId?: number;

  @IsNumberString()
  @IsNotEmpty()
  sellingPrice: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  categoryName: string;

  @ValidateIf((o) => o.type === 'custom')
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
  models?: CustomModelDto[];
}
