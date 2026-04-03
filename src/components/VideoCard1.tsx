import React from "react";
import Image from "next/image";

interface VideoCard1Props {
  videoSrc: string;
  title: string;
}

const VideoCard1: React.FC<VideoCard1Props> = ({ videoSrc, title }) => {
  return (
    <div className="relative w-[140px] md:w-[240px] aspect-[9/16] shrink-0 rounded-2xl overflow-hidden cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-500 border border-white/5">
      {/* Video Content */}
      {videoSrc.endsWith('.mp4') || videoSrc.includes('video') ? (
        <video
          src={videoSrc}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image
          src={videoSrc}
          alt={title}
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      
      {/* Label at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <h3 className="text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 group-hover:translate-x-1">
          {title}
        </h3>
      </div>
      
      {/* Play Indicator (Aesthetic) */}
      <div className="absolute top-4 right-4 z-10 opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
        </svg>
      </div>
    </div>
  );
};

export default VideoCard1;
