"use client";

import React, { useEffect, useState } from "react";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShouldRender(true);
      setIsVisible(true);
      sessionStorage.setItem("hasSeenSplash", "true");
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation before removing from DOM
        setTimeout(() => setShouldRender(false), 1000);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

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
