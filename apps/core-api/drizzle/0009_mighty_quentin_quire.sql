CREATE TYPE "sales_schema"."payment_methods" AS ENUM('visa', 'bank_transfer', 'cash');--> statement-breakpoint
CREATE TYPE "sales_schema"."payment_status" AS ENUM('no-payment', 'partial', 'completed');--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"payment_method" "sales_schema"."payment_methods" DEFAULT 'cash' NOT NULL,
	"amount" numeric(12, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
DROP INDEX "sales_schema"."due_date_idx";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ALTER COLUMN "payment_status" SET DEFAULT 'no-payment'::"sales_schema"."payment_status";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ALTER COLUMN "payment_status" SET DATA TYPE "sales_schema"."payment_status" USING "payment_status"::"sales_schema"."payment_status";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ADD COLUMN "amount_paid" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ADD COLUMN "amount_pending" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ADD COLUMN "payment_completed_date" timestamp;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_transactions" ADD CONSTRAINT "sales_transactions_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "sales_schema"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_idx" ON "sales_schema"."sales_orders" USING btree ("payment_due_date","amount_pending","amount_paid");--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" DROP COLUMN "paymentMethod";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ADD CONSTRAINT "payment_check" CHECK ("sales_schema"."sales_orders"."amount_paid" + "sales_schema"."sales_orders"."amount_pending" = "sales_schema"."sales_orders"."totalAmount");