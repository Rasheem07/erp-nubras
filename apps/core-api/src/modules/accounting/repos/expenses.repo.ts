// src/accounting/repos/expenses.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { expenses } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class ExpensesRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(expenses);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id))
      .limit(1);
  }

  create(data: typeof expenses.$inferInsert) {
    return this.db.insert(expenses).values(data).returning();
  }

  update(id: number, data: Partial<typeof expenses.$inferInsert>) {
    return this.db.update(expenses).set(data).where(eq(expenses.id, id));
  }

  delete(id: number) {
    return this.db.delete(expenses).where(eq(expenses.id, id));
  }
}
