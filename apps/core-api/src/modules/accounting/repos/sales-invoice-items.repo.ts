// src/accounting/repos/sales-invoice-items.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { salesInvoiceItems } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class SalesInvoiceItemsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(salesInvoiceItems);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(salesInvoiceItems)
      .where(eq(salesInvoiceItems.id, id))
      .limit(1);
  }

  create(data: typeof salesInvoiceItems.$inferInsert) {
    return this.db.insert(salesInvoiceItems).values(data).returning();
  }

  update(id: number, data: Partial<typeof salesInvoiceItems.$inferInsert>) {
    return this.db
      .update(salesInvoiceItems)
      .set(data)
      .where(eq(salesInvoiceItems.id, id));
  }

  delete(id: number) {
    return this.db.delete(salesInvoiceItems).where(eq(salesInvoiceItems.id, id));
  }
}
