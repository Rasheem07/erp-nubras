import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaxationService } from './taxation.service';
import { CreateTaxationDto } from './dto/create-taxation.dto';
import { UpdateTaxationDto } from './dto/update-taxation.dto';

@Controller('taxation')
export class TaxationController {
  constructor(private readonly taxationService: TaxationService) {}

  @Post()
  create(@Body() createTaxationDto: CreateTaxationDto) {
    return this.taxationService.create(createTaxationDto);
  }

  @Get()
  findAll() {
    return this.taxationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxationDto: UpdateTaxationDto) {
    return this.taxationService.update(+id, updateTaxationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxationService.remove(+id);
  }
}
