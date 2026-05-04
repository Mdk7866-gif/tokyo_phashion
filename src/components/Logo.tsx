"use client";

import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto", light = false }) => {
  const color = light ? "white" : "black";
  
  return (
    <svg 
      viewBox="0 0 500 140" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Kanji */}
      <text x="90" y="105"
            textAnchor="middle"
            fontSize="80"
            fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
            fontWeight="700"
            fill={color}>
        東
      </text>

      {/* Right Kanji */}
      <text x="190" y="105"
            textAnchor="middle"
            fontSize="80"
            fontFamily="'Noto Serif JP', 'Hiragino Mincho ProN', serif"
            fontWeight="700"
            fill={color}>
        京
      </text>

      {/* Red Circle */}
      <circle cx="140" cy="80" r="15" fill="#E60012"/>

      {/* TOKYO */}
      <text x="330" y="105"
            textAnchor="middle"
            fontSize="46"
            fontFamily="'Playfair Display', serif"
            letterSpacing="5"
            fill={color}>
        TOKYO
      </text>
    </svg>
  );
};

export default Logo;
