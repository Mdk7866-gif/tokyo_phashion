"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Flame, Eye, X, ExternalLink } from "lucide-react";

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
 * STREAMING STRATEGY
 * ──────────────────
 * fl_progressive   → Moves the MP4 "moov atom" to the very start of the file.
 *                    Without this, the browser must download the ENTIRE file
 *                    before it can decode frame 1. This single flag is the
 *                    most impactful fix for "video won't start".
 *
 * vc_h264:baseline → Most compatible H.264 profile (old Android, WebViews).
 *
 * br_300k (card)   → 300 kbps × 60 s ≈ 2.25 MB — plays on 2G.
 * br_600k (modal)  → 600 kbps × 60 s ≈ 4.5 MB — better quality.
 *
 * q_auto:low       → Lets Cloudinary drop quality freely to hit the bitrate.
 */
const getStreamUrl = (url: string, variant: "card" | "modal" = "card") => {
  if (!url.includes("cloudinary.com")) return url;
  const params = variant === "modal"
    ? "f_auto,q_auto:low,vc_h264:baseline,w_480,br_600k,fl_progressive"
    : "f_auto,q_auto:low,vc_h264:baseline,w_360,br_300k,fl_progressive";
  return url.includes("/upload/")
    ? url.replace("/upload/", `/upload/${params}/`)
    : url;
};

const getPosterUrl = (url: string) =>
  url.includes("cloudinary.com")
    ? url.replace("/upload/", "/upload/f_jpg,q_auto:low,w_360,so_0/").replace(/\.[^/.]+$/, ".jpg")
    : undefined;

// ─────────────────────────────────────────────────────────────────────────────
// ReelCard
// ─────────────────────────────────────────────────────────────────────────────

const ReelCard = ({ reel, onView }: { reel: Reel; onView: (r: Reel) => void }) => {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isMuted,      setIsMuted]      = useState(true);
  const [isBuffering,  setIsBuffering]  = useState(false);
  const [srcReady,     setSrcReady]     = useState(false);

  const videoUrl  = getStreamUrl(reel.videoUrl, "card");
  const posterUrl = getPosterUrl(reel.videoUrl);

  const safePlay = useCallback(async (el: HTMLVideoElement) => {
    try { 
      setIsBuffering(true);
      await el.play(); 
      setIsBuffering(false);
      setIsPlaying(true);
    }
    catch { setIsBuffering(false); }
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const isDesktop = window.matchMedia("(hover: hover)").matches;

    // Lazy-load: mount src only when ~300px from view
    const loadObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSrcReady(true); el.preload = "auto"; loadObs.disconnect(); }
    }, { rootMargin: "0px 300px 0px 300px" });

    // Auto-play on mobile when 60% visible
    const playObs = new IntersectionObserver(([e]) => {
      if (!isDesktop) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) safePlay(el);
        else el.pause();
      }
    }, { threshold: [0, 0.6] });

    loadObs.observe(el);
    playObs.observe(el);
    return () => { loadObs.disconnect(); playObs.disconnect(); };
  }, [safePlay]);

  const onEnter = () => {
    const el = videoRef.current;
    if (el && window.matchMedia("(hover: hover)").matches) safePlay(el);
  };
  const onLeave = () => {
    const el = videoRef.current;
    if (el && window.matchMedia("(hover: hover)").matches) el.pause();
  };
  const onCardClick = () => {
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
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onCardClick}
      className="relative min-w-[280px] sm:min-w-[320px] h-[500px] sm:h-[580px] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group snap-center cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        src={srcReady ? videoUrl : undefined}
        poster={posterUrl}
        className="w-full h-full object-cover pointer-events-none"
        loop muted={isMuted} playsInline preload="none"
        disablePictureInPicture disableRemotePlayback
        onLoadStart={() => setIsBuffering(true)}
        onCanPlay={()  => setIsBuffering(false)}
        onWaiting={()  => setIsBuffering(true)}
        onPlaying={()  => { setIsBuffering(false); setIsPlaying(true); }}
        onPause={()    => setIsPlaying(false)}
      />

      {/* Single custom spinner — no native controls = no duplicate ring */}
      {isBuffering && srcReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <div className="w-9 h-9 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/90 rounded-full p-4 shadow-2xl scale-110 transition-transform active:scale-95">
            <Play className="w-8 h-8 text-black fill-black ml-1" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm animate-pulse flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full" /> Live
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-3 pointer-events-auto z-30">
        <button
          onClick={e => { e.stopPropagation(); setIsMuted(m => !m); }}
          className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onView(reel); }}
          className="bg-white p-2 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <Eye className="w-4 h-4 text-black" />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Trending</span>
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white drop-shadow-md mb-4">
          {reel.title}
        </h3>
        <div className="flex items-center justify-between">
          <a
            href={reel.instagramUrl}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-3 pointer-events-auto hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#f09433" /><stop offset="25%"  stopColor="#e6683c" />
                    <stop offset="50%"  stopColor="#dc2743" /><stop offset="75%"  stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2.5"/>
                <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2.5"/>
                <circle cx="18" cy="6" r="1.5" fill="url(#ig)"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/90">@tokyo_fashion_hub</span>
              <span className="text-[8px] font-bold text-white/40">Watch on Instagram</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReelModal  —  NO native <controls>; fully custom UI → zero double-spinner
