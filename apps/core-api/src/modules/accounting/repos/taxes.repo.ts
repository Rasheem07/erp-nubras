// src/accounting/repos/taxes.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { taxes } from 'src/core/drizzle/schema/accounting.schema';
 
@Injectable()
export class TaxesRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(taxes);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(taxes)
      .where(eq(taxes.id, id))
      .limit(1);
  }

  create(data: typeof taxes.$inferInsert) {
    return this.db.insert(taxes).values(data).returning();
  }

  update(id: number, data: Partial<typeof taxes.$inferInsert>) {
    return this.db.update(taxes).set(data).where(eq(taxes.id, id));
  }

  delete(id: number) {
    return this.db.delete(taxes).where(eq(taxes.id, id));
  }
}
