"use client";

import React, { useEffect } from "react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#020d20] shadow-[0_0_50px_rgba(6,182,212,0.3)] z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-cinzel text-base tracking-widest text-white uppercase">
              Aquaria: Journey Into The Abyss
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Video Player / Presentation */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/nO1B-5m2_bY?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1"
            title="Aquaria Ocean Odyssey Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer info */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#020b18] to-[#041a33]">
          <div>
            <p className="text-sm font-medium text-white">Experience 8K IMAX Oceanography</p>
            <p className="text-xs text-white/60">
              Shot on location across Marianas Trench, Galapagos Reefs, and Arctic Fjords.
            </p>
          </div>
          <a
            href="#tickets"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(56,189,248,0.5)]"
          >
            Book Exhibition
          </a>
        </div>
      </div>
    </div>
  );
}
