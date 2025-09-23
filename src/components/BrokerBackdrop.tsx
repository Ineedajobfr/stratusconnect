export default function BrokerBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* colour fields */}
      <div aria-hidden className="absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 60% at 15% 20%, rgba(11,107,255,0.28) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(55% 55% at 85% 75%, rgba(255,122,26,0.18) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(120% 120% at 50% 100%, rgba(10,30,58,0.45) 0%, rgba(0,0,0,0.05) 60%)
          `
        }}
      />
      {/* vignette */}
      <div aria-hidden className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}