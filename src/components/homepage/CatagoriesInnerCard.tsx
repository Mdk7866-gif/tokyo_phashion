"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
  collection: string;
  subcatagory: string;
}

interface Props {
  categoryName: string;
  subcategories: SubCategory[];
  onClose: () => void;
}

export default function CatagoriesInnerCard({ categoryName, subcategories, onClose }: Props) {
  return (
    <div className="flex flex-col w-full h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-100 flex-shrink-0">
        <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-black">
          {categoryName}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Subcategories Grid */}
      <div className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop?collection=${sub.collection}&subcatagory=${sub.subcatagory}`}
              onClick={onClose}
              className="group flex flex-col items-center gap-2 md:gap-3"
            >
              {/* Circle Image */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-zinc-100 shadow-sm border border-zinc-200 group-hover:border-zinc-400 transition-colors duration-300">
                <Image
                  src={sub.imageUrl}
                  alt={sub.name}
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Label */}
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-zinc-700 text-center group-hover:text-black transition-colors">
                {sub.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
