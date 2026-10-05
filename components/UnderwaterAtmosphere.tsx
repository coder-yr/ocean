"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface UnderwaterAtmosphereProps {
  progressRef?: React.RefObject<number>;
}

export default function UnderwaterAtmosphere({
  progressRef,
}: UnderwaterAtmosphereProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const sunHazeRef = useRef<HTMLDivElement | null>(null);
  const lightRaysRef = useRef<HTMLDivElement | null>(null);
  const causticsRef = useRef<HTMLDivElement | null>(null);
  const depthFogRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Generate organic floating marine micro-spores
    const generated: Particle[] = Array.from({ length: 28 }, (_, i) => ({
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

  useEffect(() => {
    let animId: number;

    const updateAtmosphere = () => {
      const progress = progressRef?.current ?? 0;

      // 1. Surface Sunlight Haze (Strong at surface, fades into reef)
      if (sunHazeRef.current) {
        const hazeOp = Math.max(0, 1.0 - progress / 0.36) * 0.45;
        sunHazeRef.current.style.opacity = `${hazeOp.toFixed(3)}`;
      }

      // 2. Volumetric Sun Rays (Active during Surface & upper Marine Life)
      if (lightRaysRef.current) {
        const rayOp = Math.max(0, 1.0 - progress / 0.42) * 0.28;
        lightRaysRef.current.style.opacity = `${rayOp.toFixed(3)}`;
      }

      // 3. Ambient Water Caustics Shimmer (Sunlit surface shelf only)
      if (causticsRef.current) {
        const causticsOp = Math.max(0, 1.0 - progress / 0.38) * 0.18;
        causticsRef.current.style.opacity = `${causticsOp.toFixed(3)}`;
      }

      // 4. Volumetric Deep-Ocean Fog & Twilight Absorption
      if (depthFogRef.current) {
        // Ramps up as you descend into The Depths & The Abyss
        const fogOp = Math.min(Math.max((progress - 0.25) / 0.65, 0), 0.85);
        depthFogRef.current.style.opacity = `${fogOp.toFixed(3)}`;
      }

      // 5. Dynamic Radial Vignette (Deepens in The Abyss)
      if (vignetteRef.current) {
        const vigOp = 0.35 + progress * 0.45;
        vignetteRef.current.style.opacity = `${vigOp.toFixed(3)}`;
      }

      animId = requestAnimationFrame(updateAtmosphere);
    };

    updateAtmosphere();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [progressRef]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Volumetric Sunlight Haze / Soft Upper Ocean Glow */}
      <div
        ref={sunHazeRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[1100px] h-[650px] rounded-full blur-[90px] mix-blend-screen transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(210, 240, 255, 0.28) 0%, rgba(56, 189, 248, 0.14) 45%, rgba(14, 165, 233, 0) 80%)",
        }}
      />

      {/* 2. Soft Slanted Volumetric Light Rays (Natural oceanic drift) */}
      <div
        ref={lightRaysRef}
        className="absolute top-[-10%] left-[20%] w-[60vw] h-[90vh] mix-blend-screen blur-[50px] transform -rotate-12 animate-pulse transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(105deg, rgba(224, 242, 254, 0.22) 0%, rgba(56, 189, 248, 0.10) 35%, transparent 70%)",
          animationDuration: "8s",
        }}
      />

      {/* 3. Subtle Water Caustics Shimmer Layer */}
      <div
        ref={causticsRef}
        className="absolute inset-0 mix-blend-screen animate-caustics transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.35) 0%, transparent 60%),
                            radial-gradient(circle at 30% 60%, rgba(14, 165, 233, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 70% 50%, rgba(94, 234, 212, 0.20) 0%, transparent 50%)`,
        }}
      />

      {/* 4. Progressive Deep Oceanic Fog & Blue-Hour Absorption Layer */}
      <div
        ref={depthFogRef}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(3, 14, 32, 0.6) 0%, rgba(2, 8, 20, 0.95) 75%, #01040a 100%)",
          opacity: 0,
        }}
      />

      {/* 5. Localized Text Readability Gradient (Darker on left behind headline) */}
      <div
        className="absolute inset-0 max-w-3xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(2, 7, 18, 0.72) 0%, rgba(2, 7, 18, 0.40) 42%, rgba(2, 7, 18, 0.10) 75%, transparent 100%)",
        }}
      />

      {/* 6. Natural Perimeter Edge Integration (Fades into background #020712) */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#020712] via-[#020712]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020712] via-[#020712]/60 to-transparent" />
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#020712]/40 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#020712]/50 to-transparent" />

      {/* 7. Cinematic Radial Vignette */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 52% 48%, transparent 48%, rgba(1, 8, 20, 0.45) 75%, rgba(1, 8, 20, 0.9) 100%)",
        }}
      />

      {/* 8. Fine Suspended Micro-Particles / Marine Snow */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan-100 will-change-transform"
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

      {/* 9. Cinematic Film Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
