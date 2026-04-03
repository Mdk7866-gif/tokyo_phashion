"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface CarouselItem {
  title: string;
  image: string;
  originalPrice: string;
  currentPrice: string;
  discount: string;
}

interface PhotoCard2Props {
  imageSrc: string;
  title: string;
  originalPrice: string;
  currentPrice: string;
  discount: string;
}

export const PhotoCard2Card: React.FC<PhotoCard2Props> = ({ imageSrc, title, originalPrice, currentPrice, discount }) => {
  return (
    <div className="flex flex-col w-[200px] md:w-[260px] shrink-0 overflow-hidden bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 group cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative">
      {/* Discount Badge */}
      <div className="absolute top-0 left-0 bg-black text-white text-[9px] md:text-[10px] font-black px-3 py-1.5 z-10 tracking-widest uppercase rounded-br-lg shadow-sm">
        {discount}
      </div>
      
      {/* Image */}
      <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 md:gap-2 items-center justify-center text-center w-full">
        <h3 className="text-[11px] md:text-xs font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem] w-full text-center">
          {title}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1 w-full text-center">
          <span className="text-[10px] md:text-[11px] text-gray-400 line-through">
            {originalPrice}
          </span>
          <span className="text-xs md:text-sm font-black text-black">
            {currentPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

interface PhotoCard2CarouselProps {
  items: CarouselItem[];
}

export default function PhotoCard2Carousel({ items }: PhotoCard2CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden h-[380px] md:h-[480px]">
      {items.map((item, index) => {
        const offset = (index - activeIndex + items.length) % items.length;
        const normalizedOffset = offset > Math.floor(items.length / 2) ? offset - items.length : offset;

        let zIndex = 0;
        let opacity = 1;
        let scale = 1;

        if (normalizedOffset === 0) { // Center
          scale = 1.15;
          zIndex = 40;
          opacity = 1;
        } else if (normalizedOffset === -1) { // Left 1
          scale = 0.9;
          zIndex = 30;
          opacity = 0.85;
        } else if (normalizedOffset === 1) { // Right 1
          scale = 0.9;
          zIndex = 30;
          opacity = 0.85;
        } else if (normalizedOffset === -2) { // Left 2
          scale = 0.75;
          zIndex = 20;
          opacity = 0.5;
        } else if (normalizedOffset === 2) { // Right 2
          scale = 0.75;
          zIndex = 20;
          opacity = 0.5;
        } else { // Hidden items
          scale = 0.6;
          zIndex = 10;
          opacity = 0;
        }

        let tx = 0;
        if (normalizedOffset === -1) tx = -75;
        if (normalizedOffset === 1) tx = 75;
        if (normalizedOffset === -2) tx = -140;
        if (normalizedOffset === 2) tx = 140;
        if (normalizedOffset < -2) tx = -200;
        if (normalizedOffset > 2) tx = 200;
        
        return (
          <div 
            key={index}
            className="absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer"
            style={{ 
              transform: `translate(-50%, -50%) translateX(${tx}%) scale(${scale})`, 
              zIndex, 
              opacity,
              pointerEvents: normalizedOffset === 0 ? 'auto' : 'auto'
            }}
            onClick={() => setActiveIndex(index)}
          >
            <PhotoCard2Card 
              imageSrc={item.image}
              title={item.title}
              originalPrice={item.originalPrice}
              currentPrice={item.currentPrice}
              discount={item.discount}
            />
          </div>
        );
      })}
    </div>
  );
}
