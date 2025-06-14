CREATE SCHEMA "sales_schema";
--> statement-breakpoint
CREATE SCHEMA "inventory_schema";
--> statement-breakpoint
CREATE TYPE "sales_schema"."product_type" AS ENUM('ready-made', 'custom', 'alteration', 'fabric', 'service');--> statement-breakpoint
CREATE TYPE "sales_schema"."promo_type" AS ENUM('percentage', 'fixed-amount');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" integer DEFAULT 971 NOT NULL,
	"number" varchar(12),
	"email" varchar(45),
	"reference" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "contacts_phone_length" CHECK (char_length("contacts"."number") BETWEEN 7 AND 12)
);
--> statement-breakpoint
CREATE TABLE "email_otps" (
	"otp_id" serial NOT NULL,
	"email" varchar(32) NOT NULL,
	"email_otp_token" varchar(8),
	"email_otp_expires_in" timestamp NOT NULL,
	"email_otp_created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_otps_otp_id_email_otp_token_pk" PRIMARY KEY("otp_id","email_otp_token")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"referesh_token_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"replaced_by" varchar(36),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"permissions" jsonb NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(32) NOT NULL,
	"password" text NOT NULL,
	"role_id" serial NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"two_factor_type" varchar(20),
	"two_factor_secret" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"grpId" integer NOT NULL,
	"phone" varchar(16) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100),
	"status" varchar(12) DEFAULT 'new' NOT NULL,
	"measurement" jsonb,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."customer_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(16) NOT NULL,
	"admin" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "customer_groups_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"time" timestamp NOT NULL,
	"type" varchar(20) NOT NULL,
	"assignedTo" varchar(50),
	"location" text,
	"customerId" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(35) NOT NULL,
	"content" text,
	"language" varchar(20) DEFAULT 'english',
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."pos_register_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"terminal_id" integer,
	"opened_by" integer,
	"opened_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"openingCash" numeric(10, 2) NOT NULL,
	"closingCash" numeric(10, 2),
	"status" varchar(10) NOT NULL,
	"notes" text,
	CONSTRAINT "sesson_status_check" CHECK ("sales_schema"."pos_register_sessions"."status" in ('open', 'closed'))
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."product_catelog" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "sales_schema"."product_type" NOT NULL,
	"name" varchar(75) NOT NULL,
	"sku" varchar(15) NOT NULL,
	"barcode" varchar NOT NULL,
	"item_id" integer,
	"selling_price" numeric(10, 2) NOT NULL,
	"image" text,
	"description" text,
	"enabled" boolean DEFAULT true,
	"category_name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "product_catelog_name_unique" UNIQUE("name"),
	CONSTRAINT "product_catelog_item_id_unique" UNIQUE("item_id"),
	CONSTRAINT "item_id_check" CHECK (
        "sales_schema"."product_catelog"."type" NOT IN ('ready-made','fabric')
        OR "sales_schema"."product_catelog"."item_id" IS NOT NULL
      )
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "product_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."product_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(75) NOT NULL,
	"sku" varchar(15) NOT NULL,
	"category" varchar(15) NOT NULL,
	"uom" varchar(20) DEFAULT 'pc' NOT NULL,
	"description" text,
	"cost" numeric(8, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"minStock" integer DEFAULT 1 NOT NULL,
	"reorderPoint" integer NOT NULL,
	"barcode" text,
	"supplierId" integer,
	"weight" varchar(12),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."product_restocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"cost" numeric(8, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"supplier_id" integer NOT NULL,
	"invNo" varchar(15),
	"restock_date" timestamp NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."project_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"stepNo" integer NOT NULL,
	"configId" integer NOT NULL,
	"notes" text NOT NULL,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"completedAt" timestamp,
	"projectId" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "project_workflows_projectId_configId_stepNo_unique" UNIQUE("projectId","configId","stepNo")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar(12) DEFAULT 'draft' NOT NULL,
	"customer_id" integer NOT NULL,
	"customerName" varchar(100) NOT NULL,
	"sales_person_id" integer NOT NULL,
	"sales_person_name" varchar(100) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"taxAmount" numeric(8, 2) NOT NULL,
	"discountAmount" numeric(8, 2) NOT NULL,
	"totalAmount" numeric(12, 2) NOT NULL,
	"paymentMethod" varchar(20) NOT NULL,
	"payment_status" varchar(35) DEFAULT 'no-payment',
	"notes" text,
	"priority" varchar(12) DEFAULT 'medium' NOT NULL,
	"paymentTerms" varchar(35) DEFAULT 'net 30' NOT NULL,
	"payment_due_date" timestamp NOT NULL,
	"delivery_date" timestamp,
	"completed_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "total_amount_pos" CHECK ("sales_schema"."sales_orders"."taxAmount" > 0)
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_order_items" (
	"id" serial NOT NULL,
	"orderId" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"catelog_id" integer NOT NULL,
	"sku" varchar(15),
	"qty" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"item_total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "sales_order_items_id_description_pk" PRIMARY KEY("id","description")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"customerId" integer NOT NULL,
	"description" text NOT NULL,
	"deadline" timestamp NOT NULL,
	"rush" boolean DEFAULT false,
	"instructions" text,
	"estimatedHours" integer,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0,
	"tailor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"type" "sales_schema"."promo_type" DEFAULT 'percentage',
	"value" integer NOT NULL,
	"startDate" timestamp DEFAULT now() NOT NULL,
	"endDate" timestamp NOT NULL,
	"min_purchase_amt" integer NOT NULL,
	"max_purchase_amt" integer NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_quotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"valid_until" timestamp,
	"customer_id" integer,
	"customerName" varchar(100) NOT NULL,
	"notes" text,
	"terms" text,
	"status" varchar(12) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "valid_until_check" CHECK ("sales_schema"."sales_quotations"."valid_until" > now())
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_quote_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"quoteId" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"catelog_id" integer NOT NULL,
	"sku" varchar(15) NOT NULL,
	"qty" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"item_total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"customerName" varchar(100) NOT NULL,
	"order_id" integer NOT NULL,
	"paymentMethod" varchar(50) NOT NULL,
	"notes" text,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_returns_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"return_id" integer,
	"item_name" varchar(100) NOT NULL,
	"qty" integer NOT NULL,
	"reason" varchar(35) NOT NULL,
	"type" varchar(15) NOT NULL,
	"condition" varchar(100) NOT NULL,
	"refund_total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"department" varchar(20) NOT NULL,
	"email" varchar(100),
	"phone" varchar(16) NOT NULL,
	"address" text,
	"level" integer DEFAULT 1 NOT NULL,
	"role" varchar(12),
	"joinDate" timestamp DEFAULT now(),
	"status" varchar(12),
	"salary" numeric(12, 2) NOT NULL,
	"photo" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"type" varchar(8) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "sales_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_Stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(16) NOT NULL,
	"location" varchar(100),
	"email" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."sales_terminals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"store_id" integer,
	"deviceIdentifier" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "sales_terminals_deviceIdentifier_unique" UNIQUE("deviceIdentifier")
);
--> statement-breakpoint
CREATE TABLE "sales_schema"."project_workflows_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."inventory_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) DEFAULT 'full' NOT NULL,
	"location_id" integer NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(75) NOT NULL,
	"category" varchar(35) NOT NULL,
	"sku" varchar(15) NOT NULL,
	"subcategory" varchar(35),
	"barcode" text,
	"uom" varchar NOT NULL,
	"description" text,
	"supplier_id" integer,
	"location_id" integer,
	"quantity" integer DEFAULT 0,
	"cost" numeric(10, 2),
	"min_qty" integer DEFAULT 1,
	"vat" integer DEFAULT 5,
	"reorder_qty" integer,
	"enabled" boolean DEFAULT true,
	"halal_cert" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."inventory_locations" (
	"location_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"type" varchar(35) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(50) NOT NULL,
	"postalCode" integer NOT NULL,
	"country" varchar(35) DEFAULT 'UAE',
	"description" text,
	"contactPerson" varchar(50) NOT NULL,
	"contactNo" varchar(12) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."material_allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"project_id" integer,
	"department" varchar(35),
	"status" varchar(20) DEFAULT 'reserved',
	"due_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"quantity" integer NOT NULL,
	"location_id" integer,
	"ref_type" varchar(20),
	"ref_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."suppliers" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"contactPerson" varchar(50) NOT NULL,
	"address" text,
	"city" varchar(35) NOT NULL,
	"country" varchar(35) DEFAULT 'UAE' NOT NULL,
	"postalCode" integer NOT NULL,
	"contactId" integer NOT NULL,
	"website" varchar(50),
	"taxId" varchar(35),
	"category" varchar(35) NOT NULL,
	"paymentTerms" varchar(35) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_preferred" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_schema"."waste_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"percentage" integer,
	"reason" varchar(100) NOT NULL,
	"project_id" integer,
	"suggestion" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "email_otps" ADD CONSTRAINT "email_otps_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."customers" ADD CONSTRAINT "customers_grpId_customer_groups_id_fk" FOREIGN KEY ("grpId") REFERENCES "sales_schema"."customer_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."events" ADD CONSTRAINT "events_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "sales_schema"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."pos_register_sessions" ADD CONSTRAINT "pos_register_sessions_store_id_sales_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "sales_schema"."sales_Stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."pos_register_sessions" ADD CONSTRAINT "pos_register_sessions_terminal_id_sales_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "sales_schema"."sales_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."pos_register_sessions" ADD CONSTRAINT "pos_register_sessions_opened_by_users_id_fk" FOREIGN KEY ("opened_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ADD CONSTRAINT "product_catelog_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_schema"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_catelog" ADD CONSTRAINT "product_catelog_category_name_product_categories_name_fk" FOREIGN KEY ("category_name") REFERENCES "sales_schema"."product_categories"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_inventory" ADD CONSTRAINT "product_inventory_supplierId_suppliers_id_fk" FOREIGN KEY ("supplierId") REFERENCES "sales_schema"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_restocks" ADD CONSTRAINT "product_restocks_itemId_product_inventory_id_fk" FOREIGN KEY ("itemId") REFERENCES "sales_schema"."product_inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."product_restocks" ADD CONSTRAINT "product_restocks_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "sales_schema"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."project_workflows" ADD CONSTRAINT "project_workflows_configId_project_workflows_config_id_fk" FOREIGN KEY ("configId") REFERENCES "sales_schema"."project_workflows_config"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."project_workflows" ADD CONSTRAINT "project_workflows_projectId_sales_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "sales_schema"."sales_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_orders" ADD CONSTRAINT "sales_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "sales_schema"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD CONSTRAINT "sales_order_items_orderId_sales_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "sales_schema"."sales_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_order_items" ADD CONSTRAINT "sales_order_items_catelog_id_product_catelog_id_fk" FOREIGN KEY ("catelog_id") REFERENCES "sales_schema"."product_catelog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_projects" ADD CONSTRAINT "sales_projects_orderId_sales_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "sales_schema"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_projects" ADD CONSTRAINT "sales_projects_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "sales_schema"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_projects" ADD CONSTRAINT "sales_projects_tailor_id_sales_staff_id_fk" FOREIGN KEY ("tailor_id") REFERENCES "sales_schema"."sales_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quotations" ADD CONSTRAINT "sales_quotations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "sales_schema"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quote_items" ADD CONSTRAINT "sales_quote_items_quoteId_sales_quotations_id_fk" FOREIGN KEY ("quoteId") REFERENCES "sales_schema"."sales_quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quote_items" ADD CONSTRAINT "sales_quote_items_catelog_id_product_catelog_id_fk" FOREIGN KEY ("catelog_id") REFERENCES "sales_schema"."product_catelog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns" ADD CONSTRAINT "sales_returns_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "sales_schema"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns" ADD CONSTRAINT "sales_returns_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "sales_schema"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_returns_table" ADD CONSTRAINT "sales_returns_table_return_id_sales_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "sales_schema"."sales_returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_terminals" ADD CONSTRAINT "sales_terminals_store_id_sales_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "sales_schema"."sales_Stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_terminals" ADD CONSTRAINT "sales_terminals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."inventory_audits" ADD CONSTRAINT "inventory_audits_location_id_inventory_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "inventory_schema"."inventory_locations"("location_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."inventory_items" ADD CONSTRAINT "inventory_items_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "inventory_schema"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."inventory_items" ADD CONSTRAINT "inventory_items_location_id_inventory_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "inventory_schema"."inventory_locations"("location_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."material_allocations" ADD CONSTRAINT "material_allocations_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_schema"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."stock_movements" ADD CONSTRAINT "stock_movements_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_schema"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."stock_movements" ADD CONSTRAINT "stock_movements_location_id_inventory_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "inventory_schema"."inventory_locations"("location_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."suppliers" ADD CONSTRAINT "suppliers_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_schema"."waste_records" ADD CONSTRAINT "waste_records_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_schema"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_email_unique" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customer_idx" ON "sales_schema"."customers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "title_idx" ON "sales_schema"."events" USING btree ("title");--> statement-breakpoint
CREATE INDEX "pos_sessions_idx" ON "sales_schema"."pos_register_sessions" USING btree ("terminal_id","opened_by","store_id");--> statement-breakpoint
CREATE INDEX "ref_id_idx" ON "sales_schema"."product_catelog" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "customer_id_idx" ON "sales_schema"."sales_orders" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "sales_person_id_idx" ON "sales_schema"."sales_orders" USING btree ("sales_person_id");--> statement-breakpoint
CREATE INDEX "priority_idx" ON "sales_schema"."sales_orders" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "due_date_idx" ON "sales_schema"."sales_orders" USING btree ("payment_due_date");--> statement-breakpoint
CREATE INDEX "order_items_idx" ON "sales_schema"."sales_order_items" USING btree ("catelog_id");--> statement-breakpoint
CREATE INDEX "store_idx" ON "sales_schema"."sales_Stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "terminal_idx" ON "sales_schema"."sales_terminals" USING btree ("name","store_id","user_id");