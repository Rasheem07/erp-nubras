// src/accounting/dto/create-invoice.dto.ts

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @IsInt()
  itemId: number;

  @IsInt()
  quantity: number;

  @IsDecimal()
  total: string;
}

export class InvoiceTaxDto {
  @IsString()
  @IsNotEmpty()
  taxName: string;

  @IsInt()
  rate: number;

  @IsString()
  @IsNotEmpty()
  applyOn: string;

  @IsOptional()
  enabled?: boolean = true;
}

export class CreateInvoiceDto {
  @IsInt()
  id: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsInt()
  customerId?: number | null;

  @IsOptional()
  @IsInt()
  supplierId?: number | null;

  @IsDateString()
  date: string;

  @IsEnum(['paid', 'sent', 'draft', 'overdue', 'rejected'])
  status: "sent" | "paid" | "draft" | "rejected" | "overdue";

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string | null;

  @IsOptional()
  @IsString()
  shippingMethod?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @ArrayMinSize(1)
  items: InvoiceItemDto[];

  @ValidateNested({ each: true })
  @Type(() => InvoiceTaxDto)
  @ArrayMinSize(1)
  taxes: InvoiceTaxDto[];

  // computed in your service before passing to repo:
  @IsDecimal()
  netAmount: string;

  @IsDecimal()
  taxAmount: string;

  @IsDecimal()
  totalAmount: string;
}
