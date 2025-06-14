CREATE SCHEMA "accounting_schema";
--> statement-breakpoint
CREATE SCHEMA "crm_schema";
--> statement-breakpoint
CREATE TYPE "accounting_schema"."account_type" AS ENUM('asset', 'liability', 'equity', 'expense', 'revenue');--> statement-breakpoint
CREATE TYPE "accounting_schema"."bank_curr" AS ENUM('AED', 'USD', 'INR', 'EUR', 'GPB', 'SAR');--> statement-breakpoint
CREATE TYPE "accounting_schema"."bank_acc_type" AS ENUM('checking', 'savings', 'fixed deposit', 'current', 'other');--> statement-breakpoint
CREATE TYPE "accounting_schema"."invoice_status" AS ENUM('sent', 'paid', 'draft', 'rejected', 'overdue');--> statement-breakpoint
CREATE TABLE "accounting_schema"."accounts" (
	"no" serial PRIMARY KEY NOT NULL,
	"status" boolean DEFAULT true,
	"name" varchar(32) NOT NULL,
	"type" "accounting_schema"."account_type" NOT NULL,
	"subtype" varchar(32),
	"balance" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "accounts_name_unique" UNIQUE("name"),
	CONSTRAINT "balance_non_negative" CHECK ("accounting_schema"."accounts"."balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."bank_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"swift_or_bic" text,
	"iban" text,
	"contact_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_name" varchar(32) NOT NULL,
	"account_no" integer NOT NULL,
	"branch" varchar(32) NOT NULL,
	"type" "accounting_schema"."bank_acc_type" NOT NULL,
	"currency" "accounting_schema"."bank_curr" DEFAULT 'AED',
	"balance" numeric(12, 2) DEFAULT '0.00',
	"status" varchar(20) DEFAULT 'active',
	"description" text,
	"details_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "bank_balance_non_negative" CHECK ("accounting_schema"."bank_accounts"."balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."bank_reconciliations" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now(),
	"st_balance" numeric(12, 2) NOT NULL,
	"bk_balance" numeric(12, 2) NOT NULL,
	"difference" numeric(12, 2) NOT NULL,
	"status" varchar(15) DEFAULT 'pending',
	"bank_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "reconcile_diff_calc" CHECK ("accounting_schema"."bank_reconciliations"."difference" = "accounting_schema"."bank_reconciliations"."st_balance" - "accounting_schema"."bank_reconciliations"."bk_balance"),
	CONSTRAINT "reconcile_status_enum" CHECK ("accounting_schema"."bank_reconciliations"."status" IN ('pending','completed','reconciled'))
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."budget_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"budget_id" integer NOT NULL,
	"category" varchar(35) NOT NULL,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" varchar(35) NOT NULL,
	"period" varchar(35) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"description" text,
	"department" varchar(35) NOT NULL,
	"status" varchar(12) DEFAULT 'draft',
	"approver_id" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "budget_period_valid" CHECK ("accounting_schema"."budgets"."end_date" > "accounting_schema"."budgets"."start_date")
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"date" timestamp DEFAULT now(),
	"category" varchar(35) DEFAULT 'other' NOT NULL,
	"payment_method" varchar(35),
	"paid_to_merchant" varchar(35),
	"description" text,
	"tags" text,
	"billable" boolean DEFAULT false,
	"tax_deductible" boolean DEFAULT false,
	"recurring" boolean DEFAULT false,
	"approval_required" boolean DEFAULT false NOT NULL,
	"approver_id" integer,
	"cost_center" varchar(35),
	"gl_account_no" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "expense_amount_positive" CHECK ("accounting_schema"."expenses"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."invoices_taxes" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoiceId" integer NOT NULL,
	"tax_name" varchar(35) NOT NULL,
	"rate" integer NOT NULL,
	"applyOn" varchar(35) NOT NULL,
	"enabled" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(12) NOT NULL,
	"customer_id" integer DEFAULT null,
	"supplier_id" integer DEFAULT null,
	"status" "accounting_schema"."invoice_status" DEFAULT 'draft' NOT NULL,
	"date" timestamp DEFAULT now(),
	"due_date" timestamp NOT NULL,
	"delivery_date" timestamp,
	"shippingMethod" varchar(25),
	"notes" text,
	"net_amount" numeric(12, 2) NOT NULL,
	"tax_amount" numeric(12, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "check_invoice_type" CHECK ("accounting_schema"."invoices"."type" IN ('sales','purchase')),
	CONSTRAINT "exactly_one_party" CHECK (
        (type = 'sales'    AND customer_id IS NOT NULL AND supplier_id IS NULL)
        OR
        (type = 'purchase' AND supplier_id IS NOT NULL AND customer_id IS NULL)
      ),
	CONSTRAINT "due_after_date" CHECK ("accounting_schema"."invoices"."due_date" >= "accounting_schema"."invoices"."date")
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now(),
	"ref_type" varchar(35),
	"ref_no" integer,
	"description" text,
	"notes" text,
	"status" varchar(20) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "journal_date_past" CHECK ("accounting_schema"."journal_entries"."date" <= now())
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."journal_entry_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"journal_entry_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"debit" numeric(12, 2) DEFAULT '0.00',
	"credit" numeric(12, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "line_debit_xor_credit" CHECK ((CASE WHEN "accounting_schema"."journal_entry_lines"."debit" > 0 THEN 1 ELSE 0 END + CASE WHEN "accounting_schema"."journal_entry_lines"."credit" > 0 THEN 1 ELSE 0 END) = 1)
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(35) NOT NULL,
	"date" timestamp DEFAULT now(),
	"method" varchar(35) NOT NULL,
	"party_type" varchar(35) NOT NULL,
	"party_acc" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(5) DEFAULT 'UAE',
	"category" varchar(35),
	"ref_type" varchar(35),
	"ref_no" integer,
	"description" text,
	"recurring" boolean DEFAULT false,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"cleared_date" timestamp,
	"attachment" text,
	"is_tax" boolean DEFAULT false,
	"tax_amount" numeric(8, 2) DEFAULT '0.00',
	"approval_status" varchar(25) DEFAULT 'pending',
	"approver" varchar(50),
	"tags" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "payment_amount_positive" CHECK ("accounting_schema"."payments"."amount" > 0),
	CONSTRAINT "check_payment_type" CHECK ("accounting_schema"."payments"."type" IN ('incoming','outgoing')),
	CONSTRAINT "check_payment_method" CHECK ("accounting_schema"."payments"."method" IN ('bank_transfer','check','cash')),
	CONSTRAINT "check_party_type" CHECK ("accounting_schema"."payments"."party_type" IN ('customer/vendor','employee','other')),
	CONSTRAINT "check_payment_status" CHECK ("accounting_schema"."payments"."status" IN ('pending','completed','failed','cancelled'))
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."purchase_invoice_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"item_id" integer,
	"quantity" integer NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."sales_invoice_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"item_id" integer,
	"quantity" integer NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."taxes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(25) NOT NULL,
	"rate" integer NOT NULL,
	"frequency" varchar(20) DEFAULT 'monthly',
	"next_due_date" timestamp NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"filling_instructions" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "tax_rate_range" CHECK ("accounting_schema"."taxes"."rate" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "accounting_schema"."terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(25) NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "crm_schema"."customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(75) NOT NULL,
	"contactId" integer,
	"address" text NOT NULL,
	"city" varchar(50) NOT NULL,
	"country" varchar(50) DEFAULT 'UAE',
	"postalCode" integer NOT NULL,
	"segment" varchar(75) DEFAULT 'new customer',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quotations" ADD COLUMN "subtotal" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quotations" ADD COLUMN "taxAmount" numeric(8, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quotations" ADD COLUMN "discountAmount" numeric(8, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_schema"."sales_quotations" ADD COLUMN "totalAmount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounting_schema"."bank_details" ADD CONSTRAINT "bank_details_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."bank_accounts" ADD CONSTRAINT "bank_accounts_account_no_accounts_no_fk" FOREIGN KEY ("account_no") REFERENCES "accounting_schema"."accounts"("no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."bank_accounts" ADD CONSTRAINT "bank_accounts_details_id_bank_details_id_fk" FOREIGN KEY ("details_id") REFERENCES "accounting_schema"."bank_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_bank_id_bank_accounts_id_fk" FOREIGN KEY ("bank_id") REFERENCES "accounting_schema"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."budget_items" ADD CONSTRAINT "budget_items_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "accounting_schema"."budgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."budgets" ADD CONSTRAINT "budgets_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."expenses" ADD CONSTRAINT "expenses_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."expenses" ADD CONSTRAINT "expenses_gl_account_no_accounts_no_fk" FOREIGN KEY ("gl_account_no") REFERENCES "accounting_schema"."accounts"("no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "crm_schema"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."invoices" ADD CONSTRAINT "invoices_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "inventory_schema"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."journal_entry_lines" ADD CONSTRAINT "journal_entry_lines_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "accounting_schema"."journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."journal_entry_lines" ADD CONSTRAINT "journal_entry_lines_account_id_accounts_no_fk" FOREIGN KEY ("account_id") REFERENCES "accounting_schema"."accounts"("no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."payments" ADD CONSTRAINT "payments_party_acc_accounts_no_fk" FOREIGN KEY ("party_acc") REFERENCES "accounting_schema"."accounts"("no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."purchase_invoice_items" ADD CONSTRAINT "purchase_invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "accounting_schema"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."purchase_invoice_items" ADD CONSTRAINT "purchase_invoice_items_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_schema"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "accounting_schema"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounting_schema"."sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_item_id_product_catelog_id_fk" FOREIGN KEY ("item_id") REFERENCES "sales_schema"."product_catelog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_schema"."customers" ADD CONSTRAINT "customers_contactId_contacts_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_type_name_unique" ON "accounting_schema"."accounts" USING btree ("type","name");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_acc_unique" ON "accounting_schema"."bank_accounts" USING btree ("bank_name","account_no");--> statement-breakpoint
CREATE INDEX "idx_bank_account_accNo" ON "accounting_schema"."bank_accounts" USING btree ("account_no");--> statement-breakpoint
CREATE INDEX "idx_reconcile_date" ON "accounting_schema"."bank_reconciliations" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_budgetitem_budget" ON "accounting_schema"."budget_items" USING btree ("budget_id");--> statement-breakpoint
CREATE UNIQUE INDEX "budget_name_period" ON "accounting_schema"."budgets" USING btree ("name","period");--> statement-breakpoint
CREATE INDEX "idx_budget_period" ON "accounting_schema"."budgets" USING btree ("period");--> statement-breakpoint
CREATE INDEX "idx_exp_date" ON "accounting_schema"."expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_invoice_date" ON "accounting_schema"."invoices" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_invoice_dueDate" ON "accounting_schema"."invoices" USING btree ("due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "journal_ref_unique" ON "accounting_schema"."journal_entries" USING btree ("ref_type","ref_no");--> statement-breakpoint
CREATE INDEX "idx_journal_date" ON "accounting_schema"."journal_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_jeline_journal_id" ON "accounting_schema"."journal_entry_lines" USING btree ("journal_entry_id");--> statement-breakpoint
CREATE INDEX "idx_jeline_account_id" ON "accounting_schema"."journal_entry_lines" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_payment_date" ON "accounting_schema"."payments" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_inv_item_unique" ON "accounting_schema"."purchase_invoice_items" USING btree ("invoice_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_inv_item_unique" ON "accounting_schema"."sales_invoice_items" USING btree ("invoice_id","item_id");--> statement-breakpoint
CREATE INDEX "idx_sales_inv_qty" ON "accounting_schema"."sales_invoice_items" USING btree ("quantity");--> statement-breakpoint
CREATE INDEX "sales_invoice_id" ON "accounting_schema"."sales_invoice_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "idx_tax_next_due" ON "accounting_schema"."taxes" USING btree ("next_due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "terms_unique_cat_title" ON "accounting_schema"."terms" USING btree ("category","title");