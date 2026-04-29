"use client";

import React from "react";

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string; // Main color for the "Tokyo" text
  accentColor?: string; // Color for the Red Sun
  showText?: boolean;
}

export default function Logo({
  className = "",
  width = "auto",
  height = "auto",
  color = "currentColor",
  accentColor = "#e11d48",
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ width, height }}>
      <svg
        viewBox="100 80 200 260"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        style={{ minWidth: "40px", maxWidth: "100%" }}
      >
        {/* Red Sun Circle */}
        <circle cx="200" cy="150" r="70" fill={accentColor} />

        {/* Minimal Pagoda Shape */}
        <g fill="currentColor">
          <rect x="185" y="140" width="30" height="80" />
          <polygon points="170,140 230,140 200,115" />
          <polygon points="175,165 225,165 200,140" />
          <polygon points="180,190 220,190 200,165" />
        </g>

        {showText && (
          <>
            {/* TOKYO Text */}
            <text
              x="200"
              y="260"
              textAnchor="middle"
              fontSize="40"
              fill={color}
              fontFamily="Georgia, serif"
              letterSpacing="4"
              fontWeight="bold"
            >
              TOKYO
            </text>

            {/* FASHION Text */}
            <text
              x="200"
              y="290"
              textAnchor="middle"
              fontSize="16"
              fill={color}
              opacity="0.7"
              letterSpacing="8"
            >
              FASHION
            </text>

            {/* Japanese Text */}
            <text
              x="200"
              y="320"
              textAnchor="middle"
              fontSize="18"
              fill={accentColor}
              fontWeight="bold"
            >
              東京ファッション
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
