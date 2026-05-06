# Story 9: Submit a Debrief Report — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/sources/new` route where ambulance clinicians can submit a debrief report as a standalone source item (no topic required at submission time).

**Architecture:** Extend the `sources` table with `source_type`, `content`, `report_date` columns and make `topic_id` nullable. Follow the exact file structure of `src/app/topics/new/` — server component page, `"use client"` form component using `useActionState`, and a dedicated server actions file. Add a navigation button to `/topics`.

**Tech Stack:** Next.js App Router, Drizzle ORM, postgres-js, Zod, React `useActionState`

---

## File map

| Action | File |
|--------|------|
| Modify | `src/db/schema.ts` |
| Auto-generated | `drizzle/XXXX_*.sql` + `drizzle/meta/` |
| Create | `src/app/actions/sources.ts` |
| Create | `src/app/sources/new/page.tsx` |
| Create | `src/app/sources/new/create-source-form.tsx` |
| Modify | `src/app/topics/page.tsx` |

---

## Task 1: Update schema

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Update `src/db/schema.ts`**

Replace the file's import line and `sources` table definition:

```typescript
import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  guidance: text("guidance").notNull(),
  topicType: text("topic_type").default("Prosedyre").notNull(),
  area: text("area"),
  rationale: text("rationale"),
  owner: text("owner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sourceType: text("source_type").default("Debrief").notNull(),
  content: text("content").notNull(),
  reportDate: date("report_date"),
  url: text("url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
```

Key changes vs current:
- `date` added to the import
- `topicId`: removed `.notNull()` — now nullable
- `sourceType`: new column, `text NOT NULL DEFAULT 'Debrief'`
- `content`: new column, `text NOT NULL`
- `reportDate`: new column, `date` nullable

- [ ] **Step 2: Generate migration**

```bash
npx drizzle-kit generate
```

Expected: prints `[✓] Your SQL migration file ➜ drizzle/XXXX_*.sql 🚀`

- [ ] **Step 3: Apply migration**

```bash
npx drizzle-kit migrate
```

Expected: `[✓] migrations applied successfully!`

- [ ] **Step 4: Verify columns exist**

```bash
docker exec paramedic-learnings-db-1 psql -U postgres -d paramedic_learnings \
  -c "SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'sources' ORDER BY ordinal_position;"
```

Expected output includes rows for `topic_id` with `is_nullable = YES`, plus `source_type`, `content`, `report_date`.

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "feat(schema): make sources.topic_id nullable, add source_type/content/report_date"
```

---

## Task 2: Server action

**Files:**
- Create: `src/app/actions/sources.ts`

- [ ] **Step 1: Create `src/app/actions/sources.ts`**

```typescript
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
```

- [ ] **Step 2: Verify types compile**

```bash
npm run build
```

Expected: no TypeScript errors. The build may warn about the new route not existing yet — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/sources.ts
git commit -m "feat(actions): add createSource server action with Zod validation"
```

---

## Task 3: Form component

**Files:**
- Create: `src/app/sources/new/create-source-form.tsx`

- [ ] **Step 1: Create `src/app/sources/new/create-source-form.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createSource, type CreateSourceErrors } from "@/app/actions/sources";

interface FieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  defaultValue?: string;
  error?: string;
}

function Field({
  label,
  id,
  name,
  type = "text",
  required,
  multiline,
  rows = 4,
  defaultValue,
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: `1px solid ${error ? "var(--accent)" : "var(--border)"}`,
    borderLeft: focused
      ? "2px solid var(--accent)"
      : `2px solid ${error ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "2px",
    color: "var(--text-primary)",
    fontSize: "14px",
    padding: "9px 12px",
    width: "100%",
    outline: "none",
    transition: "border-left-color 0.15s ease",
    fontFamily: "system-ui, sans-serif",
    resize: multiline ? "vertical" : undefined,
  };

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: focused ? "var(--accent-muted)" : "var(--text-muted)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "6px",
          transition: "color 0.15s ease",
        }}
      >
        {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--accent)",
            fontSize: "10px",
            letterSpacing: "0.08em",
            marginTop: "4px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function CreateSourceForm() {
  const [state, formAction, isPending] = useActionState(createSource, null);
  const errors: CreateSourceErrors = state?.errors ?? {};

  return (
    <div style={{ minHeight: "calc(100vh - 65px)" }}>
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-strong)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--accent-muted)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          KILDER / NY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--text-primary)",
            fontSize: "2rem",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          MELD DEBRIEF
        </h1>
      </div>

      <div style={{ maxWidth: "640px", padding: "32px 24px" }}>
        <div
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--text-faint)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          — SKJEMA
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Field
            label="Tittel"
            id="title"
            name="title"
            required
            error={errors.title?.[0]}
          />
          <Field
            label="Dato for hendelse"
            id="reportDate"
            name="reportDate"
            type="date"
          />
          <Field
            label="Innhold"
            id="content"
            name="content"
            required
            multiline
            rows={8}
            error={errors.content?.[0]}
          />
          <Field
            label="Kilde-URL"
            id="url"
            name="url"
            type="url"
            error={errors.url?.[0]}
          />

          <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 1,
                background: isPending ? "var(--border)" : "var(--accent)",
                color: isPending ? "var(--text-muted)" : "var(--bg-base)",
                fontFamily: "var(--font-bebas)",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                padding: "11px",
                border: "none",
                borderRadius: "2px",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
            >
              {isPending ? "SENDER..." : "SEND DEBRIEF"}
            </button>
            <Link
              href="/topics"
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                fontFamily: "var(--font-ibm-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "11px 16px",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              AVBRYT
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sources/new/create-source-form.tsx
git commit -m "feat(ui): add CreateSourceForm component for debrief submission"
```

---

## Task 4: Page

**Files:**
- Create: `src/app/sources/new/page.tsx`

- [ ] **Step 1: Create `src/app/sources/new/page.tsx`**

```tsx
import { CreateSourceForm } from "./create-source-form";

export default function NewSourcePage() {
  return <CreateSourceForm />;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: clean build, `/sources/new` appears in the route list.

- [ ] **Step 3: Commit**

```bash
git add src/app/sources/new/page.tsx
git commit -m "feat(route): add /sources/new page for debrief submission"
```

---

## Task 5: Navigation — add MELD DEBRIEF button to /topics

**Files:**
- Modify: `src/app/topics/page.tsx`

- [ ] **Step 1: Add the button**

In `src/app/topics/page.tsx`, find the header `<div>` that contains the `+ OPPRETT TOPIC` link and add a second link before it:

```tsx
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
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/sources/new"
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
      </div>
```

- [ ] **Step 2: Final build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 3: Manual browser verification**

1. Open `http://localhost:3000/topics` — confirm `+ MELD DEBRIEF` button is visible in the header
2. Click it — confirm you land on `/sources/new` with the debrief form
3. Submit with empty fields — confirm inline errors appear on Tittel and Innhold
4. Fill in all fields and submit — confirm redirect to `/topics`
5. Verify the submission was saved:

```bash
docker exec paramedic-learnings-db-1 psql -U postgres -d paramedic_learnings \
  -c "SELECT id, title, source_type, topic_id, report_date FROM sources ORDER BY created_at DESC LIMIT 3;"
```

Expected: your new debrief row appears with `topic_id = NULL` and `source_type = Debrief`.

- [ ] **Step 4: Commit and push**

```bash
git add src/app/topics/page.tsx
git commit -m "feat(nav): add MELD DEBRIEF button to /topics header"
git push origin main
```
