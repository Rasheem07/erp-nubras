ALTER TABLE "sales_schema"."sales_returns_table" RENAME TO "sales_returns_items";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns_items" DROP CONSTRAINT "sales_returns_table_return_id_sales_returns_id_fk";
--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" DROP CONSTRAINT "sales_order_items_id_description_pk";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns_items" ADD COLUMN "order_item_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns_items" ADD CONSTRAINT "sales_returns_items_return_id_sales_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "sales_schema"."sales_returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns_items" ADD CONSTRAINT "sales_returns_items_order_item_id_sales_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "sales_schema"."sales_order_items"("id") ON DELETE no action ON UPDATE no action;