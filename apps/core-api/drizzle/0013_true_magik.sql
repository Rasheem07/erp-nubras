ALTER TABLE "sales_schema"."product_inventory" ALTER COLUMN "barcode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_inventory" ADD COLUMN "barcodeImageUrl" text NOT NULL;