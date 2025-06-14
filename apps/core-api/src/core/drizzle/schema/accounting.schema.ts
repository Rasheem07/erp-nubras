import {
  boolean,
  check,
  integer,
  numeric,
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { metaCols } from '../utils/metaCols';
import { productCatalog } from './sales.schema';
import { inventoryItems, suppliers } from './inventory.schema';
import { sql } from 'drizzle-orm';
import { contacts } from '.';
import { customers } from './crm.schema';

export const accountingSchema = pgSchema('accounting_schema');

// Enumerations
export const accTypes = accountingSchema.enum('account_type', [
  'asset',
  'liability',
  'equity',
  'expense',
  'revenue',
]);
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
 
// Accounts
export const accounts = accountingSchema.table(
  'accounts',
  {
    accNo: serial('no').primaryKey(),
    enabled: boolean('status').default(true),
    name: varchar('name', { length: 32 }).notNull().unique(),
    type: accTypes('type').notNull(),
    subType: varchar('subtype', { length: 32 }),
    balance: numeric('balance', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    description: text('description'),
    ...metaCols,
  },
  (table) => [
    check('balance_non_negative', sql`${table.balance} >= 0`),
    uniqueIndex('accounts_type_name_unique').on(table.type, table.name),
  ],
);

// Bank Accounts
export const additionalBankDetails = accountingSchema.table('bank_details', {
  id: serial('id').primaryKey(),
  swift_or_bic: text('swift_or_bic'),
  iban: text('iban'),
  contactId: integer('contact_id')
    .references(() => contacts.id)
    .notNull(),
  ...metaCols,
});

export const bankAccounts = accountingSchema.table(
  'bank_accounts',
  {
    id: serial('id').primaryKey(),
    bankName: varchar('bank_name', { length: 32 }).notNull(),
    accNo: integer('account_no')
      .notNull()
      .references(() => accounts.accNo),
    branch: varchar('branch', { length: 32 }).notNull(),
    bankAccType: bankAccTypes('type').notNull(),
    currency: bankAccCurrency('currency').default('AED'),
    balance: numeric('balance', { precision: 12, scale: 2 }).default('0.00'),
    status: varchar({length: 20}).default("active"),
    description: text('description'),
    additionalDetailsId: integer('details_id').references(
      () => additionalBankDetails.id,
    ).notNull(),
    ...metaCols,
  },
  (table) => [
    check('bank_balance_non_negative', sql`${table.balance} >= 0`),
    uniqueIndex('bank_acc_unique').on(table.bankName, table.accNo),
    index('idx_bank_account_accNo').on(table.accNo),
  ],
);


// Journal Entries
export const journalEntries = accountingSchema.table(
  'journal_entries',
  {
    id: serial('id').primaryKey(),
    date: timestamp('date').defaultNow(),
    refType: varchar('ref_type', { length: 35 }),
    refNo: integer('ref_no'),
    description: text('description'),
    notes: text('notes'),
    status: varchar({length: 20}).default("draft"),
    ...metaCols,
  },
  (table) => [
    uniqueIndex('journal_ref_unique').on(table.refType, table.refNo),
    check('journal_date_past', sql`${table.date} <= now()`),
    index('idx_journal_date').on(table.date),
  ],
);

// Journal Entry Lines
export const journalEntryLines = accountingSchema.table(
  'journal_entry_lines',
  {
    id: serial('id').primaryKey(),
    journalEntryId: integer('journal_entry_id')
      .notNull()
      .references(() => journalEntries.id),
    accountId: integer('account_id')
      .notNull()
      .references(() => accounts.accNo),
    debit: numeric('debit', { precision: 12, scale: 2 }).default('0.00'),
    credit: numeric('credit', { precision: 12, scale: 2 }).default('0.00'),
    ...metaCols,
  },
  (table) => [
    check(
      'line_debit_xor_credit',
      sql`(CASE WHEN ${table.debit} > 0 THEN 1 ELSE 0 END + CASE WHEN ${table.credit} > 0 THEN 1 ELSE 0 END) = 1`,
    ),
    index('idx_jeline_journal_id').on(table.journalEntryId),
    index('idx_jeline_account_id').on(table.accountId),
  ],
);

export const invoiceStatus = accountingSchema.enum("invoice_status", ['sent', 'paid', 'draft', 'rejected' , 'overdue'])
// Invoices
export const invoices = accountingSchema.table(
  'invoices',
  {
    id: serial('id').primaryKey(),
    invoiceType: varchar('type', { length: 12 }).notNull(),
    customerId: integer('customer_id')
      .references(() => customers.id)
      .default(null),
    supplierId: integer('supplier_id')
      .references(() => suppliers.id)
      .default(null),
    status: invoiceStatus().default("draft").notNull(),
    date: timestamp('date').defaultNow(),
    dueDate: timestamp('due_date').notNull(),
    deliveryDate: timestamp("delivery_date"),
    shippingMethod: varchar({length: 25}),
    notes: text('notes'),
    netAmount: numeric("net_amount" , {precision: 12, scale: 2}).notNull(),
    taxAmount: numeric("tax_amount", {precision: 12, scale: 2}).notNull(),
    totalAmount: numeric("total_amount", {precision: 12, scale: 2}).notNull(),
    ...metaCols,
  },
  (table) => [
    check('check_invoice_type', sql`${table.invoiceType} IN ('sales','purchase')`),
    check(
      'exactly_one_party',
      sql`
        (type = 'sales'    AND customer_id IS NOT NULL AND supplier_id IS NULL)
        OR
        (type = 'purchase' AND supplier_id IS NOT NULL AND customer_id IS NULL)
      `,
    ),
    check('due_after_date', sql`${table.dueDate} >= ${table.date}`),
    index('idx_invoice_date').on(table.date),
    index('idx_invoice_dueDate').on(table.dueDate),
  ],
);

export const invoiceTaxes = accountingSchema.table("invoices_taxes" , {
  id: serial().primaryKey(),
  invoiceId: integer().notNull(),
  taxName: varchar('tax_name', {length: 35}).notNull(),
  rate: integer().notNull(),
  applyOn: varchar({length: 35}).notNull(),
  enabled: boolean(),
  ...metaCols
})

// Sales Invoice Items
export const salesInvoiceItems = accountingSchema.table(
  'sales_invoice_items',
  {
    id: serial('id').primaryKey(),
    invoiceId: integer('invoice_id')
      .notNull()
      .references(() => invoices.id),
    itemId: integer('item_id').references(() => productCatalog.id),
    quantity: integer('quantity').notNull(),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    ...metaCols,
  },
  (table) => [
    uniqueIndex('sales_inv_item_unique').on(table.invoiceId, table.itemId),
    index('idx_sales_inv_qty').on(table.quantity),
    index("sales_invoice_id").on(table.invoiceId)
  ],
);

// Purchase Invoice Items
export const purchaseInvoiceItems = accountingSchema.table(
  'purchase_invoice_items',
  {
    id: serial('id').primaryKey(),
    invoiceId: integer('invoice_id')
      .notNull()
      .references(() => invoices.id),
    itemId: integer('item_id').references(() => inventoryItems.id),
    quantity: integer('quantity').notNull(),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    ...metaCols,
  },
  (table) => [
    uniqueIndex('purchase_inv_item_unique').on(table.invoiceId, table.itemId),
  ],
);

// Unified Invoice Items View
// export const allInvoiceItems = accountingSchema
//   .view('unified_invoice_items')
//   .as((qb) =>
//     qb
//       .select({
//         id: salesInvoiceItems.id,
//         invoiceId: salesInvoiceItems.invoiceId,
//         itemId: salesInvoiceItems.itemId,
//         quantity: salesInvoiceItems.quantity,
//         total: salesInvoiceItems.total,
//         created_at: salesInvoiceItems.createdAt,
//         updated_at: salesInvoiceItems.updatedAt,
//         invoice_type: sql`'sales'`.as('invoice_type'),
//       })
//       .from(salesInvoiceItems)
//       .unionAll(
//         qb
//           .select({
//             id: purchaseInvoiceItems.id,
//             invoiceId: purchaseInvoiceItems.invoiceId,
//             itemId: purchaseInvoiceItems.itemId,
//             quantity: purchaseInvoiceItems.quantity,
//             total: purchaseInvoiceItems.total,
//             created_at: purchaseInvoiceItems.createdAt,
//             updated_at: purchaseInvoiceItems.updatedAt,
//             invoice_type: sql`'purchase'`.as('invoice_type'),
//           })
//           .from(purchaseInvoiceItems),
//       ),
//   );

// Expenses (fixed typo)
export const expenses = accountingSchema.table(
  'expenses',
  {
    id: serial('id').primaryKey(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: timestamp('date').defaultNow(),
    category: varchar('category', { length: 35 }).notNull().default('other'),
    paymentMethod: varchar('payment_method', { length: 35 }),
    merchant: varchar('paid_to_merchant', { length: 35 }),
    description: text('description'),
    tags: text('tags'),
    billable: boolean('billable').default(false),
    taxDeductible: boolean('tax_deductible').default(false),
    recurring: boolean('recurring').default(false),
    approvalRequired: boolean('approval_required').notNull().default(false),
    approverId: integer('approver_id').references(() => users.id),
    costCenter: varchar('cost_center', { length: 35 }),
    glAcc: integer('gl_account_no').references(() => accounts.accNo),
    ...metaCols,
  },
  (table) => [
    check('expense_amount_positive', sql`${table.amount} > 0`),
    index('idx_exp_date').on(table.date),
  ],
);

// Payments
export const payments = accountingSchema.table(
  'payments',
  {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 35 }).notNull(),
    date: timestamp('date').defaultNow(),
    method: varchar('method', { length: 35 }).notNull(),
    partyType: varchar('party_type', { length: 35 }).notNull(),
    partyAcc: integer('party_acc')
      .notNull()
      .references(() => accounts.accNo),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 5 }).default('UAE'),
    category: varchar('category', { length: 35 }),
    refType: varchar('ref_type', { length: 35 }),
    refNo: integer('ref_no'),
    description: text('description'),
    recurring: boolean('recurring').default(false),
    status: varchar('status', { length: 12 }).default('pending').notNull(),
    clearedDate: timestamp('cleared_date'),
    attachment: text('attachment'),
    isTax: boolean('is_tax').default(false),
    taxAmount: numeric('tax_amount', { precision: 8, scale: 2 }).default(
      '0.00',
    ),
    approvalStatus: varchar('approval_status', { length: 25 }).default(
      'pending',
    ),
    approver: varchar('approver', { length: 50 }),
    tags: text('tags'),
    notes: text('notes'),
    ...metaCols,
  },
  (table) => [
    check('payment_amount_positive', sql`${table.amount} > 0`),
    check('check_payment_type', sql`${table.type} IN ('incoming','outgoing')`),
    check(
      'check_payment_method',
      sql`${table.method} IN ('bank_transfer','check','cash')`,
    ),
    check(
      'check_party_type',
      sql`${table.partyType} IN ('customer/vendor','employee','other')`,
    ),
    check(
      'check_payment_status',
      sql`${table.status} IN ('pending','completed','failed','cancelled')`,
    ),
    index('idx_payment_date').on(table.date),
  ],
);

