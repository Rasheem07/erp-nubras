import { IsDecimal, IsEnum, IsInt, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsEnum(['visa', 'bank_transfer', 'cash'])
  paymentMethod: 'visa' | 'bank_transfer' | 'cash';

  @IsDecimal()
  amount: string;
}
