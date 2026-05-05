# Design Spec — Stories #3–6: Topic Discovery

**Date:** 2026-05-05
**Status:** Approved
**Covers:** Story #3 (search), Story #4 (filter), Story #5 (detail), Story #6 (rationale + sources)

## Decisions

| Question | Choice | Rationale |
|----------|--------|-----------|
| Search implementation | Server-side with URL params + debounce | Scalable, shareable URLs, works for any dataset size |
| Search + filter placement | Combined on `/topics` | One page, composable URL params (`?q=&area=`) |
| Area data model | `area` text column on `topics` | Minimal — one filter dimension satisfies Story #4 |
| Rationale data model | `rationale` text column on `topics` | Story #6 only needs prose text on the topic itself |
| Sources data model | Lightweight `sources` table | `(id, topic_id, title, url?, description?)` — no full Source domain yet |
| Implementation order | One sprint, sequential | Schema migration first, then #3+#4, then #5+#6 |

## Schema Changes

Add to `topics` table (nullable, no breaking changes):
- `area` — `text("area")` — clinical/operational area, e.g. `"Hjerte"`, `"Luftvei"`, `"Traume"`, `"Legemidler"`, `"Annet"`
- `rationale` — `text("rationale")` — prose explanation of why the guidance exists

New `sources` table:
```
sources(
  id          serial PK,
  topic_id    integer → topics.id (cascade delete),
  title       text NOT NULL,
  url         text,
  description text,
  createdAt   timestamp DEFAULT now() NOT NULL
)
```

`TopicForm` gains an optional `area` dropdown so new topics can be categorized at creation time.

## Story #3 + #4 — Search and Filter on `/topics`

### New component: `TopicsToolbar` (`"use client"`)

Renders above the topic grid. Contains:
- Text search input — debounced 300ms, writes `?q=` to URL via `router.replace`
- Area filter chips — one per distinct area value fetched from DB, writes `?area=` to URL

Both params compose: `?q=hjerte&area=Traume` returns topics matching keyword AND area.

### Updated server action: `getTopics({ q?, area? })`

```
WHERE (title ILIKE '%q%' OR summary ILIKE '%q%' OR guidance ILIKE '%q%')
  AND (area = $area)   -- only when area param present
ORDER BY created_at DESC
```

### Updated page: `/topics/page.tsx`

Remains a server component. Reads `searchParams.q` and `searchParams.area`, passes to `getTopics()`. Also fetches distinct area values for the filter chips via `getAreas()` — `SELECT DISTINCT area FROM topics WHERE area IS NOT NULL ORDER BY area`.

### Empty state

- No topics at all: existing "Ingen topics ennå" message
- Search/filter returns nothing: "Ingen resultater for «{q}»" (or area equivalent)

## Story #5 + #6 — Topic Detail Page at `/topics/[id]`

### New route: `/topics/[id]/page.tsx`

Async server component. Fetches topic + sources in parallel. Calls `notFound()` if topic doesn't exist.

### Layout (single column, max-width 720px)

1. **Header** — breadcrumb `TOPICS / {TITLE}`, Bebas Neue title, amber top accent bar
2. **Meta strip** — owner + last updated (IBM Plex Mono, muted)
3. **Summary** — short intro block
4. **Guidance** — main content, section label `— VEILEDNING`
5. **Rationale** — only if `topic.rationale` is non-null, section label `— HVORFOR`
6. **Sources** — only if sources exist, section label `— KILDER`, list of source cards (title + optional URL + optional description)

### Navigation

`TopicCard` on the list page wraps in a link to `/topics/{id}`.

### New server actions

- `getTopicById(id: number)` — returns topic or null
- `getSourcesByTopicId(topicId: number)` — returns sources array

## Out of Scope

- Edit / delete topic
- Add sources from the UI (sources table seeded via DB or future story)
- Full Source domain model with `sourceType` (Stories #9–11)
- Versioning (Stories #18–21)