// Bank Reconciliations
export const bankReconciliations = accountingSchema.table(
  'bank_reconciliations',
  {
    id: serial('id').primaryKey(),
    date: timestamp('date').defaultNow(),
    stBalance: numeric('st_balance', { precision: 12, scale: 2 }).notNull(),
    bkBalance: numeric('bk_balance', { precision: 12, scale: 2 }).notNull(),
    difference: numeric('difference', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status', { length: 15 }).default('pending'),
    bankId: integer('bank_id')
      .notNull()
      .references(() => bankAccounts.id),
    ...metaCols,
  },
  (table) => [
    check(
      'reconcile_diff_calc',
      sql`${table.difference} = ${table.stBalance} - ${table.bkBalance}`,
    ),
    check(
      'reconcile_status_enum',
      sql`${table.status} IN ('pending','completed','reconciled')`,
    ),
    index('idx_reconcile_date').on(table.date),
  ],
);

// Taxes
export const taxes = accountingSchema.table(
  'taxes',
  {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 25 }).notNull(),
    rate: integer('rate').notNull(),
    frequency: varchar('frequency', { length: 20 }).default('monthly'),
    nextDueDate: timestamp('next_due_date').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    fillingInstructions: text('filling_instructions'),
    ...metaCols,
  },
  (table) => [
    check('tax_rate_range', sql`${table.rate} BETWEEN 0 AND 100`),
    index('idx_tax_next_due').on(table.nextDueDate),
  ],
);

