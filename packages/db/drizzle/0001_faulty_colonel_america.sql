CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"question" text NOT NULL,
	"ai_response" text NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;