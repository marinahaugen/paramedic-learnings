import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1
        className="text-4xl leading-tight text-slate-900 sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Paramedic Learnings
      </h1>
      <p className="mt-4 text-lg text-slate-500">
        A knowledge platform for ambulance personnel. Capture field experience,
        review evidence, and keep operational guidance current — with AI
        assistance and human approval.
      </p>
      <div className="mt-8">
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--navy)" }}
        >
          Browse topics
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
