import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CustomModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  charge: string;
}