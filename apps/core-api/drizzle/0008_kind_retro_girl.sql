ALTER TABLE "sales_schema"."product_catelog" DROP CONSTRAINT "product_catelog_item_id_inventory_items_id_fk";
--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ADD CONSTRAINT "product_catelog_item_id_product_inventory_id_fk" FOREIGN KEY ("item_id") REFERENCES "sales_schema"."product_inventory"("id") ON DELETE no action ON UPDATE no action;