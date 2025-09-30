import { useEffect, useRef } from "react";

/**
 * Stratus Cinematic Boot Ritual - Hitman Brief Version
 * 
 * What you get:
 * - Letterboxed boot. Black screen. Type cursor. Accessing Stratus Terminal. Flash.
 * - World map with glowing nodes pulsing like contracts.
 * - A helicopter silhouette cut that hits between the boot and the scan.
 * - Subtitles and the type-on terminal line.
 * - Then we slide into your endless radar ocean.
 * 
 * Assets needed in /public/assets/:
 * - stratus-world-elevation.png — a dark shaded-relief world map.
 * - stratus-heli-silhouette.png — the helicopter still you like, cut out on transparent background.
 * 
 * If you don't add images, it falls back to a clean mercator grid so nothing breaks.
 */

export default function StratusCinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<'boot' | 'map' | 'heli' | 'ocean'>('boot');

  // Tuning dials - Hitman brief timings (slowed down)
  const bootDur = 3000; // Boot phase duration - slowed
  const mapStart = 3000; // World map start - slowed
  const mapEnd = 6000; // World map end - slowed
  const heliStart = 6000; // Helicopter start - slowed
  const heliEnd = 7500; // Helicopter end - slowed
  const oceanStart = 7500; // Ocean phase start - slowed

  // World map nodes (contracts) - update with your coordinates
  const nodes = [
    { lat: 40.7128, lon: -74.0060, name: "NYC" },
    { lat: 51.5074, lon: -0.1278, name: "LON" },
    { lat: 35.6762, lon: 139.6503, name: "TOK" },
    { lat: 48.8566, lon: 2.3522, name: "PAR" },
    { lat: 55.7558, lon: 37.6176, name: "MOS" },
    { lat: 39.9042, lon: 116.4074, name: "BEI" },
    { lat: -33.8688, lon: 151.2093, name: "SYD" },
    { lat: 25.2048, lon: 55.2708, name: "DXB" },
    { lat: 19.4326, lon: -99.1332, name: "MEX" },
    { lat: -22.9068, lon: -43.1729, name: "RIO" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;
    startTimeRef.current = Date.now();

    // Resize handler
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Boot phase - Letterboxed black screen with type cursor
    function drawBoot(t: number) {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Letterbox bars
      const letterboxHeight = h * 0.12;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, letterboxHeight); // Top bar
      ctx.fillRect(0, h - letterboxHeight, w, letterboxHeight); // Bottom bar

      // Main content area
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, letterboxHeight, w, h - letterboxHeight * 2);

      // Type cursor effect
      const text = "Accessing Stratus Terminal...";
      ctx.fillStyle = "#00ff00";
      ctx.font = "18px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";

      const cursorBlink = Math.floor(t / 500) % 2;
      const displayText = text + (cursorBlink ? "|" : "");
      ctx.fillText(displayText, w / 2, h / 2);
    }

    // World map phase - Glowing nodes pulsing like contracts
    function drawMap(t: number) {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const progress = Math.min(1, (t - mapStart) / (mapEnd - mapStart));

      // Letterbox bars
      const letterboxHeight = h * 0.12;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, letterboxHeight);
      ctx.fillRect(0, h - letterboxHeight, w, letterboxHeight);

      // Main content area
      ctx.fillStyle = "#000011";
      ctx.fillRect(0, letterboxHeight, w, h - letterboxHeight * 2);

      // World map background (fallback to grid if no image)
      ctx.strokeStyle = "rgba(0, 100, 200, 0.1)";
      ctx.lineWidth = 0.5;
      
      // Draw mercator grid
      const gridSpacing = 40;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, letterboxHeight);
        ctx.lineTo(x, h - letterboxHeight);
        ctx.stroke();
      }
      for (let y = letterboxHeight; y < h - letterboxHeight; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Glowing nodes (contracts) pulsing
      nodes.forEach((node, index) => {
        const x = (node.lon + 180) * (w / 360);
        const y = letterboxHeight + (90 - node.lat) * ((h - letterboxHeight * 2) / 180);
        
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + index * 0.5);
        const size = 8 + pulse * 4;
        const alpha = 0.3 + pulse * 0.4;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(255, 100, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 100, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha + 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Node label
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.name, x, y - size - 5);
      });

      // Subtitles
      const subtitleText = "Global Operations Network";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "16px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(subtitleText, w / 2, h - letterboxHeight - 20);
    }

    // Helicopter phase - Silhouette cut between boot and scan
    function drawHeli(t: number) {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const progress = Math.min(1, (t - heliStart) / (heliEnd - heliStart));

      // Letterbox bars
      const letterboxHeight = h * 0.12;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, letterboxHeight);
      ctx.fillRect(0, h - letterboxHeight, w, letterboxHeight);

      // Main content area
      ctx.fillStyle = "#000011";
      ctx.fillRect(0, letterboxHeight, w, h - letterboxHeight * 2);

      // Helicopter silhouette (fallback if no image)
      const heliX = w / 2;
      const heliY = h / 2;
      const heliSize = 100;

      // Draw helicopter silhouette
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      // Main body
      ctx.ellipse(heliX, heliY, heliSize * 0.3, heliSize * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(heliX + heliSize * 0.2, heliY);
      ctx.lineTo(heliX + heliSize * 0.6, heliY - heliSize * 0.1);
      ctx.lineTo(heliX + heliSize * 0.6, heliY + heliSize * 0.1);
      ctx.closePath();
      ctx.fill();
      // Main rotor
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(heliX - heliSize * 0.4, heliY - heliSize * 0.05);
      ctx.lineTo(heliX + heliSize * 0.4, heliY - heliSize * 0.05);
      ctx.stroke();
      // Tail rotor
      ctx.beginPath();
      ctx.moveTo(heliX + heliSize * 0.5, heliY - heliSize * 0.05);
      ctx.lineTo(heliX + heliSize * 0.7, heliY - heliSize * 0.05);
      ctx.stroke();

      // Subtitles
      const subtitleText = "Mission Briefing Complete";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "16px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(subtitleText, w / 2, h - letterboxHeight - 20);
    }

    // Ocean phase - Endless radar ocean
    function drawOcean(t: number) {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const oceanTime = t - oceanStart;
      
      // Deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "#000011");
      gradient.addColorStop(0.7, "#000022");
      gradient.addColorStop(1, "#000033");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Aurora veil
      const auroraGradient = ctx.createLinearGradient(0, 0, 0, h * 0.3);
      auroraGradient.addColorStop(0, "rgba(0, 100, 200, 0.15)");
      auroraGradient.addColorStop(1, "rgba(0, 100, 200, 0)");
      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, w, h * 0.3);

      // Stars
      for (let i = 0; i < 300; i++) {
        const x = (i * 137.5) % w;
        const y = (i * 89.3) % h;
        const size = Math.random() * 2 + 1;
        const twinkle = 0.5 + 0.5 * Math.sin(oceanTime * 0.001 + i);

        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dual radar sweeps (slowed down)
      const cx = w / 2;
      const cy = h / 2;
      const sweep1 = (oceanTime * 0.0002) % (Math.PI * 2); // Slowed down
      const sweep2 = (oceanTime * 0.0002 + Math.PI) % (Math.PI * 2); // Slowed down

      // First sweep
      const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4);
      grad1.addColorStop(0, "rgba(0, 255, 255, 0)");
      grad1.addColorStop(0.7, "rgba(0, 255, 255, 0.15)");
      grad1.addColorStop(1, "rgba(0, 255, 255, 0.05)");

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, Math.min(w, h) * 0.4, sweep1, sweep1 + 0.15);
      ctx.closePath();
      ctx.fill();

      // Second sweep
      const grad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.3);
      grad2.addColorStop(0, "rgba(255, 0, 255, 0)");
      grad2.addColorStop(0.7, "rgba(255, 0, 255, 0.1)");
      grad2.addColorStop(1, "rgba(255, 0, 255, 0.03)");

      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, Math.min(w, h) * 0.3, sweep2, sweep2 + 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Endless ripples (slowed down)
      const rippleCount = Math.floor(oceanTime / 180); // Slowed down
      for (let i = 0; i < rippleCount; i++) {
        const rippleTime = oceanTime - i * 180; // Slowed down
        const radius = rippleTime * 0.6; // Slowed down
        const alpha = Math.max(0, 1 - rippleTime / 2000);

        if (alpha > 0) {
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Rare satellites
      if (Math.random() < 0.02) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = 3 + Math.random() * 2;

        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Satellite trail
        ctx.strokeStyle = "rgba(255, 255, 0, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x + 20, y);
        ctx.stroke();
      }
    }

    // Main animation loop
    function animate() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      
      // Determine phase
      if (elapsed < bootDur) {
        phaseRef.current = 'boot';
        drawBoot(elapsed);
      } else if (elapsed < mapEnd) {
        phaseRef.current = 'map';
        drawMap(elapsed);
      } else if (elapsed < heliEnd) {
        phaseRef.current = 'heli';
        drawHeli(elapsed);
      } else {
        phaseRef.current = 'ocean';
        drawOcean(elapsed);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ backgroundColor: '#000000' }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}