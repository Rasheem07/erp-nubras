import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxationDto } from './create-taxation.dto';

export class UpdateTaxationDto extends PartialType(CreateTaxationDto) {}
