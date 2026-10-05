"use client";

import React, { useState } from "react";
import HeroScene from "@/components/HeroScene";
import OceanSections from "@/components/OceanSections";
import TrailerModal from "@/components/TrailerModal";
import TicketsModal from "@/components/TicketsModal";

export default function Home() {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[#020712]">
      {/* 1. Cinematic Scroll-Controlled Pinned Hero Experience */}
      <HeroScene />

      {/* 2. Following Deep Ocean Editorial Sections */}
      <OceanSections
        onOpenTickets={() => setIsTicketsOpen(true)}
        onOpenTrailer={() => setIsTrailerOpen(true)}
      />

      {/* Interactive Modals */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />

      <TicketsModal
        isOpen={isTicketsOpen}
        onClose={() => setIsTicketsOpen(false)}
      />
    </main>
  );
}
