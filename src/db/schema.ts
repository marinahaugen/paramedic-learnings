import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  guidance: text("guidance").notNull(),
  topicType: text("topic_type").default("Prosedyre").notNull(),
  area: text("area"),
  rationale: text("rationale"),
  owner: text("owner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sourceType: text("source_type").default("Debrief").notNull(),
  content: text("content").notNull(),
  reportDate: date("report_date"),
  url: text("url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
