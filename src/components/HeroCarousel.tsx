"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/free_1000_rs_jewellery(compressed%20by%20quillbot.com).png",
  ];

const AUTOPLAY_MS = 3800;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      <div className="relative overflow-hidden bg-sage-50 shadow-sm ring-1 ring-black/5">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[8/12] w-full shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

      </div>

      {/* Slow-moving feature strip */}
      <div className="overflow-hidden bg-sage-500 py-2">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((label, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
                >
                  {label}
                  <span className="ml-6 text-white/70">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "Gold Plated",
  "Waterproof",
  "Lifetime Warranty",
  "Skin Safe",
  "Free Shipping",
  "24Hr Easy Returns",
];
