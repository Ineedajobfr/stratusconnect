import React, { useEffect, useRef } from "react";

type Props = {
  intensity?: number;
  particleCount?: number;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ModernBackground({
  intensity = 0.6,
  particleCount = 200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = 0;
    let height = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let running = true;

    // Enhanced particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
      type: 'star' | 'glow' | 'trail';
    }> = [];

    // Initialize particles
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          life: Math.random() * 100,
          maxLife: 100,
          type: Math.random() > 0.7 ? 'glow' : Math.random() > 0.5 ? 'trail' : 'star'
        });
      }
    };

    // Enhanced rendering
    const render = () => {
      if (!running) return;

      // Clear with subtle fade
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05})`;
      ctx.fillRect(0, 0, width, height);

      // Render particles
      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.5;

        // Wrap around screen
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Reset if life expired
        if (particle.life <= 0) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.life = particle.maxLife;
          particle.opacity = Math.random() * 0.8 + 0.2;
        }

        // Render based on type
        const alpha = (particle.opacity * particle.life / particle.maxLife) * intensity;
        
        if (particle.type === 'star') {
          // Bright star
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'glow') {
          // Glowing particle with gradient
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, `rgba(25, 70%, 50%, ${alpha * 0.8})`);
          gradient.addColorStop(1, `rgba(25, 70%, 50%, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'trail') {
          // Trail effect
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
          ctx.lineWidth = particle.size;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.vx * 10, particle.y - particle.vy * 10);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
        }
      });

      // Add subtle grid lines
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.02})`;
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // Resize handler
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    // Start animation
    resize();
    if (!prefersReducedMotion()) {
      render();
    }

    // Cleanup
    return () => {
      running = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [intensity, particleCount]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'linear-gradient(135deg, hsl(210, 25%, 4%) 0%, hsl(210, 20%, 2%) 100%)'
        }}
      />
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5" />
    </div>
  );
}
