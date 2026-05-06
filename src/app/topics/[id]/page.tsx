import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSourcesByTopicId, getTopicById } from "@/app/actions/topics";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topicId = parseInt(id, 10);

  if (isNaN(topicId)) notFound();

  const [topic, sources] = await Promise.all([
    getTopicById(topicId),
    getSourcesByTopicId(topicId),
  ]);

  if (!topic) notFound();

  const updatedAt = new Date(topic.updatedAt).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: "var(--accent-deep)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        <Link href="/topics" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          EMNER
        </Link>
        {" / "}
        {topic.title}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-pixel)",
          fontWeight: 700,
          color: "var(--text-primary)",
          fontSize: "2.5rem",
          letterSpacing: "0.01em",
          lineHeight: 1.05,
          borderTop: "2px solid var(--border)",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        {topic.title}
      </h1>

      {/* Meta strip */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          fontFamily: "var(--font-ibm-mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-strong)",
        }}
      >
        <span>EIER: {topic.owner || "—"}</span>
        <span>OPPDATERT: {updatedAt}</span>
        {topic.area && <span>OMRÅDE: {topic.area}</span>}
      </div>

      {/* Summary */}
      <Section label="SAMMENDRAG">
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          {topic.summary}
        </p>
      </Section>

      {/* Guidance */}
      <Section label="VEILEDNING">
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
          }}
        >
          {topic.guidance}
        </p>
      </Section>

      {/* Rationale — only if set */}
      {topic.rationale && (
        <Section label="HVORFOR">
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {topic.rationale}
          </p>
        </Section>
      )}

      {/* Sources — only if any */}
      {sources.length > 0 && (
        <Section label="KILDER">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sources.map((source) => (
              <div
                key={source.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "2px",
                  padding: "14px 16px",
                }}
              >
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-ibm-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--accent-deep)",
                      textDecoration: "none",
                    }}
                  >
                    {source.title} →
                  </a>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-ibm-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {source.title}
                  </span>
                )}
                {source.description && (
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "var(--text-muted)",
                      marginTop: "6px",
                    }}
                  >
                    {source.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: "var(--text-faint)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        — {label}
      </h2>
      {children}
    </div>
  );
}
