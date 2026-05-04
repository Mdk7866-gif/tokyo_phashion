"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Heart } from "lucide-react";

interface UserWishlistCardProps {
  item: any;
  onRemove: (id: string) => void;
}

export default function UserWishlistCard({ item, onRemove }: UserWishlistCardProps) {
  const router = useRouter();

  const variant = item.product_variants;
  const product = variant?.products;
  const subcategory = product?.subcategories;
  const category = subcategory?.categories;

  const variantImages = variant?.product_images || [];
  const thumbnail = [...variantImages].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    const params = new URLSearchParams();
    params.set("product_id", product?.id || "");
    params.set("variant_id", variant?.id || "");
    params.set("category", category?.name?.toLowerCase() || "");
    params.set("subcategory", subcategory?.name?.toLowerCase() || "");
    params.set("category_id", subcategory?.category_id || "");
    params.set("subcategory_id", product?.subcategory_id || "");

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

      {/* Wishlist Badge */}
      <div className="absolute top-1 left-1 z-10 p-1 bg-white border border-black text-red-500">
        <Heart className="h-2.5 w-2.5 fill-red-500" />
      </div>

      {/* Image */}
      <div className="aspect-[3/4] relative bg-zinc-100 border-b border-black overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product?.name || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-zinc-300">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-1.5 flex flex-col gap-1">
        <h3
          className="text-[8.5px] font-black uppercase italic tracking-tight leading-none line-clamp-1"
          title={product?.name}
        >
          {product?.name}
        </h3>
        <p className="text-[6.5px] font-bold uppercase tracking-widest text-zinc-400 leading-none">
          {variant?.color}
        </p>
      </div>
    </div>
  );
}
