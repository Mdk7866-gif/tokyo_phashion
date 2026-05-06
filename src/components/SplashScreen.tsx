"use client";

import React, { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (!hasSeenSplash) {
      requestAnimationFrame(() => {
        setShouldRender(true);
      });

      const animTimer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);

        setTimeout(() => {
          setShouldRender(false);

          if (onComplete) {
            onComplete();
          }
        }, 1000);

        sessionStorage.setItem("hasSeenSplash", "true");
      }, 3000);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(hideTimer);
      };
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${
        isVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`transform transition-all duration-1000 ease-out ${
          isVisible
            ? "scale-100 opacity-100"
            : "scale-110 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 400 260"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[78vw] max-w-[420px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[800px] xl:max-w-[950px] h-auto"
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="white" />

          {/* Left Kanji */}
          <text
            x="110"
            y="130"
            textAnchor="middle"
            fontSize="120"
            fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
            fontWeight="700"
            fill="black"
          >
            東
          </text>

          {/* Right Kanji */}
          <text
            x="290"
            y="125"
            textAnchor="middle"
            fontSize="120"
            fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
            fontWeight="700"
            fill="black"
          >
            京
          </text>

          {/* Red Circle */}
          <circle cx="200" cy="100" r="32" fill="#E60012" />

          {/* TOKYO */}
          <text
            x="200"
            y="205"
            textAnchor="middle"
            fontSize="70"
            fontFamily="'Playfair Display', serif"
            letterSpacing="4"
            fill="black"
          >
            TOKYO
          </text>
        </svg>
      </div>
    </div>
  );
};

export default SplashScreen;