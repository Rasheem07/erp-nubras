import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProjectWorflow } from './create-project-workflow.dto';

export class CreateTailoringDto {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsInt()
  @IsPositive()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsBoolean()
  rush: boolean;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsInt()
  @IsPositive()
  tailorId: number;


  @ValidateNested({each: true})
  @Type(() => CreateProjectWorflow)
  @ArrayMinSize(1)
  workflows: CreateProjectWorflow[];
}
