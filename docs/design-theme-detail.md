# Design Theme — Topic Detail Page

> **Purpose**: this file extends `docs/design-theme.md` for the topic-detail page (User Stories 5 + 6). It does **not** override the parent contract — every token, palette, font, and forbidden pattern from the parent file still applies. This file only adds what the parent doesn't cover: spatial geometry, section vocabulary, source-citation style, sidebar behavior, and detail-page-specific edge cases.

## Locked context

| | |
|---|---|
| **Primary user A** | Paramedic-clinician reading current guidance under time pressure. Glance-first. State of mind: *"what is the recommendation right now?"* |
| **Primary user B** | Clinical-governance reviewer auditing rationale and source provenance. Deliberate. State of mind: *"is this guidance still defensible?"* |
| **Single layout serving both** | Two-column with persistent sticky sources sidebar. Glance-readers ignore numbered citations; auditors use them to trace each rationale claim. No mode-switch, no "clinician view / reviewer view" split. |
| **Mobile reflow** | Below ~1024px the sidebar moves to the bottom of the single-column body. On mobile, glance-first wins; sources become "scroll to verify" instead of "always visible". |
| **Inherited from parent** | All color, type, mono separator, source-flag taxonomy, hairline divider style, card shape, avatar pattern, and **every Don't from the parent file**. |

## Spatial geometry

```
┌──────────────────────────────────────┬─────────────────┐
│  ← Topics                            │ KILDER          │ ← sidebar
│  HYPOTERMI · V4 · 3 KILDER  [Approved] │   (sticky)      │
│                                      │                 │
│  Aktiv oppvarming hos hypoterm       │ [1] RESEARCH    │
│  pasient uten egen sirkulasjon       │     Bjurström   │
│                                      │     ...         │
│  (summary, body-lg)                  │                 │
│                                      │ [2] GUIDELINE   │
│  ─── ANBEFALING ─────                │     ERC 2021    │
│  (full guidance)                     │                 │
│                                      │ [3] DEBRIEF     │
│  ─── RASJONALE ──────                │     412/2025    │
│  (rationale with [1] [2] [3])        │                 │
│                                      │                 │
│  ─── METADATA ───────                │                 │
└──────────────────────────────────────┴─────────────────┘
```

- **Outer canvas**: `max-w-5xl mx-auto`, side padding `px-6 lg:px-8`.
- **Two columns** (≥ `lg` breakpoint): main `flex-1 max-w-2xl` (~672px), sidebar `w-[280px] shrink-0`. Gap `gap-12`.
- **Sidebar**: `sticky top-6 self-start`. Scrolls with the page until it hits the top, then pins. Stays in view for the entire body scroll.
- **Below `lg`**: container becomes single column, sidebar moves *below* main content via flex `flex-col-reverse` + DOM order considerations (or render two stacked sections with no flex-reverse — simpler).
- **Reading-column max width**: `max-w-2xl` regardless of viewport. Reading comfort wins over screen-filling.

## Header strip

Top of the main column, in this exact order:

1. **Breadcrumb back-link**: `← Topics`. Mono uppercase 11px, `text-zinc-500`. Links to `/topics` preserving any active `?q=`/`?area=` filters via the `Link` component reading `searchParams` from the referer (just `/topics` is acceptable for this exercise — preserving filters is a future polish).
2. **Metadata bar**: `area-pill · v{version} · {sourceCount} KILDER` left, status pill right. All mono uppercase. Single row, baseline-aligned.
3. **Title**: `title-xl` (34/40 font-bold). Up to 3 lines, no truncation.
4. **Summary**: new `body-lg` size — 16/26 `font-normal` `text-zinc-700`. One notch heavier than list-card body. This is the document's "first paragraph" — deserves slightly more weight than ordinary body text.

## Section vocabulary

Three `─── HEADER ─────` rules in the main column, in this order: **ANBEFALING**, **RASJONALE**, **METADATA**. The pattern is consistent across all three:

```html
<div className="mt-12 flex items-center gap-4">
  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
    ANBEFALING
  </span>
  <div className="h-px flex-1 bg-zinc-200" />
</div>
```

- Mono uppercase label, hairline rule extending to right edge of column.
- `mt-12` between sections (large breathing room — this is a document, not a card stack).
- Body content sits `mt-4` below the rule.

### Section content rules

| Section | Content | Notes |
|---|---|---|
| `ANBEFALING` | The full `topic.guidance` text | Render Markdown → HTML if the content contains `#`/`-`/`**` markers (out of scope for this exercise — render as `whitespace-pre-wrap` plain text for now) |
| `RASJONALE` | The `topic.rationale` text with inline `[N]` citations | Citations link to the corresponding sidebar source row by anchor (`#source-{n}`) |
| `METADATA` | Owner, opprettet date, sist oppdatert date, "Versjon N av N (gjeldende)" | Two-column key/value list, mono labels |

## Source citations

**Inline citation marker** in the `RASJONALE` body:

```html
<sup id="cite-1" className="ml-0.5 font-mono text-[11px] text-emerald-700 hover:text-emerald-800">
  <a href="#source-1">[1]</a>
</sup>
```

- Number prefix `[N]` matches the sidebar order (oldest `evidence_link.created_at` first, stable across renders).
- Links scroll to the sidebar source row on desktop; on mobile (sidebar moved below), they scroll to the bottom of the page.
- The number itself is the link target — full source title is not needed inline.
- Citation rendering is *manual* in this exercise: the `topic.rationale` text contains literal `[1] [2] [3]` markers entered by the topic owner. Auto-linking the markers via JSX walking is out of scope.

