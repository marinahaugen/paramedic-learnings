"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { topics } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function createTopic(data: {
  title: string;
  summary: string;
  guidance: string;
  owner?: string;
}) {
  await db.insert(topics).values(data);
  revalidatePath("/topics");
  redirect("/topics");
}

export async function getTopics() {
  return db.select().from(topics).orderBy(desc(topics.createdAt));
}
