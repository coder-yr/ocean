"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  hue: number;
  pulseSpeed: number;
  pulsePhase: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export default function AtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      // Scale canvas by devicePixelRatio for 4K Ultra HD razor-sharp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize restrained marine spores & micro-bubbles for subtle cinematic depth
    const particleCount = Math.floor(Math.min(width / 38, 30));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isBubble = Math.random() > 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBubble ? Math.random() * 1.6 + 0.7 : Math.random() * 1.1 + 0.5,
        baseRadius: isBubble ? Math.random() * 1.6 + 0.7 : Math.random() * 1.1 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.35 + 0.15), // Slow gentle drift
        alpha: Math.random() * 0.28 + 0.1,
        maxAlpha: Math.random() * 0.35 + 0.15,
        hue: Math.random() > 0.3 ? 190 : 165,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.008,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Volumetric Sunbeam Caustic Sheen (Golden to Cyan)
      const sunGradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(frame * 0.005) * 40,
        -50,
        40,
        width * 0.5,
        height * 0.45,
        width * 0.75
      );
      sunGradient.addColorStop(0, "rgba(254, 243, 199, 0.12)");
      sunGradient.addColorStop(0.35, "rgba(56, 189, 248, 0.06)");
      sunGradient.addColorStop(0.7, "rgba(14, 165, 233, 0.02)");
      sunGradient.addColorStop(1, "rgba(2, 7, 18, 0)");

      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render 4K Micro-Bubbles and Bioluminescent Spores
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics
        p.pulsePhase += p.pulseSpeed;
        p.wobbleOffset += p.wobbleSpeed;

        p.x += p.vx + Math.sin(p.wobbleOffset) * 0.35;
        p.y += p.vy;

        // Subtle mouse repulsion for interactive depth
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (1 - dist / 140) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Screen boundary wrap
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // Dynamic pulsing brightness
        const currentAlpha =
          p.alpha + Math.sin(p.pulsePhase) * (p.maxAlpha - p.alpha) * 0.5;

        // Draw glowing spore or crisp bubble
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Radial glow on particle
        const particleGlow = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3.5
        );
        particleGlow.addColorStop(
          0,
          `hsla(${p.hue}, 95%, 75%, ${currentAlpha})`
        );
        particleGlow.addColorStop(
          0.4,
          `hsla(${p.hue}, 90%, 60%, ${currentAlpha * 0.6})`
        );
        particleGlow.addColorStop(1, `hsla(${p.hue}, 85%, 50%, 0)`);

        ctx.fillStyle = particleGlow;
        ctx.fill();

        // Pinpoint bright specular core for 4K crispness
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius * 0.4, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
