"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface TrendItem {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  stars: number;
  reviews: number;
  imageUrl: string;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
}

const TRENDS: TrendItem[] = [
  {
    id: 1,
    name: "Oversized Graphic Tee",
    category: "T-Shirts",
    originalPrice: 1299,
    discountPrice: 699,
    discount: 46,
    stars: 4.8,
    reviews: 312,
    imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80&auto=format&fit=crop",
    badge: "Hot",
    badgeColor: "from-rose-500 to-pink-500",
    isNew: true,
  },
  {
    id: 2,
    name: "Slim Fit Chinos",
    category: "Trousers",
    originalPrice: 2499,
    discountPrice: 1399,
    discount: 44,
    stars: 4.6,
    reviews: 198,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop",
    badge: "Trending",
    badgeColor: "from-purple-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Bomber Jacket — Olive",
    category: "Jackets",
    originalPrice: 4999,
    discountPrice: 2799,
    discount: 44,
    stars: 4.9,
    reviews: 467,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80&auto=format&fit=crop",
    badge: "Best Seller",
    badgeColor: "from-amber-500 to-orange-500",
    isNew: true,
  },
  {
    id: 4,
    name: "Structured Blazer",
    category: "Formals",
    originalPrice: 5999,
    discountPrice: 3499,
    discount: 42,
    stars: 4.7,
    reviews: 234,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
    badgeColor: "from-sky-500 to-cyan-500",
  },
  {
    id: 5,
    name: "Linen Kurta — White",
    category: "Ethnic",
    originalPrice: 1799,
    discountPrice: 999,
    discount: 44,
    stars: 4.5,
    reviews: 156,
    imageUrl: "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=600&q=80&auto=format&fit=crop",
    badge: "New",
    badgeColor: "from-emerald-500 to-teal-500",
    isNew: true,
  },
  {
    id: 6,
    name: "Relaxed Denim Jacket",
    category: "Jackets",
    originalPrice: 3499,
    discountPrice: 1999,
    discount: 43,
    stars: 4.7,
    reviews: 289,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80&auto=format&fit=crop",
    badgeColor: "from-blue-500 to-indigo-500",
  },
  {
    id: 7,
    name: "Polo Collar T-Shirt",
    category: "T-Shirts",
    originalPrice: 999,
    discountPrice: 599,
    discount: 40,
    stars: 4.4,
    reviews: 421,
    imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80&auto=format&fit=crop",
    badge: "Popular",
    badgeColor: "from-rose-400 to-pink-400",
  },
  {
    id: 8,
    name: "Cargo Jogger Pants",
    category: "Bottoms",
    originalPrice: 2299,
    discountPrice: 1299,
    discount: 43,
    stars: 4.6,
    reviews: 178,
    imageUrl: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600&q=80&auto=format&fit=crop",
    badge: "Trending",
    badgeColor: "from-violet-500 to-purple-500",
    isNew: true,
  },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill={s <= Math.round(stars) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={s <= Math.round(stars) ? "text-amber-400" : "text-zinc-300"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function TrendCard({ item }: { item: TrendItem }) {
  return (
    <Link
      href="/shop"
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-500 flex-shrink-0"
      style={{ 
        width: "clamp(160px, 18vw, 220px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)" 
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-2 left-2 bg-black/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase backdrop-blur-sm">
          -{item.discount}%
        </div>
        {item.badge && (
          <div className={`absolute top-2 right-2 bg-gradient-to-r ${item.badgeColor} text-white text-[8px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase shadow-lg`}>
            {item.badge}
          </div>
        )}
      </div>
      <div className="p-2.5 md:p-3 flex flex-col gap-1">
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">
          {item.category}
        </span>
        <h3 className="text-[10px] md:text-[11px] font-black text-zinc-900 uppercase tracking-tight leading-tight line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StarRating stars={item.stars} />
          <span className="text-[8px] font-bold text-zinc-400">({item.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xs md:text-sm font-black text-black">₹{item.discountPrice}</span>
          <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 line-through">₹{item.originalPrice}</span>
        </div>
      </div>
    </Link>
  );
}

export default function NewTrendCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const scrollPos = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const speed = 0.45; // Reduced speed for buttery smoothness

    const animate = () => {
      if (!isInteracting) {
        scrollPos.current += speed;
        
        // Seamless loop check: if we scrolled past half the content (which is duplicated)
        // Reset to start
        if (scrollPos.current >= scrollContainer.scrollWidth / 2) {
          scrollPos.current = 0;
        }
        
        scrollContainer.scrollLeft = scrollPos.current;
      } else {
        // Sync ref with actual DOM position while user is interacting
        scrollPos.current = scrollContainer.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting]);

  // Handle interaction states to avoid jank
  const handleInteractionStart = () => setIsInteracting(true);
  const handleInteractionEnd = () => setIsInteracting(false);

  // Triple the items to ensure the loop is always seamless even on large screens
  const displayTrends = [...TRENDS, ...TRENDS, ...TRENDS];

  return (
    <section className="w-full py-10 overflow-hidden">
      <div className="flex flex-col items-center mb-8 px-4 text-center">
        <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase mb-2">
          What&apos;s Hot
        </span>
        <h2 className="sec-heading heading-underline visible !mb-0 text-black">New Trends</h2>
        <div className="w-8 h-1 bg-black mt-3 rounded-full mx-auto" />
      </div>

      <div 
        className="w-full relative group"
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar px-4 md:px-8 py-2"
          style={{ 
            scrollBehavior: 'auto', // Important: must be 'auto' for JS loop to be smooth
            WebkitOverflowScrolling: "touch"
          }}
        >
          {displayTrends.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="flex-shrink-0"
            >
              <TrendCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Link
          href="/trend"
          className="group relative inline-flex items-center justify-center px-10 py-3 overflow-hidden font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-300 border-2 border-black rounded-full hover:text-white"
        >
          <span className="absolute inset-0 w-0 h-full bg-black transition-all duration-300 group-hover:w-full" />
          <span className="relative z-10 flex items-center gap-2">
            View All Trends
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
