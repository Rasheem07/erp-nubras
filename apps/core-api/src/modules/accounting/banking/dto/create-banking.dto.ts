import {
  IsDecimal,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAccountDto } from '../../accounts/dto/create-account.dto';

enum bankAccType {
  checking = 'checking',
  savings = 'savings',
  'fixed deposit' = 'fixed deposit',
  current = 'current',
  other = 'other',
}

enum currency {
  AED = 'AED',
  USD = 'USD',
  INR = 'INR',
  EUR = 'EUR',
  GPB = 'GPB',
  SAR = 'SAR',
}

class bankDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32, { message: 'Bank name cannot exceed 32 characters!' })
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32, { message: 'Bank name cannot exceed 32 characters!' })
  branch: string;

  @IsEnum(bankAccType, {
    message:
      'bankAccType must be one of: checking, savings, fixed deposit, current or other',
  })
  bankAccType: bankAccType;

  @IsEnum(['AED', 'USD', 'INR', 'EUR', 'GPB', 'SAR'])
  currency: currency;

  @IsString()
  description: string;
}

class CreateAdditionalBankDetails {
  @IsString()
  @MaxLength(11, { message: 'SWIFT/BIC cannot exceed 11 chars' })
  @IsOptional()
  swift_or_bic?: string;

  @IsString()
  @MaxLength(34, { message: 'IBAN cannot exceed 34 chars' })
  @IsOptional()
  iban?: string;
}

class contactDto {
  @IsInt()
  @Min(100, { message: 'Country code must be exactly three digits' })
  @Max(999, { message: 'Country code must be exactly three digits' })
  code: number;

  @IsString()
  @Length(8, 12)
  number: string;

  @IsEmail()
  @MaxLength(45)
  email: string;

  @IsString()
  reference: string;
}

export class CreateBankingDto {
  @IsDecimal()
  balance: string;

  @ValidateNested()
  @Type(() => bankDto)
  bankDetails: bankDto;

  @ValidateNested()
  @Type(() => CreateAdditionalBankDetails)
  additionalDetails: CreateAdditionalBankDetails;

  @ValidateNested()
  @Type(() => contactDto)
  contact: contactDto;

  @ValidateNested()
  @Type(() => CreateAccountDto)
  accountDetails: CreateAccountDto;
}
