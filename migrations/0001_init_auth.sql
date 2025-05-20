ALTER TYPE "public"."role" ADD VALUE 'supervisor';--> statement-breakpoint
CREATE TABLE "auth_provider" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"provider_user_id" varchar NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_credential" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "internal_credential_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_name_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_verified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_provider" ADD CONSTRAINT "auth_provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "internal_credential" ADD CONSTRAINT "internal_credential_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "name";