import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()',
      
      // Enhanced Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lovable.dev https://lovable-api.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "media-src 'self' data: https: blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "frame-src 'self' https://lovable.dev",
        "connect-src 'self' https://*.supabase.co https://lovable-api.com https://lovable.dev wss://*.lovableproject.com",
        "worker-src 'self' blob:",
        "child-src 'self' blob:",
        "manifest-src 'self'",
        "prefetch-src 'self'"
      ].join('; ')
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  define: {
    global: 'globalThis',
    'process.env': 'import.meta.env',
    'process': JSON.stringify({
      env: process.env
    }),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://pvgqfqkrtflpvajhddhr.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Z3FmcWtydGZscHZhamhkZGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODgyMTcsImV4cCI6MjA2OTM2NDIxN30.JOWISYqrExW1kNQY3huEGzeqU_OCriMIb2UsW001Afc'),
    'import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Z3FmcWtydGZscHZhamhkZGhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc4ODIxNywiZXhwIjoyMDY5MzY0MjE3fQ.UoKnIPZ8gfnoc8S1QovaMt8oYoKsE0wWgaVAi2VGEJU'),
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY || ''),
    'import.meta.env.VITE_OPENAI_BASE_URL': JSON.stringify(process.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1'),
    'import.meta.env.VITE_OPENAI_MODEL': JSON.stringify(process.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs']
        }
      }
    }
  }
}));
