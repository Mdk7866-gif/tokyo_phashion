"use client";

import React from "react";
import Link from "next/link";

interface Product {
  _id: string;
  productname: string;
  original_price: number;
  discount_price: number;
  stars: number;
  images: { url: string; colurname: string }[];
  subcatagory: string;
}

interface ShortProductCardProps {
  product: Product;
  collectionName: string; // Passed from parent
}

const ShortProductCard: React.FC<ShortProductCardProps> = ({ product, collectionName }) => {
  const firstImage = product.images?.[0]?.url || "";
  
  // Build URL with provided collection name
  const detailUrl = `/shop?collection=${encodeURIComponent(collectionName)}&subcatagory=${encodeURIComponent(product.subcatagory)}&id=${product._id}`;

  return (
    <Link href={detailUrl} className="group flex flex-col bg-white overflow-hidden transition-all duration-500">
      <div className="relative aspect-[3/4] bg-gray-50 rounded-xl md:rounded-[2rem] overflow-hidden">
        {firstImage ? (
          <img 
            src={firstImage} 
            alt={product.productname} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest bg-gray-100">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {product.original_price > product.discount_price && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest uppercase shadow-lg">
            -{Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)}%
          </div>
        )}
      </div>

      <div className="py-3 md:py-4 space-y-0.5 md:space-y-1 px-1">
        <div className="flex justify-between items-start gap-1 md:gap-2">
          <h3 className="text-[10px] md:text-xs font-black text-gray-900 tracking-tight uppercase leading-tight truncate flex-1">
            {product.productname}
          </h3>
          <div className="flex items-center gap-1 bg-zinc-50 px-1 md:px-1.5 py-0.5 rounded-md border border-zinc-100">
            <span className="text-[9px] md:text-[10px] font-black">{product.stars}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 md:w-2.5 md:h-2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-black text-black">₹{product.discount_price}</span>
          <span className="text-[9px] md:text-[11px] font-bold text-gray-400 line-through">₹{product.original_price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShortProductCard;
