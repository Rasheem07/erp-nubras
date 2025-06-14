ALTER TABLE "sales_schema"."product_restocks" RENAME COLUMN "itemId" TO "item_id";--> statement-breakpoint
ALTER TABLE "sales_schema"."product_restocks" DROP CONSTRAINT "product_restocks_itemId_product_inventory_id_fk";
--> statement-breakpoint
ALTER TABLE "sales_schema"."product_restocks" ADD CONSTRAINT "product_restocks_item_id_product_inventory_id_fk" FOREIGN KEY ("item_id") REFERENCES "sales_schema"."product_inventory"("id") ON DELETE no action ON UPDATE no action;