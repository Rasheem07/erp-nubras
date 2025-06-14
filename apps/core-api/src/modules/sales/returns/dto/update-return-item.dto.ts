// src/sales-orders/dto/update-sale-order-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsPositive } from 'class-validator';
import { createReturnItem } from './create-return-item.dto';

export class UpdateReturnItemDto extends PartialType(createReturnItem) {
  
}
