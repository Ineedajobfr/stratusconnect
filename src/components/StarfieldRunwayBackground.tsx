import React, { useEffect, useRef } from "react";

type Props = {
  /** 0.0 to 1.0. Default 0.6 */
  intensity?: number;
  /** lower for fewer particles on low end devices */
  starCount?: number;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function StarfieldRunwayBackground({
  intensity = 0.6,
  starCount = 240,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let running = true;

    // Scene params
    const MAX_Z = 1;
    const MIN_Z = 0.1;
    const STAR_BASE_SPEED = 0.002; // base per frame
    const RUNWAY_SPEED = 0.012;
    const runwayWidthFactor = 0.42; // relative to half width
    const centerlineSpacing = 120; // px in screen space for light gaps
    const glow = 0.6; // light glow strength

    let scrollParallax = 0;

    type Star = { x: number; y: number; z: number; speed: number; size: number; };
    const stars: Star[] = [];

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: (Math.random() * 2 - 1),         // -1..1
          y: (Math.random() * 2 - 1),         // -1..1
          z: Math.random() * (MAX_Z - MIN_Z) + MIN_Z,
          speed: STAR_BASE_SPEED * (0.5 + Math.random()),
          size: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function project(x: number, y: number, z: number) {
      // simple perspective toward center of screen
      const f = 1 / z;
      const sx = (x * f) * (width * 0.5) + width * 0.5;
      const sy = (y * f) * (height * 0.5) + height * 0.5;
      return { sx, sy };
    }

    function drawStars(dt: number, speedBoost: number) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (const s of stars) {
        // advance toward viewer
        s.z -= (s.speed + speedBoost) * dt;
        if (s.z < MIN_Z) {
          s.x = (Math.random() * 2 - 1);
          s.y = (Math.random() * 2 - 1);
          s.z = MAX_Z;
        }
        const { sx, sy } = project(s.x, s.y, s.z);
        // skip if off screen
        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;
        const r = s.size * (1.6 - s.z); // subtle size change with depth
        ctx.globalAlpha = 0.6 * (1.2 - s.z);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // runway state
    const runwayOffset = 0;

    function drawBackground(dt: number, speedBoost: number) {
      // clear
      ctx.clearRect(0, 0, width, height);

      // subtle background vignette only
      const cx = width * 0.5;
      const cy = height * 0.5;
      const g = ctx.createRadialGradient(cx, cy, Math.min(width, height) * 0.1, cx, cy, Math.max(width, height));
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.3)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    function loop(prevTime: number) {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min(32, now - prevTime); // clamp delta for stability

      // parallax factor from scroll, eased
      const sp = Math.min(1.5, Math.max(0, scrollParallax));
      const speedBoost = intensity * sp * 0.002;

      // draw layers
      drawBackground(dt, 0); // Simple background
      if (!prefersReducedMotion()) drawStars(dt, speedBoost);

      rafRef.current = requestAnimationFrame(() => loop(now));
    }

    function onScroll() {
      const y = window.scrollY || 0;
      // turn scroll distance into a 0..1.5 speed factor
      scrollParallax = Math.min(1.5, y / 600);
    }

    function onVisibility() {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => loop(performance.now()));
      }
    }

    resize();
    seedStars();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    rafRef.current = requestAnimationFrame((t) => loop(t));

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 block w-full h-full"
      aria-hidden="true"
    />
  );
}

// Terminal style headline with blinking cursor, no external CSS needed
export function TerminalHeadline({ text }: { text: string }) {
  const [on, setOn] = React.useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 520);
    return () => clearInterval(id);
  }, []);
  return (
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
      {text}
      <span aria-hidden="true" className="ml-1 align-baseline">
        {on ? "▍" : " "}
      </span>
    </h1>
  );
}

export default StarfieldRunwayBackground;
