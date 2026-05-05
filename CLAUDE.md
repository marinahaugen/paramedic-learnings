# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Postgres (Docker)
docker compose up -d

# Install dependencies
npm install

# Dev server (http://localhost:3000)
npm run dev

# Lint
npm run lint

# Build
npm run build

# Generate and apply DB migrations (after schema changes)
npx drizzle-kit generate
npx drizzle-kit migrate
```

No test runner is configured yet.

## Environment

Copy `.env.example` to `.env.local`. The default `DATABASE_URL` targets the Docker Postgres on port 15432:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:15432/paramedic_learnings
```

## Architecture

**Next.js App Router** with server components and server actions as the primary pattern. Pages live under `src/app/`; the root layout (`src/app/layout.tsx`) provides the shared header/footer shell.

**Database layer** (`src/db/`):
- `schema.ts` — Drizzle ORM table definitions (currently empty — this is where all tables go)
- `index.ts` — exports a single `db` client wired to `DATABASE_URL`
- Migrations are generated via `drizzle-kit` and land in `./drizzle/`

**Components** (`src/components/`):
- `TopicCard` — reusable display card with amber top border, Bebas Neue title, IBM Plex Mono metadata. Props: `title`, `summary`, `owner`, `version`, `isDraft`.
- `TopicForm` — client component (`"use client"`) with split layout: form fields on the left, live `TopicCard` preview on the right.

**Validation** — Zod is available for form/API input validation.

## Design System

The app uses a **Field Guide** dark aesthetic. All design tokens are CSS variables defined in `src/app/globals.css` — use `var(--*)` in inline styles rather than hardcoded hex values:

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-base` | `#0c0a09` | Page background |
| `--bg-surface` | `#1c1917` | Cards, section headers |
| `--bg-raised` | `#292524` | Inputs, tags |
| `--bg-preview` | `#161412` | Preview panel background |
| `--accent` | `#f59e0b` | Buttons, active borders |
| `--accent-muted` | `#fbbf24` | Labels, breadcrumbs |
| `--text-primary` | `#fafaf9` | Headlines |
| `--text-secondary` | `#a8a29e` | Body text |
| `--text-muted` | `#78716c` | Labels |
| `--text-faint` | `#57534e` | Metadata, timestamps |
| `--border` | `#44403c` | Input borders |
| `--border-strong` | `#292524` | Card/section dividers |

**Typography** — two display fonts loaded in `layout.tsx`:
- `var(--font-bebas)` — Bebas Neue, for headings (uppercase, `letter-spacing: 0.03–0.08em`)
- `var(--font-ibm-mono)` — IBM Plex Mono, for labels, tags, and metadata (`text-transform: uppercase`, `letter-spacing: 0.10–0.12em`)
- Body text uses `system-ui`

Full design rationale and wireframes in `docs/design-theme.md`.

## Domain

This is a knowledge-management platform for ambulance services. The core domain objects are:

- **Topic** — a clinical/operational guidance item with title, summary, guidance text, rationale, and owner
- **TopicVersion** — immutable snapshots of a topic's guidance; the current version is what users read
- **Source** — submitted material (debrief report, research finding, meeting note, policy change, etc.)
- **ChangeProposal** — AI-drafted or human-drafted update linked to a topic and one or more sources
- **ApprovalDecision** — the human accept/reject record tied to a proposal
- **Subscription / Notification** — (stretch) user follows a topic and receives updates

The intended workflow is: source submitted → AI summarizes and conflict-checks against current guidance → ChangeProposal created → human approves → new TopicVersion published → subscribers notified.

The backlog (21 user stories) is in `docs/user-stories.md`. **Start with Story 1** (create a topic manually); every subsequent story depends on having topics in the database. The recommended end-to-end slice is stories 1, 2, 5, 6, 9, 12, 14, 15, 17, 19.
