"use client";

import React, { useState } from "react";
import Image from "next/image";
import CatagoriesInnerCard, { SubCategory } from "./CatagoriesInnerCard";

interface MainCategory {
  id: string;
  name: string;
  imageUrl: string;
  subcategories: SubCategory[];
}

const CATEGORIES: MainCategory[] = [
  {
    id: "top_wear",
    name: "Top Wear",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "blazers", name: "Blazers and Coats", collection: "top_wear", subcatagory: "blazers_and_coats", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80&auto=format&fit=crop" },
      { id: "casual", name: "Casual Shirts", collection: "top_wear", subcatagory: "casual_shirts", imageUrl: "https://images.unsplash.com/photo-1589992896404-dc7f88b77ca0?w=400&q=80&auto=format&fit=crop" },
      { id: "denims", name: "Denims", collection: "top_wear", subcatagory: "denims", imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80&auto=format&fit=crop" },
      { id: "formal", name: "Formal Shirts", collection: "top_wear", subcatagory: "formal_shirts", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80&auto=format&fit=crop" },
      { id: "tshirts", name: "T-Shirts", collection: "top_wear", subcatagory: "t_shirts", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "bottom_wear",
    name: "Bottom Wear",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "jeans", name: "Jeans", collection: "bottom_wear", subcatagory: "jeans", imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80&auto=format&fit=crop" },
      { id: "trousers", name: "Trousers", collection: "bottom_wear", subcatagory: "trousers", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80&auto=format&fit=crop" },
      { id: "shorts", name: "Shorts", collection: "bottom_wear", subcatagory: "shorts", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80&auto=format&fit=crop" },
      { id: "trackpants", name: "Track Pants", collection: "bottom_wear", subcatagory: "track_pants", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "festival_wear",
    name: "Festival Wear",
    imageUrl: "https://images.unsplash.com/photo-1583391733975-4b38a8f2d0c0?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "kurta", name: "Kurta Sets", collection: "festival_wear", subcatagory: "kurta_sets", imageUrl: "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=400&q=80&auto=format&fit=crop" },
      { id: "sherwani", name: "Sherwani", collection: "festival_wear", subcatagory: "sherwani", imageUrl: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=400&q=80&auto=format&fit=crop" },
      { id: "nehru_jackets", name: "Nehru Jackets", collection: "festival_wear", subcatagory: "nehru_jackets", imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "full_pair",
    name: "Full Pair",
    imageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "coords", name: "Co-ords", collection: "full_pair", subcatagory: "co-ord_sets", imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80&auto=format&fit=crop" },
      { id: "suits", name: "Suits", collection: "full_pair", subcatagory: "suits", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80&auto=format&fit=crop" },
      { id: "tracksuits", name: "Tracksuits", collection: "full_pair", subcatagory: "tracksuits", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "inner_ware",
    name: "Inner Ware",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "briefs", name: "Briefs & Trunks", collection: "inner_ware", subcatagory: "briefs", imageUrl: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&q=80&auto=format&fit=crop" },
      { id: "vests", name: "Vests", collection: "inner_ware", subcatagory: "vests", imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "foot_ware",
    name: "Foot Ware",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "sneakers", name: "Sneakers", collection: "foot_ware", subcatagory: "sneakers", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80&auto=format&fit=crop" },
      { id: "formal_shoes", name: "Formal Shoes", collection: "foot_ware", subcatagory: "formal_shoes", imageUrl: "https://images.unsplash.com/photo-1614252235314-e59661114e39?w=400&q=80&auto=format&fit=crop" },
      { id: "sandals", name: "Sandals", collection: "foot_ware", subcatagory: "sandals", imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "fashion_accessories",
    name: "Fashion Accessories",
    imageUrl: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "watches", name: "Watches", collection: "fashion_accessories", subcatagory: "watches", imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80&auto=format&fit=crop" },
      { id: "belts", name: "Belts", collection: "fashion_accessories", subcatagory: "belts", imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80&auto=format&fit=crop" },
      { id: "sunglasses", name: "Sunglasses", collection: "fashion_accessories", subcatagory: "sunglasses", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&auto=format&fit=crop" },
    ],
  },
];

export default function CatagoriesOuterCard() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);

  return (
    <section className="w-full px-4 md:px-8 py-10 relative">
      {/* Heading */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">
          Browse by Style
        </span>
        <h2 className="sec-heading heading-underline visible">Shop Categories</h2>
      </div>

      {/* Categories Grid - 3 per row on mobile, more on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="group flex flex-col items-center gap-2 cursor-pointer outline-none"
          >
            {/* Image Circle */}
            <div className="relative w-full aspect-square rounded-full overflow-hidden bg-zinc-100 shadow-md border-2 border-transparent group-hover:border-black transition-all duration-300">
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                unoptimized
                className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Label */}
            <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-zinc-800 text-center group-hover:text-black mt-1">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity">
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <CatagoriesInnerCard 
              categoryName={selectedCategory.name}
              subcategories={selectedCategory.subcategories}
              onClose={() => setSelectedCategory(null)}
            />
          </div>
          
          {/* Backdrop click to close */}
          <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedCategory(null)} />
        </div>
      )}
    </section>
  );
}
