# Design Spec — Story 9: Submit a Debrief Report

**Date:** 2026-05-06
**Story:** As an ambulance clinician, I want to submit a debrief report so that field learning can be reviewed and reused.

---

## Decision: Standalone submission

Debrief reports are submitted without linking to a topic. The AI pipeline (Stories 12–14) is responsible for routing a source to the relevant topic. This is a deliberate domain decision — if the clinician always picks the topic manually, Stories 13 (suggest related topics) and 14 (flag possible conflict) have nothing meaningful to do.

---

## Schema changes

One migration alters the `sources` table:

| Column | Change |
|--------|--------|
| `topic_id` | `NOT NULL` → **nullable**. Existing rows (seeded sources linked to topics) are unaffected. |
| `source_type` | New. `text NOT NULL DEFAULT 'Debrief'`. Hardcoded for Story 9; Story 11 adds a picker. |
| `content` | New. `text NOT NULL`. Long-form debrief narrative. |
| `report_date` | New. `date` nullable. The date of the incident or event being debriefed. |

`description` (short optional summary) is retained — it is already rendered in the topic detail sources sidebar and must not be removed.

Drizzle types `Topic` and `Source` are re-inferred from the updated schema.

---

## Routes

```
GET  /sources/new   — debrief submission form
POST /sources/new   — handled by createSource server action (redirect to /topics on success)
```

No `/sources` list route in this story. That belongs to Story 11.

---

## Files

```
src/app/sources/new/page.tsx                 — server component, renders form
src/app/sources/new/create-source-form.tsx   — "use client", useActionState
src/app/actions/sources.ts                   — createSource action + Zod schema
```

Follows the identical pattern established in `src/app/topics/new/`.

---

## Server action

```ts
// src/app/actions/sources.ts
createSource(data: {
  title: string
  content: string
  reportDate?: string   // "YYYY-MM-DD" from the date input
  url?: string
})
```

- Zod validates: `title` non-empty, `content` non-empty, `reportDate` optional valid date string, `url` optional URL.
- Inserts with `source_type: "Debrief"`, `topic_id: null`.
- On success: `revalidatePath("/topics")` + `redirect("/topics")`.
- On validation failure: returns `{ errors: fieldErrors }` — client renders inline.

---

## Form fields

| Label | Input | Validation |
|-------|-------|------------|
| Tittel | `<input type="text">` | Required |
| Dato for hendelse | `<input type="date">` | Optional |
| Innhold | `<textarea rows={8}>` | Required |
| Kilde-URL | `<input type="url">` | Optional, valid URL |

`source_type` is not shown — hardcoded to `"Debrief"` in the action.

Layout: single column, consistent with `create-topic-form.tsx` styling (Field Guide dark aesthetic, `var(--*)` tokens, IBM Plex Mono labels).

---

## Navigation

Add a `+ MELD DEBRIEF` button to the `/topics` page header bar, alongside the existing `+ OPPRETT TOPIC` button. Same visual style (amber background, mono uppercase, 2px border-radius).

---

## Out of scope

- Source type picker (Story 11)
- AI-generated summary (Story 12)
- Topic suggestion / conflict flag (Stories 13–14)
- Source list page (Story 11)
- Editing or deleting a submitted source
