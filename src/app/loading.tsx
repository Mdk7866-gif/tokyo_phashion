"use client";

import React, { useState, useEffect } from "react";

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Completely unmount after 2.8 seconds (giving 0.8s for fade out animation)
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b0b] overflow-hidden transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-10 flex items-center justify-center">
          <svg
            viewBox="100 60 200 280"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Red Sun Circle with pulse and reveal */}
            <circle
              cx="200"
              cy="150"
              r="70"
              fill="#e11d48"
              className="animate-logo"
              style={{ transformOrigin: 'center', animationDelay: '0.1s' }}
            />

            {/* Tree Shape - Growing Animation */}
            <g
              fill="#0b0b0b"
              style={{
                animation: 'treeGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: '0.4s',
                transformOrigin: 'center bottom',
                opacity: 0
              }}
            >
              {/* Trunk */}
              <rect x="192" y="160" width="16" height="70" rx="2" />

              {/* Tree layers (bonsai style) */}
              <polygon points="200,110 160,150 240,150" />
              <polygon points="200,135 170,175 230,175" />
              <polygon points="200,160 180,200 220,200" />
            </g>

            {/* TOKYO Text */}
            <text
              x="200"
              y="260"
              textAnchor="middle"
              fontSize="40"
              fill="#ffffff"
              fontFamily="Georgia, serif"
              letterSpacing="4"
              fontWeight="bold"
              style={{
                animation: 'logoReveal 0.8s ease-out forwards',
                animationDelay: '0.6s',
                opacity: 0
              }}
            >
              TOKYO
            </text>

            {/* FASHION Text */}
            <text
              x="200"
              y="290"
              textAnchor="middle"
              fontSize="16"
              fill="#aaaaaa"
              letterSpacing="8"
              style={{
                animation: 'logoReveal 0.8s ease-out forwards',
                animationDelay: '0.8s',
                opacity: 0
              }}
            >
              FASHION
            </text>

            {/* Japanese Text */}
            <text
              x="200"
              y="320"
              textAnchor="middle"
              fontSize="18"
              fill="#e11d48"
              fontWeight="bold"
              style={{
                animation: 'logoReveal 1.2s ease-out forwards',
                animationDelay: '1s',
                opacity: 0
              }}
            >
              東京ファッション
            </text>
          </svg>

          {/* Decorative Rings - Larger for splash screen */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-[-20px] rounded-full border border-red-600/20 animate-pulse" style={{ animationDuration: '2s' }} />
        </div>

        {/* Loading Bar */}
        <div className="w-48 md:w-64 h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(225,29,72,0.5)]">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-red-500 to-transparent w-full"
            style={{
              animation: 'loadingProgress 1.5s ease-in-out infinite'
            }}
          />
        </div>

        <p className="mt-8 text-xs font-black tracking-[0.5em] uppercase text-zinc-400 animate-pulse">
          Initializing Style
        </p>
      </div>

      <style jsx>{`
        @keyframes loadingProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
          @keyframes treeGrow {
  0% {
    transform: scaleY(0.2) translateY(40px);
    opacity: 0;
  }
  60% {
    transform: scaleY(1.1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
      `}</style>
    </div>
  );
}
