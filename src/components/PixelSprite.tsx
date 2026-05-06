import React from "react";

type SpriteKind =
  | "heart"
  | "lung"
  | "cross"
  | "vial"
  | "book"
  | "crest"
  | "brain"
  | "child"
  | "radio"
  | "pill"
  | "wrench"
  | "clipboard"
  | "petri"
  | "default";

interface PixelSpriteProps {
  kind: SpriteKind | string;
  size?: number;
  title?: string;
}

export function PixelSprite({ kind, size = 24, title }: PixelSpriteProps) {
  const k = (kind as SpriteKind) in SPRITES ? (kind as SpriteKind) : "default";
  const draw = SPRITES[k];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="pixelated"
      aria-hidden={!title}
    >
      {title && <title>{title}</title>}
      {draw}
    </svg>
  );
}

export function spriteKindForArea(area?: string | null): SpriteKind {
  if (!area) return "default";
  const a = area.toLowerCase();
  if (a.includes("hjerte") || a.includes("kar")) return "heart";
  if (a.includes("luft") || a.includes("lunge") || a.includes("respira")) return "lung";
  if (a.includes("akutt") || a.includes("traum")) return "cross";
  if (a.includes("legem") || a.includes("medikament")) return "vial";
  if (a.includes("infek") || a.includes("hygien")) return "petri";
  if (a.includes("nevro") || a.includes("hjern")) return "brain";
  if (a.includes("pediatr") || a.includes("barn")) return "child";
  if (a.includes("kommun") || a.includes("samband")) return "radio";
  if (a.includes("smerte") || a.includes("anestesi")) return "pill";
  if (a.includes("drift") || a.includes("utstyr") || a.includes("verktøy")) return "wrench";
  if (a.includes("admin") || a.includes("dokument") || a.includes("rutine")) return "clipboard";
  if (a.includes("annet") || a.includes("annen")) return "book";
  return "default";
}

const ROSE = "#b87474";
const ROSE_DEEP = "#a04848";
const ROSE_LIGHT = "#d68a8a";
const HIGHLIGHT = "#f5d4d4";
const PAPER = "#f5e8d8";
const INK = "#2c2620";
const SHADOW = "#5a4a36";

