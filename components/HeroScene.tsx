"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import ChapterNav, { Chapter } from "./ChapterNav";
import ScrollIndicator from "./ScrollIndicator";
import UnderwaterAtmosphere from "./UnderwaterAtmosphere";
import AtmosphereCanvas from "./AtmosphereCanvas";
import ForegroundDepth from "./ForegroundDepth";
import TrailerModal from "./TrailerModal";
import TicketsModal from "./TicketsModal";

const CHAPTERS: Chapter[] = [
  {
    id: "surface",
    number: "01",
    title: "The Surface",
    description:
      "A breathtaking journey through the wonders of marine life, from vibrant reefs to the mysterious depths.",
  },
  {
    id: "marine-life",
    number: "02",
    title: "Marine Life",
    description:
      "An ecosystem alive with movement, color, and hidden worlds.",
  },
  {
    id: "depths",
    number: "03",
    title: "The Depths",
    description:
      "Descend into submerged sunken ruins and ancient submerged gothic temples of forgotten civilizations.",
  },
  {
    id: "planet",
    number: "04",
    title: "Our Planet",
    description:
      "Discover what lies below our living ocean.",
  },
  {
    id: "abyss",
    number: "05",
    title: "The Abyss",
    description:
      "Enter the midnight trench where ancient titans sleep in eternal silence.",
  },
];

