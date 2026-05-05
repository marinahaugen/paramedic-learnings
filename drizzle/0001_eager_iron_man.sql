CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "area" text;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "rationale" text;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;