"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface BudgetProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  badge?: string;
}

const UNDER_499: BudgetProduct[] = [
  {
    id: 1,
    name: "Basic Cotton Tee",
    category: "T-Shirts",
    price: 299,
    originalPrice: 799,
    imageUrl:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80&auto=format&fit=crop",
    badge: "🔥 Deal",
  },
  {
    id: 2,
    name: "Striped Polo",
    category: "T-Shirts",
    price: 399,
    originalPrice: 999,
    imageUrl:
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Solid Henley",
    category: "T-Shirts",
    price: 349,
    originalPrice: 699,
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80&auto=format&fit=crop",
    badge: "⚡ Flash",
  },
  {
    id: 4,
    name: "Pocket Tee",
    category: "T-Shirts",
    price: 249,
    originalPrice: 599,
    imageUrl:
      "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Logo Graphic Tee",
    category: "T-Shirts",
    price: 449,
    originalPrice: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80&auto=format&fit=crop",
    badge: "🆕 New",
  },
  {
    id: 6,
    name: "Ribbed Crew Neck",
    category: "T-Shirts",
    price: 379,
    originalPrice: 799,
    imageUrl:
      "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777444266/tokyofashion/admin_insert/l4aukezxhgfhboh95mwc.webp",
  },
];

const UNDER_999: BudgetProduct[] = [
  {
    id: 1,
    name: "Slim Chino Shorts",
    category: "Bottoms",
    price: 699,
    originalPrice: 1499,
    imageUrl:
      "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777467659/tokyofashion/admin_insert/ba38anagfzrzkhobnkev.webp",
    badge: "🔥 Hot",
  },
  {
    id: 2,
    name: "Linen Overshirt",
    category: "Shirts",
    price: 899,
    originalPrice: 1999,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Printed Casual Shirt",
    category: "Shirts",
    price: 749,
    originalPrice: 1599,
    imageUrl:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80&auto=format&fit=crop",
    badge: "⚡ Steal",
  },
  {
    id: 4,
    name: "Cotton Track Pants",
    category: "Bottoms",
    price: 599,
    originalPrice: 1299,
    imageUrl:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Denim Shorts",
    category: "Bottoms",
    price: 849,
    originalPrice: 1799,
    imageUrl:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80&auto=format&fit=crop",
    badge: "🆕 New",
  },
  {
    id: 6,
    name: "Half-Zip Sweatshirt",
    category: "Hoodies",
    price: 949,
    originalPrice: 2199,
    imageUrl:
      "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777442656/tokyofashion/admin_insert/y80uzqvsxlpny9fzf2xd.webp",
  },
];

/* ── Single mini product card ── */
function MiniCard({ product, priceColor }: { product: BudgetProduct; priceColor: string }) {
  return (
    <Link
      href="/shop"
      className="group flex-shrink-0 flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
      style={{ width: "clamp(130px, 36vw, 180px)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-50" style={{ aspectRatio: "3/4" }}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover object-top group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />

        {/* Discount */}
        <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">
          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
            {product.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1">
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{product.category}</span>
        <span className="text-[10px] font-black text-zinc-800 uppercase tracking-tight leading-tight line-clamp-1">
          {product.name}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xs font-black ${priceColor}`}>₹{product.price}</span>
          <span className="text-[9px] font-bold text-zinc-400 line-through">₹{product.originalPrice}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Horizontal scroll row ── */
function BudgetRow({
  label,
  sublabel,
  products,
  accent,
  priceColor,
  badgeBg,
  href,
}: {
  label: string;
  sublabel: string;
  products: BudgetProduct[];
  accent: string;
  priceColor: string;
  badgeBg: string;
  href: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Row header */}
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest ${badgeBg}`}
          >
            {label}
          </div>
          <span className="text-xs text-zinc-500 font-bold hidden sm:block">{sublabel}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Arrow buttons */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 active:scale-90 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 active:scale-90 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <Link
            href={href}
            className={`text-[10px] font-black uppercase tracking-widest ${accent} underline underline-offset-4 hidden sm:block`}
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Scrollable product row */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-4 md:px-8 lg:px-16 overflow-x-auto hide-scrollbar pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ scrollSnapAlign: "start" }}>
            <MiniCard product={p} priceColor={priceColor} />
          </div>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="flex justify-center sm:hidden">
        <Link
          href={href}
          className={`text-[10px] font-black uppercase tracking-widest ${accent} underline underline-offset-4`}
        >
          View All →
        </Link>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function UnderCard() {
  return (
    <section className="w-full py-10 md:py-16">
      {/* Heading */}
      <div className="flex flex-col items-center mb-8 md:mb-12 px-4">
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">
          Value Picks
        </span>
        <h2 className="sec-heading heading-underline visible">Budget Finds</h2>
        <p className="text-sm text-zinc-500 text-center mt-2 max-w-md">
          Premium style doesn&apos;t have to break the bank. Shop smart.
        </p>
      </div>

      {/* Under ₹499 */}
      <BudgetRow
        label="Under ₹499"
        sublabel="Top picks for under five hundred"
        products={UNDER_499}
        accent="text-rose-600"
        priceColor="text-rose-600"
        badgeBg="bg-gradient-to-r from-rose-500 to-pink-500"
        href="/under499"
      />

      {/* Spacer */}
      <div className="h-8 md:h-10" />

      {/* Under ₹999 */}
      <BudgetRow
        label="Under ₹999"
        sublabel="Great styles under a thousand"
        products={UNDER_999}
        accent="text-violet-600"
        priceColor="text-violet-600"
        badgeBg="bg-gradient-to-r from-violet-500 to-purple-600"
        href="/under999"
      />
    </section>
  );
}
