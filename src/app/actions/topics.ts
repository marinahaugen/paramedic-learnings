"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { sources, topics } from "@/db/schema";
import type { SQL } from "drizzle-orm";
import { and, desc, eq, ilike, isNotNull, or } from "drizzle-orm";

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
  return filtered.orderBy(desc(topics.createdAt));
}

export async function getAreas(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ area: topics.area })
    .from(topics)
    .where(isNotNull(topics.area))
    .orderBy(topics.area);
  return rows.map((r) => r.area as string);
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
    .orderBy(sources.createdAt);
}
