"use client";

import React, { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check session storage on mount
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (!hasSeenSplash) {
      // Use requestAnimationFrame to avoid sync setState in effect
      requestAnimationFrame(() => {
        setShouldRender(true);
      });
      // Small timeout to ensure the component is mounted before starting animation
      const animTimer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation
        setTimeout(() => {
          setShouldRender(false);
          if (onComplete) onComplete();
        }, 1000);
        // Only set after we are sure we are hiding, or simply on first show
        sessionStorage.setItem("hasSeenSplash", "true");
      }, 3000);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(hideTimer);
      };
    } else {
       if (onComplete) onComplete();
    }
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className={`transform transition-all duration-1000 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
        <svg width="400" height="260" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="max-w-[80vw] h-auto">
          {/* Background */}
          <rect width="100%" height="100%" fill="white"/>

          {/* Left Kanji */}
          <text x="140" y="130"
                textAnchor="middle"
                fontSize="90"
                fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
                fontWeight="700"
                fill="black">
            東
          </text>

          {/* Right Kanji */}
          <text x="260" y="130"
                textAnchor="middle"
                fontSize="90"
                fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
                fontWeight="700"
                fill="black">
            京
          </text>

          {/* Red Circle */}
          <circle cx="200" cy="110" r="15" fill="#E60012"/>

          {/* TOKYO */}
          <text x="200" y="175"
                textAnchor="middle"
                fontSize="38"
                fontFamily="'Playfair Display', serif"
                letterSpacing="4"
                fill="black">
            TOKYO
          </text>
        </svg>
      </div>
    </div>
  );
};

export default SplashScreen;
