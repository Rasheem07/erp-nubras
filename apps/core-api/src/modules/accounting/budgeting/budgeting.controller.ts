import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BudgetingService } from './budgeting.service';
import { CreateBudgetingDto } from './dto/create-budgeting.dto';
import { UpdateBudgetingDto } from './dto/update-budgeting.dto';

@Controller('budgeting')
export class BudgetingController {
  constructor(private readonly budgetingService: BudgetingService) {}

  @Post()
  create(@Body() createBudgetingDto: CreateBudgetingDto) {
    return this.budgetingService.create(createBudgetingDto);
  }

  @Get()
  findAll() {
    return this.budgetingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetingDto: UpdateBudgetingDto) {
    return this.budgetingService.update(+id, updateBudgetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetingService.remove(+id);
  }
}
