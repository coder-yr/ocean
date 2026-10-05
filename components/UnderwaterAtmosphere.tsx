"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function UnderwaterAtmosphere() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate organic floating marine micro-spores
    const generated: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.8,
      opacity: Math.random() * 0.35 + 0.1,
      duration: Math.random() * 18 + 14,
      delay: Math.random() * 6,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* 1. Volumetric Sunlight Haze / Soft Upper Ocean Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[1100px] h-[650px] rounded-full blur-[90px] opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(210, 240, 255, 0.28) 0%, rgba(56, 189, 248, 0.12) 45%, rgba(14, 165, 233, 0) 80%)",
        }}
      />

      {/* 2. Soft Slanted Volumetric Light Rays (Low opacity, natural oceanic drift) */}
      <div
        className="absolute top-[-10%] left-[20%] w-[60vw] h-[90vh] opacity-25 mix-blend-screen blur-[50px] transform -rotate-12 animate-pulse"
        style={{
          background:
            "linear-gradient(105deg, rgba(224, 242, 254, 0.18) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 70%)",
          animationDuration: "8s",
        }}
      />

      {/* 3. Localized Text Readability Gradient (Darker on the left behind headline, transparent center & right) */}
      <div
        className="absolute inset-0 max-w-3xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(2, 7, 18, 0.72) 0%, rgba(2, 7, 18, 0.40) 42%, rgba(2, 7, 18, 0.10) 75%, transparent 100%)",
        }}
      />

      {/* 4. Natural Perimeter Edge Integration (Fades video seamlessly into background #020712) */}
      {/* Top navbar edge blend */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#020712] via-[#020712]/50 to-transparent" />
      {/* Bottom section edge blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020712] via-[#020712]/60 to-transparent" />
      {/* Subtle left & right edge fades */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#020712]/40 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#020712]/50 to-transparent" />

      {/* 5. Cinematic Radial Vignette (Transparent center, dark deep ocean perimeter) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 52% 48%, transparent 48%, rgba(1, 8, 20, 0.35) 75%, rgba(1, 8, 20, 0.75) 100%)",
        }}
      />

      {/* 6. Subtle Water Caustics Shimmer Layer */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-screen animate-caustics"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.35) 0%, transparent 60%),
                            radial-gradient(circle at 30% 60%, rgba(14, 165, 233, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 70% 50%, rgba(94, 234, 212, 0.20) 0%, transparent 50%)`,
        }}
      />

      {/* 7. Fine Suspended Micro-Particles / Marine Snow */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan-100"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px rgba(56, 189, 248, 0.6)`,
            animation: `gentleDriftSlow ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* 8. Cinematic Film Grain (Fine, low-opacity 0.035, prevents flat digital look) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
