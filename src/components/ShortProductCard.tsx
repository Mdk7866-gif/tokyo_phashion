"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/AlertMessageCard";

interface Product {
  _id: string;
  productname: string;
  original_price: number;
  discount_price: number;
  stars: number;
  images: { url: string; colurname: string }[];
  subcatagory: string;
  instoke?: string;
}

interface ShortProductCardProps {
  product: Product;
  collectionName: string; // Passed from parent
}

const ShortProductCard: React.FC<ShortProductCardProps> = ({ product, collectionName }) => {
  const firstImage = product.images?.[0]?.url || "";
  
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [isWishlisting, setIsWishlisting] = useState(false);

  // Build URL with provided collection name
  const detailUrl = `/shop?collection=${encodeURIComponent(collectionName)}&subcatagory=${encodeURIComponent(product.subcatagory)}&id=${product._id}`;

  const isWishlisted = user?.wishlistitems?.some((item: any) => item.link.includes(`id=${product._id}`));

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showAlert({ 
        type: "info", 
        title: "Login Required",
        message: "Please login to add items to your wishlist.",
        onConfirm: () => {
          const currentPath = window.location.pathname + window.location.search;
          router.push(`/login?from=${encodeURIComponent(currentPath)}`);
        }
      });
      return;
    }

    setIsWishlisting(true);
    try {
      if (isWishlisted) {
        // Find the specific item in the user's wishlist to get its exact properties
        const existingItem = user?.wishlistitems?.find((item: any) => item.link.includes(`id=${product._id}`));
        
        if (existingItem) {
          const res = await fetch("/api/user/deletewishlistitem", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: existingItem.name,
              link: existingItem.link,
              size: existingItem.size,
              colour: existingItem.colour
            }),
          });
          if (res.ok) {
            window.dispatchEvent(new Event('wishlist-updated'));
            showAlert({ type: "success", message: "Removed from Wishlist" });
          } else {
            const data = await res.json();
            showAlert({ type: "error", message: data.error || "Failed to remove from wishlist" });
          }
        }
      } else {
        const wishlistData = {
          name: product.productname,
          link: detailUrl.slice(1),
          originalprice: product.original_price,
          discountprice: product.discount_price,
          image: firstImage,
          colour: product.images?.[0]?.colurname || "Standard",
          size: "M",
          catagory: collectionName,
          subcatagory: product.subcatagory,
        };

        const res = await fetch("/api/user/addwishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wishlistData),
        });
        if (res.ok) {
          window.dispatchEvent(new Event('wishlist-updated'));
          showAlert({ type: "success", message: "Added to Wishlist!" });
        } else {
          const data = await res.json();
          showAlert({ type: "error", message: data.error || "Failed to wishlist" });
        }
      }
    } catch (err) {
      showAlert({ type: "error", message: "An error occurred." });
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <Link href={detailUrl} className="group flex flex-col bg-white overflow-hidden transition-all duration-500">
      <div className="relative aspect-[3/4] bg-gray-50 rounded-xl md:rounded-[2rem] overflow-hidden">
        {firstImage ? (
          <Image 
            src={firstImage} 
            alt={product.productname} 
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
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

        {/* Out of Stock Overlay */}
        {product.instoke === "Out of Stock" && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-rose-600 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-xl transform -rotate-12 border-2 border-white">
              Out of Stock
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          disabled={isWishlisting}
          className={`absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50 ${isWishlisted ? "text-rose-500" : "text-zinc-400 hover:text-rose-500 hover:bg-white"}`}
          aria-label="Add to wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
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
