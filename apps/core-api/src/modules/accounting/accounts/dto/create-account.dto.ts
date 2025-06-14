import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export enum accType {
  asset = 'asset',
  liability = 'liability',
  equity = 'equity',
  expense = 'expense',
  revenue = 'revenue',
}
export class CreateAccountDto {
  @IsOptional()
  @IsInt({ message: 'Account no must be an integer number!' })
  accNo: number;

  @IsBoolean({ message: 'Enabled must be true or false' })
  enabled: boolean;

  @IsString({ message: 'Account name must be a string' })
  @Length(3, 32, {
    message: 'Account name must be between 4 to 32 characters!',
  })
  name: string;

  @IsEnum(['asset', 'liability', 'equity', 'expense', 'revenue'], {
    message:
      'Account type must be either one of them: asset, liability, equity, expense or revenue',
  })
  type: accType;

  @IsString({ message: 'Account sub type must be a string' })
  @MaxLength(32)
  subType: string;

  @IsString({ message: 'Balance must be a string' })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'Balance must be a valid decimal with up to 2 decimal places',
  })
  balance: string;

  @IsOptional()
  @IsString()
  description: string;
}
