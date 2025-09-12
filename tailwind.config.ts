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
        // Terminal specific colors
        'terminal-bg': "hsl(var(--terminal-bg))",
        'terminal-card': "hsl(var(--terminal-card))",
        'terminal-border': "hsl(var(--terminal-border))",
        'terminal-glow': "hsl(var(--terminal-glow))",
        'gunmetal': "hsl(var(--gunmetal))",
        // Data display colors
        'data-positive': "hsl(var(--data-positive))",
        'data-negative': "hsl(var(--data-negative))",
        'data-neutral': "hsl(var(--data-neutral))",
        'data-warning': "hsl(var(--data-warning))",
        // Terminal status colors
        'terminal-success': "hsl(var(--terminal-success))",
        'terminal-warning': "hsl(var(--terminal-warning))",
        'terminal-danger': "hsl(var(--terminal-danger))",
        'terminal-info': "hsl(var(--terminal-info))",
        // Chart colors
        'chart-1': "hsl(var(--chart-1))",
        'chart-2': "hsl(var(--chart-2))",
        'chart-3': "hsl(var(--chart-3))",
        'chart-4': "hsl(var(--chart-4))",
        'chart-5': "hsl(var(--chart-5))",
        // Sidebar colors
        'sidebar-background': "hsl(var(--sidebar-background))",
        'sidebar-foreground': "hsl(var(--sidebar-foreground))",
        'sidebar-primary': "hsl(var(--sidebar-primary))",
        'sidebar-primary-foreground': "hsl(var(--sidebar-primary-foreground))",
        'sidebar-accent': "hsl(var(--sidebar-accent))",
        'sidebar-accent-foreground': "hsl(var(--sidebar-accent-foreground))",
        'sidebar-border': "hsl(var(--sidebar-border))",
        'sidebar-ring': "hsl(var(--sidebar-ring))",
        // Additional required colors
        'foreground': "hsl(var(--foreground))",
        'background': "hsl(var(--background))",
        'card': "hsl(var(--card))",
        'card-foreground': "hsl(var(--card-foreground))",
        'popover': "hsl(var(--popover))",
        'popover-foreground': "hsl(var(--popover-foreground))",
        'primary': "hsl(var(--primary))",
        'primary-foreground': "hsl(var(--primary-foreground))",
        'secondary': "hsl(var(--secondary))",
        'secondary-foreground': "hsl(var(--secondary-foreground))",
        'muted': "hsl(var(--muted))",
        'muted-foreground': "hsl(var(--muted-foreground))",
        'accent': "hsl(var(--accent))",
        'accent-foreground': "hsl(var(--accent-foreground))",
        'destructive': "hsl(var(--destructive))",
        'destructive-foreground': "hsl(var(--destructive-foreground))",
        'border': "hsl(var(--border))",
        'input': "hsl(var(--input))",
        'ring': "hsl(var(--ring))",
        // Status colors
        'error': "hsl(var(--destructive))",
        'success': "hsl(var(--terminal-success))",
        'warning': "hsl(var(--terminal-warning))",
        'info': "hsl(var(--terminal-info))",
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