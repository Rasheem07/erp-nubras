import {
  IsDate,
  IsDecimal,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {Type} from 'class-transformer'

export class CreateRestockDto {
  @IsInt()
  @IsPositive()
  itemId: number;

  @IsInt()
  @Min(1)
  qty: number;

  @IsDecimal()
  cost: string;

  @IsDecimal()
  total: string;

  @IsInt()
  @IsPositive()
  supplierId: number;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  invNo: string;

  @Type(() => Date)
  @IsDate()
  restockDate: Date;

  @IsOptional()
  @IsString()
  notes: string;
}
