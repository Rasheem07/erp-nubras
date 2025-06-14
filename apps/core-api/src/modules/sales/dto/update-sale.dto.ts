
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSalesOrderDto }     from './create-sale.dto';
import { UpdateSalesOrderItemDto } from './update-sale-order-item.dto';
import { ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class _UpdateSaleDtoBase extends OmitType(CreateSalesOrderDto, ['items'] as const) {}

class _PartialUpdateSaleDto extends PartialType(_UpdateSaleDtoBase) {}

export class UpdateSaleDto extends _PartialUpdateSaleDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateSalesOrderItemDto)
  @ArrayMinSize(1)
  @IsOptional()
  items?: UpdateSalesOrderItemDto[];
}
