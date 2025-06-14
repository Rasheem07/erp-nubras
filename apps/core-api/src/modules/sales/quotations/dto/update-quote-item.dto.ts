// src/sales-orders/dto/update-sale-order-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsPositive } from 'class-validator';
import { createQuoteItemDto } from './create-quote-item.dto';

export class UpdateQuoteItemDto extends PartialType(createQuoteItemDto) {

}
