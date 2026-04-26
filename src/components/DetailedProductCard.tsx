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
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-10 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="group relative aspect-[3/4] bg-zinc-50 overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-zinc-100">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.productname} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm font-black uppercase tracking-[0.5em]">
                Image Processing
              </div>
            )}
            
            {/* Minimalist Floating Rating */}
            <div className="absolute top-8 left-8 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm transition-all group-hover:-translate-y-1">
              <span className="text-[11px] font-black text-black">{parseFloat(product.stars.toString()).toFixed(1)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>

            {/* Discount Badge */}
            {product.original_price > product.discount_price && (
              <div className="absolute top-8 right-8 bg-black text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
                {Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex flex-wrap gap-4 px-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedColorIndex === idx ? "border-black scale-105 shadow-xl" : "border-transparent opacity-40 hover:opacity-100"}`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt={img.colurname} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase leading-none">
                {product.collectionname.replace(/_/g, ' ')}
              </span>
              <span className="h-px w-6 bg-zinc-200"></span>
              <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase leading-none">
                {product.subcatagory.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9]">
              {product.productname}
            </h1>
          </div>

          <div className="flex items-baseline gap-6 mb-12">
            <span className="text-4xl font-black text-black tracking-tight">₹{product.discount_price}</span>
            <span className="text-xl font-bold text-zinc-300 line-through tracking-tight">₹{product.original_price}</span>
            <span className={`ml-auto text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${product.instoke === 'In Stock' ? 'bg-zinc-50 border-zinc-100 text-zinc-600' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
              {product.instoke || "In Stock"}
            </span>
          </div>

          <div className="space-y-12">
            {/* Color Selector Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Selected Color</span>
                <span className="text-xs font-black uppercase tracking-widest text-black">{selectedColorName}</span>
              </div>
              <div className="h-px w-full bg-zinc-100"></div>
            </div>

            {/* Size Selector */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Select Size</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 hover:text-black hover:border-black transition-all">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.size?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[64px] h-14 flex items-center justify-center rounded-2xl font-black text-sm border transition-all duration-300 ${selectedSize === s ? "bg-black text-white border-black scale-105 shadow-2xl" : "bg-white text-black border-zinc-100 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-100 rounded-2xl bg-zinc-50 px-2 h-16">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center font-bold text-xl hover:opacity-50 transition-opacity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-black text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center font-bold text-xl hover:opacity-50 transition-opacity"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-black text-white h-16 rounded-[1.5rem] font-black text-[11px] md:text-xs tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isAdding ? "ADDING..." : "ADD TO CART"}
                </button>
              </div>
              <button className="w-full bg-white border-2 border-black text-black h-16 rounded-[1.5rem] font-black text-[11px] md:text-xs tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all shadow-lg active:scale-[0.98]">
                BUY NOW
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 pt-16 mt-auto">
            <div className="flex items-center gap-4 p-5 bg-zinc-50/50 border border-zinc-100 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-500">
               <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                   <path d="M10 21V10a2 2 0 0 1 2-2h10l-2-2-2 2h-4V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6H4l-2-2-2 2h10"/>
                 </svg>
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Premium Shipping</p>
            </div>
            <div className="flex items-center gap-4 p-5 bg-zinc-50/50 border border-zinc-100 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-500">
               <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                   <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                 </svg>
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Info Section */}
      <div className="mt-24 lg:mt-40 border-t border-zinc-100 pt-20">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black leading-none mb-4">The Detail</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Craftsmanship & Design</p>
          </div>
          
          <div className="lg:col-span-8 space-y-16">
            <div className="max-w-3xl">
              <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap">
                {product.description || "Designed with precision and crafted from premium materials, this piece represents our commitment to minimalist excellence. Every stitch is placed with intention, ensuring a silhouette that is both timeless and contemporary."}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-zinc-100">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 border-b border-zinc-900 pb-2 inline-block">Product Specs</h4>
                <dl className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <dt className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Collection</dt>
                    <dd className="text-xs font-black uppercase tracking-tight">{product.collectionname.replace(/_/g, ' ')}</dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subcategory</dt>
                    <dd className="text-xs font-black uppercase tracking-tight">{product.subcatagory.replace(/_/g, ' ')}</dd>
                  </div>
                </dl>
              </div>
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 border-b border-zinc-900 pb-2 inline-block">Care Guide</h4>
                <p className="text-[10px] font-medium text-zinc-500 uppercase leading-[2] tracking-[0.2em]">
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
