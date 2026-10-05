"use client";

import React from "react";

export interface Chapter {
  id: string;
  number: string;
  title: string;
  description?: string;
}

interface ChapterNavProps {
  chapters: Chapter[];
  activeChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

export default function ChapterNav({
  chapters,
  activeChapterIndex,
  onSelectChapter,
}: ChapterNavProps) {
  return (
    <aside className="fixed right-8 sm:right-12 md:right-16 top-[55%] -translate-y-1/2 z-40 hidden sm:flex flex-col items-start select-none">
      <div className="relative flex flex-col space-y-9">
        {/* Continuous vertical guide line */}
        <div className="absolute left-[4px] top-4 bottom-4 w-[1px] bg-white/20 -z-10" />

        {chapters.map((chapter, index) => {
          const isActive = index === activeChapterIndex;

          return (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(index)}
              className="group flex items-start text-left focus:outline-none transition-all duration-300"
            >
              {/* Dot on the vertical line */}
              <div className="relative w-2.5 h-2.5 flex items-center justify-center mr-5 mt-3.5">
                {isActive ? (
                  <>
                    <span className="absolute w-4 h-4 rounded-full bg-cyan-400/25 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] ring-1 ring-white/80" />
                  </>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-white/40 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-300" />
                )}
              </div>

              {/* Number (above) and Title (below) */}
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-sans font-light tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-cyan-300 font-normal"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {chapter.number}
                </span>
                <span
                  className={`text-[13px] md:text-[14px] font-sans tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-white font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                      : "text-white/50 group-hover:text-white/80"
                  }`}
                >
                  {chapter.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
