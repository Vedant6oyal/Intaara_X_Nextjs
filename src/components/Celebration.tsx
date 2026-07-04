"use client";

import { useMemo } from "react";

const COLORS = [
  "#d4af37", // gold
  "#f5d76e", // light gold
  "#e8b923", // amber
  "#b9694f", // terracotta
  "#e8836a", // light terracotta
  "#1A3C2A", // forest green
  "#7c9885", // sage
  "#ffffff", // white
];

type Piece = {
  originX: number; // vw
  originY: number; // vh
  tx: number; // px translation (final)
  ty: number; // px translation (final)
  rot: number; // deg
  color: string;
  size: number; // px
  shape: "square" | "circle" | "ribbon";
  delay: number; // s
  duration: number; // s
};

/**
 * Cannon-style celebration: two bursts from the bottom corners plus a top
 * shower. Uses CSS custom properties (--tx/--ty/--rot) with a single `burst`
 * keyframe so every piece flies to its own target position.
 */
export default function Celebration({ show }: { show: boolean }) {
  // Deterministic per-mount so re-renders don't reshuffle mid-animation.
  const pieces = useMemo<Piece[]>(() => {
    const list: Piece[] = [];
    const rand = mulberry32(1234);
    const shapes: Piece["shape"][] = ["square", "circle", "ribbon"];

    // Two cannon bursts from bottom-left and bottom-right corners.
    const cannons = [
      { x: 8, y: 95, angleMin: -75, angleMax: -30 }, // bottom-left → up-right
      { x: 92, y: 95, angleMin: -150, angleMax: -105 }, // bottom-right → up-left
    ];

    cannons.forEach((c) => {
      for (let i = 0; i < 45; i++) {
        const angleDeg =
          c.angleMin + rand() * (c.angleMax - c.angleMin);
        const angle = (angleDeg * Math.PI) / 180;
        const power = 260 + rand() * 340; // travel distance
        list.push({
          originX: c.x,
          originY: c.y,
          tx: Math.cos(angle) * power,
          ty: Math.sin(angle) * power + 240, // gravity pulls down
          rot: (rand() - 0.5) * 900,
          color: COLORS[Math.floor(rand() * COLORS.length)],
          size: 6 + rand() * 8,
          shape: shapes[Math.floor(rand() * shapes.length)],
          delay: rand() * 0.15,
          duration: 1.6 + rand() * 0.9,
        });
      }
    });

    // Top shower for lingering fall.
    for (let i = 0; i < 30; i++) {
      list.push({
        originX: rand() * 100,
        originY: -5,
        tx: (rand() - 0.5) * 120,
        ty: 700 + rand() * 200,
        rot: (rand() - 0.5) * 720,
        color: COLORS[Math.floor(rand() * COLORS.length)],
        size: 6 + rand() * 8,
        shape: shapes[Math.floor(rand() * shapes.length)],
        delay: 0.2 + rand() * 0.8,
        duration: 2.2 + rand() * 1.4,
      });
    }

    return list;
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => {
        const isCircle = p.shape === "circle";
        const isRibbon = p.shape === "ribbon";
        return (
          <span
            key={i}
            aria-hidden
            className="absolute block animate-burst"
            style={
              {
                left: `${p.originX}%`,
                top: `${p.originY}%`,
                width: isRibbon ? p.size * 0.4 : p.size,
                height: isRibbon ? p.size * 1.6 : p.size,
                backgroundColor: p.color,
                borderRadius: isCircle ? "50%" : isRibbon ? "2px" : "1px",
                boxShadow: `0 0 6px ${p.color}55`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                "--rot": `${p.rot}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/** Small deterministic PRNG so confetti layout is stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
