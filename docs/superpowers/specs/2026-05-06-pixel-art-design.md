# Pixel Art Field Guide Redesign

**Date:** 2026-05-06
**Branch:** `feature/pixel-art-redesign`
**Status:** Approved — ready to implement

## Goal

Replace the dark "Field Guide" aesthetic (near-black bg, amber accents, Bebas Neue) with a **modern indie pixel-art design** in cream + dusty rose. The app should feel inviting and human while preserving the seriousness of clinical content.

## Decisions (locked through visual brainstorming)

| # | Decision | Choice | Mockup |
|---|----------|--------|--------|
| 01 | Era | Modern indie pixel (Stardew/Eastward/Hilda lineage) | `mockups/01-era.html` |
| 02 | Accent | Cream + Dusty Rose (no greens, no scanlines, no chrome) | `mockups/02-accent.html` |
| 03 | Approach | Hybrid: Field Guide sidebar + Botanical Index list rows | `mockups/03-approach.html`, `mockups/index.html` |

## Design tokens (replace `globals.css`)

```css
:root {
  /* Surfaces */
  --bg-base:        #f5e8d8;  /* cream paper */
  --bg-surface:     #eedcc4;  /* slightly darker cream — sidebar, sub-bg */
  --bg-raised:      #fff8e8;  /* lightest cream — input fields */
  --bg-preview:     #f3e1c8;  /* preview pane */

  /* Text */
  --text-primary:   #2c2620;  /* near-black ink */
  --text-secondary: #5a4a36;  /* body text */
  --text-muted:     #8a7657;  /* labels, metadata */
  --text-faint:     #a8927a;  /* timestamps, faint UI */

  /* Borders & rules */
  --border:         #2c2620;  /* solid frames (always ink) */
  --border-strong:  #2c2620;
  --rule:           #c8b48d;  /* dashed/dotted dividers */

  /* Accent — dusty rose */
  --accent:         #b87474;  /* primary (tags, active, focus) */
  --accent-light:   #d68a8a;  /* light (decorations, washi tape) */
  --accent-deep:    #a04848;  /* deep (active text, version stamps, important) */
  --accent-shadow:  #b87474;  /* pixel shadow color */
}
```

## Typography

- **Display font:** `Pixelify Sans` (Google Fonts, weights 400/500/700) — replaces Bebas Neue. Used for headings (`h1`/`h2`/`h3`), buttons, topic titles.
- **Mono font:** `IBM Plex Mono` (already loaded) — kept for labels, metadata, navigation, body text where monospace clarity is wanted.
- **Body:** `system-ui, sans-serif` for paragraphs of clinical guidance text where readability dominates.

CSS variable naming stays: `--font-bebas` is renamed to `--font-pixel` (or kept as alias) and points to Pixelify Sans.

## Layout (`layout.tsx`)

- Top bar: cream surface, ink-colored 2px bottom border, `Press Start 2P` brand mark in ink, IBM Plex Mono nav links, active link gets rose-deep underline.
- Footer: cream surface with single ink rule above, mono caption.
- Body: cream paper background with subtle pixel-stippling (radial-gradient pattern, low opacity).

## Component inventory

### New components

| Component | Purpose |
|-----------|---------|
| `<PixelSprite kind="..." size={24} />` | Wrapper for SVG pixel sprites with consistent rendering. Sprites: `heart` (Hjerte), `lung` (Luftvei), `cross` (Traume), `vial` (Legemidler), `book` (Annet), `crest` (homepage hero). |
| `<ChapterSidebar areas={...} active={...} />` | Sidebar listing areas with rose-pixel bullets, count badges, and "ALLE" link. |
| `<TopicRow topic={...} />` | Row-style topic entry (replaces `TopicCard` on list pages). 24×24 sprite + title + summary + meta. |
| `<ChapterTile area={...} count={...} />` | Homepage tile: pixel sprite + name + count, click-throughs to filtered list. |

### Updated components

- `<TopicCard>` — keep for backward compatibility (still used in form preview), but restyle to cream-paper. Add `<TopicRow>` as the primary list rendering.
- `<TopicForm>` — preserve split layout, restyle inputs (cream-paper bg, ink border, rose focus shadow). Replace right-pane `<TopicCard>` preview with **3 list rows** showing the new topic between alphabetical neighbors.
- `<TopicsToolbar>` — restyle search input + area filter pills to cream-paper aesthetic. Filter pills become small ink-bordered chips with rose active state.

