"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/hero_carousel(compressed%20by%20quillbot.com).png",
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/hero_Image_2(compressed%20by%20quillbot.com).png"
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
      <div
        className="relative cursor-pointer overflow-hidden bg-sage-50 shadow-sm ring-1 ring-black/5"
        onClick={() => {
          const el = document.getElementById("pick-gifts");
          if (!el) return;
          const start = window.scrollY;
          const end = el.getBoundingClientRect().top + window.scrollY - 10;
          const duration = 600;
          const startTime = performance.now();
          const easeInOut = (t: number) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const step = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, start + (end - start) * easeInOut(t));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }}
      >
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
    </section>
  );
}
