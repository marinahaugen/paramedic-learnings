"use client";

import { useState } from "react";
import { TopicCard } from "./TopicCard";

interface FieldProps {
  label: string;
  id: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Field({ label, id, required, multiline, rows = 4, value, onChange, placeholder }: FieldProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(e.target.value);

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderLeft: focused ? "2px solid var(--accent)" : "2px solid var(--border)",
    borderRadius: "2px",
    color: "var(--text-primary)",
    fontSize: "14px",
    padding: "9px 12px",
    width: "100%",
    outline: "none",
    transition: "border-left-color 0.15s ease",
    fontFamily: "system-ui, sans-serif",
    resize: multiline ? "vertical" : undefined,
  };

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-ibm-mono)",
          color: focused ? "var(--accent-muted)" : "var(--text-muted)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "6px",
          transition: "color 0.15s ease",
        }}
      >
        {label}{" "}
        {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={inputStyle}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}

type SubmitStatus = "idle" | "submitting" | "submitted";

export function TopicForm() {
  const [form, setForm] = useState({ title: "", summary: "", guidance: "", owner: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isValid = form.title.trim() && form.summary.trim() && form.guidance.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--accent-muted)",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ✓ TOPIC OPPRETTET
        </div>
        <div
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--text-primary)",
            fontSize: "2.5rem",
            letterSpacing: "0.03em",
          }}
        >
          {form.title}
        </div>
        <a
          href="/topics"
          style={{
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textDecoration: "none",
            border: "1px solid var(--border)",
            padding: "8px 16px",
            borderRadius: "2px",
            marginTop: "8px",
          }}
        >
          SE ALLE TOPICS →
        </a>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div style={{ minHeight: "calc(100vh - 65px)" }}>
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-strong)", padding: "16px 24px" }}>
        <div
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--accent-muted)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          TOPICS / NY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--text-primary)",
            fontSize: "2rem",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          OPPRETT TOPIC
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 130px)",
        }}
      >
        <div style={{ padding: "28px 24px", borderRight: "1px solid var(--border-strong)" }}>
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            — SKJEMA
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Field label="Tittel" id="title" required value={form.title} onChange={update("title")} placeholder="Navn på emnet" />
            <Field label="Sammendrag" id="summary" required value={form.summary} onChange={update("summary")} placeholder="Kort beskrivelse av emnet" />
            <Field label="Veiledning" id="guidance" required multiline rows={5} value={form.guidance} onChange={update("guidance")} placeholder="Detaljert veiledning og prosedyre..." />
            <Field label="Eier" id="owner" value={form.owner} onChange={update("owner")} placeholder="Navn på ansvarlig person" />

            <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
              <button
                type="submit"
                disabled={!isValid || submitting}
                style={{
                  flex: 1,
                  background: isValid && !submitting ? "var(--accent)" : "var(--border)",
                  color: isValid && !submitting ? "var(--bg-base)" : "var(--text-muted)",
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  padding: "11px",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isValid && !submitting ? "pointer" : "not-allowed",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                {submitting ? "OPPRETTER..." : "OPPRETT TOPIC"}
              </button>
              <a
                href="/"
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-ibm-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "11px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                AVBRYT
              </a>
            </div>
          </form>
        </div>

        <div style={{ padding: "28px 24px", background: "var(--bg-preview)" }}>
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            — FORHÅNDSVISNING
          </div>

          <TopicCard title={form.title} summary={form.summary} owner={form.owner} isDraft />

          <p
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--border)",
              fontSize: "10px",
              textAlign: "center",
              marginTop: "14px",
              letterSpacing: "0.05em",
            }}
          >
            ← oppdateres mens du skriver
          </p>
        </div>
      </div>
    </div>
  );
}
