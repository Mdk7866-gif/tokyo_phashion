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
    imageUrl:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80&auto=format&fit=crop",
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
    imageUrl:
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600&q=80&auto=format&fit=crop",
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
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all duration-500 flex-shrink-0"
      style={{ 
        width: "calc((100% - 32px) / 3)", // 3 cards per row, 16px gap
        minWidth: "160px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)" 
      }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-[1.8s] ease-out"
        />

        {/* Discount badge */}
        <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-widest uppercase">
          -{item.discount}%
        </div>

        {/* Category badge */}
        {item.badge && (
          <div
            className={`absolute top-2 right-2 bg-gradient-to-r ${item.badgeColor} text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase shadow-md`}
          >
            {item.badge}
          </div>
        )}

        {/* New dot */}
        {item.isNew && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[7px] font-black text-emerald-700 uppercase tracking-wider">New</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 md:p-3 flex flex-col gap-1">
        {/* Category */}
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
          {item.category}
        </span>

        {/* Name */}
        <h3 className="text-[10px] md:text-xs font-black text-zinc-900 uppercase tracking-tight leading-tight line-clamp-1">
          {item.name}
        </h3>

        {/* Stars + reviews */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <StarRating stars={item.stars} />
          <span className="text-[8px] font-bold text-zinc-400">({item.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-xs md:text-sm font-black text-black">₹{item.discountPrice}</span>
          <span className="text-[8px] md:text-[9px] font-bold text-zinc-400 line-through">
            ₹{item.originalPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function NewTrendCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto scroll effect
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    const speed = 30; // pixels per second

    const scroll = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollLeft += speed * delta;
        
        // Reset scroll when reaching the end to create a loop effect
        // Realistically just loop around or stop. We'll just let it scroll.
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
        ) {
          // If we reached the end, snap back to start
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="w-full px-4 md:px-8 py-10">
      {/* Heading */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">
          What&apos;s Hot Right Now
        </span>
        <h2 className="sec-heading heading-underline visible">New Trends</h2>
        <p className="text-xs text-zinc-500 text-center mt-2 max-w-md">
          The freshest styles handpicked for the modern Tokyo man.
        </p>
      </div>

      {/* Slider */}
      <div 
        className="w-full overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {TRENDS.map((item) => (
            <div key={item.id} className="snap-start flex-shrink-0" style={{ width: "calc((100% - 32px) / 3)", minWidth: "160px" }}>
              <TrendCard item={item} />
            </div>
          ))}
          {/* Duplicate some items at the end to make the loop look seamless if they reach the end */}
          {TRENDS.slice(0, 3).map((item, i) => (
            <div key={`dup-${item.id}-${i}`} className="snap-start flex-shrink-0" style={{ width: "calc((100% - 32px) / 3)", minWidth: "160px" }}>
              <TrendCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Show More */}
      <div className="flex justify-center mt-6">
        <Link
          href="/trends"
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-black text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white active:scale-95 transition-all duration-300"
        >
          + Show More
        </Link>
      </div>
    </section>
  );
}
