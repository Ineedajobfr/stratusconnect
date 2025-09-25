import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        app:      "hsl(var(--terminal-bg) / <alpha-value>)",
        surface:  "hsl(var(--terminal-card) / <alpha-value>)",
        elev:     "hsl(var(--secondary) / <alpha-value>)",
        border:   "hsl(var(--terminal-border) / <alpha-value>)",
        text:     "hsl(var(--foreground) / <alpha-value>)",
        muted:    "hsl(var(--muted-foreground) / <alpha-value>)",
        accent:   "hsl(var(--accent) / <alpha-value>)",
        info:     "hsl(var(--terminal-info) / <alpha-value>)",
        success:  "hsl(var(--terminal-success) / <alpha-value>)",
        warn:     "hsl(var(--terminal-warning) / <alpha-value>)",
        danger:   "hsl(var(--terminal-danger) / <alpha-value>)",
        // Additional required colors
        'foreground': "hsl(var(--foreground) / <alpha-value>)",
        'background': "hsl(var(--background) / <alpha-value>)",
        'card': "hsl(var(--card) / <alpha-value>)",
        'card-foreground': "hsl(var(--card-foreground) / <alpha-value>)",
        'popover': "hsl(var(--popover) / <alpha-value>)",
        'popover-foreground': "hsl(var(--popover-foreground) / <alpha-value>)",
        'primary': "hsl(var(--primary) / <alpha-value>)",
        'primary-foreground': "hsl(var(--primary-foreground) / <alpha-value>)",
        'secondary': "hsl(var(--secondary) / <alpha-value>)",
        'secondary-foreground': "hsl(var(--secondary-foreground) / <alpha-value>)",
        'muted': "hsl(var(--muted) / <alpha-value>)",
        'muted-foreground': "hsl(var(--muted-foreground) / <alpha-value>)",
        'accent': "hsl(var(--accent) / <alpha-value>)",
        'accent-foreground': "hsl(var(--accent-foreground) / <alpha-value>)",
        'destructive': "hsl(var(--destructive) / <alpha-value>)",
        'destructive-foreground': "hsl(var(--destructive-foreground) / <alpha-value>)",
        'border': "hsl(var(--border) / <alpha-value>)",
        'input': "hsl(var(--input) / <alpha-value>)",
        'ring': "hsl(var(--ring) / <alpha-value>)",
        // Terminal specific colors
        'terminal-bg': "hsl(var(--terminal-bg) / <alpha-value>)",
        'terminal-card': "hsl(var(--terminal-card) / <alpha-value>)",
        'terminal-border': "hsl(var(--terminal-border) / <alpha-value>)",
        'terminal-glow': "hsl(var(--terminal-glow) / <alpha-value>)",
        'gunmetal': "hsl(var(--gunmetal) / <alpha-value>)",
        // Data display colors
        'data-positive': "hsl(var(--data-positive) / <alpha-value>)",
        'data-negative': "hsl(var(--data-negative) / <alpha-value>)",
        'data-neutral': "hsl(var(--data-neutral) / <alpha-value>)",
        'data-warning': "hsl(var(--data-warning) / <alpha-value>)",
        // Terminal status colors
        'terminal-success': "hsl(var(--terminal-success) / <alpha-value>)",
        'terminal-warning': "hsl(var(--terminal-warning) / <alpha-value>)",
        'terminal-danger': "hsl(var(--terminal-danger) / <alpha-value>)",
        'terminal-info': "hsl(var(--terminal-info) / <alpha-value>)",
        // Chart colors
        'chart-1': "hsl(var(--chart-1) / <alpha-value>)",
        'chart-2': "hsl(var(--chart-2) / <alpha-value>)",
        'chart-3': "hsl(var(--chart-3) / <alpha-value>)",
        'chart-4': "hsl(var(--chart-4) / <alpha-value>)",
        'chart-5': "hsl(var(--chart-5) / <alpha-value>)",
      },
      boxShadow: { card: "0 12px 28px rgba(0,0,0,.35)" },
      borderRadius: { xl2: "1rem" },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".bg-app":     { backgroundColor: "hsl(var(--terminal-bg))" },
        ".bg-surface": { backgroundColor: "hsl(var(--terminal-card))" },
        ".bg-elev":    { backgroundColor: "hsl(var(--secondary))" },
        ".text-body":  { color: "hsl(var(--foreground))" },
        ".text-muted": { color: "hsl(var(--muted-foreground))" },
        ".border-default": { borderColor: "hsl(var(--terminal-border))" },
      });
    },
  ],
};
export default config;