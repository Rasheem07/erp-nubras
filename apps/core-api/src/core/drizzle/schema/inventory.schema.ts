import { boolean, integer, numeric, pgSchema, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { metaCols } from "../utils/metaCols";

export const inventorySchema = pgSchema("inventory_schema");

export const inventoryItems = inventorySchema.table("inventory_items", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 75}).notNull(),
    categoy: varchar("category", {length: 35}).notNull(),
    sku: varchar("sku", {length: 15}),
    subcategory: varchar("subcategory", {length: 35}),
    barcode: text("barcode"),
    uom: varchar("uom"),
    description: text(),
    supplierId: integer("supplier_id").references(() => suppliers.id),
    locationId: integer("location_id").references(() => locations.id),
    quantity: integer("quantity").default(0),
    cost: numeric("cost", {precision: 10, scale: 2}),
    minQty: integer("min_qty").default(1),
    vat: integer("vat").default(5),
    reorderQty:  integer("reorder_qty"),
    enabled: boolean("enabled").default(true),
    halalCert: boolean("halal_cert").default(false),
    ...metaCols
})


export const suppliers = inventorySchema.table("suppliers", {
    id: serial("supplier_id").primaryKey(),
    ...metaCols
})

export const locations = inventorySchema.table("inventory_locations", {
    id: serial("location_id").primaryKey(),
    ...metaCols
})