import {
  boolean,
  check,
  integer,
  numeric,
  pgSchema,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { metaCols } from '../utils/metaCols';
import { inventoryItems } from './inventory.schema';
import { sql } from 'drizzle-orm';

export const salesSchema = pgSchema('sales_schema');

export const product = salesSchema.enum('product_type', [
  'ready-made',
  'custom',
  'alteration',
  'fabric',
  'service',
]);

export const productCatelog = salesSchema.table(
  'product_catelog',
  {
    id: serial().primaryKey(),
    type: product().notNull(),
    itemId: integer('item_id')
      .references(() => inventoryItems.id)
      .unique(),
    sellingPrice: numeric('selling_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    image: text(),
    description: text(),
    enabled: boolean().default(true),
    ...metaCols,
  },
  (table) => [
    check(
      'check_itemId',
      sql`
         (type IN ('ready-made', 'fabric') AND item_id IS NOT NULL) OR 
         (type NOT IN ('ready-made', 'fabric') AND item_id IS NULL)
        `
    ),
  ],
);
