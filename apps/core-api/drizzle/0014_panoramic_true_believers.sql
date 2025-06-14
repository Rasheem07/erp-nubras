ALTER TABLE "sales_schema"."product_catelog" DROP CONSTRAINT "item_id_check";--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "sales_schema"."product_type";--> statement-breakpoint
CREATE TYPE "sales_schema"."product_type" AS ENUM('ready-made', 'custom');--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ALTER COLUMN "type" SET DATA TYPE "sales_schema"."product_type" USING "type"::"sales_schema"."product_type";--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ADD CONSTRAINT "item_id_check" CHECK (
        "sales_schema"."product_catelog"."type" NOT IN ('ready-made')
        OR "sales_schema"."product_catelog"."item_id" IS NOT NULL
      );