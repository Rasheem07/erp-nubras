import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class createQuoteItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  catalogId: number;

  @IsString()
  sku: string;

  @IsInt()
  @IsPositive()
  qty: number;

  @IsDecimal()
  price: string;

  @IsDecimal()
  total: string;
}
