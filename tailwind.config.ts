import type { Config } from "tailwindcss";

export default {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--muted)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          600: "var(--brand-600)",
          300: "var(--brand-300)",
        },
        fire: {
          DEFAULT: "var(--fire)",
          600: "var(--fire-600)",
          300: "var(--fire-300)",
        },
        success: "var(--success)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(11,107,255,0.25), 0 8px 30px rgba(11,107,255,0.12)",
        card: "0 8px 40px rgba(0,0,0,0.45)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
} satisfies Config;