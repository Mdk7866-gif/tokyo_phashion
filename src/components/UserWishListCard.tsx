"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/components/AlertMessageCard";

interface WishlistItem {
  name: string;
  link: string;
  size: string;
  colour: string;
  image: string;
  catagory: string;
  subcatagory: string;
  discountprice: number;
  originalprice: number;
}

interface UserWishListCardProps {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
}

export default function UserWishListCard({ item, onRemove }: UserWishListCardProps) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const cleanLink = item.link ? (item.link.startsWith('/') ? item.link : '/' + item.link).replace(/&cartid=[^&]*/g, '') : "/shop";

  const handleAddToCart = async () => {
    if (!user) {
      showAlert({ type: "error", message: "Please login to add items to cart." });
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch("/api/user/addcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_no: user.mobile_no,
          name: item.name,
          link: item.link,
          originalprice: item.originalprice,
          discountprice: item.discountprice,
          image: item.image,
          colour: item.colour,
          size: item.size,
          catagory: item.catagory,
          subcatagory: item.subcatagory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'));
        // Automatically remove from wishlist after adding to cart
        await handleRemove(true); 
        showAlert({ type: "success", message: "Item added to cart and removed from wishlist!" });
      } else {
        showAlert({ type: "error", message: data.error || "Failed to add to cart" });
      }
    } catch (error) {
      console.error("Failed to add item to cart", error);
      showAlert({ type: "error", message: "An error occurred." });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemove = async (silent = false) => {
    setIsRemoving(true);
    try {
      const res = await fetch("/api/user/deletewishlistitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          link: item.link,
          size: item.size,
          colour: item.colour,
        }),
      });

      if (res.ok) {
        onRemove(item);
        window.dispatchEvent(new Event('wishlist-updated'));
        if (!silent) showAlert({ type: "success", message: "Item removed from wishlist." });
      } else {
        const data = await res.json();
        if (!silent) showAlert({ type: "error", message: data.error || "Failed to remove item." });
      }
    } catch (error) {
      console.error("Failed to delete item", error);
      if (!silent) showAlert({ type: "error", message: "An error occurred." });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="group/wishlist-item bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-black transition-all relative flex flex-col h-full">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={() => handleRemove()}
          disabled={isRemoving}
          className="p-1.5 bg-white/90 backdrop-blur hover:bg-rose-50 text-rose-500 rounded-full transition-colors active:scale-90 disabled:opacity-50 border border-zinc-100 shadow-sm"
          title="Remove from wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <Link href={cleanLink} className="relative w-full aspect-[3/4] bg-zinc-100 overflow-hidden block group-hover/wishlist-item:scale-[1.02] transition-transform">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-300">NO IMAGE</div>
        )}
      </Link>
      
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link href={cleanLink} className="block flex-1">
          <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 truncate">{item.catagory || "Clothing"}</p>
          <h4 className="font-bold text-[10px] md:text-xs uppercase mb-2 line-clamp-2 leading-tight h-8 md:h-9">{item.name}</h4>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black">₹{item.discountprice || item.originalprice}</span>
            {item.discountprice && item.originalprice > item.discountprice && (
              <span className="text-[9px] text-zinc-400 line-through font-medium">₹{item.originalprice}</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
             <span className="text-[8px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-zinc-600 uppercase">Size: {item.size || "M"}</span>
             <span className="text-[8px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-zinc-600 uppercase">Color: {item.colour || "Std"}</span>
          </div>
        </Link>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2.5 bg-black text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 active:scale-95"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
