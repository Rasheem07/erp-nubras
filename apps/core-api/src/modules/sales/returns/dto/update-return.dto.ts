import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReturnDto } from './create-return.dto';
import { UpdateReturnItemDto } from './update-return-item.dto';

class _UpdateReturnDtoBase extends OmitType(CreateReturnDto, [
  'items',
] as const) {}

class _PartialUpdateReturnDto extends PartialType(_UpdateReturnDtoBase) {}

export class UpdateReturnDto extends _PartialUpdateReturnDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateReturnItemDto)
  @ArrayMinSize(1)
  @IsOptional()
  items?: UpdateReturnItemDto[];
}
