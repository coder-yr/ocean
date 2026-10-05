"use client";

import React from "react";

interface ScrollIndicatorProps {
  onScrollClick?: () => void;
}

export default function ScrollIndicator({ onScrollClick }: ScrollIndicatorProps) {
  return (
    <div
      onClick={onScrollClick}
      className="fixed left-8 sm:left-12 md:left-16 bottom-12 z-40 flex items-center gap-3.5 cursor-pointer select-none group"
      title="Scroll to explore"
    >
      {/* Rotated text "Scroll Down" */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-sans font-light tracking-[0.25em] text-white/50 group-hover:text-cyan-300 transition-colors duration-300 [writing-mode:vertical-lr] rotate-180">
          Scroll Down
        </span>
      </div>

      {/* Vertical track line with scrubber circle bead */}
      <div className="relative w-3 h-14 flex items-center justify-center">
        {/* Track Line */}
        <div className="w-[1px] h-full bg-white/25 group-hover:bg-white/50 transition-colors" />

        {/* Circular Scrubber Bead */}
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/90 bg-cyan-300 shadow-[0_0_8px_#38bdf8] animate-scrubber group-hover:scale-125 transition-transform" />
      </div>
    </div>
  );
}
