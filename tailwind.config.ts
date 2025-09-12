import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens (CSS variables defined below)
        app:        "rgb(var(--sc-bg) / <alpha-value>)",        // page background
        surface:    "rgb(var(--sc-surface) / <alpha-value>)",   // cards
        surface2:   "rgb(var(--sc-surface-2) / <alpha-value>)", // secondary cards/inputs
        border:     "rgb(var(--sc-border) / <alpha-value>)",
        text:       "rgb(var(--sc-text) / <alpha-value>)",
        muted:      "rgb(var(--sc-muted) / <alpha-value>)",
        accent:     "rgb(var(--sc-accent) / <alpha-value>)",    // orange accent
        info:       "rgb(var(--sc-info) / <alpha-value>)",      // cyan accent
        success:    "rgb(var(--sc-success) / <alpha-value>)",
        warning:    "rgb(var(--sc-warning) / <alpha-value>)",
        danger:     "rgb(var(--sc-danger) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [
    // Utility aliases so your team can use the same names everywhere
    function ({ addUtilities }) {
      addUtilities({
        ".bg-app":     { backgroundColor: "rgb(var(--sc-bg))" },
        ".bg-surface": { backgroundColor: "rgb(var(--sc-surface))" },
        ".bg-elev":    { backgroundColor: "rgb(var(--sc-surface-2))" },
        ".text-muted": { color: "rgb(var(--sc-muted))" },
        ".text-body":  { color: "rgb(var(--sc-text))" },
        ".border-default": { borderColor: "rgb(var(--sc-border))" },
      });
    },
  ],
};
export default config;