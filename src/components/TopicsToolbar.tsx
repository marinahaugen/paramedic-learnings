"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface TopicsToolbarProps {
  areas: string[];
}

export function TopicsToolbar({ areas }: TopicsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const q = searchParams.get("q") ?? "";
  const activeArea = searchParams.get("area") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 300);
  };

  const handleArea = (value: string) => {
    updateParams({ area: activeArea === value ? "" : value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
      <input
        type="text"
        defaultValue={q}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Søk i topics..."
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderLeft: "2px solid var(--border)",
          borderRadius: "2px",
          color: "var(--text-primary)",
          fontSize: "14px",
          padding: "9px 12px",
          outline: "none",
          fontFamily: "system-ui, sans-serif",
          width: "100%",
        }}
      />
      {areas.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => handleArea(a)}
              style={{
                background: activeArea === a ? "var(--accent)" : "var(--bg-raised)",
                color: activeArea === a ? "var(--bg-base)" : "var(--text-muted)",
                fontFamily: "var(--font-ibm-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 10px",
                border: `1px solid ${activeArea === a ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
