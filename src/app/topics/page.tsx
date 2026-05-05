import { desc } from "drizzle-orm";
import { db } from "@/db";
import { topics } from "@/db/schema";
import TopicListClient from "./TopicListClient";

export default async function TopicsPage() {
  const rows = await db
    .select({
      id:        topics.id,
      title:     topics.title,
      summary:   topics.summary,
      createdBy: topics.createdBy,
      updatedAt: topics.updatedAt,
    })
    .from(topics)
    .orderBy(desc(topics.updatedAt));

  const serialized = rows.map((r) => ({
    ...r,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return <TopicListClient topics={serialized} />;
}
