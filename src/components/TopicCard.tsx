"use client";

import Link from "next/link";
import { useMemo } from "react";

export interface TopicCardProps {
  id?: number;
  title?: string;
  summary?: string;
  owner?: string;
  version?: number;
  isDraft?: boolean;
  updatedAt?: Date | string;
}

export function TopicCard({
  id,
  title,
  summary,
  owner,
  version = 1,
  isDraft = false,
  updatedAt,
}: TopicCardProps) {
  const today = useMemo(
    () =>
      (updatedAt ? new Date(updatedAt) : new Date()).toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [updatedAt],
  );

  const card = (
    <article
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderTop: "2px solid var(--accent)",
        borderRadius: "2px",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div style={{ padding: "20px 20px 16px" }}>
        <header
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--accent-muted)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "var(--bg-raised)",
              padding: "2px 8px",
            }}
          >
            PROSEDYRE
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
            }}
          >
            v{version} · {isDraft ? "Utkast" : "Publisert"}
          </span>
        </header>

        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.85rem",
            letterSpacing: "0.03em",
            lineHeight: 1,
            color: title ? "var(--text-primary)" : "var(--border)",
            marginBottom: "10px",
            transition: "color 0.15s ease",
          }}
        >
          {title || "TITTEL VISES HER"}
        </h2>

        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.65,
            color: summary ? "var(--text-secondary)" : "var(--border)",
            marginBottom: "16px",
            fontStyle: summary ? "normal" : "italic",
            transition: "color 0.15s ease",
          }}
        >
          {summary || "Sammendrag vil vises her når du begynner å skrive..."}
        </p>

        <div
          style={{
            borderTop: "1px solid var(--border-strong)",
            paddingTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            EIER: {owner || "—"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-faint)",
              fontSize: "10px",
            }}
          >
            {today}
          </span>
        </div>
      </div>
    </article>
  );

  if (id && !isDraft) {
    return (
      <Link href={`/topics/${id}`} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </Link>
    );
  }

  return card;
}
