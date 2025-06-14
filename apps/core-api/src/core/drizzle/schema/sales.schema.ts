import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgSchema,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { metaCols } from '../utils/metaCols';
import { inventoryItems } from './inventory.schema';
import { sql } from 'drizzle-orm';
import { users } from './user.schema';

export const salesSchema = pgSchema('sales_schema');

export const stores = salesSchema.table(
  'sales_Stores',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    location: text(),
    ...metaCols,
  },
  (table) => [index('store_idx').on(table.name)],
);

export const terminals = salesSchema.table(
  'sales_terminals',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    storeId: integer('store_id').references(() => stores.id),
    deviceIdentifier: text().unique(),
    userId: integer('user_id').references(() => users.id),
    ...metaCols,
  },
  (table) => [
    index('terminal_idx').on(table.name, table.storeId, table.userId),
  ],
);

export const posSessions = salesSchema.table(
  'pos_register_sessions',
  {
    id: serial().primaryKey(),
    storeId: integer('store_id').references(() => stores.id),
    terminalId: integer('terminal_id').references(() => terminals.id),
    openedBy: integer('opened_by').references(() => users.id),
    openedAt: timestamp('opened_at').defaultNow(),
    closedAt: timestamp('closed_at'),
    openingCash: numeric({ precision: 10, scale: 2 }).notNull(),
    closingCash: numeric({ precision: 10, scale: 2 }),
    status: varchar({ length: 10 }).notNull(),
    notes: text(),
  },
  (table) => [
    check('sesson_status_check', sql`${table.status} in ('open', 'closed')`),
    index('pos_sessions_idx').on(
      table.terminalId,
      table.openedBy,
      table.storeId,
    ),
  ],
);

export const product = salesSchema.enum('product_type', [
  'ready-made',
  'custom'
]);

export const customerGroup = salesSchema.table('customer_groups', {
  id: serial().primaryKey(),
  phone: varchar({ length: 16 }).notNull().unique(),
  admin: varchar({ length: 100 }),
  ...metaCols,
});

export interface customerMeasurement {
  arabic: {
    frontLength: number;
    backLength: number;
    shoulder: number;
    sleeves: number;
    neck: number;
    waist: number;
    chest: number;
    widthEnd: number;
    notes: string;
  };
  kuwaiti: {
    frontLength: number;
    backLength: number;
    shoulder: number;
    sleeves: number;
    neck: number;
    waist: number;
    chest: number;
    widthEnd: number;
    notes: string;
  };
}

export const customer = salesSchema.table(
  'customers',
  {
    id: serial().primaryKey(),
    grpId: integer()
      .notNull()
      .references(() => customerGroup.id),
    phone: varchar({ length: 16 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }),
    status: varchar({ length: 12 }).default('new').notNull(),
    measurement: jsonb().$type<customerMeasurement>(),
    preferences: jsonb().$type<string[]>(),
    ...metaCols,
  },
  (table) => [index('customer_idx').on(table.name)],
);

export const paymentStatus = salesSchema.enum('payment_status', [
  'no-payment',
  'partial',
  'completed',
]);

