"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  productname: string;
  original_price: number;
  discount_price: number;
  stars: number;
  images: { url: string; colurname: string }[];
  collectionname: string;
  subcatagory: string;
  size: string[];
  description?: string;
  instoke?: string;
}

interface DetailedProductCardProps {
  product: Product;
}

const DetailedProductCard: React.FC<DetailedProductCardProps> = ({ product }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const selectedImage = product.images?.[selectedColorIndex]?.url || "";
  const selectedColorName = product.images?.[selectedColorIndex]?.colurname || "";

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setIsAdding(true);
    try {
      const link = `shop?collection=${encodeURIComponent(product.collectionname)}&subcatagory=${encodeURIComponent(product.subcatagory)}&id=${product._id}&cartid=${user.mobile_no}`;

      const res = await fetch("/api/user/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_no: user.mobile_no,
          name: product.productname,
          link,
          originalprice: product.original_price,
          discountprice: product.discount_price,
          image: selectedImage,
          colour: selectedColorName,
          size: selectedSize,
          catagory: product.collectionname,
          subcatagory: product.subcatagory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'));
        alert("Added to cart!");
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Gallery */}
        <div className="lg:w-3/5 space-y-6">
          <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden rounded-3xl border border-zinc-100">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.productname} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm font-bold uppercase tracking-widest">
                Loading Image...
              </div>
            )}
            
            <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
              <span className="text-xs font-bold text-black">{parseFloat(product.stars.toString()).toFixed(1)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>

            {product.original_price > product.discount_price && (
              <div className="absolute top-6 right-6 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${selectedColorIndex === idx ? "border-black scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt={img.colurname} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:w-2/5 flex flex-col">
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                {product.collectionname.replace(/_/g, ' ')}
              </span>
              <span className="w-4 h-px bg-zinc-200"></span>
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                {product.subcatagory.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight uppercase leading-tight">
              {product.productname}
            </h1>
          </div>

          <div className="flex items-baseline gap-4 mb-12">
            <span className="text-3xl font-bold text-black">₹{product.discount_price}</span>
            <span className="text-lg font-medium text-zinc-300 line-through">₹{product.original_price}</span>
            <span className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${product.instoke === 'In Stock' ? 'bg-zinc-50 border-zinc-100 text-zinc-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
              {product.instoke || "In Stock"}
            </span>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Color</span>
                <span className="text-xs font-bold uppercase text-black">{selectedColorName}</span>
              </div>
              <div className="h-px w-full bg-zinc-100"></div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Size</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 hover:text-black">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.size?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[56px] h-12 flex items-center justify-center rounded-xl font-bold text-xs border transition-all ${selectedSize === s ? "bg-black text-white border-black" : "bg-white text-black border-zinc-100 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-100 rounded-xl bg-zinc-50 h-14">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center font-bold text-lg hover:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center font-bold text-lg hover:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-black text-white h-14 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              <button className="w-full bg-white border border-black text-black h-14 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all active:scale-95">
                Buy Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-12 mt-auto">
            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black shrink-0">
                 <path d="M10 21V10a2 2 0 0 1 2-2h10l-2-2-2 2h-4V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6H4l-2-2-2 2h10"/>
               </svg>
               <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Free Shipping</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black shrink-0">
                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
               </svg>
               <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quality Check</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 lg:mt-32 border-t border-zinc-100 pt-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black mb-2">The Detail</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Craftsmanship & Design</p>
          </div>
          
          <div className="lg:col-span-8 space-y-12">
            <div className="max-w-2xl">
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">
                {product.description || "Designed with precision and crafted from premium materials, this piece represents our commitment to minimalist excellence. Every stitch is placed with intention, ensuring a silhouette that is both timeless and contemporary."}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-zinc-100">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Product Specs</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <dt className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Collection</dt>
                    <dd className="text-xs font-bold uppercase">{product.collectionname.replace(/_/g, ' ')}</dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subcategory</dt>
                    <dd className="text-xs font-bold uppercase">{product.subcatagory.replace(/_/g, ' ')}</dd>
                  </div>
                </dl>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Care Guide</h4>
                <p className="text-[11px] font-medium text-zinc-500 uppercase leading-relaxed tracking-wider">
                  Wash cold to preserve fiber integrity. Dry flat in shade. Professional steam clean recommended for structured pieces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedProductCard;
