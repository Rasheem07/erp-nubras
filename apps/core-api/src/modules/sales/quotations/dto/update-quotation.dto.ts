import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateQuotationDto } from './create-quotation.dto';
import {
  ArrayMinSize,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { UpdateQuoteItemDto } from './update-quote-item.dto';
import { Type } from 'class-transformer';

class _UpdateQuotationDtoBase extends OmitType(CreateQuotationDto, [
  'items',
] as const) {}

class _PartialUpdateQuotationDto extends PartialType(_UpdateQuotationDtoBase) {}

export class UpdateQuotationDto extends _PartialUpdateQuotationDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateQuoteItemDto)
  @ArrayMinSize(1)
  @IsOptional()
  items?: UpdateQuoteItemDto[];
}
