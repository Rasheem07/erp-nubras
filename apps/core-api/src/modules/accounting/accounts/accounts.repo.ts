// src/accounting/repos/accounts.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { accounts } from 'src/core/drizzle/schema/accounting.schema';
@Injectable()
export class AccountsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(accounts);
  }

  findOne(accNo: number) {
    return this.db
      .select()
      .from(accounts)
      .where(eq(accounts.accNo, accNo))
      .limit(1);
  }

  create(data: typeof accounts.$inferInsert) {
    return this.db.insert(accounts).values(data).returning();
  }

  update(accNo: number, data: Partial<typeof accounts.$inferInsert>) {
    return this.db.update(accounts).set(data).where(eq(accounts.accNo, accNo));
  }

  delete(accNo: number) {
    return this.db.delete(accounts).where(eq(accounts.accNo, accNo));
  }
}
