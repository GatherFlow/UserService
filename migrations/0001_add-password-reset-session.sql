CREATE TABLE "password-reset-session" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"email" varchar NOT NULL,
	"code" varchar(4) NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "password-reset-session" ADD CONSTRAINT "password-reset-session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;

CREATE OR REPLACE FUNCTION delete_expired_rows()
	RETURNS TRIGGER AS $$
	BEGIN
	  DELETE FROM "password-reset-session"
	  WHERE "expires_at" < NOW();
	  RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER expire_rows_trigger
BEFORE INSERT OR UPDATE ON "password-reset-session"
FOR EACH ROW EXECUTE FUNCTION delete_expired_rows();
