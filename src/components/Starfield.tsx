import { useEffect, useRef } from "react";

export default function Starfield({
  density = 0.00012,
  speed = 0.15,
}: { density?: number; speed?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);
    let raf = 0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = Math.max(120, Math.floor(w * h * density));
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.2,
      s: Math.random() * speed + speed * 0.3,
      a: Math.random() * 0.35 + 0.25,
    }));

    const onResize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / w - 0.5) * 0.6;
      my = (e.clientY / h - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouse);

    function frame() {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#0a0f1a";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#fff";
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x + mx, s.y + my, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduce) {
          s.y += s.s;
          if (s.y > h) { s.y = -2; s.x = Math.random() * w; }
        }
      }
      ctx.globalAlpha = 1;

      const grd = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.25, w/2, h/2, Math.max(w,h)*0.65);
      grd.addColorStop(0, "rgba(0,0,0,0)");
      grd.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [density, speed]);

  return <canvas ref={ref} className="fixed inset-0 -z-50 block" />;
}
