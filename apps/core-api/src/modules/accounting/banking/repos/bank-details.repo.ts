// src/accounting/repos/bank-details.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { additionalBankDetails } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class BankDetailsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(additionalBankDetails);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(additionalBankDetails)
      .where(eq(additionalBankDetails.id, id))
      .limit(1);
  }

  create(data: typeof additionalBankDetails.$inferInsert) {
    return this.db.insert(additionalBankDetails).values(data).returning();
  }

  update(id: number, data: Partial<typeof additionalBankDetails.$inferInsert>) {
    return this.db
      .update(additionalBankDetails)
      .set(data)
      .where(eq(additionalBankDetails.id, id));
  }

  delete(id: number) {
    return this.db.delete(additionalBankDetails).where(eq(additionalBankDetails.id, id));
  }
}
