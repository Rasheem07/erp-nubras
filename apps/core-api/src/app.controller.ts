import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from './modules/auth/auth.guard';
import { UserService } from './modules/auth/users/users.service';
import { DRIZZLE_CLIENT } from './core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { customer } from './core/drizzle/schema/sales.schema';
import { suppliers } from './core/drizzle/schema/inventory.schema';
import { contacts, salesStaff } from './core/drizzle/schema';
import { eq } from 'drizzle-orm';

@Controller()
export class AppController {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  @Get('me')
  getHello(@Req() req: Response) {
    return {
      id: req['user'].sub,
      email: req['user'].profile.email,
      createdAt: req['user'].profile.createdAt,
      role: req['user'].role,
      permissions: req['user'].permissions,
    };
  }

  @Get('list/customer')
  async getCustomers() {
    const rows = await this.db
      .select({
        id: customer.id,
        name: customer.name, 
        phone: customer.phone,
        email: customer.email,
        status: customer.status
      })
      .from(customer)

    // map each row into your shape
    return rows;
  }

  @Get('list/suppliers')
  async getSuppliers() {
    const rows = await this.db
      .select()
      .from(suppliers)
      .leftJoin(contacts, eq(contacts.id, suppliers.contactId));

    // map each row into your shape
    return rows.map((r) => ({
      id: r.suppliers.id,
      name: r.suppliers.name,
      contact: r.contacts.number,
      email: r.contacts.email,
    }));
  }

  @Get('list/sales-person')
  async listSalesPerson() {
    return await this.db
      .select({
        id: salesStaff.id,
        name: salesStaff.name,
        department: salesStaff.department,
        level: salesStaff.level,
        phone: salesStaff.phone
      })
      .from(salesStaff)
      .where(eq(salesStaff.department, 'sales'));
  }
}
