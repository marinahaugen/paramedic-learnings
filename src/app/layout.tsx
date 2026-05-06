import type { Metadata } from "next";
import { Pixelify_Sans, IBM_Plex_Mono, Press_Start_2P } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const pixelify = Pixelify_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-pixel",
  subsets: ["latin"],
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  variable: "--font-ibm-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-stamp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paramedic Learnings",
  description:
    "En levende felthåndbok der kliniske prosedyrer oppdateres når praksisen lærer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${pixelify.variable} ${ibmMono.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <header
          style={{
            background: "var(--bg-surface)",
            borderBottom: "2px solid var(--border)",
          }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <PixelHeart />
              <span
                style={{
                  fontFamily: "var(--font-stamp)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
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
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "flex",
                gap: "24px",
              }}
            >
              <NavLink href="/topics">Emner</NavLink>
              <NavLink href="/topics/new" accent>+ Ny</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          style={{
            borderTop: "1px dashed var(--rule)",
            padding: "20px 24px",
            textAlign: "center",
            fontFamily: "var(--font-ibm-mono)",
            fontSize: "10px",
            color: "var(--text-muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          PARAMEDIC LEARNINGS · FELTHÅNDBOK FOR PREHOSPITALE TJENESTER
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  accent,
  children,
}: {
  href: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        color: accent ? "var(--accent-deep)" : "var(--text-primary)",
        textDecoration: "none",
        paddingBottom: "2px",
        borderBottom: accent
          ? "2px solid var(--accent-deep)"
          : "2px solid transparent",
      }}
    >
      {children}
    </Link>
  );
}

function PixelHeart() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className="pixelated"
      aria-hidden
    >
      <rect x="3" y="3" width="3" height="3" fill="#b87474" />
      <rect x="10" y="3" width="3" height="3" fill="#b87474" />
      <rect x="2" y="4" width="12" height="4" fill="#b87474" />
      <rect x="3" y="8" width="10" height="2" fill="#a04848" />
      <rect x="4" y="10" width="8" height="1" fill="#a04848" />
      <rect x="5" y="11" width="6" height="1" fill="#a04848" />
      <rect x="6" y="12" width="4" height="1" fill="#a04848" />
      <rect x="7" y="13" width="2" height="1" fill="#a04848" />
      <rect x="4" y="4" width="1" height="1" fill="#f5d4d4" />
      <rect x="11" y="4" width="1" height="1" fill="#f5d4d4" />
    </svg>
  );
}
