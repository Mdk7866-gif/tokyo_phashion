"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Box, Package, Share2, Check } from "lucide-react";
import ConfirmationMessagePopUp from "../ConfirmationMessagePopUp";

interface ProductSize {
  stock?: number;
}

interface ProductImage {
  image_url: string;
}

interface ProductVariant {
  id: string;
  color: string;
  product_images?: ProductImage[];
  variant_sizes?: ProductSize[];
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  product_variants?: ProductVariant[];
}

interface ProductBriefDescriptionCardProps {
  product: Product;
  category: string;
  subcategory: string;
  cat_id: string;
  sub_id: string;
  onRefresh: () => void;
}

export default function ProductBriefDescriptionCard({
  product,
  category,
  subcategory,
  cat_id,
  sub_id,
  onRefresh
}: ProductBriefDescriptionCardProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/crudproduct?id=${product.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/detailedproduct?product_id=${product.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThumbnail = () => {
    const variant = product.product_variants?.[0];
    return variant?.product_images?.[0]?.image_url || null;
  };

  const thumbnail = getThumbnail();
  const totalStock = product.product_variants?.reduce((sum: number, v: ProductVariant) => {
    return sum + (v.variant_sizes?.reduce((s: number, vs: ProductSize) => s + (vs.stock || 0), 0) || 0);
  }, 0) || 0;

  return (
    <>
      <div className={`group border border-black bg-white flex flex-col transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${totalStock === 0 ? 'border-zinc-300 bg-zinc-50/50' : ''}`}>
        <div 
          className="flex h-32 border-b border-black cursor-pointer"
          onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}`)}
        >
           <div className={`w-1/3 border-r border-black relative bg-zinc-50 flex items-center justify-center overflow-hidden ${totalStock === 0 ? 'filter grayscale opacity-55' : ''}`}>
             {thumbnail ? (
                <Image src={thumbnail} alt={product.name} fill className="object-cover" sizes="33vw" />
             ) : (
                <div className="text-[8px] font-black uppercase text-zinc-300">No Image</div>
             )}
           </div>
           <div className="w-2/3 p-4 flex flex-col">
              <h3 className="text-sm font-black uppercase italic tracking-tight truncate flex items-center justify-between gap-2" title={product.name}>
                <span className="truncate">{product.name}</span>
                {totalStock === 0 && (
                  <span className="flex-shrink-0 text-[8px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(220,38,38,1)]">
                    OUT
                  </span>
                )}
              </h3>
              <p className="mt-1 text-[10px] text-zinc-500 line-clamp-2">
                {product.description || "No description provided."}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-[10px] font-bold text-zinc-500">
                 <div className="flex items-center gap-1">
                   <Package className="h-3 w-3" />
                   <span>{product.product_variants?.length || 0} Colors</span>
                 </div>
                 <div className={`flex items-center gap-1 ${totalStock === 0 ? 'text-red-500 font-extrabold' : ''}`}>
                    <Box className="h-3 w-3" />
                    <span>{totalStock === 0 ? 'Out of stock' : `${totalStock} in stock`}</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-2 bg-zinc-50 flex flex-wrap gap-2 justify-between items-center">
           <div className="flex gap-1 overflow-x-auto custom-scrollbar flex-1 mr-2">
              {product.product_variants?.map((v: ProductVariant) => (
                <button
                  key={v.id}
                  onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}&color=${v.color}`)}
                  className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-white border border-black hover:bg-black hover:text-white transition-colors flex-shrink-0"
                >
                  {v.color}
                </button>
              ))}
          
           </div>
           
           <div className="flex gap-1 flex-shrink-0">
             <div className="relative group/copy">
               <button 
                  onClick={handleCopyLink}
                  className={`p-1.5 transition-colors ${copied ? 'text-green-600 bg-green-50' : 'text-zinc-500 hover:text-black hover:bg-zinc-200'}`}
                  title={copied ? "Copied!" : "Copy Shareable Link"}
               >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />} 
               </button>
               {copied && (
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 uppercase font-bold tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                   Link Copied
                 </span>
               )}
             </div>
             <button 
                onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}`)}
                className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200"
                title="Edit Product Details"
             >
                <Pencil className="h-3.5 w-3.5" />
             </button>
             <button 
                onClick={() => setShowConfirm(true)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
                title="Delete Product"
             >
                <Trash2 className="h-3.5 w-3.5" />
             </button>
           </div>
        </div>
      </div>

      <ConfirmationMessagePopUp
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`}
        type="error"
        confirmText="Delete"
      />
    </>
  );
}
