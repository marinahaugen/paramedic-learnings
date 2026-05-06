import Link from "next/link";
import { Suspense } from "react";
import { getAreas, getTopics, getTotalTopicCount } from "@/app/actions/topics";
import { ChapterSidebar } from "@/components/ChapterSidebar";
import { TopicRow } from "@/components/TopicRow";
import { TopicsToolbar } from "@/components/TopicsToolbar";

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>;
}) {
  const { q, area } = await searchParams;
  const [topics, areas, total] = await Promise.all([
    getTopics({ q, area }),
    getAreas(),
    getTotalTopicCount(),
  ]);

  const heading = area ? `${area} · ${topics.length} emner` : `Alle emner · ${topics.length}`;

  return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 24px" }}>
      <PaperPage>
        <div style={{ display: "flex", minHeight: "560px" }}>
          <ChapterSidebar chapters={areas} active={area ?? null} total={total} />

          <main style={{ flex: 1, padding: "22px 26px" }}>
            <header
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "18px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-ibm-mono)",
                    color: "var(--accent-deep)",
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Felthåndbok
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.05,
                    margin: 0,
                  }}
                >
                  {heading}
                </h1>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  href="/sources/new/debrief"
                  style={{
                    fontFamily: "var(--font-ibm-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent-muted)",
                    background: "transparent",
                    textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: "2px",
                    border: "1px solid var(--border)",
                  }}
                >
                  + MELD DEBRIEF
                </Link>
                <Link
                  href="/sources/new/research"
                  style={{
                    fontFamily: "var(--font-ibm-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent-muted)",
                    background: "transparent",
                    textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: "2px",
                    border: "1px solid var(--border)",
                  }}
                >
                  + REGISTRER FORSKNING
                </Link>
                <Link
                  href="/topics/new"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--bg-base)",
                    background: "var(--accent-deep)",
                    textDecoration: "none",
                    padding: "8px 14px",
                    border: "2px solid var(--border)",
                    boxShadow: "3px 3px 0 var(--border)",
                  }}
                >
                  + NYTT EMNE
                </Link>
              </div>
            </header>

            <Suspense fallback={null}>
              <TopicsToolbar areas={areas.map((a) => a.name)} />
            </Suspense>

            {topics.length === 0 ? (
              <div
                style={{
                  border: "1px dashed var(--rule)",
                  padding: "48px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-ibm-mono)",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  {q || area
                    ? `Ingen resultater${q ? ` for «${q}»` : ""}${area ? ` i ${area}` : ""}`
                    : "Ingen emner ennå — opprett det første"}
                </p>
              </div>
            ) : (
              <div>
                {topics.map((topic) => (
                  <TopicRow
                    key={topic.id}
                    id={topic.id}
                    title={topic.title}
                    summary={topic.summary}
                    owner={topic.owner}
                    area={topic.area}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </PaperPage>
    </div>
  );
}

function PaperPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-base)",
        border: "2px solid var(--border)",
        boxShadow: "6px 6px 0 var(--accent-shadow)",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
