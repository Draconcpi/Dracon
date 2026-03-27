'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarField({ count = 120 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30; // Cap at 30fps

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.015 + 0.003,
        twinkleSpeed: Math.random() * 0.015 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = time - lastTime;
      if (delta < FPS_INTERVAL) return;
      lastTime = time - (delta % FPS_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const alpha = star.opacity * twinkle;

        // Simple filled circle — no gradient creation
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgb(200, 180, 255)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y -= star.speed;
        if (star.y < -5) {
          star.y = canvas.height + 5;
          star.x = Math.random() * canvas.width;
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    createStars();
    animationId = requestAnimationFrame(animate);

    const handleResize = () => { resize(); createStars(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
