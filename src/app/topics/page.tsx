import Link from "next/link";
import { Suspense } from "react";
import { getAreas, getTopics } from "@/app/actions/topics";
import { TopicCard } from "@/components/TopicCard";
import { TopicsToolbar } from "@/components/TopicsToolbar";

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>;
}) {
  const { q, area } = await searchParams;
  const [topics, areas] = await Promise.all([getTopics({ q, area }), getAreas()]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--accent-muted)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            TOPICS
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              color: "var(--text-primary)",
              fontSize: "2.5rem",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            ALLE TOPICS
          </h1>
        </div>
        <Link
          href="/topics/new"
          style={{
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--bg-base)",
            background: "var(--accent)",
            textDecoration: "none",
            padding: "10px 18px",
            borderRadius: "2px",
          }}
        >
          + OPPRETT TOPIC
        </Link>
      </div>

      <Suspense fallback={null}>
        <TopicsToolbar areas={areas} />
      </Suspense>

      {topics.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: "2px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {q || area
              ? `Ingen resultater${q ? ` for «${q}»` : ""}${area ? ` i ${area}` : ""}`
              : "Ingen topics ennå — opprett det første"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              summary={topic.summary}
              owner={topic.owner ?? undefined}
              updatedAt={topic.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
