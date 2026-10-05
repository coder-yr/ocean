"use client";

import React from "react";
import Image from "next/image";

interface OceanSectionsProps {
  onOpenTickets: () => void;
  onOpenTrailer: () => void;
}

export default function OceanSections({
  onOpenTickets,
  onOpenTrailer,
}: OceanSectionsProps) {
  const exhibits = [
    {
      title: "Humpback Sanctuary",
      depth: "Surface to 200m",
      description:
        "Witness the majestic leviathans of the open ocean. Our 4-million-gallon oceanic biome replicates the nutrient-rich Arctic migration corridors.",
      stat: "40 Tons",
      statLabel: "Average Weight",
      gradient: "from-sky-500/20 via-blue-600/10 to-transparent",
    },
    {
      title: "Sunken Cathedral Ruins",
      depth: "Twilight Zone 450m",
      description:
        "Submerged beneath the Pacific shelf lies the stone architecture of an ancient underwater monument, now overgrown by vibrant cold-water corals and marine gardens.",
      stat: "450m",
      statLabel: "Exploration Depth",
      gradient: "from-cyan-500/20 via-teal-600/10 to-transparent",
    },
    {
      title: "Bioluminescent Cavern",
      depth: "Midnight Abyss 1,200m",
      description:
        "Enter pitch-black volcanic chambers illuminated exclusively by colonies of living siphonophores, radiant moon jellies, and deep-sea anglerfish.",
      stat: "90%",
      statLabel: "Bioluminescent Species",
      gradient: "from-blue-600/20 via-indigo-700/10 to-transparent",
    },
  ];

  const conservationStats = [
    { value: "1.2M", label: "Acres of Protected Ocean Sanctuaries" },
    { value: "450+", label: "Endangered Marine Species Safeguarded" },
    { value: "100%", label: "Renewable Geothermal Oceanic Power" },
    { value: "85 Tons", label: "Marine Plastic Removed Annually" },
  ];

  return (
    <div className="relative z-20 bg-[#020712] text-white">
      {/* SECTION 1: THE OCEAN / EXPEDITION ZONES */}
      <section id="discover" className="relative py-28 sm:py-36 px-8 sm:px-12 md:px-16 border-t border-white/10">
        <div className="max-w-[1720px] mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3.5 mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-sans font-light">
              THE EXPEDITION
            </span>
            <div className="w-12 h-[1px] bg-cyan-400/40" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] max-w-2xl">
                JOURNEY INTO THE VAST BLUE REALM
              </h2>
            </div>
            <p className="text-white/70 font-sans text-base max-w-lg leading-relaxed font-light">
              From sun-drenched surface waters teeming with marine life to the silent,
              glimmering wonder of the midnight abyss, Aquaria is dedicated to understanding
              and preserving our living planet.
            </p>
          </div>

          {/* Exhibition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exhibits.map((item, idx) => (
              <div
                key={idx}
                className="group relative p-8 sm:p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-cyan-400/40 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Ambient glow accent */}
                <div
                  className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${item.gradient} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between text-xs font-mono tracking-wider text-cyan-300 mb-6">
                    <span>ZONE {`0${idx + 1}`}</span>
                    <span className="text-white/50">{item.depth}</span>
                  </div>

                  <h3 className="font-cinzel text-2xl text-white font-normal mb-4 group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-white/65 font-sans text-sm leading-relaxed font-light mb-8">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <span className="font-cinzel text-3xl font-medium text-white block">
                      {item.stat}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-white/40 font-sans">
                      {item.statLabel}
                    </span>
                  </div>
                  <button
                    onClick={onOpenTickets}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-200 transition-all"
                    title="Explore zone"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: CONSERVATION */}
      <section id="conservation" className="relative py-28 sm:py-36 px-8 sm:px-12 md:px-16 bg-[#010814] border-t border-white/10">
        <div className="max-w-[1720px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-sans font-light">
                  OUR MISSION
                </span>
                <div className="w-12 h-[1px] bg-cyan-400/40" />
              </div>

              <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] mb-6">
                GUARDIANS OF THE DEEP OCEAN
              </h2>

              <p className="text-white/70 font-sans text-base leading-relaxed font-light mb-8 max-w-xl">
                Over 80% of our ocean remains unmapped and unexplored. Every ticket directly
                funds our research submersibles, coral propagation labs, and international
                marine wildlife sanctuaries.
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <button
                  onClick={onOpenTickets}
                  className="glass-pill-glow px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-medium text-white transition-all hover:scale-105"
                >
                  Join Conservation Guild
                </button>
                <button
                  onClick={onOpenTrailer}
                  className="px-6 py-3.5 rounded-full border border-white/20 text-xs uppercase tracking-widest text-white/80 hover:text-white hover:border-cyan-400/50 transition-all"
                >
                  Watch Documentary
                </button>
              </div>
            </div>

            {/* Impact stats grid */}
            <div className="grid grid-cols-2 gap-6">
              {conservationStats.map((stat, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                >
                  <span className="font-cinzel text-4xl sm:text-5xl font-medium text-cyan-300 block mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/60 font-sans leading-relaxed block font-light">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISIT / TICKETS CALLOUT */}
      <section id="visit" className="relative py-28 sm:py-36 px-8 sm:px-12 md:px-16 border-t border-white/10">
        <div className="max-w-[1720px] mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-sans font-light">
              PLAN YOUR VISIT
            </span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] mb-6 max-w-3xl mx-auto">
            BEGIN YOUR EXPEDITION TODAY
          </h2>

          <p className="text-white/70 font-sans text-base sm:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Reserve your admission passes online for guaranteed entry, priority submersible
            access, and 8K oceanarium screenings.
          </p>

          <button
            onClick={onOpenTickets}
            className="glass-pill-glow px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-white shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-105 transition-all"
          >
            Get Tickets Now &rarr;
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-8 sm:px-12 md:px-16 bg-[#010610]">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <span className="font-cinzel text-lg tracking-[0.35em] text-white">
              AQUARIA
            </span>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-xs text-white/50 tracking-wider">
              Ocean Exploration &bull; Science &bull; Wonder
            </span>
          </div>

          <p className="text-xs text-white/40 tracking-wider">
            &copy; 2026 AQUARIA Oceanic Foundation. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
