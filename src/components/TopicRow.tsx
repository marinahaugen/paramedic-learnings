"use client";

import Link from "next/link";
import { useState } from "react";
import { PixelSprite, spriteKindForArea } from "./PixelSprite";

export interface TopicRowProps {
  id?: number;
  title?: string;
  summary?: string;
  owner?: string | null;
  area?: string | null;
  version?: number;
  isDraft?: boolean;
  featured?: boolean;
  ghosted?: boolean;
  highlighted?: boolean;
  asLink?: boolean;
}

export function TopicRow({
  id,
  title,
  summary,
  owner,
  area,
  version = 1,
  isDraft = false,
  featured = false,
  ghosted = false,
  highlighted = false,
  asLink = true,
}: TopicRowProps) {
  const [hovered, setHovered] = useState(false);
  const interactive = asLink && id !== undefined;

  const titleColor = featured || highlighted ? "var(--accent-deep)" : "var(--text-primary)";

  const row = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 96px",
        gap: "14px",
        alignItems: "center",
        padding: "12px 6px",
        borderBottom: "1px dotted var(--rule)",
        background: highlighted
          ? "rgba(184,116,116,0.10)"
          : interactive && hovered
            ? "rgba(184,116,116,0.06)"
            : "transparent",
        opacity: ghosted ? 0.45 : 1,
        cursor: interactive ? "pointer" : "default",
        transition: "background 0.12s ease",
      }}
    >
      <PixelSprite kind={spriteKindForArea(area)} size={26} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: 1.15,
            color: title ? titleColor : "var(--text-faint)",
            fontStyle: title ? "normal" : "italic",
            marginBottom: "2px",
          }}
        >
          {title || "Tittel vises her"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            lineHeight: 1.35,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {summary || "Sammendrag vises her..."}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-ibm-mono)",
          fontSize: "10px",
          letterSpacing: "0.06em",
          textAlign: "right",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            color: isDraft ? "var(--text-muted)" : "var(--accent-deep)",
            fontWeight: 700,
            fontStyle: isDraft ? "italic" : "normal",
            letterSpacing: isDraft ? "0.10em" : "0.04em",
          }}
        >
          {isDraft ? "Utkast" : `v${version}`}
        </div>
        <div>{owner || "—"}</div>
      </div>
    </div>
  );

  if (interactive) {
    return (
      <Link href={`/topics/${id}`} style={{ textDecoration: "none", display: "block", color: "inherit" }}>
        {row}
      </Link>
    );
  }
  return row;
}