const SPRITES: Record<SpriteKind, React.ReactElement> = {
  heart: (
    <g>
      <rect x="2" y="2" width="2" height="2" fill={ROSE} />
      <rect x="8" y="2" width="2" height="2" fill={ROSE} />
      <rect x="1" y="3" width="10" height="3" fill={ROSE} />
      <rect x="2" y="6" width="8" height="2" fill={ROSE_DEEP} />
      <rect x="3" y="8" width="6" height="1" fill={ROSE_DEEP} />
      <rect x="4" y="9" width="4" height="1" fill={ROSE_DEEP} />
      <rect x="5" y="10" width="2" height="1" fill={ROSE_DEEP} />
      <rect x="2" y="3" width="1" height="1" fill={HIGHLIGHT} />
      <rect x="3" y="4" width="1" height="1" fill={HIGHLIGHT} />
    </g>
  ),
  lung: (
    <g>
      <rect x="5" y="1" width="2" height="9" fill={ROSE_DEEP} />
      <rect x="2" y="3" width="3" height="6" fill={ROSE} />
      <rect x="7" y="3" width="3" height="6" fill={ROSE} />
      <rect x="3" y="4" width="1" height="4" fill={ROSE_LIGHT} />
      <rect x="8" y="4" width="1" height="4" fill={ROSE_LIGHT} />
      <rect x="2" y="9" width="3" height="1" fill={ROSE_DEEP} />
      <rect x="7" y="9" width="3" height="1" fill={ROSE_DEEP} />
    </g>
  ),
  cross: (
    <g>
      <rect x="5" y="1" width="2" height="10" fill={ROSE_DEEP} />
      <rect x="1" y="5" width="10" height="2" fill={ROSE_DEEP} />
      <rect x="5" y="2" width="1" height="8" fill={ROSE_LIGHT} />
      <rect x="2" y="5" width="8" height="1" fill={ROSE_LIGHT} />
    </g>
  ),
  vial: (
    <g>
      <rect x="4" y="1" width="4" height="1" fill={INK} />
      <rect x="3" y="2" width="6" height="1" fill={SHADOW} />
      <rect x="4" y="3" width="4" height="8" fill={PAPER} />
      <rect x="3" y="3" width="1" height="8" fill={INK} />
      <rect x="8" y="3" width="1" height="8" fill={INK} />
      <rect x="4" y="11" width="4" height="1" fill={INK} />
      <rect x="4" y="7" width="4" height="4" fill={ROSE} />
      <rect x="5" y="9" width="1" height="1" fill={ROSE_LIGHT} />
    </g>
  ),
  book: (
    <g>
      <rect x="2" y="2" width="8" height="9" fill={ROSE_DEEP} />
      <rect x="3" y="3" width="6" height="7" fill={PAPER} />
      <rect x="4" y="4" width="4" height="1" fill={ROSE} />
      <rect x="4" y="6" width="5" height="1" fill={INK} />
      <rect x="4" y="8" width="3" height="1" fill={INK} />
      <rect x="9" y="2" width="1" height="4" fill={ROSE} />
    </g>
  ),
  crest: (
    <g>
      <rect x="2" y="2" width="2" height="2" fill={ROSE} />
      <rect x="8" y="2" width="2" height="2" fill={ROSE} />
      <rect x="1" y="3" width="10" height="3" fill={ROSE} />
      <rect x="2" y="6" width="8" height="2" fill={ROSE_DEEP} />
      <rect x="3" y="8" width="6" height="1" fill={ROSE_DEEP} />
      <rect x="4" y="9" width="4" height="1" fill={ROSE_DEEP} />
      <rect x="5" y="10" width="2" height="1" fill={ROSE_DEEP} />
      <rect x="2" y="3" width="1" height="1" fill={HIGHLIGHT} />
      <rect x="3" y="4" width="1" height="1" fill={HIGHLIGHT} />
      <rect x="9" y="3" width="1" height="1" fill={HIGHLIGHT} />
    </g>
  ),
  brain: (
    <g>
      {/* Top lobes */}
      <rect x="3" y="2" width="3" height="1" fill={ROSE} />
      <rect x="6" y="2" width="3" height="1" fill={ROSE} />
      <rect x="2" y="3" width="8" height="1" fill={ROSE} />
      {/* Body */}
      <rect x="1" y="4" width="10" height="4" fill={ROSE} />
      <rect x="2" y="8" width="8" height="1" fill={ROSE_DEEP} />
      <rect x="3" y="9" width="6" height="1" fill={ROSE_DEEP} />
      {/* Folds (lighter highlights) */}
      <rect x="3" y="4" width="2" height="1" fill={ROSE_LIGHT} />
      <rect x="7" y="4" width="2" height="1" fill={ROSE_LIGHT} />
      <rect x="5" y="3" width="1" height="1" fill={INK} />
      <rect x="2" y="6" width="1" height="1" fill={ROSE_DEEP} />
      <rect x="9" y="6" width="1" height="1" fill={ROSE_DEEP} />
      <rect x="5" y="6" width="2" height="1" fill={ROSE_DEEP} />
      {/* Stem */}
      <rect x="5" y="10" width="2" height="1" fill={SHADOW} />
    </g>
  ),
  child: (
    <g>
      {/* Head */}
      <rect x="4" y="1" width="4" height="3" fill={ROSE_LIGHT} />
      <rect x="3" y="2" width="6" height="2" fill={ROSE_LIGHT} />
      <rect x="4" y="2" width="1" height="1" fill={INK} />
      <rect x="7" y="2" width="1" height="1" fill={INK} />
      <rect x="5" y="3" width="2" height="1" fill={ROSE_DEEP} />
      {/* Body / smock */}
      <rect x="3" y="5" width="6" height="4" fill={ROSE} />
      <rect x="4" y="6" width="4" height="2" fill={ROSE_DEEP} />
      <rect x="5" y="6" width="2" height="1" fill={HIGHLIGHT} />
      {/* Legs */}
      <rect x="3" y="9" width="2" height="2" fill={SHADOW} />
      <rect x="7" y="9" width="2" height="2" fill={SHADOW} />
    </g>
  ),
  radio: (
    <g>
      {/* Body */}
      <rect x="2" y="3" width="6" height="8" fill={INK} />
      <rect x="3" y="4" width="4" height="3" fill={ROSE} />
      <rect x="3" y="5" width="4" height="1" fill={ROSE_LIGHT} />
      {/* Knobs */}
      <rect x="4" y="8" width="1" height="1" fill={ROSE_LIGHT} />
      <rect x="6" y="8" width="1" height="1" fill={ROSE_LIGHT} />
      <rect x="3" y="9" width="4" height="1" fill={SHADOW} />
      {/* Antenna */}
      <rect x="8" y="2" width="1" height="1" fill={INK} />
      <rect x="9" y="1" width="1" height="1" fill={INK} />
      <rect x="10" y="0" width="1" height="1" fill={INK} />
      {/* Signal waves */}
      <rect x="9" y="3" width="1" height="1" fill={ROSE} />
      <rect x="10" y="2" width="1" height="1" fill={ROSE} />
      <rect x="10" y="4" width="1" height="1" fill={ROSE} />
    </g>
  ),
  pill: (
    <g>
      {/* Capsule split diagonally */}
      <rect x="2" y="3" width="3" height="6" fill={ROSE} />
      <rect x="3" y="2" width="2" height="1" fill={ROSE} />
      <rect x="3" y="9" width="2" height="1" fill={ROSE} />
      <rect x="7" y="3" width="3" height="6" fill={PAPER} />
      <rect x="7" y="2" width="2" height="1" fill={PAPER} />
      <rect x="7" y="9" width="2" height="1" fill={PAPER} />
      {/* Outline */}
      <rect x="2" y="2" width="1" height="1" fill={INK} />
      <rect x="9" y="2" width="1" height="1" fill={INK} />
      <rect x="2" y="9" width="1" height="1" fill={INK} />
      <rect x="9" y="9" width="1" height="1" fill={INK} />
      <rect x="3" y="1" width="6" height="1" fill={INK} />
      <rect x="3" y="10" width="6" height="1" fill={INK} />
      <rect x="1" y="3" width="1" height="6" fill={INK} />
      <rect x="10" y="3" width="1" height="6" fill={INK} />
      {/* Seam */}
      <rect x="6" y="2" width="1" height="8" fill={INK} />
      {/* Highlight on rose half */}
      <rect x="3" y="3" width="1" height="2" fill={ROSE_LIGHT} />
    </g>
  ),
  wrench: (
    <g>
      {/* Open jaw at top-left */}
      <rect x="1" y="1" width="3" height="3" fill={ROSE_DEEP} />
      <rect x="2" y="2" width="2" height="1" fill={PAPER} />
      <rect x="1" y="2" width="1" height="1" fill={ROSE_LIGHT} />
      <rect x="3" y="3" width="1" height="1" fill={ROSE_DEEP} />
      <rect x="2" y="4" width="1" height="1" fill={ROSE} />
      {/* Diagonal handle */}
      <rect x="3" y="4" width="2" height="1" fill={ROSE} />
      <rect x="4" y="5" width="2" height="1" fill={ROSE} />
      <rect x="5" y="6" width="2" height="1" fill={ROSE} />
      <rect x="6" y="7" width="2" height="1" fill={ROSE} />
      <rect x="7" y="8" width="2" height="1" fill={ROSE} />
      <rect x="8" y="9" width="2" height="1" fill={ROSE} />
      {/* Closed end at bottom-right */}
      <rect x="8" y="8" width="3" height="3" fill={ROSE_DEEP} />
      <rect x="9" y="9" width="1" height="1" fill={ROSE_LIGHT} />
    </g>
  ),
  clipboard: (
    <g>
      {/* Board */}
      <rect x="2" y="2" width="8" height="9" fill={ROSE_DEEP} />
      <rect x="3" y="3" width="6" height="7" fill={PAPER} />
      {/* Clip */}
      <rect x="4" y="1" width="4" height="2" fill={INK} />
      <rect x="5" y="0" width="2" height="1" fill={INK} />
      {/* Lines */}
      <rect x="4" y="5" width="4" height="1" fill={INK} />
      <rect x="4" y="7" width="3" height="1" fill={INK} />
      <rect x="4" y="9" width="2" height="1" fill={INK} />
      {/* Check mark in rose */}
      <rect x="7" y="9" width="1" height="1" fill={ROSE} />
      <rect x="8" y="8" width="1" height="1" fill={ROSE} />
    </g>
  ),
  petri: (
    <g>
      {/* Dish */}
      <rect x="1" y="4" width="10" height="6" fill={PAPER} />
      <rect x="1" y="4" width="10" height="1" fill={INK} />
      <rect x="1" y="9" width="10" height="1" fill={INK} />
      <rect x="0" y="5" width="1" height="4" fill={INK} />
      <rect x="11" y="5" width="1" height="4" fill={INK} />
      {/* Lid line */}
      <rect x="2" y="3" width="8" height="1" fill={SHADOW} />
      {/* Bacterial colonies */}
      <rect x="3" y="6" width="2" height="1" fill={ROSE} />
      <rect x="2" y="7" width="3" height="1" fill={ROSE} />
      <rect x="3" y="8" width="2" height="1" fill={ROSE_DEEP} />
      <rect x="7" y="6" width="1" height="1" fill={ROSE_DEEP} />
      <rect x="8" y="7" width="2" height="1" fill={ROSE} />
      <rect x="6" y="8" width="1" height="1" fill={ROSE} />
    </g>
  ),
  default: (
    <g>
      <rect x="2" y="2" width="8" height="8" fill={ROSE} />
      <rect x="3" y="3" width="6" height="6" fill={PAPER} />
      <rect x="4" y="4" width="4" height="4" fill={ROSE_DEEP} />
      <rect x="5" y="5" width="2" height="2" fill={HIGHLIGHT} />
    </g>
  ),
};
