"use client";

import React, { useRef, useEffect, useState } from "react";
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

// Network-aware optimization function
const getAdaptiveUrl = (url: string, isFullView = false) => {
  if (!url.includes("cloudinary.com")) return url;
  
  // Default quality settings
  let quality = "q_auto";
  let width = isFullView ? "w_1280" : "w_600";
  
  // Check for Network Information API support
  if (typeof navigator !== "undefined") {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      // If user has "Save Data" on, or is on a slow connection (3g/2g)
      if (conn.saveData || conn.effectiveType === '3g' || conn.effectiveType === '2g') {
        quality = "q_auto:low";
        width = isFullView ? "w_720" : "w_400";
      } else if (conn.effectiveType === '4g') {
        quality = isFullView ? "q_auto:best" : "q_auto:good";
      }
    }
  }

  if (url.includes("/upload/")) {
    // f_auto: best format for browser
    // vc_h264: most compatible video codec
    return url.replace("/upload/", `/upload/f_auto,${quality},${width},vc_h264/`);
  }
  return url;
};

const ReelCard = ({ reel, index, onView }: { reel: Reel, index: number, onView: (r: Reel) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isNearView, setIsNearView] = useState(false);



  const videoUrl = getAdaptiveUrl(reel.videoUrl);
  const posterUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg");

  useEffect(() => {
    // 1. Observer for Preloading (Near View)
    const preloadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsNearView(true);
      });
    }, { rootMargin: "0px" }); // Tightened to only load when touching viewport

    // 2. Observer for Playing (In View)
    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          setIsInView(false);
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, { threshold: 0.6 });

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      preloadObserver.observe(currentVideoRef);
      playObserver.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        preloadObserver.unobserve(currentVideoRef);
        playObserver.unobserve(currentVideoRef);
        currentVideoRef.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-w-[260px] sm:min-w-[300px] h-[450px] sm:h-[530px] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group snap-center">
      {/* Video Content */}
      <video
        ref={videoRef}
        src={isNearView ? videoUrl : undefined}
        poster={posterUrl}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loop
        muted={isMuted}
        playsInline
        preload={isNearView ? "auto" : "none"}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && isNearView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm animate-pulse flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full" /> Live
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-3 pointer-events-auto z-30">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
        <button 
          onClick={() => onView(reel)}
          className="bg-white p-2 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <Eye className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Bottom Info */}
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
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 pointer-events-auto group/ig hover:opacity-80 transition-opacity"
          >
             <div className="w-8 h-8 rounded-full border border-white/20 bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagram-gradient)" strokeWidth="2.5" />
                  <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" strokeWidth="2.5" />
                  <circle cx="18" cy="6" r="1.5" fill="url(#instagram-gradient)" />
                </svg>
             </div>
             <div className="flex flex-col">
               <span className="text-[9px] font-black text-white/90">@tokyo_fashion_hub</span>
               <span className="text-[8px] font-bold text-white/40 group-hover/ig:text-white/60">Watch on Instagram</span>
             </div>
          </a>
          
          {!isPlaying && (
            <button className="bg-white p-2 rounded-full">
              <Play className="w-4 h-4 text-black fill-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="mt-20 py-10 border-t-2 border-black">
      {/* ... (Header content) ... */}
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

      {/* Instagram Handle Image */}
      <div className="flex justify-center mb-10 px-2 sm:px-4">
        <a
          href="https://www.instagram.com/tokyo__fashion_hub/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full max-w-4xl group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-red-500 to-magenta-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
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

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 sm:gap-6 overflow-x-auto pb-10 px-2 no-scrollbar snap-x snap-mandatory ${isDragging ? 'cursor-grabbing select-none scroll-auto' : 'cursor-grab scroll-smooth'}`}
      >
        {REELS_DATA.map((reel, idx) => (
          <ReelCard key={reel.id} reel={reel} index={idx} onView={setSelectedReel} />
        ))}
      </div>

      {/* Full Screen Modal */}
      {selectedReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button 
            onClick={() => setSelectedReel(null)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all z-[110] group"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[90vh] bg-black border-[3px] border-white shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
             {/* Header in Modal */}
             <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Direct Cinematic Stream</span>
             </div>

             <video 
               src={getAdaptiveUrl(selectedReel.videoUrl, true)} 
               autoPlay 
               loop 
               controls 
               playsInline
               className="w-full h-full object-cover"
             />
             
             {/* Info Bar */}
             <div className="p-5 bg-white text-black border-t-[3px] border-black">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight mb-1">{selectedReel.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Official Street Drop</p>
                  </div>
                  <a 
                    href={selectedReel.instagramUrl} 
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
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ReelsSection;
