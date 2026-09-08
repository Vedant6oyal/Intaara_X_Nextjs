"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export type Reel = {
  id: string;
  src: string;
  poster?: string;
  creator: string;
  handle?: string;
};

const DEFAULT_REELS: Reel[] = [
  {
    id: "reel-1",
    src: "https://cdn.shopify.com/videos/c/o/v/1e910c6eefd84c1ca8a46806cb66e319.mp4",
    poster: "https://cdn.shopify.com/files/./YOUR_POSTER_0.jpg",
    creator: "Intaara",
    handle: "@intaara.in",
  },
  {
    id: "reel-2",
    src: "https://cdn.shopify.com/videos/c/o/v/b6b341ee564d4f70b1e4971dfeb9289d.mp4",
    poster: "https://cdn.shopify.com/files/./YOUR_POSTER_2.jpg",
    creator: "Intaara",
    handle: "@intaara.in",
  },
  {
    id: "reel-3",
    src: "https://cdn.shopify.com/videos/c/o/v/d86b8300cf2140cda1d44ff53c92167b.mp4",
    poster: "https://cdn.shopify.com/files/./YOUR_POSTER_3.jpg",
    creator: "Intaara",
    handle: "@intaara.in",
  },
  {
    id: "reel-4",
    src: "https://cdn.shopify.com/videos/c/o/v/3fa215f028154a128a756c30feeeafe3.mp4",
    poster: "https://cdn.shopify.com/files/./YOUR_POSTER_4.jpg",
    creator: "Intaara",
    handle: "@intaara.in",
  },
  {
    id: "reel-5",
    src: "https://cdn.shopify.com/videos/c/o/v/c75d4300b253447191b8b4837920a7f0.mp4",
    poster: "https://cdn.shopify.com/files/./YOUR_POSTER_5.jpg",
    creator: "Intaara",
    handle: "@intaara.in",
  },
];

function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          video.load();
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative h-[420px] w-[234px] shrink-0 snap-center overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="none"
        onClick={toggleMute}
        className="h-full w-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      {/* Handle overlay */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <p className="text-xs font-medium text-white/80">{reel.handle}</p>
      </div>
      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}

export default function ReelsSection({ reels = DEFAULT_REELS }: { reels?: Reel[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-bold text-gray-800">
          From Our Instagram
        </h2>
        <a
          href="https://instagram.com/intaara.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-terracotta-500"
        >
          Follow @intaara.in
        </a>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  );
}
