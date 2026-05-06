# Story 11: Source Type Display — Design Spec

## Goal

Show the `sourceType` field ("Debrief" / "Forskning") on each source in the topic detail page's sources section, so reviewers can quickly distinguish evidence types.

## Context

The `sourceType` column already exists on the `sources` table with a `"Debrief"` default. The source submission forms already store the correct value. `getSourcesByTopicId` already returns it. The only missing piece is rendering it in the UI.

## Scope

Single file change: `src/app/topics/[id]/page.tsx`.

No schema changes. No migrations. No new server actions. No new components.

## Design

**Placement:** Inline badge before the source title (Option B from visual review). Each source row gets a flex row containing the badge followed by the title/link.

**Badge appearance:**
- Background: `var(--bg-raised)` (`#fff8e8`)
- Text color: `var(--accent-deep)` (`#a04848`)
- Border: `1px solid var(--border)` (`#2c2620`)
- Font: `var(--font-ibm-mono)`, 9px, bold, uppercase, `letter-spacing: 0.12em`
- Padding: `2px 7px`
- `white-space: nowrap` to prevent wrapping on long titles

**Label text:** `source.sourceType` as-is — values are already "Debrief" and "Forskning", which display correctly uppercase via `text-transform: uppercase`.

**Row structure:**
```tsx
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <span style={{ /* badge styles */ }}>{source.sourceType}</span>
  {/* existing title/link */}
</div>
```

The description paragraph (if present) remains below the row, unchanged.

## Acceptance Criteria

- Each source in the KILDER section shows its type badge before the title
- Badge is visible for both "Debrief" and "Forskning" sources
- Badge uses the project's current warm parchment design tokens
- Sources without a description still show the badge
- Sources with a URL still link correctly
