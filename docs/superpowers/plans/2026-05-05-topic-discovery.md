# Topic Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Stories #3–6 — keyword search, area filter, topic detail page, and rationale/sources section.

**Architecture:** Schema migration first (add `area`/`rationale` to topics, new `sources` table), then search+filter on `/topics` via URL params with a client-side toolbar, then a new `/topics/[id]` detail page showing all topic fields plus sources.

**Tech Stack:** Next.js 16 App Router, Drizzle ORM 0.45, PostgreSQL, TypeScript, CSS custom properties (Field Guide design system)

> **Note:** No test runner is configured. Verification steps use `npm run build` and `npm run lint` in place of unit tests. Prefix all npm/npx commands with `export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" &&` if Node is not in PATH.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/db/schema.ts` | Modify | Add `area`, `rationale` to topics; add `sources` table |
| `src/app/actions/topics.ts` | Modify | Add `getTopics({q,area})`, `getAreas()`, `getTopicById()`, `getSourcesByTopicId()` |
| `src/components/TopicForm.tsx` | Modify | Add `area` dropdown field |
| `src/components/TopicCard.tsx` | Modify | Add `id` prop, wrap in link to detail page |
| `src/components/TopicsToolbar.tsx` | Create | Search input + area filter chips (client component) |
| `src/app/topics/page.tsx` | Modify | Read `searchParams`, pass to `getTopics`, render toolbar |
| `src/app/topics/[id]/page.tsx` | Create | Topic detail: title, summary, guidance, rationale, sources |

---

## Task 1: Feature branch

- [ ] **Create branch**

```bash
git checkout -b story-3-6-topic-discovery
```

---

## Task 2: Update schema

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Replace the contents of `src/db/schema.ts`**

```typescript
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  guidance: text("guidance").notNull(),
  area: text("area"),
  rationale: text("rationale"),
  owner: text("owner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
```

- [ ] **Generate migration**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npx drizzle-kit generate
```

Expected: new file created under `drizzle/` with ALTER TABLE and CREATE TABLE statements.

- [ ] **Apply migration**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npx drizzle-kit migrate
```

Expected: `...migrations applied` or similar success message.

- [ ] **Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "feat: add area, rationale to topics; add sources table"
```

---

## Task 3: Update server actions

**Files:**
- Modify: `src/app/actions/topics.ts`

- [ ] **Replace the contents of `src/app/actions/topics.ts`**

```typescript
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { sources, topics } from "@/db/schema";
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
  const conditions = [];

  if (params?.q) {
    const pattern = `%${params.q}%`;
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
  const filtered =
    conditions.length === 0
      ? base
      : conditions.length === 1
        ? base.where(conditions[0])
        : base.where(and(...conditions));

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
```

- [ ] **Verify build passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run build
```

Expected: `✓ Compiled successfully` — no TypeScript errors.

- [ ] **Commit**

```bash
git add src/app/actions/topics.ts
git commit -m "feat: update topics actions with search, filter, and detail queries"
```

---

## Task 4: Add area field to TopicForm

**Files:**
- Modify: `src/components/TopicForm.tsx`

- [ ] **Add `area` to form state** — update the `useState` initializer at line 90:

```typescript
const [form, setForm] = useState({ title: "", summary: "", guidance: "", owner: "", area: "" });
```

- [ ] **Add a styled select element** — insert after the `<Field label="Veiledning" .../>` line and before `<Field label="Eier" .../>` in the form JSX:

```tsx
<div>
  <label
    htmlFor="area"
    style={{
      fontFamily: "var(--font-ibm-mono)",
      color: "var(--text-muted)",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      display: "block",
      marginBottom: "6px",
    }}
  >
    Område
  </label>
  <select
    id="area"
    value={form.area}
    onChange={(e) => update("area")(e.target.value)}
    style={{
      background: "var(--bg-raised)",
      border: "1px solid var(--border)",
      borderLeft: "2px solid var(--border)",
      borderRadius: "2px",
      color: form.area ? "var(--text-primary)" : "var(--text-muted)",
      fontSize: "14px",
      padding: "9px 12px",
      width: "100%",
      outline: "none",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <option value="">Velg område...</option>
    <option value="Hjerte">Hjerte</option>
    <option value="Luftvei">Luftvei</option>
    <option value="Traume">Traume</option>
    <option value="Legemidler">Legemidler</option>
    <option value="Annet">Annet</option>
  </select>
</div>
```

- [ ] **Pass `area` to `createTopic`** — update the call inside `handleSubmit`:

```typescript
await createTopic({
  title: form.title.trim(),
  summary: form.summary.trim(),
  guidance: form.guidance.trim(),
  area: form.area || undefined,
  owner: form.owner.trim() || undefined,
});
```

- [ ] **Verify build passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run build
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/TopicForm.tsx
git commit -m "feat: add area dropdown to TopicForm"
```

---

## Task 5: Create TopicsToolbar component

**Files:**
- Create: `src/components/TopicsToolbar.tsx`

- [ ] **Create `src/components/TopicsToolbar.tsx`**

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface TopicsToolbarProps {
  areas: string[];
}

export function TopicsToolbar({ areas }: TopicsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const q = searchParams.get("q") ?? "";
  const activeArea = searchParams.get("area") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 300);
  };

  const handleArea = (value: string) => {
    updateParams({ area: activeArea === value ? "" : value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
      <input
        type="text"
        defaultValue={q}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Søk i topics..."
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderLeft: "2px solid var(--border)",
          borderRadius: "2px",
          color: "var(--text-primary)",
          fontSize: "14px",
          padding: "9px 12px",
          outline: "none",
          fontFamily: "system-ui, sans-serif",
          width: "100%",
        }}
      />
      {areas.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => handleArea(a)}
              style={{
                background: activeArea === a ? "var(--accent)" : "var(--bg-raised)",
                color: activeArea === a ? "var(--bg-base)" : "var(--text-muted)",
                fontFamily: "var(--font-ibm-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 10px",
                border: `1px solid ${activeArea === a ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Verify lint passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run lint
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/components/TopicsToolbar.tsx
git commit -m "feat: add TopicsToolbar with search and area filter"
```

---

## Task 6: Update /topics page

**Files:**
- Modify: `src/app/topics/page.tsx`

- [ ] **Replace the contents of `src/app/topics/page.tsx`**

```tsx
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Verify build passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run build
```

Expected: TypeScript error on `id` prop — TopicCard doesn't have it yet. This is the expected "red" state before Task 7.

---

## Task 7: Update TopicCard to link to detail page

**Files:**
- Modify: `src/components/TopicCard.tsx`

- [ ] **Add `id` prop and link wrapping** — replace the full file:

```tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";

export interface TopicCardProps {
  id?: number;
  title?: string;
  summary?: string;
  owner?: string;
  version?: number;
  isDraft?: boolean;
}

export function TopicCard({
  id,
  title,
  summary,
  owner,
  version = 1,
  isDraft = false,
}: TopicCardProps) {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [],
  );

  const card = (
    <article
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderTop: "2px solid var(--accent)",
        borderRadius: "2px",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div style={{ padding: "20px 20px 16px" }}>
        <header
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--accent-muted)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "var(--bg-raised)",
              padding: "2px 8px",
            }}
          >
            PROSEDYRE
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
            }}
          >
            v{version} · {isDraft ? "Utkast" : "Publisert"}
          </span>
        </header>

        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.85rem",
            letterSpacing: "0.03em",
            lineHeight: 1,
            color: title ? "var(--text-primary)" : "var(--border)",
            marginBottom: "10px",
            transition: "color 0.15s ease",
          }}
        >
          {title || "TITTEL VISES HER"}
        </h2>

        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.65,
            color: summary ? "var(--text-secondary)" : "var(--border)",
            marginBottom: "16px",
            fontStyle: summary ? "normal" : "italic",
            transition: "color 0.15s ease",
          }}
        >
          {summary || "Sammendrag vil vises her når du begynner å skrive..."}
        </p>

        <div
          style={{
            borderTop: "1px solid var(--border-strong)",
            paddingTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            EIER: {owner || "—"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
            }}
          >
            {today}
          </span>
        </div>
      </div>
    </article>
  );

  if (id && !isDraft) {
    return (
      <Link href={`/topics/${id}`} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </Link>
    );
  }

  return card;
}
```

- [ ] **Verify build passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run build
```

Expected: `✓ Compiled successfully` — no errors.

- [ ] **Commit**

```bash
git add src/components/TopicCard.tsx src/app/topics/page.tsx
git commit -m "feat: story 3+4 — search and area filter on /topics"
```

---

## Task 8: Create topic detail page

**Files:**
- Create: `src/app/topics/[id]/page.tsx`

- [ ] **Create directory and file**

```bash
mkdir -p src/app/topics/\[id\]
```

- [ ] **Create `src/app/topics/[id]/page.tsx`**

```tsx
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
          color: "var(--accent-muted)",
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        <a href="/topics" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          TOPICS
        </a>
        {" / "}
        {topic.title}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-bebas)",
          color: "var(--text-primary)",
          fontSize: "3rem",
          letterSpacing: "0.04em",
          lineHeight: 1,
          borderTop: "2px solid var(--accent)",
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
                      color: "var(--accent-muted)",
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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: "var(--text-faint)",
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        — {label}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Verify build passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run build
```

Expected: `✓ Compiled successfully` — no errors. Route `/topics/[id]` appears in the output.

- [ ] **Commit**

```bash
git add src/app/topics/\[id\]/page.tsx
git commit -m "feat: story 5+6 — topic detail page with rationale and sources"
```

---

## Task 9: Final verification

- [ ] **Run lint**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run lint
```

Expected: no errors or warnings.

- [ ] **Start dev server and verify manually**

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && npm run dev
```

Open http://localhost:3000/topics and check:
1. Search input appears — typing filters topics server-side
2. If any topics have an area, chips appear and clicking one filters by area
3. Clicking a topic card navigates to `/topics/{id}`
4. Detail page shows title, meta, summary, guidance
5. Rationale section hidden if empty; sources section hidden if none
6. 404 shown for non-existent `/topics/99999`

- [ ] **Open PR**

```bash
git push -u origin story-3-6-topic-discovery
```

Then open a PR targeting `main`.