// ─────────────────────────────────────────────────────────────────────────────

const ReelModal = ({ reel, onClose }: { reel: Reel; onClose: () => void }) => {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isMuted,     setIsMuted]     = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress,    setProgress]    = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const tryPlay = async () => {
      try { el.muted = false; setIsBuffering(true); await el.play(); setIsMuted(false); setIsBuffering(false); setIsPlaying(true); return; } catch {}
      try { el.muted = true;  setIsBuffering(true); await el.play(); setIsMuted(true); setIsBuffering(false); setIsPlaying(true);  return; } catch { setIsBuffering(false); }
    };
    const t = setTimeout(tryPlay, 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const tick = () => { if (el.duration) setProgress((el.currentTime / el.duration) * 100); };
    el.addEventListener("timeupdate", tick);
    return () => el.removeEventListener("timeupdate", tick);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el  = videoRef.current;
    const bar = progressRef.current;
    if (!el || !bar || !el.duration) return;
    const rect = bar.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration;
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      setIsBuffering(true);
      el.play().then(() => { setIsBuffering(false); setIsPlaying(true); }).catch(() => { setIsBuffering(false); });
    } else {
      el.pause();
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all z-[110] group"
      >
        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <div className="relative w-full max-w-[400px] aspect-[9/16] max-h-[90vh] bg-black border-[3px] border-white shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">

        {/* Video — NO controls attr → no native buffering ring */}
        <video
          ref={videoRef}
          key={reel.id}
          src={getStreamUrl(reel.videoUrl, "modal")}
          loop playsInline muted={isMuted}
          className="w-full h-full object-cover"
          disablePictureInPicture disableRemotePlayback
          onLoadStart={() => setIsBuffering(true)}
          onCanPlay={()  => setIsBuffering(false)}
          onWaiting={()  => setIsBuffering(true)}
          onPlaying={()  => { setIsBuffering(false); setIsPlaying(true); }}
          onPause={()    => setIsPlaying(false)}
          onClick={togglePlay}
        />

        {/* Single spinner — only ours */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-12 h-12 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-white rounded-full p-5 shadow-xl transition-transform active:scale-95">
              <Play className="w-10 h-10 text-black fill-black ml-1" />
            </div>
          </div>
        )}

        {/* Top label */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">Direct Cinematic Stream</span>
          </div>
        </div>

        {/* Bottom custom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-5 pt-10 pb-5">

          {/* Progress bar — click to seek */}
          <div
            ref={progressRef}
            onClick={seek}
            className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/bar"
          >
            <div
              className="h-full bg-white rounded-full relative transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 transition-colors"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-white fill-white" />
                  : <Play  className="w-4 h-4 text-white fill-white" />}
              </button>
              <button
                onClick={toggleMute}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
              <span className="text-white text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">
                {reel.title}
              </span>
            </div>

            <a
              href={reel.instagramUrl}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors rounded-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ExternalLink className="w-3 h-3" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReelsSection
// ─────────────────────────────────────────────────────────────────────────────

const ReelsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging,   setIsDragging]   = useState(false);
  const [startX,       setStartX]       = useState(0);
  const [scrollLeft,   setScrollLeft]   = useState(0);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft = scrollLeft - (e.pageX - scrollRef.current.offsetLeft - startX) * 2;
  };

  return (
    <section className="mt-20 py-10 border-t-2 border-black">
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
          <span>{isDragging ? "Dragging…" : "Drag to discover"}</span>
          <div className="w-12 h-[1px] bg-zinc-300" />
        </div>
      </div>

      <div className="flex justify-center mb-10 px-2 sm:px-4">
        <a
          href="https://www.instagram.com/tokyo__fashion_hub/"
          target="_blank" rel="noopener noreferrer"
          className="relative w-full max-w-4xl group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="https://res.cloudinary.com/ddya4o2yl/image/upload/v1779135335/Screenshot_2026-05-19_014404_xibfya.png"
              alt="Follow @tokyo_fashion_hub"
              width={1200} height={400}
              className="w-full h-auto object-contain bg-zinc-900"
              priority
            />
          </div>
        </a>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={()    => setIsDragging(false)}
        onMouseMove={onMouseMove}
        className={`flex gap-4 sm:gap-6 overflow-x-auto pb-10 px-2 no-scrollbar snap-x snap-mandatory ${
          isDragging ? "cursor-grabbing select-none scroll-auto" : "cursor-grab scroll-smooth"
        }`}
      >
        {REELS_DATA.map(reel => (
          <ReelCard key={reel.id} reel={reel} onView={setSelectedReel} />
        ))}
      </div>

      {selectedReel && (
        <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
      `}</style>
    </section>
  );
};

export default ReelsSection;