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
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777449981/tokyofashion/admin_insert/paqmojw1dza9jysqko0h.webp",
    subcategories: [
      { id: "blazers", name: "Blazers and Coats", collection: "top_wear", subcatagory: "blazers_and_coats", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80&auto=format&fit=crop" },
      { id: "casual", name: "Casual Shirts", collection: "top_wear", subcatagory: "casual_shirts", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777442656/tokyofashion/admin_insert/y80uzqvsxlpny9fzf2xd.webp" },
      { id: "denims", name: "Denims", collection: "top_wear", subcatagory: "denims", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777449496/tokyofashion/admin_insert/hqqsvdflnoh2rramcpi1.webp" },
      { id: "formal", name: "Formal Shirts", collection: "top_wear", subcatagory: "formal_shirts", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80&auto=format&fit=crop" },
      { id: "tshirts", name: "T-Shirts", collection: "top_wear", subcatagory: "t-shirts", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "bottom_wear",
    name: "Bottom Wear",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777438982/tokyofashion/admin_insert/f6gw9qgw9juecjk7yg9i.webp",
    subcategories: [
      { id: "jeans", name: "Jeans", collection: "bottom_wear", subcatagory: "jeans", imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80&auto=format&fit=crop" },
      { id: "formal trousers", name: "Formal Trousers", collection: "bottom_wear", subcatagory: "formal_trousers", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777439089/tokyofashion/admin_insert/enkhvmehne7ni3mcvhyf.webp" },
      { id: "casual trousers", name: "Casual Trousers", collection: "bottom_wear", subcatagory: "casual_trousers", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80&auto=format&fit=crop" },
      { id: "shorts", name: "Shorts", collection: "bottom_wear", subcatagory: "shorts", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777467420/tokyofashion/admin_insert/ou5adzjh0qkyzgfkxomc.webp" },
      { id: "trackpants", name: "Track Pants", collection: "bottom_wear", subcatagory: "trackpants", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777467659/tokyofashion/admin_insert/ba38anagfzrzkhobnkev.webp" },
    ],
  },
  {
    id: "festival_wear",
    name: "Festival Wear",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777444082/tokyofashion/admin_insert/m87o87kzwgrux87yc357.webp",
    subcategories: [
      { id: "kurta", name: "Kurta Sets", collection: "festival_wear", subcatagory: "kurtas", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777444126/tokyofashion/admin_insert/axacuusmklnjjrrm0tep.webp" },
      { id: "sherwani", name: "Sherwani", collection: "festival_wear", subcatagory: "sherwanis", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777444489/tokyofashion/admin_insert/yfmko5coizjw39in4fik.webp" },
      { id: "nehru_jackets", name: "Nehru Jackets", collection: "festival_wear", subcatagory: "nehru_jackets", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777444266/tokyofashion/admin_insert/l4aukezxhgfhboh95mwc.webp" },
    ],
  },
  {
    id: "full_pair",
    name: "Full Pair",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777448360/tokyofashion/admin_insert/i4l3t6go5ygf5basytm7.webp",
    subcategories: [
      { id: "coords", name: "Co-ords", collection: "full_pair", subcatagory: "co-ord_sets", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777448360/tokyofashion/admin_insert/i4l3t6go5ygf5basytm7.webp" },
      { id: "tracksuits", name: "Tracksuits", collection: "full_pair", subcatagory: "tracksuits", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777467659/tokyofashion/admin_insert/ba38anagfzrzkhobnkev.webp" },
    ],
  },
  {
    id: "inner_ware",
    name: "Inner Ware",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777448860/tokyofashion/admin_insert/ick3lcanmtl7mpopirva.webp",
    subcategories: [
      { id: "underware", name: "Underwares", collection: "inner_wear", subcatagory: "underwares", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777448931/tokyofashion/admin_insert/vkfovppoaygidptklhhh.webp" },
      { id: "vests", name: "Vests", collection: "inner_wear", subcatagory: "vests", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777449021/tokyofashion/admin_insert/n2ak8u1dlmssxfesmv2v.webp" },
    ],
  },
  {
    id: "foot_ware",
    name: "Foot Ware",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    subcategories: [
      { id: "casual_shoes", name: "Casual Shoes", collection: "foot_wear", subcatagory: "casual_shoes", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80&auto=format&fit=crop" },
      { id: "formal_shoes", name: "Formal Shoes", collection: "foot_wear", subcatagory: "formal_shoes", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777446372/tokyofashion/admin_insert/wbvjop2r4wxrqdhp9ldj.webp" },
      { id: "sandals", name: "Sandals", collection: "foot_wear", subcatagory: "sandals", imageUrl: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80&auto=format&fit=crop" },
      { id: "slippers", name: "Slippers", collection: "foot_wear", subcatagory: "slippers", imageUrl: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&q=80&auto=format&fit=crop" },
      { id: "sneakers", name: "Sneakers", collection: "foot_wear", subcatagory: "sneakers", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80&auto=format&fit=crop" },
      { id: "socks", name: "Socks", collection: "foot_wear", subcatagory: "socks", imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&q=80&auto=format&fit=crop" },
      { id: "sport_shoes", name: "Sport Shoes", collection: "foot_wear", subcatagory: "sport_shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop" },
    ],
  },
  {
    id: "fashion_accessories",
    name: "Fashion Accessories",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777442983/tokyofashion/admin_insert/ftldfx7z89bvskvsinz7.webp",
    subcategories: [
      { id: "watches", name: "Watches", collection: "fashion_accessories", subcatagory: "watches", imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80&auto=format&fit=crop" },
      { id: "belts", name: "Belts", collection: "fashion_accessories", subcatagory: "belts", imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80&auto=format&fit=crop" },
      { id: "glasses", name: "Glasses", collection: "fashion_accessories", subcatagory: "glasses", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&auto=format&fit=crop" },
      { id: "perfumes", name: "Perfumes", collection: "fashion_accessories", subcatagory: "perfumes", imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1777443962/tokyofashion/admin_insert/wneeojbtik8h2afx3jlh.webp" },
      
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
            className="relative w-full max-w-2xl h-auto max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-up"
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
