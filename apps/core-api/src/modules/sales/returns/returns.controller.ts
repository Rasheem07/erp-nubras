import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  async create(@Body() createReturnDto: CreateReturnDto) {
    return await this.returnsService.create(createReturnDto);
  }

  @Get()
  async findAll() {
    return await this.returnsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.returnsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReturnDto: UpdateReturnDto) {
    return await this.returnsService.update(+id, updateReturnDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.returnsService.reject(+id);
  }
}
