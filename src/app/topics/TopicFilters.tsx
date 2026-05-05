"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AREAS } from "@/db/schema";

export function TopicFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    router.replace(`/topics?${next.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Search topics…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        className="flex-1 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
      />
      <select
        defaultValue={params.get("area") ?? ""}
        onChange={(e) => update("area", e.target.value)}
        className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
      >
        <option value="">All areas</option>
        {AREAS.map((a) => (
          <option key={a} value={a}>
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
