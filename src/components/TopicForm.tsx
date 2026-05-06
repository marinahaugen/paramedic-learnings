"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TopicRow } from "./TopicRow";
import { createTopic } from "@/app/actions/topics";

interface NeighborTopic {
  id: number;
  title: string;
  area: string | null;
  owner: string | null;
}

interface TopicFormProps {
  existingTopics: NeighborTopic[];
}

const AREA_OPTIONS = [
  { value: "", label: "Velg kapittel..." },
  { value: "Hjerte", label: "Hjerte" },
  { value: "Luftvei", label: "Luftvei" },
  { value: "Traume", label: "Traume" },
  { value: "Legemidler", label: "Legemidler" },
  { value: "Annet", label: "Annet" },
];

type SubmitStatus = "idle" | "submitting" | "submitted";

export function TopicForm({ existingTopics }: TopicFormProps) {
  const [form, setForm] = useState({ title: "", summary: "", guidance: "", owner: "", area: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isValid = form.title.trim() && form.summary.trim() && form.guidance.trim();

  const neighbors = useMemo(() => {
    const inArea = existingTopics
      .filter((t) => !form.area || t.area === form.area)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title, "nb"));
    if (!form.title.trim()) {
      return { above: inArea[0] ?? null, below: inArea[1] ?? null };
    }
    const titleKey = form.title.trim().toLowerCase();
    let above: NeighborTopic | null = null;
    let below: NeighborTopic | null = null;
    for (const t of inArea) {
      const k = t.title.toLowerCase();
      if (k < titleKey) above = t;
      else if (k > titleKey) {
        below = t;
        break;
      }
    }
    return { above, below };
  }, [form.title, form.area, existingTopics]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("submitting");
    await createTopic({
      title: form.title.trim(),
      summary: form.summary.trim(),
      guidance: form.guidance.trim(),
      area: form.area || undefined,
      owner: form.owner.trim() || undefined,
    });
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
            color: "var(--accent-deep)",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          ✓ Emne opprettet
        </div>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontWeight: 700,
            color: "var(--text-primary)",
            fontSize: "2.4rem",
            letterSpacing: "0.01em",
          }}
        >
          {form.title}
        </div>
        <Link
          href="/topics"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--bg-base)",
            background: "var(--accent-deep)",
            textDecoration: "none",
            padding: "10px 18px",
            border: "2px solid var(--border)",
            boxShadow: "3px 3px 0 var(--border)",
            marginTop: "8px",
          }}
        >
          SE ALLE EMNER →
        </Link>
      </div>
    );
  }

  const submitting = status === "submitting";
  const ctxArea = form.area || "ny";

  return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 24px" }}>
      <div
        style={{
          background: "var(--bg-base)",
          border: "2px solid var(--border)",
          boxShadow: "6px 6px 0 var(--accent-shadow)",
        }}
      >
        <header
          style={{
            background: "var(--bg-surface)",
            borderBottom: "2px solid var(--border)",
            padding: "20px 28px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--accent-deep)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            EMNER · NYTT
          </div>
          <h1
            style={{
              fontFamily: "var(--font-pixel)",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "2rem",
              letterSpacing: "0.01em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Nytt emne
          </h1>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "520px",
          }}
        >
          {/* Form pane */}
          <div
            style={{
              padding: "28px 28px",
              borderRight: "2px solid var(--border)",
            }}
          >
            <SectionLabel>— Skjema</SectionLabel>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "14px" }}
            >
              <SelectField
                label="Kapittel"
                id="area"
                value={form.area}
                onChange={update("area")}
                options={AREA_OPTIONS}
              />
              <Field
                label="Tittel"
                id="title"
                required
                value={form.title}
                onChange={update("title")}
                placeholder="Navn på emnet"
              />
              <Field
                label="Sammendrag"
                id="summary"
                required
                value={form.summary}
                onChange={update("summary")}
                placeholder="Kort beskrivelse"
              />
              <Field
                label="Veiledning"
                id="guidance"
                required
                multiline
                rows={5}
                value={form.guidance}
                onChange={update("guidance")}
                placeholder="Detaljert veiledning og prosedyre..."
              />
              <Field
                label="Eier"
                id="owner"
                value={form.owner}
                onChange={update("owner")}
                placeholder="Initialer eller navn"
              />

              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  style={{
                    flex: 1,
                    background: isValid && !submitting ? "var(--accent-deep)" : "var(--rule)",
                    color: isValid && !submitting ? "var(--bg-base)" : "var(--text-muted)",
                    fontFamily: "var(--font-pixel)",
                    fontWeight: 700,
                    fontSize: "15px",
                    letterSpacing: "0.04em",
                    padding: "10px",
                    border: "2px solid var(--border)",
                    boxShadow:
                      isValid && !submitting ? "3px 3px 0 var(--border)" : "none",
                    cursor: isValid && !submitting ? "pointer" : "not-allowed",
                    transition: "background 0.12s ease",
                  }}
                >
                  {submitting ? "OPPRETTER..." : "PUBLISER EMNE"}
                </button>
                <Link
                  href="/topics"
                  style={{
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-ibm-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "11px 16px",
                    border: "2px solid var(--border)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  AVBRYT
                </Link>
              </div>
            </form>
          </div>

          {/* Preview pane */}
          <div
            style={{
              padding: "28px 28px",
              background: "var(--bg-preview)",
            }}
          >
            <SectionLabel>— Forhåndsvisning · i {ctxArea}</SectionLabel>

            <div
              style={{
                marginTop: "14px",
                background: "var(--bg-base)",
                border: "1px dashed var(--rule)",
                padding: "12px 14px",
              }}
            >
              {neighbors.above ? (
                <TopicRow
                  title={neighbors.above.title}
                  summary={`Eier: ${neighbors.above.owner ?? "—"}`}
                  owner={neighbors.above.owner}
                  area={neighbors.above.area}
                  ghosted
                  asLink={false}
                  version={1}
                />
              ) : (
                <PlaceholderRow text="(ingen oppslag før)" />
              )}

              <TopicRow
                title={form.title || undefined}
                summary={form.summary || undefined}
                owner={form.owner || undefined}
                area={form.area || undefined}
                isDraft
                highlighted
                asLink={false}
              />

              {neighbors.below ? (
                <TopicRow
                  title={neighbors.below.title}
                  summary={`Eier: ${neighbors.below.owner ?? "—"}`}
                  owner={neighbors.below.owner}
                  area={neighbors.below.area}
                  ghosted
                  asLink={false}
                  version={1}
                />
              ) : (
                <PlaceholderRow text="(ingen oppslag etter)" />
              )}
            </div>

            <p
              style={{
                fontFamily: "var(--font-ibm-mono)",
                color: "var(--text-muted)",
                fontSize: "10px",
                textAlign: "center",
                marginTop: "12px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              ← oppdateres mens du skriver
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-ibm-mono)",
        color: "var(--text-muted)",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function PlaceholderRow({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "12px 6px",
        borderBottom: "1px dotted var(--rule)",
        fontFamily: "var(--font-ibm-mono)",
        fontSize: "10px",
        color: "var(--text-faint)",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        fontStyle: "italic",
      }}
    >
      {text}
    </div>
  );
}

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

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: "2px solid var(--border)",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "var(--font-pixel)",
    padding: "8px 10px",
    width: "100%",
    outline: "none",
    boxShadow: focused ? "3px 3px 0 var(--accent)" : "none",
    transition: "box-shadow 0.12s ease",
    resize: multiline ? "vertical" : undefined,
  };

  return (
    <div>
      <FieldLabel htmlFor={id} focused={focused}>
        {label} {required && <span style={{ color: "var(--accent-deep)" }}>*</span>}
      </FieldLabel>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={inputStyle}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ label, id, value, onChange, options }: SelectFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <FieldLabel htmlFor={id} focused={focused}>
        {label}
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "var(--bg-raised)",
          border: "2px solid var(--border)",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: "14px",
          fontFamily: "var(--font-pixel)",
          padding: "8px 10px",
          width: "100%",
          outline: "none",
          boxShadow: focused ? "3px 3px 0 var(--accent)" : "none",
          transition: "box-shadow 0.12s ease",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  focused,
  children,
}: {
  htmlFor: string;
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontFamily: "var(--font-ibm-mono)",
        color: focused ? "var(--accent-deep)" : "var(--text-muted)",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "5px",
        transition: "color 0.12s ease",
      }}
    >
      {children}
    </label>
  );
}
