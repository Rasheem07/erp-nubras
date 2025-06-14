// src/accounting/repos/purchase-invoice-items.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { purchaseInvoiceItems } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class PurchaseInvoiceItemsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(purchaseInvoiceItems);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(purchaseInvoiceItems)
      .where(eq(purchaseInvoiceItems.id, id))
      .limit(1);
  }

  create(data: typeof purchaseInvoiceItems.$inferInsert) {
    return this.db.insert(purchaseInvoiceItems).values(data).returning();
  }

  update(id: number, data: Partial<typeof purchaseInvoiceItems.$inferInsert>) {
    return this.db
      .update(purchaseInvoiceItems)
      .set(data)
      .where(eq(purchaseInvoiceItems.id, id));
  }

  delete(id: number) {
    return this.db
      .delete(purchaseInvoiceItems)
      .where(eq(purchaseInvoiceItems.id, id));
  }
}
