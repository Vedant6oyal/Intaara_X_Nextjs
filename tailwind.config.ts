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
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        cinzel: ["var(--font-cinzel)", "Georgia", "serif"],
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
      },
    },
  },
  plugins: [],
};

export default config;
