# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start local Postgres (port 15432)
docker compose up -d

# Dev server
npm run dev

# Lint
npm run lint

# Build
npm run build

# Database migrations (run after editing src/db/schema.ts)
npx drizzle-kit generate
npx drizzle-kit migrate
```

No test suite is configured yet.

## Architecture

**Next.js App Router** project. Pages and API routes live under `src/app/`. The router convention is file-based: `src/app/some-route/page.tsx` renders the page, `src/app/some-route/route.ts` handles API requests.

**Database** is PostgreSQL accessed via Drizzle ORM. The single source of truth for the schema is `src/db/schema.ts` (currently empty — define tables here). `src/db/index.ts` exports a `db` singleton. After changing the schema, always regenerate and apply migrations with `drizzle-kit generate && drizzle-kit migrate`. Migration files land in `./drizzle/`. The default local connection string is `postgresql://postgres:postgres@localhost:15432/paramedic_learnings` (see `.env.example`).

**Environment**: `DATABASE_URL` is the only required env var. Set it in `.env.local`.

## Domain

A knowledge platform for ambulance services. The core loop is: **AI proposes, human approves**.

Key domain concepts (canonical names; teams may choose variants):

| Concept | Purpose |
|---|---|
| `Topic` | A clinical or operational subject with current guidance and rationale |
| `TopicVersion` | Immutable snapshot of a topic's guidance text; one version is current |
| `Source` | Submitted material (debrief report, research finding, policy change, etc.) |
| `ChangeProposal` | AI-drafted proposed update to a topic, linked to one or more sources |
| `ApprovalDecision` | Human accept/reject of a proposal; approval triggers a new `TopicVersion` |

AI is used for summarization, topic-linking, conflict detection, and drafting change proposals. It never directly updates guidance — all changes go through a human approval step.

The backlog is in `docs/user-stories.md`. The suggested starting slice ends at Story 1 → 2 → 5 → 6 → 9 → 12 → 14 → 15 → 17 → 19.
