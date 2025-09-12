import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        app:      "rgb(var(--sc-bg) / <alpha-value>)",        // page
        surface:  "rgb(var(--sc-surface) / <alpha-value>)",   // cards
        elev:     "rgb(var(--sc-elev) / <alpha-value>)",      // raised cards, inputs
        border:   "rgb(var(--sc-border) / <alpha-value>)",
        text:     "rgb(var(--sc-text) / <alpha-value>)",      // near-white
        muted:    "rgb(var(--sc-muted) / <alpha-value>)",
        accent:   "rgb(var(--sc-accent) / <alpha-value>)",    // Stratus orange
        info:     "rgb(var(--sc-info) / <alpha-value>)",      // cyan
        success:  "rgb(var(--sc-success) / <alpha-value>)",
        warn:     "rgb(var(--sc-warn) / <alpha-value>)",
        danger:   "rgb(var(--sc-danger) / <alpha-value>)",
      },
      boxShadow: { card: "0 10px 30px rgba(0,0,0,0.35)" },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".bg-app":     { backgroundColor: "rgb(var(--sc-bg))" },
        ".bg-surface": { backgroundColor: "rgb(var(--sc-surface))" },
        ".bg-elev":    { backgroundColor: "rgb(var(--sc-elev))" },
        ".text-body":  { color: "rgb(var(--sc-text))" },
        ".text-muted": { color: "rgb(var(--sc-muted))" },
        ".border-default": { borderColor: "rgb(var(--sc-border))" },
      });
    },
  ],
};
export default config;