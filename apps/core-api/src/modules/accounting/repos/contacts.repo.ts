// src/accounting/repos/contacts.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { contacts } from 'src/core/drizzle/schema';

@Injectable()
export class ContactsRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  findAll() {
    return this.db.select().from(contacts);
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);
  }

  create(data: typeof contacts.$inferInsert) {
    return this.db.insert(contacts).values(data).returning();
  }

  update(id: number, data: Partial<typeof contacts.$inferInsert>) {
    return this.db.update(contacts).set(data).where(eq(contacts.id, id));
  }

  delete(id: number) {
    return this.db.delete(contacts).where(eq(contacts.id, id));
  }
}
