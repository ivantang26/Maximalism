import type { ReactNode } from "react";
import type { Work } from "@/lib/content/types";
import { palette, type PaletteName } from "@/lib/tokens";
import { rngFor, between, pick, round, type Rng } from "@/lib/rng";

/**
 * Renders a work as SVG from its template and palette. The fictional artworks are
 * generated rather than photographed, which keeps the exhibition page far below its
 * 1.8MB budget and lets collage clusters crop any detail at any size.
 *
 * Canvas: 400 × 500. Colour order per template is fixed so curators' alt text stays true.
 */
const W = 400;
const H = 500;
const INK = palette.black;

type Draw = (c: string[], r: Rng) => ReactNode;

function smoothClosedPath(points: [number, number][]): string {
  const n = points.length;
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d + "Z";
}

function blob(r: Rng, cx: number, cy: number, radius: number, wobble = 0.28, n = 7): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = radius * (1 - wobble + r() * wobble * 2);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothClosedPath(pts);
}

const templates: Record<Work["template"], Draw> = {
  bands: ([a, b, c, d], r) => {
    const n = 6 + Math.floor(r() * 3);
    const h = H / n;
    const tilt = round(between(r, -6, 6));
    const cx = round(between(r, 120, 280));
    const cy = round(between(r, 170, 330));
    const rad = round(between(r, 110, 150));
    return (
      <>
        <rect width={W} height={H} fill={a} />
        <g transform={`rotate(${tilt} 200 250)`}>
          {Array.from({ length: n + 4 }, (_, i) => (
            <rect key={i} x={-60} y={(i - 2) * h} width={W + 120} height={h + 1} fill={[a, b, c][i % 3]} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={rad} fill={d} stroke={INK} strokeWidth={7} />
      </>
    );
  },

  memphis: ([a, b, c, d], r) => {
    const shapes: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      const x = between(r, 20, 300);
      const y = between(r, 30, 460);
      const s = between(r, 14, 22);
      shapes.push(
        <path
          key={`s${i}`}
          d={`M${round(x)} ${round(y)}q${s} ${-s} ${s * 2} 0t${s * 2} 0t${s * 2} 0`}
          fill="none"
          stroke={b}
          strokeWidth={9}
          strokeLinecap="round"
        />,
      );
    }
    for (let i = 0; i < 4; i++) {
      const x = between(r, 40, 360);
      const y = between(r, 40, 460);
      const s = between(r, 34, 56);
      const rot = round(between(r, 0, 360));
      shapes.push(
        <path
          key={`t${i}`}
          d={`M${round(x)} ${round(y - s)}L${round(x + s)} ${round(y + s * 0.7)}L${round(x - s)} ${round(y + s * 0.7)}Z`}
          fill={c}
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
          transform={`rotate(${rot} ${round(x)} ${round(y)})`}
        />,
      );
    }
    for (let i = 0; i < 6; i++) {
      shapes.push(<circle key={`d${i}`} cx={round(between(r, 20, 380))} cy={round(between(r, 20, 480))} r={round(between(r, 10, 26))} fill={d} />);
    }
    return (
      <>
        <rect width={W} height={H} fill={a} />
        <g fill={INK}>
          {Array.from({ length: 9 }, (_, i) =>
            Array.from({ length: 11 }, (_, j) => <circle key={`${i}-${j}`} cx={20 + i * 45} cy={20 + j * 46} r={2.4} />),
          )}
        </g>
        {shapes}
      </>
    );
  },

  quilt: (cs, r) => {
    const size = 100;
    const cells: ReactNode[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * size;
        const y = row * size;
        const c1 = pick(r, cs);
        let c2 = pick(r, cs);
        if (c2 === c1) c2 = cs[(cs.indexOf(c1) + 1) % cs.length];
        const flip = r() > 0.5;
        const tri = flip ? `M${x} ${y}h${size}L${x} ${y + size}Z` : `M${x} ${y}h${size}v${size}Z`;
        cells.push(
          <g key={`${row}-${col}`}>
            <rect x={x} y={y} width={size} height={size} fill={c1} />
            <path d={tri} fill={c2} />
          </g>,
        );
      }
    }
    return (
      <>
        {cells}
        <path
          d={`${[100, 200, 300].map((x) => `M${x} 0V${H}`).join("")}${[100, 200, 300, 400].map((y) => `M0 ${y}H${W}`).join("")}`}
          stroke={INK}
          strokeWidth={3}
          strokeDasharray="9 7"
        />
      </>
    );
  },

  target: ([a, b, c, d], r) => {
    const cx = round(between(r, 140, 260));
    const cy = round(between(r, 180, 320));
    const rings = [b, c, d];
    return (
      <>
        <rect width={W} height={H} fill={a} />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={cx} cy={cy} r={330 - i * 36} fill={rings[i % 3]} />
        ))}
      </>
    );
  },

  face: ([bg, face, hair, feature], r) => {
    const eyeR = round(between(r, 22, 32));
    const mouthW = round(between(r, 60, 110));
    const smile = r() > 0.5;
    return (
      <>
        <rect width={W} height={H} fill={bg} />
        <ellipse cx={200} cy={290} rx={138} ry={170} fill={face} stroke={INK} strokeWidth={7} />
        <path d="M58 250L58 120Q200 20 342 120L342 250L312 190L282 250L252 190L222 250L192 190L162 250L132 190L102 250L82 200Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {[140, 260].map((x) => (
          <g key={x}>
            <circle cx={x} cy={285} r={eyeR + 12} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
            <circle cx={x + round(between(r, -6, 6))} cy={288} r={eyeR * 0.55} fill={INK} />
          </g>
        ))}
        <path d="M200 305L228 370H172Z" fill={feature} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={112} cy={362} r={24} fill={feature} />
        <circle cx={288} cy={362} r={24} fill={feature} />
        {smile ? (
          <path d={`M${200 - mouthW / 2} 400Q200 ${440} ${200 + mouthW / 2} 400`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        ) : (
          <rect x={200 - mouthW / 2} y={396} width={mouthW} height={20} rx={10} fill={INK} />
        )}
      </>
    );
  },

  blobs: ([a, b, c, d], r) => {
    const outline = a === palette.black ? palette.cream : INK;
    const fills = [b, c, d, b];
    return (
      <>
        <rect width={W} height={H} fill={a} />
        {fills.map((f, i) => (
          <path
            key={i}
            d={blob(r, between(r, 90, 310), between(r, 100, 400), between(r, 85, 140))}
            fill={f}
            stroke={i === 1 ? outline : "none"}
            strokeWidth={6}
          />
        ))}
      </>
    );
  },

  neon: ([a, b, c], r) => (
    <>
      <rect width={W} height={H} fill={INK} />
      {[a, b, c].map((col, i) => {
        const d = blob(r, between(r, 120, 280), between(r, 130, 370), between(r, 90, 150), 0.45, 6);
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={col} strokeOpacity={0.25} strokeWidth={26} strokeLinejoin="round" />
            <path d={d} fill="none" stroke={col} strokeWidth={8} strokeLinejoin="round" />
            <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} strokeLinejoin="round" />
          </g>
        );
      })}
    </>
  ),

  totem: ([wall, floor, s1, s2], r) => {
    const forms: ReactNode[] = [];
    let y = 400;
    const kinds = ["cube", "sphere", "cone", "cylinder"] as const;
    for (let i = 0; i < 4; i++) {
      const kind = kinds[Math.floor(r() * kinds.length)];
      const col = i % 2 === 0 ? s1 : s2;
      const w = between(r, 70, 120);
      const h = kind === "cone" ? w * 0.95 : kind === "sphere" ? w : w * 0.7;
      const top = y - h;
      const x = 200 + between(r, -14, 14);
      const common = { fill: col, stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const };
      if (kind === "cube") forms.push(<rect key={i} x={round(x - w / 2)} y={round(top)} width={round(w)} height={round(h)} {...common} />);
      if (kind === "sphere") forms.push(<circle key={i} cx={round(x)} cy={round(top + h / 2)} r={round(w / 2)} {...common} />);
      if (kind === "cone") forms.push(<path key={i} d={`M${round(x)} ${round(top)}L${round(x + w / 2)} ${round(y)}H${round(x - w / 2)}Z`} {...common} />);
      if (kind === "cylinder")
        forms.push(
          <g key={i}>
            <rect x={round(x - w / 2)} y={round(top + 8)} width={round(w)} height={round(h - 8)} {...common} />
            <ellipse cx={round(x)} cy={round(top + 8)} rx={round(w / 2)} ry={12} {...common} />
          </g>,
        );
      y = top + 4;
    }
    return (
      <>
        <rect width={W} height={H} fill={wall} />
        <rect y={400} width={W} height={100} fill={floor} />
        <rect x={120} y={400} width={160} height={70} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {forms}
      </>
    );
  },

  sunburst: ([a, b, c], r) => {
    const cx = round(between(r, 150, 250));
    const n = 22;
    const rays: ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI + (i / n) * Math.PI * 1;
      const a1 = Math.PI + ((i + 1) / n) * Math.PI * 1;
      const R = 900;
      rays.push(
        <path
          key={i}
          d={`M${cx} ${H}L${round(cx + Math.cos(a0) * R)} ${round(H + Math.sin(a0) * R)}L${round(cx + Math.cos(a1) * R)} ${round(H + Math.sin(a1) * R)}Z`}
          fill={i % 2 === 0 ? a : b}
        />,
      );
    }
    return (
      <>
        <rect width={W} height={H} fill={a} />
        {rays}
        <circle cx={cx} cy={H} r={round(between(r, 110, 150))} fill={c} stroke={INK} strokeWidth={8} />
      </>
    );
  },

  halftone: ([a, b], r) => {
    const fx = between(r, 80, 320);
    const fy = between(r, 100, 400);
    const dots: ReactNode[] = [];
    const step = 25;
    for (let x = step / 2; x < W; x += step) {
      for (let y = step / 2; y < H; y += step) {
        const dist = Math.hypot(x - fx, y - fy);
        const v = 0.5 + 0.5 * Math.cos(dist / 38);
        const rad = round(2 + v * 10);
        dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={rad} />);
      }
    }
    return (
      <>
        <rect width={W} height={H} fill={a} />
        <g fill={b}>{dots}</g>
      </>
    );
  },

  checkwarp: ([a, b, c, d], r) => {
    const size = 50;
    const checks: string[] = [];
    for (let row = 0; row < 10; row++) for (let col = 0; col < 8; col++) if ((row + col) % 2 === 0) checks.push(`M${col * size} ${row * size}h${size}v${size}h-${size}Z`);
    const ax = round(between(r, 90, 170));
    const aw = round(between(r, 150, 200));
    return (
      <>
        <rect width={W} height={H} fill={a} />
        <path d={checks.join("")} fill={b} />
        <path d={`M${ax} 470V${250}A${aw / 2} ${aw / 2} 0 0 1 ${ax + aw} 250V470Z`} fill={c} stroke={INK} strokeWidth={7} />
        <circle cx={round(between(r, 60, 340))} cy={round(between(r, 60, 150))} r={round(between(r, 34, 50))} fill={d} stroke={INK} strokeWidth={5} />
      </>
    );
  },

  waves: ([a, b, c, d], r) => {
    const cols = [b, c, d];
    const amp = between(r, 12, 22);
    return (
      <>
        <rect width={W} height={H} fill={a} />
        {Array.from({ length: 8 }, (_, i) => {
          const x = 25 + i * 50;
          let d0 = `M${x} -20q${round(amp)} 30 0 60`;
          for (let y = 40; y < H + 40; y += 60) d0 += "t0 60";
          return <path key={i} d={d0} fill="none" stroke={cols[i % 3]} strokeWidth={22} strokeLinecap="round" />;
        })}
      </>
    );
  },
};

interface ArtworkProps {
  work: Pick<Work, "id" | "template" | "palette" | "alt">;
  /** Zoom into a region [x, y, w, h] of the 400×500 canvas, for collage details. */
  crop?: readonly [number, number, number, number];
  /** Decorative uses (collage, thumbnails beside a visible title) hide the image from assistive tech. */
  decorative?: boolean;
  className?: string;
}

export default function Artwork({ work, crop, decorative, className }: ArtworkProps) {
  const colours = work.palette.map((p: PaletteName) => palette[p]);
  const viewBox = crop ? crop.join(" ") : `0 0 ${W} ${H}`;
  const a11y = decorative ? { "aria-hidden": true, focusable: false } : { role: "img", "aria-label": work.alt };
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className={className} {...a11y}>
      {templates[work.template](colours, rngFor(work.id))}
    </svg>
  );
}
