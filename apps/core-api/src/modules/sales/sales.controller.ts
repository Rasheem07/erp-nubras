import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSalesOrderDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.salesService.cancel(+id);
  }

  @Get('/list/orders')
  async list() {
    return await this.salesService.listOrders()
  }

  @Get(":id/items")
  async listOrderItems(@Param('id', ParseIntPipe) id: number) {
    return await this.salesService.listSalesOrderItems(id);
  }

  @Get('list/tailoring')
  async listTailoringOrders() {
    return await this.salesService.listOrdersForTailoring()
  }

  @Get(":id/payment")
  async getPaymentDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.salesService.getPaymentDetails(id)
  }
}
