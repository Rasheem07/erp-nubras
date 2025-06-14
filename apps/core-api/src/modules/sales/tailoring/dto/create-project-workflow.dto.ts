import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProjectWorflow {
  @IsInt()
  @IsPositive()
  stepNo: number;

  @IsInt()
  @IsPositive()
  configId: number;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsInt()
  @IsInt()
  estimatedHours: number;
}
