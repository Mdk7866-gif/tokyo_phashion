"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

interface UserCartItemCardProps {
  item: any;
  onRemove: (id: string) => void;
}

export default function UserCartItemCard({ item, onRemove }: UserCartItemCardProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  
  const size = item.variant_sizes;
  const variant = size?.product_variants;
  const product = variant?.products;
  const subcategory = product?.subcategories;
  const category = subcategory?.categories;
  
  // Explicitly find the images for THIS specific variant
  const variantImages = variant?.product_images || [];
  const thumbnail = variantImages.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;

  const price = size?.discount_price || size?.original_price || 0;
  const totalPrice = price * quantity;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent redirect if clicking on buttons or their children
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    const params = new URLSearchParams();
    params.set("product_id", product?.id || "");
    params.set("variant_id", variant?.id || "");
    params.set("category", category?.name?.toLowerCase() || "");
    params.set("subcategory", subcategory?.name?.toLowerCase() || "");
    params.set("category_id", subcategory?.category_id || "");
    params.set("subcategory_id", product?.subcategory_id || "");
    params.set("size_id", size?.id || "");

    router.push(`/detailedproduct?${params.toString()}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative border border-black bg-white flex flex-col transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden h-fit"
    >
      {/* Remove Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="absolute top-1 right-1 z-10 p-1 bg-white border border-black text-black hover:bg-red-500 hover:text-white transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        <X className="h-2.5 w-2.5" />
      </button>

      {/* Slim Image Section */}
      <div className="aspect-[3/4] relative bg-zinc-100 border-b border-black overflow-hidden">
        {thumbnail ? (
          <Image 
            src={thumbnail} 
            alt={product?.name || "Product"} 
            fill 
            className="object-cover" 
            sizes="(max-width: 640px) 50vw, 20vw" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-zinc-300">No Image</div>
        )}
      </div>

      {/* Ultra-compact Content */}
      <div className="p-2 flex flex-col gap-2">
        <div className="min-h-[24px]">
          <h3 className="text-[9px] font-black uppercase italic tracking-tight leading-none line-clamp-1" title={product?.name}>
            {product?.name}
          </h3>
          <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
            {variant?.color} / {size?.size}
          </p>
        </div>

        <div className="flex items-center justify-between gap-1">
           <div className="text-[10px] font-black leading-none">₹{price.toFixed(0)}</div>
           
           {/* Quantity Controls - Fixed visibility */}
           <div className="flex items-center border border-black h-5 bg-white">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setQuantity(Math.max(1, quantity - 1));
               }}
               className="px-1.5 h-full hover:bg-zinc-100 transition-colors border-r border-black flex items-center justify-center"
             >
               <Minus className="h-2 w-2 text-black" />
             </button>
             <span className="w-5 text-center text-[8px] font-black text-black">{quantity}</span>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setQuantity(quantity + 1);
               }}
               className="px-1.5 h-full hover:bg-zinc-100 transition-colors border-l border-black flex items-center justify-center"
             >
               <Plus className="h-2 w-2 text-black" />
             </button>
           </div>
        </div>

        {/* Compact Buy Button */}
        <button 
          disabled
          onClick={(e) => e.stopPropagation()}
          className="w-full border border-black py-1.5 text-[8px] font-black uppercase tracking-widest bg-zinc-800 text-white opacity-60 cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="h-2.5 w-2.5" />
          Buy ₹{totalPrice.toFixed(0)}
        </button>
      </div>
    </div>
  );
}

