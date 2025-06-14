import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { QuotationsModule } from './quotations/quotations.module';
import { ReturnsModule } from './returns/returns.module';
import { TailoringModule } from './tailoring/tailoring.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { CustomersModule } from './customers/customers.module';
import { StaffModule } from './staff/staff.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [QuotationsModule, ReturnsModule, TailoringModule, ProductsModule, InventoryModule, CustomersModule, StaffModule, TransactionsModule, ReportsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
