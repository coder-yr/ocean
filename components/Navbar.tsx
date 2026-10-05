"use client";

import React, { useState } from "react";

interface NavbarProps {
  onOpenTickets: () => void;
  onOpenTrailer: () => void;
}

export default function Navbar({ onOpenTickets }: NavbarProps) {
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Discover", href: "#discover" },
    { name: "Exhibits", href: "#exhibits" },
    { name: "Conservation", href: "#conservation" },
    { name: "Visit", href: "#visit" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 sm:px-12 md:px-16 py-7 transition-all duration-300">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          {/* Exact Geometric Crest Icon */}
          <div className="w-7 h-7 flex items-center justify-center">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-transform duration-500 group-hover:scale-105"
            >
              <path
                d="M4 11L14 6L24 11"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 16L14 12.5L21 16"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 21L14 19L18 21"
                stroke="#7dd3fc"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-cinzel text-lg sm:text-xl font-normal tracking-[0.38em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            AQUARIA
          </span>
        </a>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name)}
                className={`relative py-1.5 text-[15px] tracking-wide transition-all duration-300 font-light ${
                  isActive
                    ? "text-white font-normal"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-[2.5px] bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 rounded-full shadow-[0_0_14px_#38bdf8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTickets}
            className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[13px] tracking-wide font-light text-white border border-white/20 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
          >
            <span>Get Tickets</span>
            <span className="text-white/80 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </button>

          {/* Circular Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-full border border-white/25 bg-white/[0.04] backdrop-blur-md flex flex-col items-center justify-center gap-[5px] transition-all duration-300 hover:border-cyan-400/60 hover:bg-white/[0.1] group"
          >
            <span
              className={`w-4 h-[1.5px] bg-white transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-white transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-white transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-6 rounded-2xl border border-white/15 bg-[#020d20]/95 backdrop-blur-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setActiveTab(link.name);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-base tracking-wide py-2 px-3 rounded-lg transition-colors ${
                  activeTab === link.name
                    ? "text-cyan-300 bg-white/5 font-medium"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTickets();
                }}
                className="w-full py-2.5 rounded-full text-center text-xs tracking-wider font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
