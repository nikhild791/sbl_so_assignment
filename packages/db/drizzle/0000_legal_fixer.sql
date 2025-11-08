CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"question" text NOT NULL,
	"ai_response" text,
	"status" text DEFAULT 'queued' NOT NULL
);
