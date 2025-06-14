import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { createReturnItem } from './create-return-item.dto';

export class CreateReturnDto {
  @IsInt()
  @IsPositive()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsInt()
  @IsPositive()
  orderId: number;

  @IsEnum(['cash', 'mobile', 'card', 'bank_transfer', 'cheque'])
  paymentMethod: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsEnum(['pending', 'approved', 'rejected', 'completed'])
  status: string;

  @ValidateNested({ each: true })
  @Type(() => createReturnItem)
  @ArrayMinSize(1)
  items: createReturnItem[];
}