export const salesOrder = salesSchema.table(
  'sales_orders',
  {
    id: serial().primaryKey(),
    status: varchar({ length: 12 }).notNull().default('draft'),
    customerId: integer('customer_id')
      .notNull()
      .references(() => customer.id),
    customerName: varchar({ length: 100 }).notNull(),
    salesPersonId: integer('sales_person_id').notNull(),
    salesPersonName: varchar('sales_person_name', { length: 100 }).notNull(),
    subtotal: numeric({ precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric({ precision: 8, scale: 2 }).notNull(),
    discountAmount: numeric({ precision: 8, scale: 2 }).notNull(),
    totalAmount: numeric({ precision: 12, scale: 2 }).notNull(),
    paymentStatus: paymentStatus('payment_status').default('no-payment'),
    notes: text(),
    priority: varchar({ length: 12 }).notNull().default('medium'),
    paymentTerms: varchar({ length: 35 }).notNull().default('net 30'),
    dueDate: timestamp('payment_due_date').notNull(),
    deliveryDate: timestamp('delivery_date'),
    completedDate: timestamp('completed_date'),
    quoteId: integer().references(() => salesQuotations.id),
    amountPaid: numeric('amount_paid', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    amountPending: numeric('amount_pending', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    paymentCompletedDate: timestamp('payment_completed_date'),
    ...metaCols,
  },
  (table) => [
    index('date_idx').on(table.createdAt),
    index('customer_id_idx').on(table.customerId),
    index('sales_person_id_idx').on(table.salesPersonId),
    check('total_amount_pos', sql`${table.taxAmount} > 0`),
    index('priority_idx').on(table.priority),
    index('payment_idx').on(
      table.dueDate,
      table.amountPending,
      table.amountPaid,
    ),
    check(
      'payment_check',
      sql`${table.amountPaid} + ${table.amountPending} = ${table.totalAmount}`,
    ),
  ],
);

export const salesOrderItem = salesSchema.table(
  'sales_order_items',
  {
    id: serial().primaryKey(),
    type: product().default("ready-made").notNull(),
    orderId: integer()
      .notNull()
      .references(() => salesOrder.id, { onDelete: 'cascade' }),
    description: varchar({ length: 100 }).notNull(),
    catelogId: integer('catelog_id')
      .references(() => productCatalog.id)
      .notNull(),
    modelName: text()
      .references(() => customProductModels.name),
    sku: varchar('sku', { length: 15 }),
    qty: integer().notNull(),
    price: numeric('base_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    modelPrice: numeric('model_price', {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    total: numeric('item_total', {
      precision: 10,
      scale: 2,
    }).notNull(),
    ...metaCols,
  },
  (table) => [index('order_items_idx').on(table.catelogId)],
);

export const orderItemMeasurements = salesSchema.table(
  'order_item_measurement',
  {
    id: serial().primaryKey(),
    orderItemId: integer('order_item_id')
      .notNull()
      .references(() => salesOrderItem.id),
    frontLength: varchar({ length: 6 }).notNull(),
    backLength: varchar({ length: 6 }).notNull(),
    shoulder: varchar({ length: 6 }).notNull(),
    sleeves: varchar({ length: 6 }).notNull(),
    neck: varchar({ length: 6 }).notNull(),
    waist: varchar({ length: 6 }).notNull(),
    chest: varchar({ length: 6 }).notNull(),
    widthEnd: varchar({ length: 6 }).notNull(),
    notes: text(),
    ...metaCols,
  },
);

export const paymentMethodType = salesSchema.enum('payment_methods', [
  'visa',
  'bank_transfer',
  'cash',
]);

export const salesTransactions = salesSchema.table('sales_transactions', {
  id: serial().primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => salesOrder.id),
  paymentMethod: paymentMethodType('payment_method').default('cash').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  ...metaCols,
});

export const salesQuotations = salesSchema.table(
  'sales_quotations',
  {
    id: serial().primaryKey(),
    validUntil: timestamp('valid_until'),
    customerId: integer('customer_id').references(() => customer.id, {
      onDelete: 'cascade',
    }),
    customerName: varchar({ length: 100 }).notNull(),
    notes: text(),
    terms: text(),
    status: varchar({ length: 12 }).default('draft').notNull(),
    subtotal: numeric({ precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric({ precision: 8, scale: 2 }).notNull(),
    discountAmount: numeric({ precision: 8, scale: 2 }).notNull(),
    totalAmount: numeric({ precision: 12, scale: 2 }).notNull(),
    ...metaCols,
  },
  (table) => [check('valid_until_check', sql`${table.validUntil} > now()`)],
);

export const salesQuoteItem = salesSchema.table('sales_quote_items', {
  id: serial().primaryKey(),
  quoteId: integer()
    .notNull()
    .references(() => salesQuotations.id),
  description: varchar({ length: 100 }).notNull(),
  catalogId: integer('catelog_id')
    .references(() => productCatalog.id)
    .notNull(),
  sku: varchar('sku', { length: 15 }).notNull(),
  qty: integer().notNull(),
  price: numeric('unit_price', {
    precision: 10,
    scale: 2,
  }).notNull(),
  total: numeric('item_total', {
    precision: 10,
    scale: 2,
  }).notNull(),
  ...metaCols,
});

export const salesReturns = salesSchema.table('sales_returns', {
  id: serial().primaryKey(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customer.id),
  customerName: varchar({ length: 100 }).notNull(),
  orderId: integer('order_id')
    .notNull()
    .references(() => salesOrder.id),
  paymentMethod: varchar({ length: 50 }).notNull(),
  notes: text(),
  status: varchar({ length: 12 }).default('pending').notNull(),
  ...metaCols,
});

export const salesReturnsItem = salesSchema.table('sales_returns_items', {
  id: serial().primaryKey(),
  returnId: integer('return_id').references(() => salesReturns.id, {
    onDelete: 'cascade',
  }),
  orderItemId: integer('order_item_id')
    .notNull()
    .references(() => salesOrderItem.id),
  itemName: varchar('item_name', { length: 100 }).notNull(),
  qty: integer().notNull(),
  reason: varchar({ length: 35 }).notNull(),
  type: varchar({ length: 15 }).notNull(),
  condition: varchar({ length: 100 }).notNull(),
  refundAmount: numeric('refund_total', {
    precision: 10,
    scale: 2,
  }).notNull(),
  ...metaCols,
});

export const salesProjects = salesSchema.table('sales_projects', {
  id: serial().primaryKey(),
  orderId: integer()
    .notNull()
    .references(() => salesOrder.id),
  customerId: integer()
    .notNull()
    .references(() => customer.id),
  description: text().notNull(),
  deadline: timestamp().notNull(),
  rush: boolean().default(false),
  instructions: text(),
  estimatedHours: integer(),
  status: varchar({ length: 12 }).notNull().default('pending'),
  progress: integer().default(0),
  tailorId: integer('tailor_id')
    .notNull()
    .references(() => salesStaff.id),
  ...metaCols,
});

export const projectWorkflows = salesSchema.table(
  'project_workflows',
  {
    id: serial().primaryKey(),
    stepNo: integer().notNull(),
    configId: integer()
      .notNull()
      .references(() => workflowTemplates.id, { onDelete: 'cascade' }),
    notes: text().notNull(),
    status: varchar({ length: 12 }).notNull().default('pending'),
    completedAt: timestamp(),
    estimatedHours: integer(),
    actualHours: integer(),
    projectId: integer()
      .notNull()
      .references(() => salesProjects.id, { onDelete: 'cascade' }),
    ...metaCols,
  },
  (table) => [unique().on(table.projectId, table.configId, table.stepNo)],
);

export const workflowTemplates = salesSchema.table('project_workflows_config', {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  ...metaCols,
});

export const salesStaff = salesSchema.table('sales_staff', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  department: varchar({ length: 20 }).notNull(),
  email: varchar({ length: 100 }),
  phone: varchar({ length: 16 }).notNull(),
  address: text(),
  level: integer().default(1).notNull(),
  role: varchar({ length: 12 }),
  joinDate: timestamp().defaultNow(),
  status: varchar({ length: 12 }),
  salary: numeric({ precision: 12, scale: 2 }).notNull(),
  photo: text(),
  specialties: jsonb().$type<string[]>(),
  ...metaCols,
});

export const productCatalog = salesSchema.table(
  'product_catelog',
  {
    id: serial().primaryKey(),
    type: product().notNull(),
    name: varchar('name', { length: 75 }).notNull().unique(),
    sku: varchar('sku', { length: 15 }).notNull(),
    barcode: varchar().notNull(),
    itemId: integer('item_id')
      .references(() => productInventory.id)
      .unique(),
    sellingPrice: numeric('selling_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    image: text(),
    description: text(),
    enabled: boolean().default(true),
    categoryName: varchar('category_name', { length: 50 })
      .notNull()
      .references(() => productCategories.name),
    ...metaCols,
  },
  (table) => [
    index('ref_id_idx').on(table.sku),
    check(
      'item_id_check',
      sql`
        ${table.type} NOT IN ('ready-made')
        OR ${table.itemId} IS NOT NULL
      `,
    ),
  ],
);

export const customProductModels = salesSchema.table('custom_product_models', {
  id: serial().primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => productCatalog.id),
  name: text().notNull().unique(),
  charge: numeric('model_charge', {
    precision: 10,
    scale: 2,
  }).notNull(),
  ...metaCols,
});

export const productCategories = salesSchema.table('product_categories', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
  ...metaCols,
});

export const productInventory = salesSchema.table('product_inventory', {
  id: serial().primaryKey(),
  name: varchar({ length: 75 }).notNull(),
  sku: varchar({ length: 15 }).notNull(),
  category: varchar({ length: 15 }).notNull(),
  uom: varchar({ length: 20 }).notNull().default('pc'),
  description: text(),
  cost: numeric({ precision: 8, scale: 2 }).notNull(),
  stock: integer().notNull().default(0),
  minStock: integer().notNull().default(1),
  reorderPoint: integer().notNull(),
  //if exists or it will be generated in the system for product packaging, quick sales and more
  barcode: text().notNull(),
  barcodeImageUrl: text().notNull(),
  //preffered supplier
  supplierId: integer().references(() => suppliers.id),
  weight: varchar({ length: 12 }),
  notes: text(),
  ...metaCols,
});

export const productRestocks = salesSchema.table('product_restocks', {
  id: serial().primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => productInventory.id),
  qty: integer('quantity').notNull(),
  cost: numeric({ precision: 8, scale: 2 }).notNull(),
  total: numeric({ precision: 12, scale: 2 }).notNull(),
  supplierId: integer('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  invNo: varchar({ length: 15 }),
  restockDate: timestamp('restock_date').notNull(),
  notes: text(),
  ...metaCols,
});

export const suppliers = salesSchema.table('suppliers', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 16 }).notNull(),
  location: varchar({ length: 100 }),
  email: text(),
  ...metaCols,
});

