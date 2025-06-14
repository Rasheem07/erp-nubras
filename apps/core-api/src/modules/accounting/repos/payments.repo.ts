// src/accounting/repos/payments.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { payments } from 'src/core/drizzle/schema/accounting.schema';

@Injectable()
export class PaymentsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(payments);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1);
  }

  create(data: typeof payments.$inferInsert) {
    return this.db.insert(payments).values(data).returning();
  }

  update(id: number, data: Partial<typeof payments.$inferInsert>) {
    return this.db.update(payments).set(data).where(eq(payments.id, id));
  }

  delete(id: number) {
    return this.db.delete(payments).where(eq(payments.id, id));
  }
}
