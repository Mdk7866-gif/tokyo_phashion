"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Slide {
  id: number;
  imageUrl: string;
  badge: string;
  headline: string;
  subline: string;
  cta: string;
  ctaHref: string;
  accent: string; // tailwind gradient string used for badge/btn
}

const SLIDES: Slide[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1600&q=80&auto=format&fit=crop",
    badge: "New Season",
    headline: "Elevated Street",
    subline: "Minimal cuts, maximum presence. Drop SS '25.",
    cta: "Shop Now",
    ctaHref: "/shop",
    accent: "from-purple-600 to-rose-500",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1600&q=80&auto=format&fit=crop",
    badge: "Best Seller",
    headline: "Tokyo Classics",
    subline: "Timeless silhouettes crafted for modern men.",
    cta: "Explore",
    ctaHref: "/shop",
    accent: "from-sky-500 to-indigo-600",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80&auto=format&fit=crop",
    badge: "Limited Drop",
    headline: "Premium Layers",
    subline: "Outerwear that speaks before you do.",
    cta: "View Drop",
    ctaHref: "/shop",
    accent: "from-amber-500 to-rose-600",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1600&q=80&auto=format&fit=crop",
    badge: "Trending",
    headline: "Sharp & Bold",
    subline: "Formals reimagined for the modern Tokyo man.",
    cta: "Discover",
    ctaHref: "/shop",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=80&auto=format&fit=crop",
    badge: "Edit '25",
    headline: "After Dark",
    subline: "Evening wear that commands the room.",
    cta: "Shop Edit",
    ctaHref: "/shop",
    accent: "from-rose-600 to-pink-500",
  },
];

const AUTO_PLAY_MS = 5000;

export default function HeroSectionCard() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const total = SLIDES.length;

  /* ── navigate ── */
  const navigate = useCallback(
    (targetIdx: number, dir: "left" | "right") => {
      if (animating) return;
      setPrev(current);
      setDirection(dir);
      setAnimating(true);
      setCurrent(targetIdx);
      setProgress(0);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 700);
    },
    [animating, current]
  );

  const goNext = useCallback(() => {
    navigate((current + 1) % total, "left");
  }, [current, total, navigate]);

  const goPrev = useCallback(() => {
    navigate((current - 1 + total) % total, "right");
  }, [current, total, navigate]);

  /* ── auto-play ── */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    if (paused) return;

    setProgress(0);
    const step = 100 / (AUTO_PLAY_MS / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p + step >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return p + step;
      });
    }, 50);

    timerRef.current = setTimeout(() => {
      goNext();
    }, AUTO_PLAY_MS);
  }, [paused, goNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused, resetTimer]);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  /* ── touch ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setPaused(false);
  };

  /* ── mouse drag ── */
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    setPaused(true);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    isDragging.current = false;
    mouseStartX.current = null;
    setPaused(false);
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    mouseStartX.current = null;
    setPaused(false);
  };

  /* ── slide offset ── */
  const slideOffset = (idx: number) => {
    if (idx === current) return "translateX(0%)";
    if (idx === prev) {
      return direction === "left" ? "translateX(-100%)" : "translateX(100%)";
    }
    // hidden
    return direction === "left" ? "translateX(100%)" : "translateX(-100%)";
  };

  const slideVisible = (idx: number) => idx === current || idx === prev;

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: "clamp(420px, 80vh, 820px)" }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Hero slideshow"
    >
      {/* ── Slides ── */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          aria-hidden={idx !== current}
          style={{
            position: "absolute",
            inset: 0,
            transform: slideOffset(idx),
            transition: slideVisible(idx)
              ? "transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)"
              : "none",
            willChange: "transform",
            zIndex: idx === current ? 2 : idx === prev ? 1 : 0,
          }}
        >
          {/* Image with Ken-Burns */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              animation: idx === current ? "heroPan 8s ease-in-out infinite alternate" : "none",
            }}
          />

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.08) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 50%)",
            }}
          />

          {/* Content */}
          <div
            className="absolute inset-0 flex flex-col justify-end md:justify-center px-6 pb-20 md:pb-0 md:px-16 lg:px-24"
            style={{ maxWidth: "640px" }}
          >
            {/* Badge */}
            <span
              className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-white mb-4 bg-gradient-to-r ${slide.accent}`}
              style={{
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s 0.1s, transform 0.6s 0.1s",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              {slide.badge}
            </span>

            {/* Headline */}
            <h1
              className="text-white font-black leading-none mb-3"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 5rem)",
                letterSpacing: "-0.02em",
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.7s 0.2s, transform 0.7s 0.2s",
              }}
            >
              {slide.headline}
            </h1>

            {/* Subline */}
            <p
              className="text-white/75 font-medium mb-8"
              style={{
                fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
                letterSpacing: "0.02em",
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.7s 0.32s, transform 0.7s 0.32s",
              }}
            >
              {slide.subline}
            </p>

            {/* CTA */}
            <div
              style={{
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.7s 0.44s, transform 0.7s 0.44s",
              }}
            >
              <Link
                href={slide.ctaHref}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black tracking-widest uppercase text-white bg-gradient-to-r ${slide.accent} shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200`}
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                tabIndex={idx === current ? 0 : -1}
              >
                {slide.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* ── Prev / Next Arrows ── */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => navigate(idx, idx > current ? "left" : "right")}
            aria-label={`Go to slide ${idx + 1}`}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              width: idx === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: idx === current ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            {idx === current && (
              <span
                className="absolute inset-y-0 left-0 h-full rounded-full bg-white/40"
                style={{ width: `${progress}%`, transition: "width 50ms linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
        <span className="text-white font-black text-xs tracking-widest">
          {String(current + 1).padStart(2, "0")}
          <span className="text-white/40"> / </span>
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── Ken-Burns keyframe injected ── */}
      <style>{`
        @keyframes heroPan {
          0%   { transform: scale(1)    translateX(0px); }
          50%  { transform: scale(1.06) translateX(-8px); }
          100% { transform: scale(1.03) translateX(4px); }
        }
      `}</style>
    </section>
  );
}
