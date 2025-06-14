import { integer, pgSchema, serial, text, varchar } from 'drizzle-orm/pg-core';
import { contacts } from '.';
import { metaCols } from '../utils/metaCols';

export const crmSchema = pgSchema('crm_schema');

export const customers = crmSchema.table('customers', {
  id: serial().primaryKey(),
  name: varchar({ length: 75 }).notNull(),
  contactId: integer().references(() => contacts.id),
  address: text().notNull(),
  city: varchar({ length: 50 }).notNull(),
  country: varchar({ length: 50 }).default('UAE'),
  postalCode: integer().notNull(),
  segment: varchar({ length: 75 }).default('new customer'),
  ...metaCols
});
