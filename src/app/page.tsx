import Link from "next/link";
import { getAreas } from "@/app/actions/topics";
import { PixelSprite, spriteKindForArea } from "@/components/PixelSprite";

export default async function Home() {
  const areas = await getAreas();

  return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 24px" }}>
      <div
        style={{
          background: "var(--bg-base)",
          border: "2px solid var(--border)",
          boxShadow: "6px 6px 0 var(--accent-shadow)",
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: "relative",
            padding: "44px 36px 32px",
            borderBottom: "2px solid var(--border)",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 26px, rgba(184,116,116,0.05) 26px 27px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "32px",
              right: "36px",
            }}
          >
            <PixelSprite kind="crest" size={72} title="Felthåndbok" />
          </div>
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--accent-deep)",
              fontSize: "11px",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Felthåndbok · v1.0
          </div>
          <h1
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "44px",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.05,
              margin: "0 0 14px",
              maxWidth: "640px",
            }}
          >
            Faglig kunnskap for prehospitale tjenester
          </h1>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "560px",
            }}
          >
            En levende håndbok der kliniske prosedyrer oppdateres når praksisen
            lærer. Bla i kapitlene under, eller skriv et nytt oppslag.
          </p>
          <div style={{ marginTop: "22px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/topics"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--bg-base)",
                background: "var(--accent-deep)",
                textDecoration: "none",
                padding: "10px 18px",
                border: "2px solid var(--border)",
                boxShadow: "3px 3px 0 var(--border)",
              }}
            >
              ÅPNE FELTHÅNDBOKEN →
            </Link>
            <Link
              href="/topics/new"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-primary)",
                background: "var(--bg-surface)",
                textDecoration: "none",
                padding: "10px 18px",
                border: "2px solid var(--border)",
                boxShadow: "3px 3px 0 var(--accent)",
              }}
            >
              + NYTT EMNE
            </Link>
          </div>
        </section>

        {/* Chapters */}
        <section style={{ padding: "26px 36px 36px" }}>
          <div
            style={{
              fontFamily: "var(--font-ibm-mono)",
              color: "var(--text-muted)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Kapitler
          </div>

          {areas.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--rule)",
                padding: "32px",
                textAlign: "center",
                fontFamily: "var(--font-ibm-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Ingen kapitler ennå — opprett det første emnet
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "14px",
              }}
            >
              {areas.map((a) => (
                <ChapterTile key={a.name} name={a.name} count={a.count} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ChapterTile({ name, count }: { name: string; count: number }) {
  return (
    <Link
      href={`/topics?area=${encodeURIComponent(name)}`}
      style={{
        display: "block",
        padding: "16px 14px",
        background: "var(--bg-surface)",
        border: "2px solid var(--border)",
        textAlign: "center",
        textDecoration: "none",
        color: "var(--text-primary)",
        boxShadow: "3px 3px 0 var(--accent)",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
        <PixelSprite kind={spriteKindForArea(name)} size={36} title={name} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.1,
          marginBottom: "2px",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-ibm-mono)",
          fontSize: "10px",
          color: "var(--text-muted)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        {count} {count === 1 ? "emne" : "emner"}
      </div>
    </Link>
  );
}
