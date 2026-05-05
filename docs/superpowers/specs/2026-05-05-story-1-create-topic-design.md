# Story 1: Create a Topic Manually — Design Spec

**Date:** 2026-05-05
**Story:** As a topic owner, I want to create a new topic so that the team has a place to capture and improve guidance for that subject.

---

## Decisions

| Question | Decision |
|---|---|
| Where does the form live? | Modal/dialog on the topic list page |
| Who is the creator? | Free-text name field in the form (no auth) |
| After save | Navigate to the new topic's detail page |
| Form submission mechanism | Next.js Server Action |
| Modal layout | Grouped sections: "About the topic", "Guidance", "Author" |

---

## Database Schema

```ts
// src/db/schema.ts
export const topics = pgTable('topics', {
  id:           serial('id').primaryKey(),
  title:        text('title').notNull(),
  summary:      text('summary').notNull(),
  guidanceText: text('guidance_text').notNull(),
  createdBy:    text('created_by').notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});
```

**Note on versioning:** The domain model separates `Topic` from `TopicVersion`. `guidanceText` lives directly on `Topic` for now and will migrate to a `TopicVersion` table when Stories 15–18 (change proposals and approval) are implemented.

---

## File Structure

```
src/
  db/
    schema.ts                        ← add topics table
  app/
    topics/
      page.tsx                       ← Server Component: fetches topics, renders TopicListClient
      TopicListClient.tsx            ← Client Component: modal open/close state + form
      actions.ts                     ← Server Action: createTopic()
      [id]/
        page.tsx                     ← Server Component: topic detail view
drizzle/                             ← generated migration (drizzle-kit generate + migrate)
```

---

## Data Flow

```
User clicks "New Topic"
  → TopicListClient: setModalOpen(true)

User fills form (title, summary, guidanceText, createdBy) and clicks Save
  → createTopic(formData) [Server Action]
      1. Validate: all fields non-empty
      2. db.insert(topics).values({ title, summary, guidanceText, createdBy })
      3. Return { id } on success, { error: string } on failure

Client receives result
  → Success: router.push(`/topics/${id}`)
  → Failure: modal stays open, inline error message shown

/topics/[id]/page.tsx
  → db.select from topics where id = params.id
  → Renders: title, summary, guidanceText, createdBy, createdAt
```

---

## Modal Form Layout

Grouped under three section headings:

```
[ New Topic ]

About the topic
  ┌──────────────────────────┐
  │ Title                    │
  └──────────────────────────┘
  ┌──────────────────────────┐
  │ Summary                  │
  └──────────────────────────┘

Guidance
  ┌──────────────────────────┐
  │                          │
  │ Guidance text (textarea) │
  │                          │
  └──────────────────────────┘

Author
  ┌──────────────────────────┐
  │ Your name                │
  └──────────────────────────┘

                [ Cancel ]  [ Save Topic ]
```

All fields are required. Validation is enforced server-side in the Server Action; the HTML `required` attribute provides basic client-side prevention.

---

## Error Handling

- **Validation failure** (empty field): Server Action returns `{ error: "All fields are required" }`. Modal stays open, error renders inline above the Save button.
- **DB failure**: Server Action returns `{ error: "Failed to save topic. Please try again." }`. Same inline error treatment.
- **Not-found on detail page**: If `params.id` doesn't match any topic, render a simple "Topic not found" message.

---

## Out of Scope for Story 1

- Authentication / verified identity (creator is a free-text field)
- Topic versioning (`TopicVersion` table) — added in Stories 15–18
- Topic editing or deletion
- Search or filtering (Stories 3–4)
- Rationale / source linking (Story 6)
