import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  variable: "--font-ibm-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paramedic Learnings",
  description:
    "A knowledge platform for ambulance personnel: capture and improve operational guidance with AI-assisted analysis and human approval.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${ibmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <header style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border-strong)" }}>
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "1.25rem",
                  letterSpacing: "0.08em",
                  color: "var(--text-primary)",
                }}
              >
                PARAMEDIC LEARNINGS
              </span>
            </Link>
            <nav
              style={{
                fontFamily: "var(--font-ibm-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "flex",
                gap: "24px",
              }}
            >
              <Link href="/topics" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Topics</Link>
              <Link href="/topics/new" style={{ color: "var(--accent-muted)", textDecoration: "none" }}>+ Ny</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--bg-surface)",
            padding: "20px 24px",
            textAlign: "center",
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "11px",
            color: "var(--border)",
            letterSpacing: "0.06em",
          }}
        >
          PARAMEDIC LEARNINGS — FAGLIG KUNNSKAP FOR PREHOSPITALE TJENESTER
        </footer>
      </body>
    </html>
  );
}