### Removed

- Bebas Neue import (replaced by Pixelify Sans).

## Pages

### Homepage (`/`)

Hero strip with subtle horizontal rose ruled-paper lines, ink heading "Faglig kunnskap for prehospitale tjenester", small body copy, and a 56×56 pixel "crest" sprite (heart) top-right. Below: a "KAPITLER" section showing the available areas as 3-up tiles, each with its representative pixel sprite + count. Clicking a tile navigates to `/topics?area=Hjerte` etc.

### Topic List (`/topics`)

Two-column layout inside a cream-paper "page" frame:
- **Left sidebar (180px):** `KAPITLER` heading, list of areas with rose-pixel bullets and count badges (`HJERTE 8`), active area in rose-deep with larger bullet. "ALLE" link at the bottom.
- **Right main:** chapter header (`Hjerte · 8 emner`), sort controls (A–Å · Nyeste · Utkast), then list of `<TopicRow>` items. Each row: 24×24 sprite + title + truncated summary + meta (version + owner). Featured topics get rose-deep title color. Hover: faint rose tint background.

Sort + search live in `searchParams` (already supported).

### Topic Form (`/topics/new`)

Preserve split layout. Left pane: form fields (Tittel, Sammendrag, Veiledning, Område, Eier) styled with cream-paper inputs and rose focus shadows. Right pane: **list-row preview** showing 3 rows — the new topic in the middle (highlighted with rose-tint background and rose-deep title), and its alphabetical neighbors above and below (faded). When `area` is empty, show the row at the top of "Ny / Uten kapittel".

The Submit button: rose-deep filled, cream text, 2px ink border, 3px ink pixel-shadow.

## Data layer

**No DB migrations required.** The existing `area` field is the chapter taxonomy.

**One action change** — `getAreas()` should return chapter counts:

```typescript
// before
export async function getAreas(): Promise<string[]>

// after
export async function getAreas(): Promise<Array<{ name: string; count: number }>>
```

Implementation: `SELECT area, COUNT(*) FROM topics WHERE area IS NOT NULL GROUP BY area ORDER BY area`.

The "ALLE" link in the sidebar uses the sum.

## Sprite library

A small set of inline SVG sprites in `src/components/PixelSprite.tsx`:
- `heart` — for Hjerte
- `lung` — for Luftvei
- `cross` — for Traume
- `vial` — for Legemidler
- `book` — for Annet
- `crest` — for homepage hero (a stylized heart with highlight pixels)

Sprites use `viewBox="0 0 12 12"` (small icons) or `0 0 16 16` (hero). All use `shape-rendering="crispEdges"` and the locked palette (`#b87474`, `#a04848`, `#d68a8a`, `#f5d4d4`, `#f5e8d8`).

## Out of scope

- Adding new chapter values (Nevro, Pediatri, Gift) — current taxonomy stays.
- A topic-specific icon picker (every topic uses its area's sprite).
- Animations beyond hover transitions and focus shadows.
- Light/dark mode toggle — this is the only theme.
- Mobile-specific redesign — responsive collapse of the sidebar to a top-row of chips is acceptable for v1.

## Implementation order

1. `globals.css` — replace tokens, load Pixelify Sans.
2. `layout.tsx` — top bar + footer restyle.
3. `PixelSprite` component + sprite SVG library.
4. `ChapterSidebar` component.
5. `TopicRow` component.
6. Update `getAreas()` to include counts.
7. `/topics/page.tsx` — sidebar + rows layout.
8. `/page.tsx` — hero + chapter tiles.
9. `TopicsToolbar` — restyle search + pills.
10. `TopicForm` — restyle inputs + neighbor preview.
11. Smoke-test in browser; visual check against `mockups/index.html`.

## Acceptance

- Visual: `/topics` matches `mockups/index.html` "VIEW 1" panel. `/` matches "VIEW 2". `/topics/new` matches "VIEW 3".
- Functional: `getTopics`, `createTopic`, search, area-filter all still work (tested via existing flow).
- No DB migrations.
- `npm run lint` and `npm run build` pass.
