# Design Theme

Visual and interaction design decisions for the ParamedicLearnings platform.

---

## Modals / Dialogs

- Forms open as a modal overlay on the current page — user stays in context
- White background, subtle border (`1px solid #ddd`), `border-radius: 8px`
- Soft drop shadow to lift the modal off the page
- Cancel and Save buttons right-aligned at the bottom of the modal
- Cancel: neutral/light style. Save: primary action style.

---

## Form Layout

- Fields grouped under **section headings** rather than a flat list
- Section labels: small, uppercase, letter-spaced, muted colour (e.g. `#aaa`)
- All required fields — no optional fields unless explicitly designed in
- Validation enforced server-side; `required` attribute used client-side for basic prevention
- Inline error message above the Save button on failure (modal stays open, input preserved)

### Standard field groups (Create Topic)

```
About the topic   ← section label
  Title
  Summary

Guidance          ← section label
  Guidance text (textarea, taller than inputs)

Author            ← section label
  Your name
```

---

## Navigation

- Top nav bar: app name + key sections
- After creating a record: navigate forward to the detail page (not back to the list)

---

## Tone

- Clinical and operational context — keep UI language clear and direct
- Label actions plainly: "Save Topic", "Cancel" — no ambiguous labels
- Show system-generated content clearly marked as such (relevant for AI summaries in later stories)
