// src/accounting/repos/bank-reconciliations.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { bankReconciliations } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class BankReconciliationsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(bankReconciliations);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(bankReconciliations)
      .where(eq(bankReconciliations.id, id))
      .limit(1);
  }

  create(data: typeof bankReconciliations.$inferInsert) {
    return this.db.insert(bankReconciliations).values(data).returning();
  }

  update(id: number, data: Partial<typeof bankReconciliations.$inferInsert>) {
    return this.db
      .update(bankReconciliations)
      .set(data)
      .where(eq(bankReconciliations.id, id));
  }

  delete(id: number) {
    return this.db
      .delete(bankReconciliations)
      .where(eq(bankReconciliations.id, id));
  }
}
