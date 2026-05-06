import Link from "next/link";

export interface ChapterEntry {
  name: string;
  count: number;
}

interface ChapterSidebarProps {
  chapters: ChapterEntry[];
  active?: string | null;
  total: number;
}

export function ChapterSidebar({ chapters, active, total }: ChapterSidebarProps) {
  return (
    <aside
      style={{
        width: "180px",
        flexShrink: 0,
        padding: "20px 18px",
        background: "var(--bg-surface)",
        borderRight: "2px solid var(--border)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-ibm-mono)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "12px",
        }}
      >
        Kapitler
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {chapters.map((c) => (
          <ChapterItem
            key={c.name}
            href={`/topics?area=${encodeURIComponent(c.name)}`}
            label={c.name.toUpperCase()}
            count={c.count}
            active={active === c.name}
          />
        ))}
        <li style={{ marginTop: "14px" }}>
          <ChapterItem
            href="/topics"
            label="ALLE"
            count={total}
            active={!active}
          />
        </li>
      </ul>
    </aside>
  );
}

function ChapterItem({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <li style={{ marginBottom: "9px", listStyle: "none" }}>
      <Link
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "var(--font-pixel)",
          fontSize: "14px",
          fontWeight: active ? 700 : 500,
          color: active ? "var(--accent-deep)" : "var(--text-primary)",
          textDecoration: "none",
          paddingLeft: "0",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: active ? "7px" : "5px",
            height: active ? "7px" : "5px",
            background: active ? "var(--accent-deep)" : "var(--accent)",
            flexShrink: 0,
          }}
        />
        <span style={{ flex: 1 }}>{label}</span>
        <span
          style={{
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "10px",
            color: active ? "var(--accent-deep)" : "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {count}
        </span>
      </Link>
    </li>
  );
}