// Budgets
export const budgets = accountingSchema.table(
  'budgets',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: varchar('type', { length: 35 }).notNull(),
    period: varchar('period', { length: 35 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    description: text('description'),
    department: varchar('department', { length: 35 }).notNull(),
    status: varchar('status', { length: 12 }).default('draft'),
    approverId: integer('approver_id')
      .notNull()
      .references(() => users.id),
    notes: text('notes'),
    ...metaCols,
  },
  (table) => [
    check('budget_period_valid', sql`${table.endDate} > ${table.startDate}`),
    uniqueIndex('budget_name_period').on(table.name, table.period),
    index('idx_budget_period').on(table.period),
  ],
);

// Budget Items
export const budgetItems = accountingSchema.table(
  'budget_items',
  {
    id: serial('id').primaryKey(),
    budgetId: integer('budget_id')
      .notNull()
      .references(() => budgets.id),
    category: varchar('category', { length: 35 }).notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    ...metaCols,
  },
  (table) => [index('idx_budgetitem_budget').on(table.budgetId)],
);

// Terms & Conditions
export const terms = accountingSchema.table(
  'terms',
  {
    id: serial('id').primaryKey(),
    category: varchar('category', { length: 25 }).notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    content: text('content').notNull(),
    isDefault: boolean('is_default').default(false),
    ...metaCols,
  },
  (table) => [
    uniqueIndex('terms_unique_cat_title').on(table.category, table.title),
  ],
);
