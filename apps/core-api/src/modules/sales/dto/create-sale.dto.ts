// src/sales-orders/dto/create-sales-order.dto.ts
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  IsOptional,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
  IsDecimal,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderItemDto } from './createSaleOrderItem.dto';

export enum PaymentStatus {
  NoPayment = 'no-payment',
  Partial   = 'partial',
  Completed = 'completed',
}

export class CreateSalesOrderDto {
  @IsEnum([
    'draft',
    'pending',
    'confirmed',
    'processing',
    'completed',
    'cancelled',
  ])
  status: string;

  @IsNumber()
  @IsPositive()
  customerId: number;

  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsNumber()
  @IsPositive()
  salesPersonId: number;

  @IsString()
  @MaxLength(100)
  salesPersonName: string;

  @IsDecimal()
  subtotal: string;

  @IsDecimal()
  taxAmount: string;

  @IsDecimal()
  discountAmount: string;

  @IsDecimal()
  totalAmount: string;

  @IsString()
  @MaxLength(20)
  paymentMethod: string;

  @IsEnum(['no-payment', 'partial', 'paid'])
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @IsString()
  paymentTerms: string;

  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedDate?: Date;

  @ValidateNested({ each: true })
  @Type(() => SalesOrderItemDto)
  @ArrayMinSize(1)
  items: SalesOrderItemDto[];

  @IsDecimal()
  partialAmount: string;
}
