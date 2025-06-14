import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetingDto } from './create-budgeting.dto';

export class UpdateBudgetingDto extends PartialType(CreateBudgetingDto) {}
