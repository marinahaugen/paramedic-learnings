# Design Spec — Story 10: Submit a Research Finding

**Date:** 2026-05-06
**Story:** As a contributor, I want to submit a research finding so that new evidence can be considered against current guidance.

---

## Decision: Parameterised route, shared form, no migration

Story 10 is a thin extension of Story 9. The same `sources` table, the same server action shape, and the same form scaffolding handle both flavours. The only differences are:

- a route segment that names the source type
- a hidden form field that carries the type to the action
- per-type field labels (and one extra field for research)

The `description` column on `sources` was created in earlier work but has no writer in the debrief flow. Story 10 repurposes it as the research-only "Forfattere / Utgiver" field. No schema migration is required.

---

## Schema changes

**None.** All fields map onto existing columns:

| Form field (research) | DB column |
|---|---|
| Tittel | `title` |
| Forfattere / Utgiver | `description` *(unused until now)* |
| Publiseringsdato | `report_date` |
| Sammendrag | `content` |
| URL / DOI | `url` |
| *(hidden)* | `source_type = 'Forskning'` |

Debrief continues to write `description = null`.

---

## Routes

```
GET  /sources/new                  — 308-redirect → /sources/new/debrief (backwards compat for Story 9)
GET  /sources/new/[type]           — submission form for the named type
POST (server action)               — createSource handles both types
```

`type` is constrained on the server side to `"debrief" | "research"` via Zod. Anything else returns `notFound()`.

---

## Files

```
src/app/sources/new/page.tsx                       — becomes a redirect to /sources/new/debrief
src/app/sources/new/[type]/page.tsx                — validates `type`, renders <CreateSourceForm type={...} />
src/app/sources/new/[type]/create-source-form.tsx  — moved from sources/new/, now type-aware
src/app/actions/sources.ts                         — schema gains `description` (optional) and `sourceType` (enum)
src/app/topics/page.tsx                            — adds "+ REGISTRER FORSKNING" button next to MELD DEBRIEF
```

The previous `src/app/sources/new/create-source-form.tsx` is deleted; its contents are moved into `[type]/create-source-form.tsx` with the type-driven branches added.

---

## Server action

```ts
// src/app/actions/sources.ts
const sourceTypeEnum = z.enum(["Debrief", "Forskning"]);

createSourceSchema = z.object({
  sourceType: sourceTypeEnum,
  title: z.string().min(1, "Tittel er påkrevd"),
  content: z.string().min(1, "Innhold er påkrevd"),
  reportDate: z.string().optional(),
  url: z.string().url("Ugyldig URL").optional().or(z.literal("")),
  description: z.string().optional(),
});
```

- `sourceType` arrives as a hidden `<input>` rendered by the form. Zod enum guards against tampering.
- `description` is read regardless of type but, in practice, only the research form renders it — debrief submissions send an empty string, which becomes `null` on insert.
- `topic_id: null` continues to apply to both types (Story 13 will route topics later).
- On success: `revalidatePath("/topics")` + `redirect("/topics")`. On validation failure: returns `{ errors: fieldErrors }`.

---

## Form fields by type

| Label | Input | Required | Debrief | Research |
|---|---|---|---|---|
| Tittel | `<input type="text">` | yes | ✓ | ✓ |
| Forfattere / Utgiver | `<input type="text">` | no | — | ✓ |
| Dato for hendelse / Publiseringsdato | `<input type="date">` | no | "Dato for hendelse" | "Publiseringsdato" |
| Innhold / Sammendrag | `<textarea rows={8}>` | yes | "Innhold" | "Sammendrag" |
| Kilde-URL / URL · DOI | `<input type="url">` | no | "Kilde-URL" | "URL / DOI" |
| `sourceType` | `<input type="hidden">` | — | value="Debrief" | value="Forskning" |

Page heading and breadcrumb also branch on type:

| | Debrief | Research |
|---|---|---|
| Breadcrumb | KILDER / NY DEBRIEF | KILDER / NY FORSKNING |
| Heading | MELD DEBRIEF | REGISTRER FORSKNING |
| Submit button | SEND DEBRIEF | SEND FORSKNING |

These strings live in a small `copyByType` map at the top of `create-source-form.tsx` so the JSX stays branch-free.

---

## Navigation

Add a second amber button in the `/topics` page header, immediately after `+ MELD DEBRIEF`:

```
+ MELD DEBRIEF       → /sources/new/debrief
+ REGISTRER FORSKNING → /sources/new/research
```

Both buttons share the existing visual treatment.

---

## Error handling

- Invalid `type` segment → `notFound()` from the route handler.
- Invalid `sourceType` in form payload → Zod fails, action returns field errors (defensive; should not happen via the UI).
- Standard required-field errors render inline with the existing red `border-left` pattern from the debrief form.

---

## Verification

No test runner exists in the repo. Verification is:

1. `npm run lint`
2. `npm run build`
3. Manual click-through:
   - `/sources/new/debrief` still works (existing Story 9 flow unchanged for users).
   - `/sources/new/research` shows the research form with the extra Forfattere field.
   - `/sources/new` redirects to `/sources/new/debrief`.
   - Submitting each form inserts a row with the correct `source_type` and the right column populated for `description`.
   - Both buttons appear in the `/topics` header.

---

## Out of scope

- AI summary of the research finding (Story 12)
- Source-type picker UI inside the form (Story 11 — type is implied by URL here)
- Topic suggestion / conflict flag (Stories 13–14)
- Editing or deleting a submitted source
- A `/sources` list page
- Schema migration (intentional — `description` is reused as-is)
