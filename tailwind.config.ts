import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        ui: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Sleek surface colors
        surface: { 
          50: "hsl(217, 32%, 3%)", 
          100: "hsl(217, 30%, 5%)", 
          200: "hsl(217, 25%, 8%)" 
        },
        
        // Terminal-specific colors
        "terminal-bg": "hsl(var(--terminal-bg))",
        "terminal-card": "hsl(var(--terminal-card))",
        "terminal-border": "hsl(var(--terminal-border))",
        "terminal-glow": "hsl(var(--terminal-glow))",
        "gunmetal": "hsl(var(--gunmetal))",
        
        // Data visualization colors
        "data-positive": "hsl(var(--data-positive))",
        "data-negative": "hsl(var(--data-negative))",
        "data-neutral": "hsl(var(--data-neutral))",
        "data-warning": "hsl(var(--data-warning))",
        
        // Status colors
        success: "hsl(var(--terminal-success))",
        warning: "hsl(var(--terminal-warning))",
        error: "hsl(var(--terminal-danger))",
        info: "hsl(var(--terminal-info))",
        
        // Terminal status colors
        "terminal-success": "hsl(var(--terminal-success))",
        "terminal-warning": "hsl(var(--terminal-warning))",
        "terminal-danger": "hsl(var(--terminal-danger))",
        "terminal-info": "hsl(var(--terminal-info))",
        
        // Chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Luxury terminal colors
        ink: "#0a0f1a",
        glass: "rgba(255,255,255,0.04)",
        line: "rgba(255,255,255,0.12)",
        textDim: "rgba(255,255,255,0.7)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-terminal": "var(--gradient-terminal)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        'terminal': '0 0 20px hsl(var(--terminal-glow) / 0.2)',
        'glow': '0 0 40px hsl(var(--terminal-glow) / 0.4)',
        'card': '0 8px 30px rgba(0,0,0,0.35)',
        'sleek': '0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'rotate-slow': 'rotate-slow 100s linear infinite'
      },
      spacing: {
        '8': '8px',
        '16': '16px', 
        '24': '24px',
        '32': '32px'
      }
    }
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;