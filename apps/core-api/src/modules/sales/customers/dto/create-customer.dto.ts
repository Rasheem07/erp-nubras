import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Sub-class for Arabic & Kuwaiti measurement
class MeasurementDetails {
  @IsNumber()
  frontLength: number;

  @IsNumber()
  backLength: number;

  @IsNumber()
  shoulder: number;

  @IsNumber()
  sleeves: number;

  @IsNumber()
  neck: number;

  @IsNumber()
  waist: number;

  @IsNumber()
  chest: number;

  @IsNumber()
  widthEnd: number;

  @IsOptional()
  @IsString()
  notes: string;
}

// Top-level measurement class
class CustomerMeasurement {
  @ValidateNested()
  @Type(() => MeasurementDetails)
  arabic: MeasurementDetails;

  @ValidateNested()
  @Type(() => MeasurementDetails)
  kuwaiti: MeasurementDetails;
}

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['new', 'active', 'platinum', 'gold', 'diamond', 'inactive'])
  status: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerMeasurement)
  measurement: CustomerMeasurement;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences: string[];
}
