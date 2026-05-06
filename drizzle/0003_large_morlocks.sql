ALTER TABLE "sources" ALTER COLUMN "topic_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "source_type" text DEFAULT 'Debrief' NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "report_date" date;