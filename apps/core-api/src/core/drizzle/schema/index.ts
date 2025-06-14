import { check, integer, pgTable, serial, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { metaCols } from "../utils/metaCols";
import { sql } from "drizzle-orm";

// Contacts
export const contacts = pgTable(
  'contacts',
  {
    id: serial('id').primaryKey(),
    code: integer('code').notNull().default(971),
    number: varchar('number', { length: 12 }),
    email: varchar('email', { length: 45 }),
    reference: text('reference'),
    ...metaCols,
  },
  (table) => [
    uniqueIndex('contacts_email_unique').on(table.email),
    check(
      'contacts_phone_length',
      sql`char_length(${table.number}) BETWEEN 7 AND 12`,
    ),
  ], 
);


export * from "./user.schema"
export * from "./sales.schema"