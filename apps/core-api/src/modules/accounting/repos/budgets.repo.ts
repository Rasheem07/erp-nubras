// src/accounting/repos/budgets.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { budgets } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class BudgetsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(budgets);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(budgets)
      .where(eq(budgets.id, id))
      .limit(1);
  }

  create(data: typeof budgets.$inferInsert) {
    return this.db.insert(budgets).values(data).returning();
  }

  update(id: number, data: Partial<typeof budgets.$inferInsert>) {
    return this.db.update(budgets).set(data).where(eq(budgets.id, id));
  }

  delete(id: number) {
    return this.db.delete(budgets).where(eq(budgets.id, id));
  }
}
