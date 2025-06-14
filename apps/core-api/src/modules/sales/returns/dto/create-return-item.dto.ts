import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class createReturnItem {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsInt()
  @IsPositive()
  orderItemId: number;
  
  @IsInt()
  @IsPositive()
  qty: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  reason: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  condition: string;

  @IsDecimal()
  refundAmount: string;
}
