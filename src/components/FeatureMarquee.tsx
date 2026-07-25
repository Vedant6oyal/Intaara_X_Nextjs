"use client";

const ICON_BASE =
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Icons";

const FEATURES = [
  { label: "Anti-Tarnish — Doesn't Turn Black", icon: `${ICON_BASE}/star.png` },
  { label: "Waterproof", icon: `${ICON_BASE}/waterproof_1.png` },
  { label: "Skin-Friendly", icon: `${ICON_BASE}/skin_friendly.png` },
  { label: "18k Gold Plated", icon: `${ICON_BASE}/gold_plated_icon.png` },
];

export default function FeatureMarquee() {
  return (
    <div className="overflow-hidden bg-sage-100 py-2">
      <div className="flex w-max animate-marquee-medium whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {FEATURES.map((item, i) => {
              return (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-sage-800"
                >
                  <img
                    src={item.icon}
                    alt=""
                    loading="lazy"
                    className="h-3.5 w-3.5 object-contain"
                  />
                  {item.label}
                  <span className="ml-4 text-sage-400">·</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
