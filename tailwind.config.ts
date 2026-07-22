import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f3f6f1",
          100: "#e3ebde",
          200: "#c8d8bf",
          300: "#a6bd97",
          400: "#8aa67a",
          500: "#7c9885",
          600: "#1A3C2A",
          700: "#1A3C2A",
          800: "#1A3C2A",
          900: "#1A3C2A",
        },
        terracotta: {
          400: "#c8806a",
          500: "#b9694f",
          600: "#a3543b",
        },
        cream: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        serif: ["var(--font-nunito)", "system-ui", "sans-serif"],
        cinzel: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fill: {
          "0%": { width: "0%" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        confetti: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(360px) rotate(720deg)",
            opacity: "0",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wiggle: {
          "0%, 88%, 100%": { transform: "rotate(0deg)" },
          "90%": { transform: "rotate(-2deg)" },
          "92%": { transform: "rotate(2deg)" },
          "94%": { transform: "rotate(-1.5deg)" },
          "96%": { transform: "rotate(1.5deg)" },
          "98%": { transform: "rotate(-1deg)" },
        },
        burst: {
          "0%": {
            transform: "translate(0, 0) rotate(0deg) scale(1)",
            opacity: "1",
          },
          "70%": { opacity: "1" },
          "100%": {
            transform:
              "translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.7)",
            opacity: "0",
          },
        },
        "shine-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-20deg)", opacity: "0" },
          "20%": { opacity: "0.9" },
          "100%": { transform: "translateX(220%) skewX(-20deg)", opacity: "0" },
        },
        "reward-pop": {
          "0%": { transform: "scale(0.3) rotate(-6deg)", opacity: "0" },
          "55%": { transform: "scale(1.08) rotate(2deg)", opacity: "1" },
          "75%": { transform: "scale(0.97) rotate(-1deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "price-flash": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(212,175,55,0.7)" },
          "50%": { transform: "scale(1.06)", boxShadow: "0 0 0 6px rgba(212,175,55,0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(212,175,55,0)" },
        },
        "cta-glow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 6px 18px -4px rgba(26, 60, 42, 0.45), 0 0 0 0 rgba(26, 60, 42, 0.55)",
          },
          "50%": {
            transform: "scale(1.025)",
            boxShadow:
              "0 10px 24px -4px rgba(26, 60, 42, 0.6), 0 0 0 10px rgba(26, 60, 42, 0)",
          },
        },
      },
      animation: {
        pop: "pop 0.25s ease-out",
        fill: "fill 0.6s ease-out",
        "slide-in": "slide-in 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-out": "slide-out 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.25s ease-out",
        "fade-out": "fade-out 0.2s ease-in",
        confetti: "confetti 2.4s ease-in forwards",
        "cta-glow": "cta-glow 1.8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "marquee-fast": "marquee 5s linear infinite",
        "marquee-medium": "marquee 10s linear infinite",
        wiggle: "wiggle 4s ease-in-out infinite",
        burst: "burst 1.8s cubic-bezier(0.16, 0.84, 0.44, 1) forwards",
        "shine-sweep": "shine-sweep 1.6s ease-in-out",
        "reward-pop": "reward-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "price-flash": "price-flash 1.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