const TOTAL_FRAMES = 240;

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// Aspect-ratio cover drawing on canvas
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || 1280;
  const ih = img.naturalHeight || 720;
  const canvasRatio = w / h;
  const imgRatio = iw / ih;

  let renderWidth = w;
  let renderHeight = h;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imgRatio) {
    renderHeight = w / imgRatio;
    offsetY = (h - renderHeight) / 2;
  } else {
    renderWidth = h * imgRatio;
    offsetX = (w - renderWidth) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preloaded frame image objects for sub-millisecond 60fps/120fps fluid scrubbing
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);
  const displayFrameRef = useRef<number>(0);

  // Video timeline refs for DOM timeline sync
  const videoDurationRef = useRef<number>(10);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const isReducedMotionRef = useRef<boolean>(false);

  // Audio system refs for authentic water soundscape & dynamic depth acoustic filtering
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Text layer refs for direct DOM updates
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroButtonsRef = useRef<HTMLDivElement | null>(null);
  const ch1Ref = useRef<HTMLDivElement | null>(null);
  const ch2Ref = useRef<HTMLDivElement | null>(null);
  const ch3Ref = useRef<HTMLDivElement | null>(null);
  const ch4Ref = useRef<HTMLDivElement | null>(null);
  const abyssRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);
  const videoViewportRef = useRef<HTMLDivElement | null>(null);
  const distantAtmosphereRef = useRef<HTMLDivElement | null>(null);
  const midgroundRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);
  const colorGradeRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  }>({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // States
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const activeChapterRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Initialize video controls & loadedmetadata duration listener
  useEffect(() => {
    isReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (isReducedMotionRef.current) return;
      // Normalized coordinates from -1 to 1 for subtle environmental tilt
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const video = videoRef.current;
    if (!video) return;

    // Ensure video is paused at all times (scroll-controlled timeline only)
    video.pause();

    const onLoadedMetadata = () => {
      video.pause();
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        videoDurationRef.current = video.duration;
      }
    };

    if (video.readyState >= 1 && video.duration && !isNaN(video.duration)) {
      videoDurationRef.current = video.duration;
    }

    const onPlay = () => {
      video.pause();
    };

    const onSeeking = () => {
      isSeekingRef.current = true;
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      const diff = Math.abs(video.currentTime - currentTimeRef.current);
      if (diff > 0.04) {
        isSeekingRef.current = true;
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // 2. Preload 240 high-definition frames in memory for instantaneous 60fps/120fps scrubbing
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const frame0 = new window.Image();
    frame0.src = "/frames/frame_000.webp";
    frame0.onload = () => {
      images[0] = frame0;
      if (frameCanvasRef.current) {
        const ctx = frameCanvasRef.current.getContext("2d");
        if (ctx) {
          drawCover(
            ctx,
            frame0,
            frameCanvasRef.current.width,
            frameCanvasRef.current.height
          );
          lastDrawnFrameRef.current = 0;
        }
      }
    };
    images[0] = frame0;

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const pad = String(i).padStart(3, "0");
      const img = new window.Image();
      img.src = `/frames/frame_${pad}.webp`;
      images[i] = img;
    }

    imagesRef.current = images;

    const handleResize = () => {
      if (!frameCanvasRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      frameCanvasRef.current.width = w * dpr;
      frameCanvasRef.current.height = h * dpr;
      frameCanvasRef.current.style.width = `${w}px`;
      frameCanvasRef.current.style.height = `${h}px`;

      const currentIdx = Math.max(lastDrawnFrameRef.current, 0);
      const img = imagesRef.current[currentIdx];
      if (img && img.complete) {
        const ctx = frameCanvasRef.current.getContext("2d");
        if (ctx) {
          drawCover(
            ctx,
            img,
            frameCanvasRef.current.width,
            frameCanvasRef.current.height
          );
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 3. Master Scroll Timeline: SCROLL PROGRESS -> VIDEO CURRENTTIME -> TEXT ANIMATIONS -> CHAPTER NAVIGATION -> HERO EFFECTS
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const canvas = frameCanvasRef.current;
    if (!container || !stage) return;

    const updateMasterTimeline = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const currentScroll = -rect.top;
      const progress = clamp(currentScroll / Math.max(totalScrollable, 1), 0, 1);

      // 1. PINNING: Keep stage 100% FIXED in viewport until video timeline sequence is complete
      if (currentScroll >= totalScrollable) {
        stage.style.position = "absolute";
        stage.style.top = "auto";
        stage.style.bottom = "0px";
        stage.style.left = "0px";
        stage.style.width = "100%";
        stage.style.height = "100vh";
      } else {
        stage.style.position = "fixed";
        stage.style.top = "0px";
        stage.style.bottom = "auto";
        stage.style.left = "0px";
        stage.style.width = "100%";
        stage.style.height = "100vh";
      }

      // 2. VIDEO CURRENTTIME: Map progress to video duration with smooth interpolation
      const duration = videoDurationRef.current || 10;
      targetTimeRef.current = progress * duration;

      const damp = isReducedMotionRef.current ? 1.0 : 0.18;
      currentTimeRef.current +=
        (targetTimeRef.current - currentTimeRef.current) * damp;

      if (video && !isSeekingRef.current) {
        const diff = Math.abs(video.currentTime - currentTimeRef.current);
        if (diff > 0.035) {
          isSeekingRef.current = true;
          try {
            video.currentTime = currentTimeRef.current;
          } catch {
            isSeekingRef.current = false;
          }
        }
      }

      // 3. ULTRA-SMOOTH CANVAS FRAME SCRUBBING (0ms decode lag, 60fps/120fps)
      const targetFrame = progress * (TOTAL_FRAMES - 1);
      displayFrameRef.current +=
        (targetFrame - displayFrameRef.current) * damp;

      const frameIdx = clamp(
        Math.round(displayFrameRef.current),
        0,
        TOTAL_FRAMES - 1
      );

      if (canvas && frameIdx !== lastDrawnFrameRef.current) {
        const img = imagesRef.current[frameIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            drawCover(ctx, img, canvas.width, canvas.height);
            lastDrawnFrameRef.current = frameIdx;
          }
        }
      }

      progressRef.current = progress;

      // Mouse Parallax Calculation (damped smooth follow)
      const mx = (mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05);
      const my = (mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05);

      // 3A. DEPTH LAYER 1: DISTANT ATMOSPHERE (Volumetric Haze, Deep Sea Gradation, Caustics)
      // Slowest scroll parallax (-10px) + subtle mouse shift (2px)
      if (distantAtmosphereRef.current) {
        const daX = mx * 2;
        const daY = -progress * 10 + my * 1.5;
        distantAtmosphereRef.current.style.transform = `translate3d(${daX.toFixed(1)}px, ${daY.toFixed(1)}px, -35px)`;
      }

      // 3B. DEPTH LAYER 2: BACKGROUND (Cinematic Video & Canvas Frame Buffer)
      // Subtle scroll parallax (-18px) + continuous camera dive scale + subtle mouse shift (3.5px)
      if (videoViewportRef.current) {
        let zoomScale = 1.0;
        if (progress < 0.5) {
          zoomScale = 1.015 - (progress / 0.5) * 0.015; // 1.015 -> 1.00
        } else {
          zoomScale = 1.00 + ((progress - 0.5) / 0.5) * 0.025; // 1.00 -> 1.025
        }
        const bgX = mx * 3.5;
        const bgY = -progress * 18 + my * 2.5;
        videoViewportRef.current.style.transform = `translate3d(${bgX.toFixed(1)}px, ${bgY.toFixed(1)}px, -15px) scale(${zoomScale.toFixed(4)})`;

        // Dynamic depth color absorption: Surface (crystal teal) -> Reef (deep blue) -> Depths (slate gloom) -> Abyss (deep midnight)
        const contrastVal = (1.08 + progress * 0.08).toFixed(3);
        const brightnessVal = (1.02 - progress * 0.22).toFixed(3);
        const saturateVal = (1.10 - progress * 0.12).toFixed(3);
        videoViewportRef.current.style.filter = `contrast(${contrastVal}) brightness(${brightnessVal}) saturate(${saturateVal})`;
      }

      // Dynamic color tone progression deeper into the ocean
      if (colorGradeRef.current) {
        colorGradeRef.current.style.opacity = (0.04 + progress * 0.24).toFixed(3);
      }

      // 3C. DEPTH LAYER 3: MIDGROUND (Atmospheric Underwater Elements, Floating Particles & Subtle Bubbles)
      // Normal scroll parallax (-42px) + subtle mouse shift (7px)
      if (midgroundRef.current) {
        const midX = mx * 7;
        const midY = -progress * 42 + my * 5;
        midgroundRef.current.style.transform = `translate3d(${midX.toFixed(1)}px, ${midY.toFixed(1)}px, 15px)`;
      }

      // 3D. DEPTH LAYER 4: FOREGROUND (Macro Blurred Particles & Bokeh Bubbles close to camera lens)
      // Faster scroll parallax (-76px) + subtle mouse shift (12px)
      if (foregroundRef.current) {
        const fgX = mx * 12;
        const fgY = -progress * 76 + my * 8;
        const fgScale = 1.0 + progress * 0.04;
        foregroundRef.current.style.transform = `translate3d(${fgX.toFixed(1)}px, ${fgY.toFixed(1)}px, 40px) scale(${fgScale.toFixed(3)})`;
      }

      // 3E. Stage Exit Effect when passing progress 0.98
      if (progress >= 0.98 && currentScroll > totalScrollable) {
        const exitProgress = clamp(
          (currentScroll - totalScrollable) / (window.innerHeight * 0.5),
          0,
          1
        );
        const scale = 1.0 - exitProgress * 0.04;
        const borderRadius = exitProgress * 24;
        const opacity = 1.0 - exitProgress * 0.06;
        stage.style.transform = `scale(${scale})`;
        stage.style.borderRadius = `${borderRadius}px`;
        stage.style.opacity = `${opacity}`;
      } else {
        stage.style.transform = "scale(1)";
        stage.style.borderRadius = "0px";
        stage.style.opacity = "1";
      }

      // 4. Hero Static Backdrop to Video Cross-transition (0.00 to 0.08)
      if (bgImageRef.current) {
        const bgFade = 1.0 - clamp(progress / 0.08, 0, 1);
        bgImageRef.current.style.opacity = `${bgFade}`;
        bgImageRef.current.style.pointerEvents = bgFade < 0.05 ? "none" : "auto";
      }

      // 5. Hero Opening State Text Transitions (0.00 to 0.14)
      // Masked vertical reveal, subtle cinematic depth, blur -> sharp, upward exit, reversible
      if (heroContentRef.current) {
        const pExit = clamp(progress / 0.12, 0, 1);
        const yOffset = -pExit * 65;
        const opacity = 1.0 - pExit;
        const blur = isReducedMotionRef.current ? 0 : pExit * 8;
        const textScale = 1.0 + pExit * 0.03;
        heroContentRef.current.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 20px) scale(${textScale.toFixed(3)})`;
        heroContentRef.current.style.opacity = `${opacity}`;
        heroContentRef.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        heroContentRef.current.style.pointerEvents =
          opacity < 0.1 ? "none" : "auto";
      }

      // Hero Buttons fade earlier (0.00 to 0.07)
      if (heroButtonsRef.current) {
        const pBtn = 1.0 - clamp(progress / 0.07, 0, 1);
        heroButtonsRef.current.style.opacity = `${pBtn}`;
        heroButtonsRef.current.style.pointerEvents =
          pBtn < 0.1 ? "none" : "auto";
      }

      // Scroll Down indicator fades as user descends
      if (scrollIndicatorRef.current) {
        const pScroll = 1.0 - clamp(progress / 0.08, 0, 1);
        scrollIndicatorRef.current.style.opacity = `${pScroll}`;
        scrollIndicatorRef.current.style.pointerEvents =
          pScroll < 0.1 ? "none" : "auto";
      }

      // 6. Chapter 01: THE SURFACE (Progress 0.08 to 0.24)
      if (ch1Ref.current) {
        const enter = clamp((progress - 0.08) / 0.06, 0, 1);
        const exit = clamp((progress - 0.22) / 0.04, 0, 1);
        const op = enter * (1.0 - exit);
        const y = (1.0 - enter) * 45 - exit * 45;
        const blur = isReducedMotionRef.current ? 0 : (1.0 - enter) * 6 + exit * 6;
        const scale = 0.98 + enter * 0.02;
        ch1Ref.current.style.opacity = `${op}`;
        ch1Ref.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 18px) scale(${scale.toFixed(3)})`;
        ch1Ref.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        ch1Ref.current.style.pointerEvents = op < 0.1 ? "none" : "auto";
      }

      // 7. Chapter 02: MARINE LIFE (Progress 0.26 to 0.48) - Word-by-word reveal
      if (ch2Ref.current) {
        const enter = clamp((progress - 0.26) / 0.06, 0, 1);
        const exit = clamp((progress - 0.44) / 0.05, 0, 1);
        const op = enter * (1.0 - exit);
        const y = (1.0 - enter) * 45 - exit * 45;
        const blur = isReducedMotionRef.current ? 0 : (1.0 - enter) * 6 + exit * 6;
        const scale = 0.98 + enter * 0.02;
        ch2Ref.current.style.opacity = `${op}`;
        ch2Ref.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 18px) scale(${scale.toFixed(3)})`;
        ch2Ref.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        ch2Ref.current.style.pointerEvents = op < 0.1 ? "none" : "auto";

        const words = ch2Ref.current.querySelectorAll(".word-reveal");
        words.forEach((el, idx) => {
          const wordEnter = clamp(
            (progress - (0.26 + idx * 0.016)) / 0.035,
            0,
            1
          );
          const wY = (1.0 - wordEnter) * 35;
          const wOp = wordEnter * (1.0 - exit);
          const wBlur = isReducedMotionRef.current ? 0 : (1.0 - wordEnter) * 5;
          const wScale = 0.96 + wordEnter * 0.04;
          (el as HTMLElement).style.transform = `translate3d(0, ${wY.toFixed(1)}px, 10px) scale(${wScale.toFixed(3)})`;
          (el as HTMLElement).style.opacity = `${wOp}`;
          (el as HTMLElement).style.filter = wBlur > 0 ? `blur(${wBlur.toFixed(1)}px)` : "none";
        });
      }

      // 8. Chapter 03: THE DEPTHS (Progress 0.48 to 0.68)
      if (ch3Ref.current) {
        const enter = clamp((progress - 0.48) / 0.06, 0, 1);
        const exit = clamp((progress - 0.64) / 0.05, 0, 1);
        const op = enter * (1.0 - exit);
        const y = (1.0 - enter) * 45 - exit * 45;
        const blur = isReducedMotionRef.current ? 0 : (1.0 - enter) * 6 + exit * 6;
        const scale = 0.98 + enter * 0.02;
        ch3Ref.current.style.opacity = `${op}`;
        ch3Ref.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 18px) scale(${scale.toFixed(3)})`;
        ch3Ref.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        ch3Ref.current.style.pointerEvents = op < 0.1 ? "none" : "auto";
      }

      // 9. Chapter 04: OUR PLANET / BIOLUMINESCENCE (Progress 0.68 to 0.86)
      if (ch4Ref.current) {
        const enter = clamp((progress - 0.68) / 0.06, 0, 1);
        const exit = clamp((progress - 0.82) / 0.04, 0, 1);
        const op = enter * (1.0 - exit);
        const y = (1.0 - enter) * 45 - exit * 40;
        const blur = isReducedMotionRef.current ? 0 : (1.0 - enter) * 6 + exit * 6;
        const scale = 0.98 + enter * 0.02;
        ch4Ref.current.style.opacity = `${op}`;
        ch4Ref.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 18px) scale(${scale.toFixed(3)})`;
        ch4Ref.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        ch4Ref.current.style.pointerEvents = op < 0.1 ? "none" : "auto";
      }

      // 10. FINAL CINEMATIC MOMENT: THE ABYSS (Progress 0.86 to 1.00)
      if (abyssRef.current) {
        const enter = clamp((progress - 0.86) / 0.06, 0, 1);
        const y = (1.0 - enter) * 35;
        const blur = isReducedMotionRef.current ? 0 : (1.0 - enter) * 6;
        const scale = 0.98 + enter * 0.02;
        abyssRef.current.style.opacity = `${enter}`;
        abyssRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 20px) scale(${scale.toFixed(3)})`;
        abyssRef.current.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : "none";
        abyssRef.current.style.pointerEvents = enter < 0.1 ? "none" : "auto";
      }

      // 11. Synchronize ChapterNav Active Index (5 Chapters: 01 Surface, 02 Marine Life, 03 The Depths, 04 Our Planet, 05 The Abyss)
      let newChapter = 0;
      if (progress < 0.25) {
        newChapter = 0; // 01 The Surface
      } else if (progress < 0.47) {
        newChapter = 1; // 02 Marine Life
      } else if (progress < 0.67) {
        newChapter = 2; // 03 The Depths
      } else if (progress < 0.85) {
        newChapter = 3; // 04 Our Planet
      } else {
        newChapter = 4; // 05 The Abyss
      }

      if (newChapter !== activeChapterRef.current) {
        activeChapterRef.current = newChapter;
        setActiveChapterIndex(newChapter);
      }

      // 12. Dynamic Depth Underwater Acoustics: deeper scroll = deeper oceanic pressure & resonance
      if (filterNodeRef.current && audioContext && audioContext.state === "running") {
        // Surface (progress 0): 850Hz cutoff (crisp bubbles & surface water)
        // Abyss (progress 1): 200Hz cutoff (deep sub-bass oceanic pressure)
        const targetFreq = 850 - progress * 650;
        try {
          filterNodeRef.current.frequency.setTargetAtTime(
            targetFreq,
            audioContext.currentTime,
            0.15
          );
        } catch {
          // ignore audio param errors
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateMasterTimeline);
    };

    animationFrameRef.current = requestAnimationFrame(updateMasterTimeline);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle clicking a chapter in ChapterNav to smoothly scroll directly to that scene
  const handleSelectChapter = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    // Chapter scroll percentages: 01: 0.16, 02: 0.36, 03: 0.58, 04: 0.76, 05: 0.94
    const targetPercentages = [0.16, 0.36, 0.58, 0.76, 0.94];
    const targetY = scrollTop + totalScrollable * targetPercentages[index];

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  // Authentic underwater ambient sound engine using Web Audio API
  const toggleAmbientAudio = async () => {
    if (!audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      filterNodeRef.current = filter;
      gainNodeRef.current = gain;

      const startPlayback = (buf: AudioBuffer) => {
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.loop = true;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        audioSourceRef.current = source;
      };

      if (audioBufferRef.current) {
        startPlayback(audioBufferRef.current);
      } else {
        try {
          const res = await fetch("/audio/underwater_ambient.wav");
          const arrayBuf = await res.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf);
          audioBufferRef.current = decoded;
          startPlayback(decoded);
        } catch {
          // Fallback procedural pink/brown generator
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.05;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;
          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start();
        }
      }

      setAudioContext(ctx);
      setIsAudioPlaying(true);
    } else {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
        setIsAudioPlaying(true);
      } else if (audioContext.state === "running") {
        await audioContext.suspend();
        setIsAudioPlaying(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520vh] bg-[#020712] select-none"
    >
      {/* 100% FIXED STAGE: Remains fixed on screen until progress >= 1.0 (video finished) */}
      <div
        ref={stageRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-[#020712] z-10 transition-transform duration-300 ease-out will-change-transform [perspective:1200px] [transform-style:preserve-3d]"
      >
        {/* DEPTH LAYER 1: DISTANT ATMOSPHERE (Volumetric Haze, God Rays, Deep Sea Gradation, Caustics) */}
        <div
          ref={distantAtmosphereRef}
          className="absolute inset-0 pointer-events-none z-0 will-change-transform"
        >
          <UnderwaterAtmosphere progressRef={progressRef} />
        </div>

        {/* DEPTH LAYER 2: BACKGROUND (Cinematic Video + Hardware-Accelerated 4K Frame Canvas) */}
        <div
          ref={videoViewportRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[1] will-change-transform transition-[filter] duration-200"
        >
          {/* LAYER 0A: Scroll-Controlled Cinematic Underwater Video (DOM Timeline) */}
          <video
            ref={videoRef}
            preload="auto"
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
          >
            <source
              src="/video/video/gemini_generated_video_81941c61.mp4"
              type="video/mp4"
            />
            <source
              src="/video/video/gemini_generated_video_1bdb6f11.mp4"
              type="video/mp4"
            />
          </video>

          {/* LAYER 0B: Ultra-Fluid 60fps/120fps Hardware-Accelerated Frame Buffer */}
          <canvas
            ref={frameCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* LAYER 0C: Initial 4K Hero Backdrop Image (Seamless Crossfade at Start of Scrub) */}
          <div
            ref={bgImageRef}
            className="absolute inset-0 z-[1] transition-opacity duration-300 will-change-transform pointer-events-none"
          >
            <Image
              src="/aquaria_hero_bg.jpg"
              alt="Aquaria Deep Ocean Realm 4K Ultra HD"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* LAYER 2B: Dynamic Color Grade & Deep Oceanic Tint Progression */}
        <div
          ref={colorGradeRef}
          className="absolute inset-0 pointer-events-none z-[2] mix-blend-color bg-gradient-to-b from-sky-400/40 via-blue-900/50 to-cyan-950/70 transition-opacity duration-300 opacity-[0.04]"
        />

        {/* DEPTH LAYER 3: MIDGROUND (Atmospheric Underwater Elements, Floating Particles & Subtle Bubbles) */}
        <div
          ref={midgroundRef}
          className="absolute inset-0 pointer-events-none z-10 will-change-transform"
        >
          <AtmosphereCanvas />
        </div>

        {/* DEPTH LAYER 4: FOREGROUND (Macro Blurred Particles & Bokeh Bubbles close to camera lens) */}
        <div
          ref={foregroundRef}
          className="absolute inset-0 pointer-events-none z-20 will-change-transform"
        >
          <ForegroundDepth />
        </div>

        {/* LAYER 4: Navigation Bar (Fixed Top) */}
        <Navbar
          onOpenTickets={() => setIsTicketsOpen(true)}
          onOpenTrailer={() => setIsTrailerOpen(true)}
        />

        {/* LAYER 3: CINEMATIC TYPOGRAPHY LAYERS */}

        {/* 1. INITIAL HERO CONTENT (Visible at 0.00 scroll) */}
        <div
          ref={heroContentRef}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center pointer-events-auto transition-transform will-change-transform"
        >
          <div className="max-w-xl">
            {/* Eyebrow Header with Horizontal Line */}
            <div className="flex items-center gap-3.5 mb-5">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-white/70 font-light font-sans">
                DIVE INTO A LARGER WORLD
              </span>
              <div className="w-10 sm:w-16 h-[1px] bg-white/30" />
            </div>

            {/* Main Headline */}
            <h1 className="font-cinzel text-6xl sm:text-7xl lg:text-[88px] tracking-tight leading-[0.94] font-normal mb-6">
              <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                EXPLORE
              </span>
              <span className="block text-ocean-glow drop-shadow-[0_0_35px_rgba(56,189,248,0.55)]">
                THE OCEAN
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 font-sans text-sm sm:text-base font-light leading-relaxed max-w-md mb-9 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              A breathtaking journey through the wonders of marine life, from vibrant reefs to the mysterious depths.
            </p>

            {/* CTA Action Buttons */}
            <div
              ref={heroButtonsRef}
              className="flex items-center gap-6 sm:gap-8 transition-opacity will-change-transform"
            >
              {/* Primary Button: Start Exploring */}
              <button
                onClick={() => handleSelectChapter(0)}
                className="glass-pill-glow group relative inline-flex items-center gap-3.5 pl-6 pr-4 py-3 rounded-full text-white text-[13px] tracking-wide font-normal transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Exploring</span>
                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center bg-white/10 group-hover:bg-cyan-400 group-hover:border-cyan-300 group-hover:text-black transition-all duration-300">
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </button>

              {/* Secondary Button: Watch Trailer */}
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="group inline-flex items-center gap-3 text-white/85 hover:text-white transition-all duration-300"
              >
                <div className="relative w-9 h-9 rounded-full border border-white/30 bg-white/[0.04] backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                  <svg
                    className="w-3 h-3 fill-current text-white translate-x-0.5 group-hover:text-cyan-200 transition-colors"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-[13px] tracking-wide font-light">
                  Watch Trailer
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. CHAPTER 01: THE SURFACE */}
        <div
          ref={ch1Ref}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center opacity-0 pointer-events-none transition-transform will-change-transform"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-cyan-300 font-medium">
                01 &bull; THE SURFACE
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent" />
            </div>

            <h2 className="font-cinzel text-5xl sm:text-7xl font-normal text-white leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              BEGIN BENEATH
              <span className="block text-ocean-glow">THE LIGHT.</span>
            </h2>

            <p className="text-white/75 font-sans text-base sm:text-lg font-light leading-relaxed max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Sunlight fragments into shimmering ribbons across the upper ocean shelf, where life awakens in crystal waters.
            </p>
          </div>
        </div>

        {/* 3. CHAPTER 02: MARINE LIFE (Reversible word-by-word reveal) */}
        <div
          ref={ch2Ref}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center opacity-0 pointer-events-none transition-transform will-change-transform"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-cyan-300 font-medium">
                02 &bull; MARINE LIFE
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent" />
            </div>

            {/* Word-by-word reveal headline */}
            <h2 className="font-cinzel text-5xl sm:text-7xl font-normal text-white leading-[1.05] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] overflow-hidden">
              <span className="inline-block overflow-hidden mr-3">
                <span className="word-reveal inline-block transition-transform duration-300">
                  BEYOND
                </span>
              </span>
              <span className="inline-block overflow-hidden mr-3">
                <span className="word-reveal inline-block transition-transform duration-300">
                  THE
                </span>
              </span>
              <span className="inline-block overflow-hidden">
                <span className="word-reveal inline-block text-ocean-glow transition-transform duration-300">
                  SURFACE
                </span>
              </span>
            </h2>

            <p className="text-white/80 font-sans text-base sm:text-lg font-light leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              An ecosystem alive with movement, color, and hidden worlds. Vast schools of silver dart across sunlit currents as titans of the deep drift into view.
            </p>
          </div>
        </div>

        {/* 4. CHAPTER 03: THE DEPTHS (Asymmetric positioning away from whales) */}
        <div
          ref={ch3Ref}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-end pb-28 opacity-0 pointer-events-none transition-transform will-change-transform"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-cyan-300 font-medium">
                03 &bull; THE DEPTHS
              </span>
              <div className="w-14 h-[1px] bg-cyan-400/40" />
            </div>

            <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-white leading-[1.15] mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              THE DEEPER YOU GO,
              <span className="block text-ocean-glow">
                THE MORE THERE IS TO DISCOVER.
              </span>
            </h2>

            <p className="text-white/70 font-sans text-sm sm:text-base font-light leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Sunlight fades into the twilight zone. Ancient currents sweep past submerged stone ruins where gentle oceanic giants rule in quiet majesty.
            </p>
          </div>
        </div>

        {/* 5. CHAPTER 04: OUR PLANET / BIOLUMINESCENCE */}
        <div
          ref={ch4Ref}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center opacity-0 pointer-events-none transition-transform will-change-transform"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-cyan-300 font-medium">
                04 &bull; OUR PLANET
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
            </div>

            <h2 className="font-cinzel text-5xl sm:text-7xl font-normal text-white leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              DISCOVER WHAT
              <span className="block text-ocean-glow">LIES BELOW.</span>
            </h2>

            <p className="text-white/75 font-sans text-base sm:text-lg font-light leading-relaxed max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              In absolute darkness, life crafts its own light. Ethereal constellations of living bioluminescence ignite the vast ocean floor.
            </p>
          </div>
        </div>

        {/* 6. FINAL CINEMATIC MOMENT: THE ABYSS (Holds firmly on final frame) */}
        <div
          ref={abyssRef}
          className="absolute inset-0 z-30 max-w-[1720px] w-full mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center items-center text-center opacity-0 pointer-events-none transition-transform will-change-transform"
        >
          <div className="max-w-2xl flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-cyan-300 font-medium">
                05 &bull; THE ABYSS
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
            </div>

            <h2 className="font-cinzel text-5xl sm:text-7xl font-normal text-white leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              THE MIDNIGHT
              <span className="block text-ocean-glow">TRENCH.</span>
            </h2>

            <p className="text-white/75 font-sans text-base sm:text-lg font-light leading-relaxed max-w-md mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Where light has never reached and ancient subterranean monoliths sleep in profound oceanic silence.
            </p>

            <button
              onClick={() => setIsTicketsOpen(true)}
              className="glass-pill-glow px-9 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
            >
              Book Your Expedition &rarr;
            </button>
          </div>
        </div>

        {/* Vertical Chapter / Timeline Tracker (Right Side) */}
        <ChapterNav
          chapters={CHAPTERS}
          activeChapterIndex={activeChapterIndex}
          onSelectChapter={handleSelectChapter}
        />

        {/* Bottom Left Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="transition-opacity will-change-transform"
        >
          <ScrollIndicator
            onScrollClick={() => {
              handleSelectChapter(0);
            }}
          />
        </div>

        {/* Bottom Right 4K Ultra HD & Ambient Water Sound Bar */}
        <div className="fixed right-6 sm:right-12 md:right-16 bottom-8 sm:bottom-12 z-40 flex items-center gap-2.5 sm:gap-3">
          {/* 4K Ultra HD Pill Badge */}
          <div className="hidden xs:flex px-2.5 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 backdrop-blur-md text-cyan-300 text-[10px] font-mono tracking-widest uppercase items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>4K Ultra HD</span>
          </div>

          {/* Water Sound Toggle Button */}
          <button
            onClick={toggleAmbientAudio}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all text-xs tracking-wider group shadow-lg ${
              isAudioPlaying
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "border-white/20 bg-black/40 text-white/70 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-white/10"
            }`}
            title={
              isAudioPlaying ? "Mute ocean ambiance" : "Play authentic underwater water sound"
            }
          >
            <div className="flex items-end gap-[2px] h-3.5 w-4">
              <span
                className={`w-[2px] bg-current rounded-full transition-all ${
                  isAudioPlaying
                    ? "h-3.5 animate-[pulse_0.8s_ease-in-out_infinite]"
                    : "h-1"
                }`}
              />
              <span
                className={`w-[2px] bg-current rounded-full transition-all ${
                  isAudioPlaying
                    ? "h-2.5 animate-[pulse_1.1s_ease-in-out_infinite]"
                    : "h-2"
                }`}
              />
              <span
                className={`w-[2px] bg-current rounded-full transition-all ${
                  isAudioPlaying
                    ? "h-3 animate-[pulse_0.9s_ease-in-out_infinite]"
                    : "h-1"
                }`}
              />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest font-medium">
              {isAudioPlaying ? "Water Sound: ON" : "Water Sound"}
            </span>
          </button>
        </div>

        {/* Modals */}
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
        />

        <TicketsModal
          isOpen={isTicketsOpen}
          onClose={() => setIsTicketsOpen(false)}
        />
      </div>
    </div>
  );
}