export const promoType = salesSchema.enum('promo_type', [
  'percentage',
  'fixed-amount',
]);
export const salesPromotions = salesSchema.table('sales_promotions', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  code: varchar({ length: 10 }).notNull(),
  type: promoType().default('percentage'),
  value: integer().notNull(),
  startDate: timestamp().defaultNow().notNull(),
  endDate: timestamp().notNull(),
  minPurchaseAmt: integer('min_purchase_amt').notNull(),
  maxPurchaseAmt: integer('max_purchase_amt').notNull(),
  description: text(),
  enabled: boolean().default(true),
  ...metaCols,
});

export const events = salesSchema.table(
  'events',
  {
    id: serial().primaryKey(),
    title: text().notNull(),
    description: text(),
    time: timestamp().notNull(),
    type: varchar({ length: 20 }).notNull(),
    assignedTo: varchar({ length: 50 }),
    location: text(),
    customerId: integer().references(() => customer.id),
    ...metaCols,
  },
  (table) => [index('title_idx').on(table.title)],
);

export const policies = salesSchema.table('sales_policies', {
  id: serial().primaryKey(),
  type: varchar({ length: 35 }).notNull(),
  content: text(),
  language: varchar({ length: 20 }).default('english'),
  enabled: boolean().default(true),
  ...metaCols,
});

export const settings = salesSchema.table('sales_settings', {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  value: jsonb().notNull(),
  type: varchar({ length: 8 }).notNull(),
  ...metaCols,
});
