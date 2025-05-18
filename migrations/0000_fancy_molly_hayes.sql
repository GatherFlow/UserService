CREATE EXTENSION pg_uuidv7;

CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint

CREATE TABLE "user_language" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"code" varchar(2) NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_privacy_settings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"is_private" boolean NOT NULL,
	"hide_owned" boolean NOT NULL,
	"hide_purchased" boolean NOT NULL,
	"hide_appreciated" boolean NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "user_social_link" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"url" varchar(2048) NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "valid_url_check" CHECK ("user_social_link"."url" ~* '^https?://')
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"avatar" text NOT NULL,
	"date_of_birth" date DEFAULT NULL,
	CONSTRAINT "user_name_unique" UNIQUE("name"),
	CONSTRAINT "user_firstName_unique" UNIQUE("first_name"),
	CONSTRAINT "user_lastName_unique" UNIQUE("last_name")
);
--> statement-breakpoint
ALTER TABLE "user_language" ADD CONSTRAINT "user_language_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_privacy_settings" ADD CONSTRAINT "user_privacy_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_social_link" ADD CONSTRAINT "user_social_link_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;