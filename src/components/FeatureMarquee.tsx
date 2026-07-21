"use client";

import { Droplets, ShieldCheck, Sparkles, Waves } from "lucide-react";

const FEATURES = [
  { label: "Lightweight & Comfortable", icon: Sparkles },
  { label: "Anti-Tarnish — Doesn't Turn Black", icon: ShieldCheck },
  { label: "Waterproof", icon: Waves },
  { label: "Skin-Safe", icon: ShieldCheck },
  { label: "18k Gold Plated", icon: Sparkles },
];

export default function FeatureMarquee() {
  return (
    <div className="overflow-hidden bg-sage-700 py-2">
      <div className="flex w-max animate-marquee-medium whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-1.5 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
                >
                  <Icon size={12} />
                  {item.label}
                  <span className="ml-4 text-white/60">·</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
