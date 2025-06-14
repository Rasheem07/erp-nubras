// src/accounting/repos/invoices.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { invoices } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class InvoicesRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(invoices);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);
  }

  create(data: typeof invoices.$inferInsert) {
    return this.db.insert(invoices).values(data).returning();
  }

  update(id: number, data: Partial<typeof invoices.$inferInsert>) {
    return this.db.update(invoices).set(data).where(eq(invoices.id, id));
  }

  delete(id: number) {
    return this.db.delete(invoices).where(eq(invoices.id, id));
  }
}
