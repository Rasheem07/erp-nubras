import { Injectable } from '@nestjs/common';
import { CreateBudgetingDto } from './dto/create-budgeting.dto';
import { UpdateBudgetingDto } from './dto/update-budgeting.dto';

@Injectable()
export class BudgetingService {
  create(createBudgetingDto: CreateBudgetingDto) {
    return 'This action adds a new budgeting';
  }

  findAll() {
    return `This action returns all budgeting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} budgeting`;
  }

  update(id: number, updateBudgetingDto: UpdateBudgetingDto) {
    return `This action updates a #${id} budgeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} budgeting`;
  }
}
