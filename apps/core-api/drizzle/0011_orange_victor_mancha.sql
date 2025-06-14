CREATE TABLE "sales_schema"."custom_product_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" text NOT NULL,
	"model_charge" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "custom_product_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."order_item_measurement" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_item_id" integer NOT NULL,
	"frontLength" varchar(6) NOT NULL,
	"backLength" varchar(6) NOT NULL,
	"shoulder" varchar(6) NOT NULL,
	"sleeves" varchar(6) NOT NULL,
	"neck" varchar(6) NOT NULL,
	"waist" varchar(6) NOT NULL,
	"chest" varchar(6) NOT NULL,
	"widthEnd" varchar(6) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" RENAME COLUMN "unit_price" TO "base_price";--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" DROP CONSTRAINT "item_id_check";--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "sales_schema"."product_type";--> statement-breakpoint
CREATE TYPE "sales_schema"."product_type" AS ENUM('ready-made', 'custom', 'both');--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ALTER COLUMN "type" SET DATA TYPE "sales_schema"."product_type" USING "type"::"sales_schema"."product_type";--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD COLUMN "modelName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD COLUMN "model_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."custom_product_models" ADD CONSTRAINT "custom_product_models_product_id_product_catelog_id_fk" FOREIGN KEY ("product_id") REFERENCES "sales_schema"."product_catelog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."order_item_measurement" ADD CONSTRAINT "order_item_measurement_order_item_id_sales_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "sales_schema"."sales_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD CONSTRAINT "sales_order_items_modelName_custom_product_models_name_fk" FOREIGN KEY ("modelName") REFERENCES "sales_schema"."custom_product_models"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ADD CONSTRAINT "item_id_check" CHECK (
        "sales_schema"."product_catelog"."type" NOT IN ('ready-made','both')
        OR "sales_schema"."product_catelog"."item_id" IS NOT NULL
      );