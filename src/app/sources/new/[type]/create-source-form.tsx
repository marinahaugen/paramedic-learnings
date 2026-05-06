"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createSource, type CreateSourceErrors } from "@/app/actions/sources";

export type SourceFormType = "debrief" | "research";

const COPY = {
  debrief: {
    breadcrumb: "KILDER / NY DEBRIEF",
    heading: "MELD DEBRIEF",
    submit: "SEND DEBRIEF",
    sourceType: "Debrief" as const,
    dateLabel: "Dato for hendelse",
    contentLabel: "Innhold",
    urlLabel: "Kilde-URL",
    descriptionLabel: null,
  },
  research: {
    breadcrumb: "KILDER / NY FORSKNING",
    heading: "REGISTRER FORSKNING",
    submit: "SEND FORSKNING",
    sourceType: "Forskning" as const,
    dateLabel: "Publiseringsdato",
    contentLabel: "Sammendrag",
    urlLabel: "URL / DOI",
    descriptionLabel: "Forfattere / Utgiver",
  },
} satisfies Record<
  SourceFormType,
  {
    breadcrumb: string;
    heading: string;
    submit: string;
    sourceType: "Debrief" | "Forskning";
    dateLabel: string;
    contentLabel: string;
    urlLabel: string;
    descriptionLabel: string | null;
  }
>;

interface FieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  defaultValue?: string;
  error?: string;
}

function Field({
  label,
  id,
  name,
  type = "text",
  required,
  multiline,
  rows = 4,
  defaultValue,
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-raised)",
    border: `1px solid ${error ? "var(--accent)" : "var(--border)"}`,
    borderLeft: focused
      ? "2px solid var(--accent)"
      : `2px solid ${error ? "var(--accent)" : "var(--border)"}`,
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
        {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-ibm-mono)",
            color: "var(--accent)",
            fontSize: "10px",
            letterSpacing: "0.08em",
            marginTop: "4px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function CreateSourceForm({ type }: { type: SourceFormType }) {
  const copy = COPY[type];
  const [state, formAction, isPending] = useActionState(createSource, null);
  const errors: CreateSourceErrors = state?.errors ?? {};

  return (
    <div style={{ minHeight: "calc(100vh - 65px)" }}>
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-strong)",
          padding: "16px 24px",
        }}
      >
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
          {copy.breadcrumb}
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
          {copy.heading}
        </h1>
      </div>

      <div style={{ maxWidth: "640px", padding: "32px 24px" }}>
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

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input type="hidden" name="sourceType" value={copy.sourceType} />

          <Field
            label="Tittel"
            id="title"
            name="title"
            required
            error={errors.title?.[0]}
          />

          {copy.descriptionLabel && (
            <Field
              label={copy.descriptionLabel}
              id="description"
              name="description"
              error={errors.description?.[0]}
            />
          )}

          <Field
            label={copy.dateLabel}
            id="reportDate"
            name="reportDate"
            type="date"
          />
          <Field
            label={copy.contentLabel}
            id="content"
            name="content"
            required
            multiline
            rows={8}
            error={errors.content?.[0]}
          />
          <Field
            label={copy.urlLabel}
            id="url"
            name="url"
            type="url"
            error={errors.url?.[0]}
          />

          <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 1,
                background: isPending ? "var(--border)" : "var(--accent)",
                color: isPending ? "var(--text-muted)" : "var(--bg-base)",
                fontFamily: "var(--font-bebas)",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                padding: "11px",
                border: "none",
                borderRadius: "2px",
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
            >
              {isPending ? "SENDER..." : copy.submit}
            </button>
            <Link
              href="/topics"
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
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
