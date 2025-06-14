import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { createQuoteItemDto } from './create-quote-item.dto';

export class CreateQuotationDto {
  @IsDate()
  @Type(() => Date)
  validUntil: Date;

  @IsInt()
  @IsPositive()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @IsDecimal()
  subtotal: string;

  @IsDecimal()
  taxAmount: string;

  @IsDecimal()
  discountAmount: string;

  @IsDecimal()
  totalAmount: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  terms: string;

  @ValidateNested({ each: true })
  @Type(() => createQuoteItemDto)
  items: createQuoteItemDto[];
}
