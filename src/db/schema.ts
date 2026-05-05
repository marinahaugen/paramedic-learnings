import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id:           serial("id").primaryKey(),
  title:        text("title").notNull(),
  summary:      text("summary").notNull(),
  guidanceText: text("guidance_text").notNull(),
  createdBy:    text("created_by").notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});
