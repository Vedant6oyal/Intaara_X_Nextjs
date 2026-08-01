"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDES = [
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/New_Hero_Carousel_1.png",
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Hareo_Carousel_2_alt.png",
  "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Hero_Carousel_3_alt_new.png"  
];

const AUTOPLAY_MS = 3800;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

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
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) {
            setIndex((i) => (i + 1) % SLIDES.length);
          } else {
            setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
          }
          touchStartX.current = null;
        }}
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
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
