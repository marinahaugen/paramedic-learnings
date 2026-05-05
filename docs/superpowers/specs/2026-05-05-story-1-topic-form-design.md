# Design Spec — Story #1: Create Topic Form

**Date:** 2026-05-05
**Status:** Approved

## Decisions

| Question | Choice | Rationale |
|----------|--------|-----------|
| Design direction | Field Guide | Dark, robust, high-contrast — fits ambulance/field context |
| Typography | Industrial Sans | Heavy condensed headings (Arial Black) + system-ui body |
| Form layout | Split with live preview | See the TopicCard as you fill in the form |
| Implementation strategy | Design-first (UI before DB wiring) | Faster to iterate on visuals; backend added separately |

## What Gets Built

Two components, one page:

- `TopicCard` — reusable card with amber top border, heavy title, metadata footer
- `TopicForm` — create-topic form (split layout, live preview on right)
- Page at `/topics/new`

Full design details, color palette, and ASCII wireframes in `docs/design-theme.md`.

## Out of Scope

- Database schema and server actions (next story slice)
- Edit / delete topic
- Topic list page (`/topics`)
