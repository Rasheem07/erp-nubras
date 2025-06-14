import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  async getSuppiers() {
    return await this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  async getOneSupplier(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.getOneSupplier(id);
  }

  @Post()
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.addSupplier(createSupplierDto);
  }

  @Patch(':id')
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return await this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Delete(':id')
  async deleteSupplier(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.removeSupplier(id);
  }
}
