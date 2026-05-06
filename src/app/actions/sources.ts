"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { sources } from "@/db/schema";

const createSourceSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  content: z.string().min(1, "Innhold er påkrevd"),
  reportDate: z.string().optional(),
  url: z
    .string()
    .url("Ugyldig URL")
    .optional()
    .or(z.literal("")),
});

export type CreateSourceErrors = Partial<
  Record<keyof z.infer<typeof createSourceSchema>, string[]>
>;

export async function createSource(
  _prev: { errors: CreateSourceErrors } | null,
  formData: FormData
): Promise<{ errors: CreateSourceErrors }> {
  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    reportDate: (formData.get("reportDate") as string) || undefined,
    url: (formData.get("url") as string) || undefined,
  };

  const parsed = createSourceSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await db.insert(sources).values({
    title: parsed.data.title,
    content: parsed.data.content,
    reportDate: parsed.data.reportDate ?? null,
    url: parsed.data.url || null,
    sourceType: "Debrief",
    topicId: null,
  });

  revalidatePath("/topics");
  redirect("/topics");
}
