'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  r: number;
  g: number;
  b: number;
  life: number;
  maxLife: number;
}

export default function CosmicDust({ count = 25 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30; // Cap at 30fps
    const particles: Particle[] = [];

    const colorOptions: [number, number, number][] = [
      [168, 85, 244],   // purple
      [124, 34, 206],   // deep purple
      [249, 115, 22],   // orange
      [200, 180, 255],  // light purple
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2 - 0.08,
        opacity: Math.random() * 0.4 + 0.1,
        r: c[0], g: c[1], b: c[2],
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    const initParticles = () => {
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    };

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = time - lastTime;
      if (delta < FPS_INTERVAL) return;
      lastTime = time - (delta % FPS_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.8) * 5, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.8 ? fadeOut : 1);

        // Simple filled circle — no gradient creation
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    initParticles();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: 'transparent' }}
    />
  );
}
