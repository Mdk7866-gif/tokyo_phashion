"use client";
import React, { useRef, useState } from 'react';
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

export const PhotoCard2Card: React.FC<PhotoCard2Props> = ({
  imageSrc, title, originalPrice, currentPrice, discount
}) => {
  return (
    <div className="pc2-card group">
      {/* Discount Badge */}
      <div className="pc2-badge">{discount}</div>

      {/* Wishlist icon */}
      <button className="pc2-wish" aria-label="Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Image */}
      <div className="pc2-img-wrap">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 280px"
          className="pc2-img"
        />
        {/* Quick Add overlay */}
        <div className="pc2-overlay">
          <span className="pc2-quick-add">Quick Add</span>
        </div>
      </div>

      {/* Info */}
      <div className="pc2-info">
        <h3 className="pc2-title">{title}</h3>
        <div className="pc2-prices">
          <span className="pc2-original">{originalPrice}</span>
          <span className="pc2-current">{currentPrice}</span>
        </div>
      </div>

      <style>{`
        .pc2-card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 160px;
          flex-shrink: 0;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          cursor: pointer;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        @media (min-width: 640px) { .pc2-card { width: 220px; border-radius: 20px; } }
        @media (min-width: 1024px) { .pc2-card { width: 270px; } }

        .pc2-card:hover {
          box-shadow: 0 12px 36px rgba(0,0,0,0.14);
          transform: translateY(-4px);
        }

        .pc2-badge {
          position: absolute;
          top: 0; left: 0;
          z-index: 10;
          background: #111;
          color: #fff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 0 0 10px 0;
        }
        @media (min-width: 640px) { .pc2-badge { font-size: 10px; } }

        .pc2-wish {
          position: absolute;
          top: 10px; right: 10px;
          z-index: 10;
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(6px);
          border: none;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #999;
          transition: color 0.2s, background 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .pc2-wish:hover { color: #e11d48; background: #fff; }

        .pc2-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #f5f5f5;
        }

        .pc2-img {
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .pc2-card:hover .pc2-img { transform: scale(1.08); }

        .pc2-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pc2-card:hover .pc2-overlay { opacity: 1; }

        .pc2-quick-add {
          background: #fff;
          color: #111;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .pc2-info {
          padding: 10px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        @media (min-width: 640px) { .pc2-info { padding: 12px 14px 14px; } }

        .pc2-title {
          font-size: 11px;
          font-weight: 700;
          color: #111;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (min-width: 640px) { .pc2-title { font-size: 12px; } }

        .pc2-prices {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .pc2-original {
          font-size: 10px;
          color: #aaa;
          text-decoration: line-through;
        }

        .pc2-current {
          font-size: 13px;
          font-weight: 900;
          color: #111;
        }
        @media (min-width: 640px) { .pc2-current { font-size: 14px; } }
      `}</style>
    </div>
  );
};

interface PhotoCard2CarouselProps {
  items: CarouselItem[];
}

export default function PhotoCard2Carousel({ items }: PhotoCard2CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!items || items.length === 0) return null;

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft ?? 0);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const stopDrag = () => setIsDragging(false);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <div className="pc2-carousel-root">
      {/* Scroll arrows — desktop only */}
      <button className="pc2-arrow pc2-arrow-left" onClick={() => scroll('left')} aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <div
        ref={scrollRef}
        className={`pc2-scroll-track ${isDragging ? 'dragging' : ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
      >
        {items.map((item, index) => (
          <PhotoCard2Card
            key={index}
            imageSrc={item.image}
            title={item.title}
            originalPrice={item.originalPrice}
            currentPrice={item.currentPrice}
            discount={item.discount}
          />
        ))}
      </div>

      <button className="pc2-arrow pc2-arrow-right" onClick={() => scroll('right')} aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      <style>{`
        .pc2-carousel-root {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .pc2-scroll-track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 12px 20px 20px;
          scrollbar-width: none;
          cursor: grab;
          flex: 1;
          min-width: 0;
          max-width: max-content;
          margin: 0 auto;
        }
        .pc2-scroll-track::-webkit-scrollbar { display: none; }
        .pc2-scroll-track.dragging { cursor: grabbing; user-select: none; }
        .pc2-scroll-track > * { scroll-snap-align: start; }

        @media (min-width: 640px) { .pc2-scroll-track { gap: 16px; padding: 16px 32px 24px; } }
        @media (min-width: 1024px) { .pc2-scroll-track { gap: 20px; padding: 20px 48px 28px; } }

        .pc2-arrow {
          display: none;
          flex-shrink: 0;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #e5e5e5;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          color: #111;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          z-index: 2;
        }
        .pc2-arrow:hover {
          background: #111;
          color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transform: scale(1.06);
        }
        @media (min-width: 1024px) { .pc2-arrow { display: flex; } }

        .pc2-arrow-left { margin-left: 12px; }
        .pc2-arrow-right { margin-right: 12px; }
      `}</style>
    </div>
  );
}
