export default {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors:{
        bg:"var(--bg)",
        surface:{1:"var(--surface-1)",2:"var(--surface-2)"},
        text:{DEFAULT:"var(--text)",muted:"var(--muted)"},
        brand:{DEFAULT:"var(--brand)",600:"var(--brand-600)",300:"var(--brand-300)"},
        fire:{DEFAULT:"var(--fire)",600:"var(--fire-600)",300:"var(--fire-300)"},
        success:"var(--success)",
        orange:{500:"#FF7A1A"},
        teal:{500:"#14B8A6"},
        purple:{500:"#8B5CF6"}
      }
    }
  },
  plugins:[]
}