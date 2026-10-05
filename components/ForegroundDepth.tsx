"use client";

import React from "react";

// Foreground macro bokeh bubbles & blurred marine particles passing close to the camera lens
export default function ForegroundDepth() {
  const bokehElements = [
    { id: 1, left: "8%", top: "25%", size: 68, blur: "blur-[7px]", opacity: 0.16, duration: "16s", delay: "0s" },
    { id: 2, left: "88%", top: "18%", size: 92, blur: "blur-[9px]", opacity: 0.14, duration: "19s", delay: "2s" },
    { id: 3, left: "75%", top: "65%", size: 54, blur: "blur-[5px]", opacity: 0.20, duration: "14s", delay: "1s" },
    { id: 4, left: "15%", top: "72%", size: 80, blur: "blur-[8px]", opacity: 0.15, duration: "21s", delay: "4s" },
    { id: 5, left: "45%", top: "85%", size: 42, blur: "blur-[4px]", opacity: 0.22, duration: "13s", delay: "3s" },
    { id: 6, left: "92%", top: "78%", size: 60, blur: "blur-[6px]", opacity: 0.18, duration: "17s", delay: "5s" },
    { id: 7, left: "28%", top: "15%", size: 38, blur: "blur-[3px]", opacity: 0.25, duration: "12s", delay: "2.5s" },
    { id: 8, left: "62%", top: "35%", size: 48, blur: "blur-[5px]", opacity: 0.18, duration: "15s", delay: "1.5s" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      {/* Macro Out-of-Focus Underwater Bokeh Elements */}
      {bokehElements.map((b) => (
        <div
          key={b.id}
          className={`absolute rounded-full ${b.blur} will-change-transform`}
          style={{
            left: b.left,
            top: b.top,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            background:
              "radial-gradient(circle at 35% 35%, rgba(224, 242, 254, 0.85) 0%, rgba(56, 189, 248, 0.35) 45%, rgba(14, 165, 233, 0.05) 85%, transparent 100%)",
            boxShadow: `0 0 ${b.size * 0.8}px rgba(56, 189, 248, 0.45)`,
            animation: `gentleDriftSlow ${b.duration} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}

      {/* Subtle close-lens camera condensation / water refraction vignette */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(255, 255, 255, 0.15) 85%, rgba(56, 189, 248, 0.25) 100%)",
        }}
      />
    </div>
  );
}
