import { PartialType } from '@nestjs/mapped-types';
import { CreateTailoringDto } from './create-tailoring.dto';

export class UpdateTailoringDto extends PartialType(CreateTailoringDto) {}
