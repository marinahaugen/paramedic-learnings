# Story 1: Create a Topic Manually — Design

**Date:** 2026-05-05
**Scope:** Story 1 only — foundation for all subsequent stories

---

## Overview

A topic owner can create a new operational guidance topic by filling in a form at `/topics/new`. On submission, the topic is saved to the database and the user is redirected to the topic list at `/topics` where the new topic appears.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth / creator identity | Hardcoded `"system"` | Skip auth for now; Story 1 is about the data model |
| Form location | Dedicated page `/topics/new` | No client state needed; simple App Router page |
| Post-submit redirect | `/topics` | User sees their topic in context; detail page is a later story |
| Form submission pattern | Server Action (extracted) | Idiomatic App Router; `actions.ts` becomes home for all topic mutations |

---

## Data Model

**Table: `topics`** — defined in `src/db/schema.ts`

| Column | Type | Notes |
|---|---|---|
| `id` | `serial` PK | |
| `title` | `text NOT NULL` | |
| `summary` | `text NOT NULL` | One-sentence description |
| `guidance` | `text NOT NULL` | Full guidance text |
| `created_by` | `text NOT NULL` | Defaults to `"system"` |
| `created_at` | `timestamp NOT NULL` | Defaults to `now()` |
| `updated_at` | `timestamp NOT NULL` | Defaults to `now()`; required by Story 2 ("last updated") |

---

## File Structure

```
src/db/schema.ts              ← add topics table (modify)
drizzle/                      ← migration files (auto-generated)

src/app/topics/page.tsx       ← topic list (new Server Component)
src/app/topics/new/page.tsx   ← create form (new Server Component)
src/app/topics/actions.ts     ← createTopic server action (new)
```

---

## UI

### `/topics` — Topic list

- Page heading "Topics" with subtext and a `+ New Topic` button linking to `/topics/new`
- One card per topic showing: title, summary, "Created by system · [relative time]"
- No pagination or search (Story 3)
- Empty state for zero topics

### `/topics/new` — Create form

- `← Topics` back-link at the top
- Page heading "New Topic"
- Three required fields: **Title**, **Summary**, **Guidance** (textarea)
- "Create Topic" submit button + "Cancel" link back to `/topics`
- Inline validation error messages if a field is empty on submit

---

## Data Flow

```
1. GET /topics/new
   └─ Server Component renders HTML <form action={createTopic}>

2. User submits form
   └─ Browser POSTs form data (no JS required)

3. createTopic(formData) in actions.ts
   ├─ Zod validates: title, summary, guidance all z.string().min(1)
   ├─ Validation failure → return error state, re-render form with message
   ├─ Success → db.insert(topics).values({ ...parsed, createdBy: "system" })
   └─ redirect("/topics")

4. GET /topics
   └─ Server Component queries db.select().from(topics), renders list
```

---

## Validation

Only boundary validation at the server action — all three fields are required (non-empty string). No max-length, no uniqueness constraint, no client-side JS validation for Story 1.

---

## Out of Scope

- Authentication / real user identity (stretch: future story)
- Topic detail page (`/topics/[id]`) — Story 5
- Search and filtering — Stories 3 and 4
- Topic editing or deletion — not in backlog yet
