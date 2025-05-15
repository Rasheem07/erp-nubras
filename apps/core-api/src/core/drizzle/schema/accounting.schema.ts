import {
  boolean,
  check,
  integer,
  numeric,
  pgSchema,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { metaCols } from '../utils/metaCols';
import { productCatelog } from './sales.schema';
import { inventoryItems, suppliers } from './inventory.schema';
import { sql } from 'drizzle-orm';

export const accountingSchema = pgSchema('accounting_schema');

export const accTypes = accountingSchema.enum('account_type', [
  'asset',
  'liability',
  'equity',
  'expense',
  'revenue',
]);
export const accounts = accountingSchema.table('accounts', {
  accNo: integer('no').primaryKey(),
  enabled: boolean('status').default(true),
  name: varchar('name', { length: 32 }).notNull(),
  type: accTypes('type').notNull(),
  subType: varchar('subtype', { length: 32 }),
  balance: numeric('balance', { precision: 12, scale: 2 }).default('0.00'),
  description: text('description'),
  ...metaCols,
});

export const bankAccTypes = accountingSchema.enum('bank_acc_type', [
  'checking',
  'savings',
  'fixed deposit',
  'current',
  'other',
]);
export const bankAccCurrency = accountingSchema.enum('bank_curr', [
  'AED',
  'USD',
  'INR',
  'EUR',
  'GPB',
  'SAR',
]);
export const bankAccounts = accountingSchema.table('bank_accounts', {
  id: serial('id').primaryKey(),
  accName: varchar('acc_name', { length: 32 })
    .notNull()
    .references(() => accounts.name),
  bankName: varchar('bank_name', { length: 32 }).notNull(),
  accNo: integer('account_no')
    .notNull()
    .references(() => accounts.accNo),
  branch: varchar({ length: 32 }).notNull(),
  bankAccType: bankAccTypes('type').notNull(),
  currency: bankAccCurrency('currency').default('AED'),
  balance: numeric('balance', { precision: 12, scale: 2 }).default('0.00'),
  description: text('description'),
  additionalDetailsId: integer('details_id').references(
    () => additionalBankDetails.id,
  ),
  ...metaCols,
});

export const additionalBankDetails = accountingSchema.table('bank_details', {
  id: serial().primaryKey(),
  swift_or_bic: text(),
  iban: text(),
  contactId: integer('contact_id').references(() => contacts.id),
  ...metaCols,
});

export const contacts = accountingSchema.table('contacts', {
  id: serial().primaryKey(),
  code: integer().notNull().default(971),
  number: varchar('number', { length: 12 }),
  email: varchar('email', { length: 45 }),
  reference: text(),
  ...metaCols,
});

export const journalEntries = accountingSchema.table('journal_entries', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow(),
  refType: varchar('ref_type', { length: 35 }),
  ref: integer('ref_no'),
  description: text(),
  notes: text(),
  ...metaCols,
});

export const journalEntryLines = accountingSchema.table('journal_entry_lines', {
  id: serial('id').primaryKey(),
  account: integer('account_id')
    .notNull()
    .references(() => accounts.accNo),
  debit: numeric('debit', { precision: 12, scale: 2 }).default('0.00'),
  credit: numeric('credit', { precision: 12, scale: 2 }).default('0.00'),
  ...metaCols,
});

export const invoices = accountingSchema.table(
  'invoices',
  {
    id: serial().primaryKey(),
    type: varchar({ length: 12 }).notNull(),
    customerId: integer('customer_id')
      .references(() => suppliers.id)
      .default(null),
    supplierId: integer('supplier_id')
      .references(() => suppliers.id)
      .default(null),
    date: timestamp().defaultNow(),
    dueDate: timestamp().notNull(),
    notes: text(),
    ...metaCols,
  },
  (table) => [
    check('check_invoice_type', sql`${table.type} IN ('sales','purchase')`),
    check(
      'exactly_one_party',
      sql`
      (type = 'sales'    AND customer_id IS NOT NULL AND supplier_id IS NULL)
      OR
      (type = 'purchase' AND supplier_id IS NOT NULL AND customer_id IS NULL)
    `,
    ),
  ],
);

export const salesInvoiceItems = accountingSchema.table('sales_invoice_items', {
  id: serial().primaryKey(),
  invoiceId: integer()
    .notNull()
    .references(() => invoices.id),
  itemId: integer('item_id').references(() => productCatelog.id),
  quantity: integer().notNull(),
  total: numeric({
    precision: 10,
    scale: 2,
  }).notNull(),
  ...metaCols,
});

export const purchaseInvoiceItems = accountingSchema.table(
  'purchase_invoice_items',
  {
    id: serial().primaryKey(),
    invoiceId: integer()
      .notNull()
      .references(() => invoices.id),
    itemId: integer('item_id').references(() => inventoryItems.id),
    quantity: integer().notNull(),
    total: numeric({
      precision: 10,
      scale: 2,
    }).notNull(),
    ...metaCols,
  },
);

export const allInvoiceItems = accountingSchema
  .view('all_invoice_items')
  .as((qb) =>
    qb
      .select({
        id: salesInvoiceItems.id,
        invoiceId: salesInvoiceItems.invoiceId,
        itemId: salesInvoiceItems.itemId,
        quantity: salesInvoiceItems.quantity,
        total: salesInvoiceItems.total,
        created_at: salesInvoiceItems.createdAt,
        updated_at: salesInvoiceItems.updatedAt,
        invoice_type: sql`'sales'`,
      })
      .from(salesInvoiceItems)
      .unionAll(
        qb
          .select({
            id: purchaseInvoiceItems.id,
            invoiceId: purchaseInvoiceItems.invoiceId,
            itemId: purchaseInvoiceItems.itemId,
            quantity: purchaseInvoiceItems.quantity,
            total: purchaseInvoiceItems.total,
            created_at: purchaseInvoiceItems.createdAt,
            updated_at: purchaseInvoiceItems.updatedAt,
            invoice_type: sql`'purchase'`,
          })
          .from(purchaseInvoiceItems),
      ),
  );

export const expenses = accountingSchema.table('expenes', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  date: timestamp('date').defaultNow(),
  category: varchar('category', { length: 35 }).notNull().default('other'),
  paymentMethod: varchar('payment_method', { length: 35 }),
  merchant: varchar('paid_to_merchant', { length: 35 }),
  description: text(),
  tags: text(),
  billable: boolean('billable').default(false),
  taxDeductable: boolean('tax_deductable').default(false),
  recurring: boolean('recurring').default(false),
  approvalRequired: boolean('approval_required').notNull().default(false),
  approverId: integer('approver_id').references(() => users.id),
  costCenter: varchar('cost_center', { length: 35 }),
  glAcc: integer('gl_account_no').references(() => accounts.accNo),
});

export const expenseAttachments = accountingSchema.table(
  'expense_attachments',
  {
    id: serial('attachment_id').primaryKey(),
    url: text(),
    notes: text(),
    ...metaCols,
  },
);
