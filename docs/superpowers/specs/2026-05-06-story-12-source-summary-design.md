# Story 12 — AI-generated source summary

**Date:** 2026-05-06
**Story:** _As a topic owner, I want a submitted source to have an AI-generated summary so that I can review it faster._
**Acceptance criteria (from `docs/user-stories.md`):**
- create and store a generated summary
- show that the summary is system-generated

## 1. Architecture & data flow

```
Clinician submits debrief
        │
        ▼
createSource action (existing)
   inserts row, summary = NULL
   redirects to /sources/[id]   ← change from /topics
        │
        ▼
SourceDetailPage  (server component)
   1. fetch source by id (404 if missing)
   2. if (source.summary == null):
        summary = await summarizeSource(source.content)
        UPDATE sources SET summary, summary_generated_at = NOW()
   3. render SourceDetailCard with title, content, summary,
      and "Generert av AI · <timestamp>" badge
        │
   on throw → error.tsx boundary shows "Noe gikk galt — Prøv igjen"
```

### Module boundaries

| Unit | File | Responsibility |
|---|---|---|
| `summarizeSource(content)` | `src/lib/ai/summarize.ts` | Pure function: text → Norwegian summary. Wraps Anthropic SDK. Throws on failure. No DB. |
| `getOrGenerateSummary(sourceId)` | `src/lib/sources/summary.ts` | Fetch source; if `summary` is null, call `summarizeSource`, persist, return updated row. |
| `SourceDetailPage` | `src/app/sources/[id]/page.tsx` | Server component. Awaits `getOrGenerateSummary`. Renders. |
| `error.tsx` | `src/app/sources/[id]/error.tsx` | Client error boundary with "Prøv igjen" button calling `reset()`. |
| `SourceDetailCard` | `src/components/SourceDetailCard.tsx` | Presentation only. Field Guide styling. |
| `createSource` action | `src/app/actions/sources.ts` (modify) | Add `.returning({ id })`; redirect to `/sources/${id}`. |

Each unit has one purpose and depends on the layer below it. `summarizeSource` knows nothing about the database; `getOrGenerateSummary` knows nothing about HTTP/Anthropic; the page knows nothing about the prompt.

### Concurrency note

If a user reloads the detail page before the first generation completes, two concurrent generations may race. Last write wins; the row content is logically equivalent. Acceptable for this story. A Postgres advisory lock could be added later if duplicate API spend becomes measurable.

## 2. Schema & migration

Add two nullable columns to `sources` (`src/db/schema.ts`):

```ts
summary: text("summary"),                              // null until generated
summaryGeneratedAt: timestamp("summary_generated_at"), // null until generated
```

State semantics:
- `summary IS NULL` ⇔ "not yet generated; will retry on next read"
- `summary IS NOT NULL` ⇔ "ready; serve from DB"

No `summary_status` enum — failures throw and are surfaced via the error boundary; the column stays NULL so the next page load retries naturally.

Migration command:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The migration is purely additive (`ALTER TABLE ADD COLUMN`). Existing rows (seeds + Story 9 submissions) get `NULL` summaries and will be filled on first detail-page visit.

`Source = typeof sources.$inferSelect` in `src/db/schema.ts` automatically picks up the new fields.

## 3. AI integration

### Dependency

```bash
npm install @anthropic-ai/sdk
```

### Environment

Add to `.env.example` and `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

If the variable is missing at call time, `summarizeSource` throws `new Error("ANTHROPIC_API_KEY not set")`. The error boundary renders cleanly rather than the call failing inside the SDK with an opaque trace.

### `src/lib/ai/summarize.ts`

```ts
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Du oppsummerer ambulansefaglige debrief-rapporter.
Skriv et nøytralt, klinisk sammendrag på norsk i 2–3 setninger (50–80 ord).
Fokuser på: hva som skjedde, viktigste læringspunkt.
Ikke spekuler. Ikke dikte opp detaljer som ikke står i kilden.
Returner kun selve sammendraget — ingen overskrift, ingen punktlister.`;

export async function summarizeSource(content: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const block = msg.content[0];
  if (block.type !== "text") throw new Error("Unexpected response shape");
  return block.text.trim();
}
```

Choices:
- **Haiku 4.5** — fastest model in the family; ~1–2 s for an 80-word reply.
- **`max_tokens: 300`** — safety cap; ~80 Norwegian words ≈ 150 tokens, leaves headroom.
- **System prompt in Norwegian** — anchors output language regardless of input language.
- **"Ikke dikte opp detaljer"** — guards against hallucination on sparse debriefs.
- **Prompt caching** — the system prompt is static and would benefit from `cache_control`. Implementation step will reach for the `claude-api` skill to wire that up; not detailed here.

### `src/lib/sources/summary.ts`

