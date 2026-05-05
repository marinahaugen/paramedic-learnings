import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { topics } from "@/db/schema";
import { notFound } from "next/navigation";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [topic] = await db
    .select()
    .from(topics)
    .where(eq(topics.id, numId));

  if (!topic) notFound();

  return (
    <div className="min-h-full" style={{ background: "var(--warm-bg)" }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/topics"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All topics
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div
            className="mb-1 h-1 w-12 rounded-full"
            style={{ background: "var(--signal)" }}
          />
          <h1
            className="mt-4 text-4xl leading-tight text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {topic.title}
          </h1>
          <p className="mt-3 text-base text-slate-500">{topic.summary}</p>

          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
            <span>{topic.createdBy}</span>
            <span>·</span>
            <span>
              {topic.createdAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <hr className="my-8 border-slate-100" />

          <div>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--signal)" }}
            >
              Guidance
            </p>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">
              {topic.guidanceText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
