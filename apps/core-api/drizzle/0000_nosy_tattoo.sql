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
	"user_id" varchar(14),
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
ALTER TABLE "email_otps" ADD CONSTRAINT "email_otps_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;