```ts
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sources } from "@/db/schema";
import { summarizeSource } from "@/lib/ai/summarize";

export async function getOrGenerateSummary(sourceId: number) {
  const [source] = await db.select().from(sources).where(eq(sources.id, sourceId));
  if (!source) return null;
  if (source.summary) return source;

  const summary = await summarizeSource(source.content);
  const [updated] = await db
    .update(sources)
    .set({ summary, summaryGeneratedAt: new Date() })
    .where(eq(sources.id, sourceId))
    .returning();
  return updated;
}
```

## 4. UI

### Routes added

```
src/app/sources/[id]/page.tsx     — server component
src/app/sources/[id]/error.tsx    — client error boundary
```

### `createSource` change (`src/app/actions/sources.ts`)

- Replace `db.insert(...).values(...)` with the `.returning({ id: sources.id })` form to capture the new row id.
- Replace `redirect("/topics")` with `redirect(\`/sources/${newId}\`)`.
- Drop `revalidatePath("/topics")` — the new redirect target makes it irrelevant for this flow.

### Detail page layout

Field Guide aesthetic, reusing CSS variables from `src/app/globals.css`:

```
┌────────────────────────────────────────────┐
│ ← Tilbake til debriefer                    │  (link → /topics for now;
├────────────────────────────────────────────┤   /sources list is a future story)
│ DEBRIEF                                    │  IBM Plex Mono, --accent-muted
│ <source.title>                             │  Bebas Neue, --text-primary
│ <reportDate · sourceType>                  │  --text-faint
├────────────────────────────────────────────┤
│ ★ AI-SAMMENDRAG · GENERERT 6. mai 14:32   │  --accent-muted, IBM Plex Mono
│                                            │
│ <summary text — Norwegian prose>           │  --text-primary, system-ui
├────────────────────────────────────────────┤
│ FULL TEKST                                 │  IBM Plex Mono label
│ <source.content — preformatted>            │  --text-secondary
└────────────────────────────────────────────┘
```

The `★ AI-SAMMENDRAG · GENERERT <timestamp>` header is the explicit "system-generated" cue required by the acceptance criterion. No icon-only signal.

### `error.tsx` (client component)

```tsx
"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="...">
      <h2>Noe gikk galt</h2>
      <p>Kunne ikke generere AI-sammendrag akkurat nå.</p>
      <button onClick={reset}>Prøv igjen</button>
    </div>
  );
}
```

`reset()` re-runs the server component, which re-invokes `getOrGenerateSummary`, which retries the LLM call.

### Out of scope

- Sources list page (`/sources`) — future story.
- Linking source ↔ topic — Story 13/14.
- Manual edit / regenerate of summary — not in acceptance criteria.

## 5. Failure handling

Per the chosen design, all generation failures throw and are caught by `src/app/sources/[id]/error.tsx`. Reload (or "Prøv igjen") = retry. No `summary_status` column, no retry button on the success page, no silent fallbacks.

Tradeoffs accepted:
- During an Anthropic outage, every fresh source visit shows the error page until the API recovers. Acceptable for a course/learning project.
- No distinction between "transient API failure" and "permanently bad input" — both retry on every load. Could upgrade to a `summary_status` enum later if this becomes a problem.

## 6. Testing & rollout

No test runner configured (per `CLAUDE.md`). Manual verification only:

| Check | How |
|---|---|
| Migration applies cleanly | `npx drizzle-kit generate && npx drizzle-kit migrate`; verify columns present |
| Submit → detail redirect | Submit a debrief at `/sources/new`; expect redirect to `/sources/<id>` |
| Lazy generation | First visit: ~1–2 s wait, summary appears. Reload: instant. |
| Persistence | Open the same `/sources/<id>` in a fresh browser/incognito → same summary text |
| Norwegian output | Submit one Norwegian and one English debrief; both summaries must be Norwegian |
| Failure path | Temporarily unset `ANTHROPIC_API_KEY`, visit a source with `summary IS NULL` → `error.tsx` renders; "Prøv igjen" works once key restored |
| Existing sources | Visit a Story 9 seed/submitted source → `summary IS NULL` → fills in on first visit |

Rollout: single PR. No feature flag; the feature is small and isolated to one new route.

Cost sanity: Haiku 4.5 ≈ $1/Mtok input, $5/Mtok output. A 1000-word debrief ≈ 1500 input tokens, 150 output tokens → ~$0.002 per source. Course-grade workload, negligible.

## 7. File-change summary

| Action | Path |
|---|---|
| New | `src/lib/ai/summarize.ts` |
| New | `src/lib/sources/summary.ts` |
| New | `src/app/sources/[id]/page.tsx` |
| New | `src/app/sources/[id]/error.tsx` |
| New | `src/components/SourceDetailCard.tsx` |
| New | `drizzle/0004_<generated>.sql` (via `drizzle-kit generate`) |
| Modify | `src/db/schema.ts` — add `summary`, `summaryGeneratedAt` |
| Modify | `src/app/actions/sources.ts` — `.returning({ id })`, redirect to `/sources/${id}` |
| Modify | `.env.example` — add `ANTHROPIC_API_KEY` |
| Modify | `package.json` / `package-lock.json` — `@anthropic-ai/sdk` dependency |
