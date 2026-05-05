"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTopic } from "./actions";

type Topic = {
  id: number;
  title: string;
  summary: string;
  createdBy: string;
  updatedAt: string;
};

export default function TopicListClient({ topics }: { topics: Topic[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full" style={{ background: "var(--warm-bg)" }}>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-end justify-between px-6 py-10">
          <div>
            <h1
              className="text-4xl leading-tight text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Topics
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Clinical &amp; operational guidance
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--navy)" }}
          >
            <span aria-hidden="true" className="text-base leading-none">+</span>
            New Topic
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {topics.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-400">No topics yet.</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-4 cursor-pointer text-sm font-medium underline underline-offset-4"
              style={{ color: "var(--signal)" }}
            >
              Create the first one
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/topics/${topic.id}`}
                  className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex">
                    <div
                      className="w-1 flex-shrink-0 transition-all duration-150 group-hover:w-[5px]"
                      style={{ background: "var(--signal)" }}
                    />
                    <div className="flex-1 px-5 py-4">
                      <h2
                        className="text-xl leading-snug text-slate-900 transition-colors group-hover:text-slate-700"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {topic.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {topic.summary}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                        <span>{topic.createdBy}</span>
                        <span>·</span>
                        <span>
                          {new Date(topic.updatedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center pr-5 text-slate-300 transition-colors group-hover:text-slate-400">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <CreateTopicModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

function CreateTopicModal({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await createTopic(new FormData(e.currentTarget));

    if ("error" in result) {
      setError(result.error);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push(`/topics/${result.id}`);
  }

  const inputClass =
    "w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal)]/10";

  const legendClass = "mb-3 text-xs font-semibold uppercase tracking-widest";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "modal-backdrop 0.2s ease" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(15, 31, 61, 0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl"
        style={{ animation: "modal-panel 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-6">
          <h2
            className="text-2xl text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New Topic
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Close"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-5">
          <fieldset>
            <legend className={legendClass} style={{ color: "var(--signal)" }}>
              About the topic
            </legend>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  ref={firstRef}
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Airway Management"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600" htmlFor="summary">
                  Summary
                </label>
                <input
                  id="summary"
                  name="summary"
                  type="text"
                  required
                  placeholder="One-line description"
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClass} style={{ color: "var(--signal)" }}>
              Guidance
            </legend>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600" htmlFor="guidanceText">
                Guidance text
              </label>
              <textarea
                id="guidanceText"
                name="guidanceText"
                required
                rows={4}
                placeholder="Current recommended approach..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClass} style={{ color: "var(--signal)" }}>
              Author
            </legend>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600" htmlFor="createdBy">
                Your name
              </label>
              <input
                id="createdBy"
                name="createdBy"
                type="text"
                required
                placeholder="Full name"
                className={inputClass}
              />
            </div>
          </fieldset>

          {error && (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-lg px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: "var(--navy)" }}
            >
              {saving ? "Saving…" : "Save Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
