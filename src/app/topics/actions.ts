"use server";

import { db } from "@/db";
import { topics } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateTopicSchema = z.object({
  title:        z.string().min(1, "Title is required"),
  summary:      z.string().min(1, "Summary is required"),
  guidanceText: z.string().min(1, "Guidance text is required"),
  createdBy:    z.string().min(1, "Your name is required"),
});

export async function createTopic(
  formData: FormData,
): Promise<{ id: number } | { error: string }> {
  const parsed = CreateTopicSchema.safeParse({
    title:        formData.get("title"),
    summary:      formData.get("summary"),
    guidanceText: formData.get("guidanceText"),
    createdBy:    formData.get("createdBy"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const [row] = await db
      .insert(topics)
      .values(parsed.data)
      .returning({ id: topics.id });
    revalidatePath("/topics");
    return { id: row.id };
  } catch {
    return { error: "Failed to save topic. Please try again." };
  }
}
