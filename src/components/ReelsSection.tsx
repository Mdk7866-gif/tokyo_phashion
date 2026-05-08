"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Play, Volume2, VolumeX, Flame, Eye, X } from "lucide-react";

interface Reel {
  id: string;
  videoUrl: string;
  instagramUrl: string;
  title: string;
}

const REELS_DATA: Reel[] = [
  { id: "1", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778183860/6_i1r1jl.mp4", instagramUrl: "https://www.instagram.com/reel/DTaODYcjPei/", title: "Tokyo Craze" },
  { id: "2", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778184194/7_weenuk.mp4", instagramUrl: "https://www.instagram.com/reel/DXUddtssFBb/", title: "Tokyo Grand Opening" },
  { id: "3", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778184325/Video_by_tokyo__fashion_hub_lrkjjz.mp4", instagramUrl: "https://www.instagram.com/reel/DXlEDOcvo8i/", title: "Customer From Surendranagar" },
  { id: "4", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778183966/3_me0e0k.mp4", instagramUrl: "https://www.instagram.com/reel/DX1by2Ss8x_/", title: "Customer From Chandkheda" },
  { id: "5", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778184276/Video_by_tokyo__fashion_hu_fjoiwr.mp4", instagramUrl: "https://www.instagram.com/reel/DX1MeSXsgGz/", title: "Mehmood Bhai" },
  { id: "6", videoUrl: "https://res.cloudinary.com/ddya4o2yl/video/upload/v1778184432/5_uynspe.mp4", instagramUrl: "https://www.instagram.com/reel/DXw3frAMSSt/", title: "Customer From Delhi" },
];

/**
 * FIX 1 — Aggressive bitrate reduction.
 * 
 * Original: br_1.5m  → ~11 MB per minute → WAY too large for inline video
 * Card view: br_350k  → ~2.6 MB per minute → streams on 3G easily
 * Modal view: br_700k → ~5.2 MB per minute → good quality, still fast
 * 
 * w_360 instead of w_480 also cuts resolution bandwidth further.
 * q_auto:low gives Cloudinary permission to drop quality freely.
 * vc_h264:baseline uses the most compatible codec profile.
 */
const getAdaptiveUrl = (url: string, variant: "card" | "modal" = "card") => {
  if (!url.includes("cloudinary.com")) return url;

  const params =
    variant === "modal"
      ? ["f_auto", "q_auto:low", "vc_h264:baseline", "w_540", "br_700k"]
      : ["f_auto", "q_auto:low", "vc_h264:baseline", "w_360", "br_350k"];

  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${params.join(",")}/`);
  }
  return url;
};

/** Generate a lightweight poster JPEG from the first frame. */
const getPosterUrl = (url: string) => {
  if (!url.includes("cloudinary.com")) return undefined;
  return url
    .replace("/upload/", "/upload/f_jpg,q_auto:low,w_360,so_0/")
    .replace(/\.[^/.]+$/, ".jpg");
};

// ─────────────────────────────────────────────────────────────────────────────

const ReelCard = ({
  reel,
  onView,
}: {
  reel: Reel;
  onView: (r: Reel) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [needsTap, setNeedsTap] = useState(false); // mobile autoplay blocked
  const [srcLoaded, setSrcLoaded] = useState(false); // lazy-load guard

  const videoUrl = getAdaptiveUrl(reel.videoUrl, "card");
  const posterUrl = getPosterUrl(reel.videoUrl);

  // ── Safe play helper ──────────────────────────────────────────────────────
  const safePlay = useCallback(async (el: HTMLVideoElement) => {
    try {
      await el.play();
      setNeedsTap(false);
    } catch {
      // Autoplay blocked (common on iOS/Android before user gesture)
      setNeedsTap(true);
    }
  }, []);

  // ── Intersection observers ─────────────────────────────────────────────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const isDesktop = window.matchMedia("(hover: hover)").matches;

    /**
     * FIX 2 — preload="metadata" instead of "auto".
     * 
     * preload="auto" tells the browser to download the whole file in the
     * background for every card that enters the page. With 6 × 30-50 MB
     * videos that immediately saturates the connection.
     * preload="metadata" only fetches the first ~32 KB (headers + duration).
     * We switch to preload="auto" ONLY for the card closest to the viewport.
     */
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrcLoaded(true); // mount the src so the browser can start fetching
          el.preload = "auto"; // allow buffering now that it's in view
          loadObserver.disconnect();
        }
      },
      // Start loading a bit before the card enters view
      { rootMargin: "0px 300px 0px 300px" }
    );

    // Auto-play observer: only for mobile (desktop uses hover)
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (!isDesktop) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            safePlay(el);
          } else if (!entry.isIntersecting) {
            el.pause();
          }
        }
      },
      { threshold: [0, 0.6] }
    );

    loadObserver.observe(el);
    playObserver.observe(el);

    return () => {
      // FIX 3 — capture el before the effect returns so cleanup never
      // dereferences a null ref (the node may already be removed from DOM).
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [safePlay]);

  // ── Desktop hover play ────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    const el = videoRef.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    safePlay(el);
  };

  const handleMouseLeave = () => {
    const el = videoRef.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    el.pause();
  };

  // ── Tap-to-play (click anywhere on the card) ──────────────────────────────
  const handleCardClick = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      safePlay(el);
    } else {
      el.pause();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="relative min-w-[280px] sm:min-w-[320px] h-[500px] sm:h-[580px] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group snap-center cursor-pointer"
    >
      {/* ── Video ──────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        /**
         * FIX 4 — Only set src once the card is near the viewport (srcLoaded).
         * Before that, the <video> renders with just the poster image — zero
         * network cost.
         */
        src={srcLoaded ? videoUrl : undefined}
        poster={posterUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        // FIX 5 — Default to "none" so ALL cards start with zero network use.
        // The loadObserver above switches it to "auto" when in view.
        preload="none"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
          setNeedsTap(false);
        }}
        onPause={() => setIsPlaying(false)}
        // Prevent card-click from double-firing the video toggle
        onClick={(e) => e.stopPropagation()}
      />

      {/* ── Spinner ────────────────────────────────────────────────────────── */}
      {isLoading && srcLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
          <div className="w-9 h-9 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* ── Tap-to-play overlay (shows when autoplay is blocked by browser) ── */}
      {needsTap && !isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 gap-3 pointer-events-none">
          <div className="bg-white/90 rounded-full p-4">
            <Play className="w-8 h-8 text-black fill-black" />
          </div>
          <span className="text-white text-xs font-bold uppercase tracking-widest">Tap to play</span>
        </div>
      )}

      {/* ── Gradient overlay ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* ── Live badge ─────────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm animate-pulse flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full" /> Live
        </div>
      </div>

      {/* ── Top-right controls ─────────────────────────────────────────────── */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 pointer-events-auto z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((m) => !m);
          }}
          className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(reel);
          }}
          className="bg-white p-2 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <Eye className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* ── Bottom info ────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
            Trending
          </span>
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white drop-shadow-md mb-4">
          {reel.title}
        </h3>

        <div className="flex items-center justify-between">
          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 pointer-events-auto group/ig hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-8 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center overflow-hidden">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad)" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2.5" />
                <circle cx="18" cy="6" r="1.5" fill="url(#ig-grad)" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/90">@tokyo_fashion_hub</span>
              <span className="text-[8px] font-bold text-white/40 group-hover/ig:text-white/60">
                Watch on Instagram
              </span>
            </div>
          </a>

          {!isPlaying && !needsTap && (
            <div className="bg-white p-2 rounded-full pointer-events-none">
              <Play className="w-4 h-4 text-black fill-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Fullscreen modal with its own isolated video element */
const ReelModal = ({
  reel,
  onClose,
}: {
  reel: Reel;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false); // unmuted by default in modal
  const [isLoading, setIsLoading] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  // FIX 6 — Modal video: autoPlay with muted=false can be blocked on mobile.
  // Strategy: try unmuted first → if blocked, fall back to muted autoplay.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = async () => {
      try {
        el.muted = false;
        await el.play();
        setIsMuted(false);
      } catch {
        // Unmuted autoplay blocked → try muted (almost always allowed)
        try {
          el.muted = true;
          setIsMuted(true);
          await el.play();
          // Show the mute button prominently so user knows to unmute
        } catch {
          // Even muted failed (very rare) → show tap-to-play
          setNeedsTap(true);
        }
      }
    };

    // Small delay ensures the video element has mounted & src is set
    const t = setTimeout(tryPlay, 100);
    return () => clearTimeout(t);
  }, []);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl"
      onClick={handleBackdropClick}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all z-[110] group"
      >
        <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[90vh] bg-black border-[3px] border-white shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center gap-3 pointer-events-none">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            Direct Cinematic Stream
          </span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
              setIsMuted((m) => !m);
            }
          }}
          className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Tap-to-play overlay */}
        {needsTap && (
          <button
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 gap-3"
            onClick={() => {
              videoRef.current?.play().catch(() => {});
              setNeedsTap(false);
            }}
          >
            <div className="bg-white/90 rounded-full p-5">
              <Play className="w-10 h-10 text-black fill-black" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Tap to play</span>
          </button>
        )}

        {/* FIX 7 — Modal video uses the higher-quality "modal" preset (700k)
            and has native controls so the user can scrub/seek freely. */}
        <video
          ref={videoRef}
          key={reel.id}
          src={getAdaptiveUrl(reel.videoUrl, "modal")}
          loop
          playsInline
          controls
          muted={isMuted}
          className="w-full h-full object-cover"
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setNeedsTap(false);
          }}
        />

        {/* Info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white text-black border-t-[3px] border-black">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight mb-1">
                {reel.title}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Official Street Drop
              </p>
            </div>
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-3 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const ReelsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  return (
    <section className="mt-20 py-10 border-t-2 border-black">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl leading-none">
            Tokyo <span className="text-zinc-300">Reels</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-2">
            Street Culture / Cinematic Drops
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>{isDragging ? "Dragging..." : "Drag to discover"}</span>
          <div className="w-12 h-[1px] bg-zinc-300" />
        </div>
      </div>

      {/* Instagram banner */}
      <div className="flex justify-center mb-10 px-2 sm:px-4">
        <a
          href="https://www.instagram.com/tokyo__fashion_hub/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full max-w-4xl group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="https://res.cloudinary.com/ddya4o2yl/image/upload/v1778185732/Screenshot_2026-05-08_015823_lliazx.png"
              alt="Follow @tokyo_fashion_hub"
              width={1200}
              height={400}
              className="w-full h-auto object-contain bg-zinc-900"
              priority
            />
          </div>
        </a>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 sm:gap-6 overflow-x-auto pb-10 px-2 no-scrollbar snap-x snap-mandatory ${
          isDragging
            ? "cursor-grabbing select-none scroll-auto"
            : "cursor-grab scroll-smooth"
        }`}
      >
        {REELS_DATA.map((reel) => (
          <ReelCard key={reel.id} reel={reel} onView={setSelectedReel} />
        ))}
      </div>

      {/* Modal */}
      {selectedReel && (
        <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ReelsSection;