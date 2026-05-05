# Design Theme — Paramedic Learnings

## Aesthetic Direction: Field Guide

Dark, robust, high-contrast. Built for people making fast decisions in difficult conditions. Amber accents on dark backgrounds signal urgency and importance without being alarming.

## Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#1c1917` (stone-900) | Page background |
| Surface | `#292524` (stone-800) | Cards, inputs |
| Surface deep | `#161412` | Preview panel background |
| Border | `#44403c` (stone-700) | Inputs, dividers |
| Border strong | `#292524` | Card borders |
| Accent | `#f59e0b` (amber-500) | Primary buttons, active borders, tags |
| Accent muted | `#fbbf24` (amber-400) | Labels, metadata |
| Text primary | `#fafaf9` (stone-50) | Headlines, values |
| Text secondary | `#a8a29e` (stone-400) | Body text, descriptions |
| Text muted | `#78716c` (stone-500) | Labels, metadata |
| Text faint | `#57534e` (stone-600) | Timestamps, version info |

## Typography

**Industrial Sans** — condensed, heavy headlines contrast with clean body text.

- **Headings / titles:** `font-family: 'Arial Black', Arial, sans-serif` — `font-weight: 900`, uppercase, tight tracking (`letter-spacing: -0.01em`)
- **Labels / tags / metadata:** `font-family: 'Arial Narrow', Arial, sans-serif` — `font-weight: 700`, uppercase, wide tracking (`letter-spacing: 0.10–0.15em`)
- **Code / versions / IDs:** `font-family: 'Courier New', monospace` — amber color for emphasis
- **Body text:** `font-family: system-ui, sans-serif` — regular weight, relaxed line height

## Component: TopicCard

A reusable card with a top amber border stripe. Used in lists and as the live preview in the creation form.

```
┌─ amber top border ───────────────────┐
│ [TAG] [v1 · Utkast]                  │
│                                       │
│ TOPIC TITLE IN HEAVY CAPS            │
│                                       │
│ Summary text in secondary color...   │
│                                       │
│ ─────────────────────────────────────│
│ EIER: Name                  date     │
└───────────────────────────────────────┘
```

Key styles:
- Top border: `border-top: 2px solid #f59e0b`
- Background: `#1c1917`, border: `1px solid #292524`
- Title: Arial Black, 900 weight, stone-50
- Tag: Courier New, amber, stone-800 background

## Component: TopicForm (Create Topic page — `/topics/new`)

Split layout: form on the left, live `TopicCard` preview on the right.

```
┌─ Page header ────────────────────────────────┐
│  TOPICS / NY                                  │
│  OPPRETT TOPIC                                │
├─ Form (left) ────┬─ Preview (right) ──────────┤
│  TITTEL *        │  — FORHÅNDSVISNING         │
│  [____________]  │                            │
│                  │  ┌─ TopicCard ──────────┐  │
│  SAMMENDRAG *    │  │  live preview        │  │
│  [____________]  │  └──────────────────────┘  │
│                  │                            │
│  VEILEDNING *    │  ← oppdateres mens du skriver
│  [____________]  │                            │
│                  │                            │
│  EIER            │                            │
│  [____________]  │                            │
│                  │                            │
│  [OPPRETT] [AVB] │                            │
└──────────────────┴────────────────────────────┘
```

Form field styles:
- Active/focused: `border-left: 2px solid #f59e0b`
- Inactive: `border-left: 2px solid #44403c`
- Required fields marked with amber asterisk

## Scope for Story #1

- Page: `src/app/topics/new/page.tsx`
- Components: `src/components/TopicCard.tsx`, `src/components/TopicForm.tsx`
- Data: static / no DB wiring in this step
- Validation: required fields (title, summary, guidance) — client-side only
- After submit: redirect to `/topics` (placeholder)
