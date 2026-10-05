"use client";

import React, { useState } from "react";

interface TicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketsModal({ isOpen, onClose }: TicketsModalProps) {
  const [selectedPass, setSelectedPass] = useState("expedition");

  if (!isOpen) return null;

  const tiers = [
    {
      id: "general",
      name: "Daylight Pass",
      depth: "Surface to 200m",
      price: "$34",
      features: ["Main Ocean Dome Access", "Giant Whale Observation Tunnel", "Coral Nursery"],
    },
    {
      id: "expedition",
      name: "Abyssal Expedition",
      depth: "Midnight Zone 1000m+",
      price: "$58",
      features: [
        "Full Aquarium & Sunken Ruins",
        "Bioluminescent Cavern Experience",
        "Submersible VR Simulation",
        "Priority Entry & Audio Guide",
      ],
      popular: true,
    },
    {
      id: "vip",
      name: "Aquanaut VIP",
      depth: "All Depths & Behind-the-Scenes",
      price: "$115",
      features: [
        "Exclusive Diver Escort Access",
        "Private Marine Biologist Briefing",
        "VIP Night Dive Access",
        "Complimentary 8K Keepsake Book",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-cyan-500/40 bg-[#020d20] shadow-[0_0_60px_rgba(6,182,212,0.35)] z-10 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 font-mono">
              Reserve Your Journey
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white mt-1">
              Select Your Expedition
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-cyan-400 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {tiers.map((tier) => {
            const isSelected = selectedPass === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPass(tier.id)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h4 className="font-cinzel text-lg text-white font-medium">{tier.name}</h4>
                  <p className="text-xs text-cyan-200/70 font-mono mt-0.5">{tier.depth}</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-white">{tier.price}</span>
                    <span className="text-xs text-white/50">/ person</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-cyan-400 text-sm leading-none">&#10003;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-6 w-full py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                    isSelected
                      ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 text-center sm:text-left">
            Instant mobile barcode delivery &bull; 100% money-back guarantee up to 24h prior
          </p>
          <button
            onClick={() => {
              alert("Thank you! Your expedition pass has been reserved.");
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold text-black bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:brightness-110 transition-transform active:scale-95"
          >
            Confirm Reservation &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
