CREATE TABLE "rate_limits" (
	"ip" varchar(45) PRIMARY KEY NOT NULL,
	"requests" integer DEFAULT 1 NOT NULL,
	"reset_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roast_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"severity" varchar(50),
	"diff_removed" text,
	"diff_added" text
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"code" text NOT NULL,
	"code_hash" text NOT NULL,
	"fixed_code" text,
	"language" varchar(50) NOT NULL,
	"score" numeric NOT NULL,
	"summary" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roasts_slug_unique" UNIQUE("slug"),
	CONSTRAINT "roasts_code_hash_unique" UNIQUE("code_hash")
);
--> statement-breakpoint
ALTER TABLE "roast_issues" ADD CONSTRAINT "roast_issues_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;