import React from "react";

type SpriteKind =
  | "heart"
  | "lung"
  | "cross"
  | "vial"
  | "book"
  | "crest"
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
  if (a.includes("hjerte")) return "heart";
  if (a.includes("luft") || a.includes("lunge")) return "lung";
  if (a.includes("traum") || a.includes("trauma")) return "cross";
  if (a.includes("legem") || a.includes("medikament")) return "vial";
  if (a.includes("annet") || a.includes("annen")) return "book";
  return "default";
}

const ROSE = "#b87474";
const ROSE_DEEP = "#a04848";
const ROSE_LIGHT = "#d68a8a";
const HIGHLIGHT = "#f5d4d4";
const PAPER = "#f5e8d8";
const INK = "#2c2620";

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
      <rect x="3" y="2" width="6" height="1" fill={ROSE} />
      <rect x="4" y="3" width="4" height="8" fill={PAPER} stroke={INK} />
      <rect x="4" y="3" width="4" height="1" fill={INK} />
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
  default: (
    <g>
      <rect x="2" y="2" width="8" height="8" fill={ROSE} />
      <rect x="3" y="3" width="6" height="6" fill={PAPER} />
      <rect x="4" y="4" width="4" height="4" fill={ROSE_DEEP} />
      <rect x="5" y="5" width="2" height="2" fill={HIGHLIGHT} />
    </g>
  ),
};