## Sources sidebar

```
┌─────────────────────┐
│ KILDER              │  ← mono uppercase, zinc-500
│                     │
│ [1] RESEARCH        │  ← source-type pill (per parent contract § Source flags)
│     Bjurström et al │  ← font-semibold zinc-900
│     2024            │
│     Effects of      │  ← body-sm zinc-600
│     active rewarming│
│     ↗ Resuscitation │  ← url, mono icon + arrow, opens in new tab
│                     │
│ ─────────────────── │  ← border-t border-zinc-100
│                     │
│ [2] GUIDELINE       │
│     ERC 2021 §3.4   │
│     ...             │
└─────────────────────┘
```

- Sidebar wrapper: `rounded-xl border border-zinc-200 bg-white p-6`. **No shadow** — sidebar must not compete with main-column content.
- Header `KILDER` in mono uppercase, mb-4.
- Each source row gets `id="source-{n}"` for citation anchor scrolling.
- Source-type pill uses the exact taxonomy + classes from `docs/design-theme.md` § Source flags. No new pills.
- URL link (when present): mono "↗" character + URL truncated, opens in new tab via `target="_blank" rel="noreferrer"`.
- Hairline divider between rows: `border-t border-zinc-100`, no margin.

## Edge cases

| State | Behavior |
|---|---|
| **No rationale** | `RASJONALE` section header still renders. Body shows: *"Rasjonale er ikke utfylt for denne versjonen."* — italic, `body-sm`, `text-zinc-500`. Never hide the section; hiding it hides the gap. |
| **No sources linked** | Sidebar shows: *"Ingen kilder knyttet enda."* — italic, `body-sm`, `text-zinc-500`. Header `KILDER` still renders. Source-count in header strip becomes `0 KILDER`. |
| **Single source** | Header strip says `1 KILDE` (singular Norwegian). |
| **Topic id not found** | Server component calls `notFound()` from `next/navigation`. No custom 404 page in this exercise. |
| **Retracted version** *(out of scope for ØVELSE 4)* | Reserved for Stories 19–21. When implemented: title gets `line-through decoration-red-300`; banner above title (amber alert card) reads "Denne versjonen er trukket tilbake. Se gjeldende versjon →"; status pill becomes `[Retracted]` red. |

## Inherited vs. extended

### Inherited from `docs/design-theme.md` (no re-specification)

- **All color tokens** (`zinc-*`, `emerald-*`, `amber-*`, `red-*`)
- **Type scale** for `title-xl`, `title-lg`, `title-md`, `body`, `body-sm`, `meta`, `micro`
- **Source-flag taxonomy** (DEBRIEF / RESEARCH / MEETING / POLICY / GUIDELINE) and their pill classes
- **Mono separator** `·` and **hairline divider** style
- **Card shape**: `rounded-xl border border-zinc-200`
- **Avatar dot** pattern (used in `METADATA` section for owner)
- **Every "Don't"** from the parent file still applies on this page

### Extended (new to this file)

- **Two-column sticky sidebar** geometry
- **`─── HEADER ─────`** section-rule pattern (mono label + hairline rule, mt-12 between sections)
- **`body-lg`** (16/26) for summary paragraphs that deserve more weight than list-card body
- **Inline citation `[N]`** style: monospace, emerald-700, anchor-linked
- **Sticky sidebar card** with no shadow (one of two cards on the page; main-column cards keep their default shadow)
- **Empty-state copy** patterns for missing rationale and missing sources

## Do / Don't (detail-page specific)

### Do

- Use the `─── HEADER ─────` rule pattern for every major section break within a topic. Three rules per page: ANBEFALING, RASJONALE, METADATA.
- Number sources sequentially in the order they appear in `evidence_links` (oldest first, stable across renders).
- Render `[N]` citations as monospace, emerald-700, smaller than body, anchor-linked to `#source-{n}`.
- Keep main column ≤ `max-w-2xl` regardless of viewport. Reading comfort wins over screen-filling.
- Render empty states as italic body-sm zinc-500 *inside* the section — never hide a section.
- Make the sidebar sticky on desktop; let it fall to the bottom on mobile. Both behaviors are intentional.

### Don't

- Don't put sources in the main column body. Their place is the sidebar (or below, on mobile).
- Don't add tabs, accordions, or "show more" toggles. Detail page is read top-to-bottom.
- Don't shadow the sidebar. Two shadowed cards on one page = visual noise.
- Don't make the page header sticky. Only the sidebar sticks.
- Don't extract a `<TopicHeader />` or `<SectionRule />` component yet. Wait until a second screen needs them.
- Don't auto-render sources inline in the rationale by parsing `[N]` markers. The marker is a literal hint; sidebar is the canonical render.
- Don't add a "Print this topic" or "Share" button decoratively. If you need print styling, design it; if not, leave it out.

## What this file does not cover

- **Versjonshistorikk view** — Stories 19–21. The metadata section may show "Versjon N av N (gjeldende)" but doesn't render historical versions.
- **Source-creation UX** — Stories 9–11. The sidebar renders sources but doesn't add or unlink them.
- **AI conflict-flag banners** — Stories 12–14. Will need their own section pattern when added; do not invent one preemptively.
- **Markdown rendering** of the guidance body. Render as `whitespace-pre-wrap` plain text for now; switch to a Markdown renderer when the content team needs it.
