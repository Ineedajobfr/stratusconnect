import { useEffect, useRef } from "react";

/**
 * Stratus Night Flight Background + HUD
 * Cinematic background that feels like looking out of an aircraft at night.
 * Layers:
 *  - Deep sky gradient with horizon glow
 *  - Starfield drifting forward with parallax
 *  - High-altitude cloud haze
 *  - HUD: horizon line, concentric radar arcs, rotating sweep
 *  - HUD: heading tape at top, altitude ladder at right
 *
 * Framework: React + Tailwind. No external libraries.
 */

export default function StratusNightFlightBackground() {
  return <StratusNightFlightBackgroundHUD />;
}

export function StratusNightFlightBackgroundHUD() {
  const skyRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sky = skyRef.current!;
    const stars = starsRef.current!;
    const clouds = cloudsRef.current!;
    const hud = hudRef.current!;

    const sCtx = sky.getContext("2d")!;
    const stCtx = stars.getContext("2d")!;
    const cCtx = clouds.getContext("2d")!;
    const hCtx = hud.getContext("2d")!;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      [sky, stars, clouds, hud].forEach((cv) => {
        cv.style.width = w + "px";
        cv.style.height = h + "px";
        cv.width = Math.floor(w * dpr);
        cv.height = Math.floor(h * dpr);
        cv.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      drawSky();
      seedStars();
      seedClouds();
      drawHUDStatic();
    }

    // SKY
    function drawSky() {
      const w = sky.width / (window.devicePixelRatio || 1);
      const h = sky.height / (window.devicePixelRatio || 1);
      const g = sCtx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#04060a");
      g.addColorStop(0.7, "#080c14");
      g.addColorStop(1, "#0d141e");
      sCtx.fillStyle = g;
      sCtx.fillRect(0, 0, w, h);

      const hg = sCtx.createRadialGradient(w * 0.5, h * 1.05, 2, w * 0.5, h * 1.05, h * 0.35);
      hg.addColorStop(0, "rgba(90,130,240,0.18)");
      hg.addColorStop(1, "rgba(10,15,25,0)");
      sCtx.fillStyle = hg;
      sCtx.fillRect(0, 0, w, h);
    }

    // STARS
    type Star = { x: number; y: number; z: number; size: number; tw: number };
    let starsArr: Star[] = [];
    function seedStars() {
      const w = stars.width / (window.devicePixelRatio || 1);
      const h = stars.height / (window.devicePixelRatio || 1);
      const count = Math.min(260, Math.floor((w * h) / 14000));
      starsArr = [];
      for (let i = 0; i < count; i++) {
        starsArr.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.8,
          z: Math.random() * 0.9 + 0.1,
          size: Math.random() * 1.4 + 0.3,
          tw: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawStars(t: number) {
      const w = stars.width / (window.devicePixelRatio || 1);
      const h = stars.height / (window.devicePixelRatio || 1);
      stCtx.clearRect(0, 0, w, h);
      for (const s of starsArr) {
        const twinkle = 0.65 + 0.35 * Math.sin(s.tw + t * 0.0015 + s.z * 3);
        const px = (s.x - 0.02 * t * (0.5 + s.z)) % w;
        const py = (s.y + 0.01 * t * (0.5 + s.z)) % h;
        stCtx.globalAlpha = Math.min(1, 0.25 + 0.75 * twinkle * s.z);
        stCtx.fillStyle = "#ffffff";
        stCtx.beginPath();
        stCtx.arc(px < 0 ? px + w : px, py < 0 ? py + h : py, s.size * (0.7 + s.z * 0.6), 0, Math.PI * 2);
        stCtx.fill();
      }
    }

    // CLOUDS
    let cloudTex: HTMLCanvasElement | null = null;
    function seedClouds() {
      const size = 256;
      cloudTex = document.createElement("canvas");
      cloudTex.width = cloudTex.height = size;
      const ctx = cloudTex.getContext("2d")!;
      const img = ctx.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.floor(Math.random() * 180);
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = Math.floor(30 + Math.random() * 40);
      }
      ctx.putImageData(img, 0, 0);
    }

    function drawClouds(t: number) {
      const w = clouds.width / (window.devicePixelRatio || 1);
      const h = clouds.height / (window.devicePixelRatio || 1);
      cCtx.clearRect(0, 0, w, h);
      if (!cloudTex) return;
      const speed = t * 0.00005;
      const x = -((speed * w) % 256);
      cCtx.globalAlpha = 0.15;
      for (let i = -1; i < Math.ceil(w / 256) + 1; i++) {
        for (let j = -1; j < Math.ceil(h / 256) + 1; j++) {
          cCtx.drawImage(cloudTex, x + i * 256, j * 256 + h * 0.4);
        }
      }
      cCtx.globalAlpha = 1;
    }

    // HUD STATIC
    function drawHUDStatic() {
      const w = hud.width / (window.devicePixelRatio || 1);
      const h = hud.height / (window.devicePixelRatio || 1);
      hCtx.clearRect(0, 0, w, h);
      hCtx.save();
      hCtx.strokeStyle = "rgba(160,200,255,0.08)";
      hCtx.lineWidth = 1;

      // Horizon line
      hCtx.beginPath();
      hCtx.moveTo(0, h * 0.78);
      hCtx.lineTo(w, h * 0.78);
      hCtx.stroke();

      // Vertical centre
      hCtx.beginPath();
      hCtx.moveTo(w * 0.5, h * 0.1);
      hCtx.lineTo(w * 0.5, h * 0.95);
      hCtx.stroke();

      // Concentric radar arcs
      const cx = w * 0.5;
      const cy = h * 0.78;
      const radii = [h * 0.12, h * 0.18, h * 0.24];
      for (const r of radii) {
        hCtx.beginPath();
        hCtx.arc(cx, cy, r, Math.PI, Math.PI * 2);
        hCtx.stroke();
      }

      // Tick marks along inner arc
      const ticks = 17;
      for (let i = 0; i < ticks; i++) {
        const a = Math.PI + (i / (ticks - 1)) * Math.PI;
        const rIn = radii[0] * 0.98;
        const rOut = radii[0] * 1.02;
        const x1 = cx + Math.cos(a) * rIn;
        const y1 = cy + Math.sin(a) * rIn;
        const x2 = cx + Math.cos(a) * rOut;
        const y2 = cy + Math.sin(a) * rOut;
        hCtx.beginPath();
        hCtx.moveTo(x1, y1);
        hCtx.lineTo(x2, y2);
        hCtx.stroke();
      }
      hCtx.restore();
    }

    // HUD SWEEP
    function drawHUDSweep(t: number) {
      const w = hud.width / (window.devicePixelRatio || 1);
      const h = hud.height / (window.devicePixelRatio || 1);
      const cx = w * 0.5;
      const cy = h * 0.78;

      drawHUDStatic(); // redraw faint static

      const base = (t * 0.00015) % 1; // 0..1
      const startA = (200 * Math.PI) / 180 + base * 0.2;
      const endA = (340 * Math.PI) / 180 + base * 0.2;

      const grad = hCtx.createRadialGradient(cx, cy, h * 0.1, cx, cy, h * 0.28);
      grad.addColorStop(0, "rgba(140,190,255,0.00)");
      grad.addColorStop(1, "rgba(140,190,255,0.10)");

      hCtx.save();
      hCtx.globalCompositeOperation = "lighter";
      hCtx.fillStyle = grad;
      hCtx.beginPath();
      hCtx.moveTo(cx, cy);
      hCtx.arc(cx, cy, h * 0.28, startA, endA, false);
      hCtx.closePath();
      hCtx.fill();

      // Leading edge
      hCtx.strokeStyle = "rgba(180,220,255,0.25)";
      hCtx.lineWidth = 1.25;
      hCtx.beginPath();
      hCtx.arc(cx, cy, h * 0.28, endA, endA + 0.001);
      hCtx.stroke();
      hCtx.restore();

      drawHeadingTape(t);
      drawAltitudeLadder(t);
    }

    // HEADING TAPE (top)
    function drawHeadingTape(t: number) {
      const w = hud.width / (window.devicePixelRatio || 1);
      const h = hud.height / (window.devicePixelRatio || 1);
      const y = h * 0.12;
      const tapeWidth = w * 0.7;
      const x0 = (w - tapeWidth) / 2;

      // background glow
      hCtx.save();
      const bg = hCtx.createLinearGradient(x0, y - 18, x0, y + 18);
      bg.addColorStop(0, "rgba(10,20,35,0)");
      bg.addColorStop(0.5, "rgba(20,40,70,0.25)");
      bg.addColorStop(1, "rgba(10,20,35,0)");
      hCtx.fillStyle = bg;
      hCtx.fillRect(x0, y - 18, tapeWidth, 36);

      // scrolling degrees 0..359, slow drift
      const degPerPx = 2.5;
      const drift = (t * 0.02) % (360 * degPerPx);

      for (let px = 0; px <= tapeWidth; px += 10) {
        const deg = Math.floor(((px + drift) / degPerPx) % 360);
        const x = x0 + px;
        const tall = deg % 10 === 0;
        hCtx.strokeStyle = "rgba(160,200,255,0.35)";
        hCtx.lineWidth = 1;
        hCtx.beginPath();
        hCtx.moveTo(x, y - (tall ? 10 : 6));
        hCtx.lineTo(x, y + (tall ? 10 : 6));
        hCtx.stroke();
        if (tall) {
          hCtx.fillStyle = "rgba(200,230,255,0.7)";
          const label = deg === 0 ? "360" : String(deg);
          hCtx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
          hCtx.textAlign = "center";
          hCtx.fillText(label, x, y - 14);
        }
      }
      // centre caret
      hCtx.strokeStyle = "rgba(220,245,255,0.8)";
      hCtx.beginPath();
      hCtx.moveTo(w / 2 - 6, y + 14);
      hCtx.lineTo(w / 2, y + 2);
      hCtx.lineTo(w / 2 + 6, y + 14);
      hCtx.stroke();
      hCtx.restore();
    }

    // ALTITUDE LADDER (right)
    function drawAltitudeLadder(t: number) {
      const w = hud.width / (window.devicePixelRatio || 1);
      const h = hud.height / (window.devicePixelRatio || 1);
      const x = w * 0.86;
      const ladderH = h * 0.5;
      const y0 = h * 0.3;

      // background glow
      hCtx.save();
      const bg = hCtx.createLinearGradient(x - 36, y0, x + 36, y0);
      bg.addColorStop(0, "rgba(10,20,35,0)");
      bg.addColorStop(0.5, "rgba(20,40,70,0.25)");
      bg.addColorStop(1, "rgba(10,20,35,0)");
      hCtx.fillStyle = bg;
      hCtx.fillRect(x - 36, y0, 72, ladderH);

      // slow oscillation to imply flight
      const offset = Math.sin(t * 0.0006) * 20;

      for (let i = -5; i <= 5; i++) {
        const y = y0 + ladderH / 2 + i * 36 + offset;
        hCtx.strokeStyle = "rgba(160,200,255,0.35)";
        hCtx.lineWidth = 1;
        hCtx.beginPath();
        hCtx.moveTo(x - (i % 2 === 0 ? 28 : 18), y);
        hCtx.lineTo(x + (i % 2 === 0 ? 28 : 18), y);
        hCtx.stroke();

        if (i % 2 === 0) {
          hCtx.fillStyle = "rgba(200,230,255,0.7)";
          hCtx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
          hCtx.textAlign = "left";
          hCtx.fillText(`${(10 - Math.abs(i)) * 1}k`, x + 12, y - 4);
        }
      }

      // centre window box
      const winY = y0 + ladderH / 2 - 16 + offset;
      hCtx.strokeStyle = "rgba(220,245,255,0.8)";
      hCtx.strokeRect(x - 34, winY, 68, 32);
      hCtx.restore();
    }

    // ANIMATE
    let t = 0;
    let rafId = 0;
    function frame() {
      t += 16;
      drawSky();
      drawStars(t);
      drawClouds(t);
      drawHUDSweep(t);
      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    frame();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={skyRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={starsRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={cloudsRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={hudRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
