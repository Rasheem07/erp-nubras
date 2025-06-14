// src/accounting/repos/budget-items.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { budgetItems } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class BudgetItemsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(budgetItems);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(budgetItems)
      .where(eq(budgetItems.id, id))
      .limit(1);
  }

  create(data: typeof budgetItems.$inferInsert) {
    return this.db.insert(budgetItems).values(data).returning();
  }

  update(id: number, data: Partial<typeof budgetItems.$inferInsert>) {
    return this.db.update(budgetItems).set(data).where(eq(budgetItems.id, id));
  }

  delete(id: number) {
    return this.db.delete(budgetItems).where(eq(budgetItems.id, id));
  }
}
