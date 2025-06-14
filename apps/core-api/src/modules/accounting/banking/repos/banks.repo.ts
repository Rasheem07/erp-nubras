// src/accounting/repos/bank-accounts.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { bankAccounts } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class BankAccountsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(bankAccounts);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(bankAccounts)
      .where(eq(bankAccounts.id, id))
      .limit(1);
  }

  create(data: typeof bankAccounts.$inferInsert) {
    return this.db.insert(bankAccounts).values(data).returning();
  }

  update(id: number, data: Partial<typeof bankAccounts.$inferInsert>) {
    return this.db.update(bankAccounts).set(data).where(eq(bankAccounts.id, id));
  }

  delete(id: number) {
    return this.db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  }
}
