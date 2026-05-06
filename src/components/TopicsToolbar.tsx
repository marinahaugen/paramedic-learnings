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

  const handleSearch = useCallback(
    (value: string) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateParams({ q: value }), 300);
    },
    [updateParams],
  );

  const handleArea = (value: string) => {
    updateParams({ area: activeArea === value ? "" : value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
      <input
        type="text"
        aria-label="Søk i emner"
        defaultValue={q}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Søk i emner..."
        style={{
          background: "var(--bg-raised)",
          border: "2px solid var(--border)",
          color: "var(--text-primary)",
          fontSize: "14px",
          fontFamily: "var(--font-pixel)",
          padding: "9px 12px",
          outline: "none",
          width: "100%",
        }}
      />
      {areas.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {areas.map((a) => {
            const on = activeArea === a;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                onClick={() => handleArea(a)}
                style={{
                  background: on ? "var(--accent-deep)" : "var(--bg-surface)",
                  color: on ? "var(--bg-base)" : "var(--text-primary)",
                  fontFamily: "var(--font-ibm-mono)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
