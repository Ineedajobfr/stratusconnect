import React from "react";

/**
 * ModernPlasmaBackground
 * Fullscreen animated gradient background with blue and orange accents,
 * subtle vignette and film-grain. Drop your page content as children.
 *
 * Works with Tailwind out of the box.
 */
export default function ModernPlasmaBackground({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Base gradient field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `
            radial-gradient(60% 60% at 15% 20%, rgba(0, 119, 255, 0.28) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(55% 55% at 85% 75%, rgba(255, 128, 0, 0.20) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(120% 120% at 50% 100%, rgba(0, 40, 80, 0.45) 0%, rgba(0,0,0,0.05) 60%),
            radial-gradient(120% 120% at 50% -10%, rgba(0, 0, 0, 0.90) 0%, rgba(0, 0, 0, 0.95) 50%)
          `,
        }}
      />

      {/* Animated blue blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/3 -top-1/4 h-[70vmax] w-[70vmax] rounded-full blur-[70px] opacity-60 animate-plasma-slow"
        style={{
          background:
            "radial-gradient(35% 35% at 50% 50%, rgba(0, 120, 255, 0.35) 0%, rgba(0, 80, 200, 0.15) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Animated orange blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-[-20vmax] h-[60vmax] w-[60vmax] rounded-full blur-[80px] opacity-55 animate-plasma"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(255, 120, 0, 0.28) 0%, rgba(160, 70, 0, 0.10) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Subtle conic sheen for modern depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light animate-drift-slow"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.06), rgba(0,0,0,0.0), rgba(255,255,255,0.03), rgba(0,0,0,0.0))",
        }}
      />

      {/* Vignette to frame content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Film grain overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay"
      >
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
