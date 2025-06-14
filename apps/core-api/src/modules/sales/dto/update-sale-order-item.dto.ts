// src/sales-orders/dto/update-sale-order-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { SalesOrderItemDto } from './createSaleOrderItem.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateSalesOrderItemDto extends PartialType(SalesOrderItemDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;  
}
