"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { sources, topics } from "@/db/schema";
import type { SQL } from "drizzle-orm";
import { and, asc, count, desc, eq, ilike, isNotNull, or } from "drizzle-orm";

export async function createTopic(data: {
  title: string;
  summary: string;
  guidance: string;
  area?: string;
  owner?: string;
}) {
  await db.insert(topics).values(data);
  revalidatePath("/topics");
  redirect("/topics");
}

export async function getTopics(params?: { q?: string; area?: string }) {
  const conditions: SQL[] = [];

  if (params?.q) {
    const escaped = params.q.replace(/[\\%_]/g, "\\$&");
    const pattern = `%${escaped}%`;
    const searchCondition = or(
      ilike(topics.title, pattern),
      ilike(topics.summary, pattern),
      ilike(topics.guidance, pattern),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  if (params?.area) {
    conditions.push(eq(topics.area, params.area));
  }

  const base = db.select().from(topics);
  const filtered = conditions.length > 0 ? base.where(and(...conditions)) : base;
  return filtered.orderBy(asc(topics.title));
}

export async function getAreas(): Promise<Array<{ name: string; count: number }>> {
  const rows = await db
    .select({ name: topics.area, count: count() })
    .from(topics)
    .where(isNotNull(topics.area))
    .groupBy(topics.area)
    .orderBy(topics.area);
  return rows
    .filter((r): r is { name: string; count: number } => r.name !== null)
    .map((r) => ({ name: r.name, count: r.count }));
}

export async function getTotalTopicCount(): Promise<number> {
  const [row] = await db.select({ count: count() }).from(topics);
  return row?.count ?? 0;
}

export async function getTopicsForNeighbors(): Promise<
  Array<{ id: number; title: string; area: string | null; owner: string | null }>
> {
  return db
    .select({
      id: topics.id,
      title: topics.title,
      area: topics.area,
      owner: topics.owner,
    })
    .from(topics)
    .orderBy(asc(topics.title));
}

export async function getTopicById(id: number) {
  const rows = await db.select().from(topics).where(eq(topics.id, id));
  return rows[0] ?? null;
}

export async function getSourcesByTopicId(topicId: number) {
  return db
    .select()
    .from(sources)
    .where(eq(sources.topicId, topicId))
    .orderBy(desc(sources.createdAt));
}
