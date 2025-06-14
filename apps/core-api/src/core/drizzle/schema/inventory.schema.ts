import {
  boolean,
  integer,
  numeric,
  pgSchema,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { metaCols } from '../utils/metaCols';
import { invoices } from './accounting.schema';
import { contacts } from '.';

export const inventorySchema = pgSchema('inventory_schema');

export const inventoryItems = inventorySchema.table('inventory_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 75 }).notNull(),
  category: varchar('category', { length: 35 }).notNull(),
  sku: varchar('sku', { length: 15 }).notNull(),
  subcategory: varchar('subcategory', { length: 35 }),
  barcode: text('barcode'),
  uom: varchar('uom').notNull(),
  description: text(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  locationId: integer('location_id').references(() => locations.id),
  quantity: integer('quantity').default(0),
  cost: numeric('cost', { precision: 10, scale: 2 }),
  minQty: integer('min_qty').default(1),
  vat: integer('vat').default(5),
  reorderQty: integer('reorder_qty'),
  enabled: boolean('enabled').default(true),
  halalCert: boolean('halal_cert').default(false),
  ...metaCols,
});

export const stockMovements = inventorySchema.table('stock_movements', {
  id: serial().primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => inventoryItems.id),
  type: varchar({ length: 20 }).notNull(),
  quantity: integer().notNull(),
  locationId: integer('location_id').references(() => locations.id),
  refType: varchar('ref_type', { length: 20 }),
  refId: integer('ref_id'),
  notes: text(),
  ...metaCols,
});

export const materialAllocations = inventorySchema.table(
  'material_allocations',
  {
    id: serial().primaryKey(),
    itemId: integer('item_id')
      .notNull()
      .references(() => inventoryItems.id),
    quantity: integer().notNull(),
    projectId: integer('project_id'), //will be linked to projects  entity in future
    department: varchar({ length: 35 }),
    status: varchar({ length: 20 }).default('reserved'),
    dueDate: timestamp('due_date'),
    notes: text(),
    ...metaCols,
  },
);

export const wasteRecords = inventorySchema.table('waste_records', {
  id: serial().primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => inventoryItems.id),
  quantity: integer().notNull(),
  percentage: integer(),
  reason: varchar({ length: 100 }).notNull(),
  projectId: integer('project_id'), //will be linked to projects  entity in future
  suggestion: text(),
  ...metaCols,
});


export const suppliers = inventorySchema.table('suppliers', {
  id: serial('supplier_id').primaryKey(),
  name: varchar({length: 50}).notNull(),
  contactPerson: varchar({length: 50}).notNull(),
  address: text(),
  city: varchar({length: 35}).notNull(),
  country: varchar({length: 35}).notNull().default("UAE"),
  postalCode: integer().notNull(),
  contactId: integer().references(() => contacts.id).notNull(),
  website: varchar({length: 50}),
  taxId: varchar({length: 35}),
  category: varchar({length: 35}).notNull(),
  paymentTerms: varchar({length: 35}).notNull(),
  isActive: boolean("is_active").default(true),
  preferred: boolean("is_preferred").default(false),
  notes: text(),
  ...metaCols,
});

export const locations = inventorySchema.table('inventory_locations', {
  id: serial('location_id').primaryKey(),
  name: varchar({length: 50}).notNull(),
  type: varchar({length: 35}).notNull(),
  address: text().notNull(),
  city: varchar({length: 50}).notNull(),
  postalCode: integer().notNull(),
  country: varchar({length: 35}).default("UAE"),
  description: text(),
  contactPerson: varchar({length: 50}).notNull(),
  contactNo: varchar({length: 12}).notNull(),
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  ...metaCols,
});

export const InventoryAudits = inventorySchema.table("inventory_audits", {
    id: serial().primaryKey(),
    type: varchar({length: 20}).notNull().default("full"),
    locationId: integer("location_id").notNull().references(() => locations.id),
    startDate: timestamp().notNull(),
    endDate: timestamp().notNull(),
    notes: text(),
    ...metaCols
})