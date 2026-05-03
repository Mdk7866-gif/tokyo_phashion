"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Box, Package } from "lucide-react";
import ConfirmationMessagePopUp from "../ConfirmationMessagePopUp";

interface ProductBriefDescriptionCardProps {
  product: any;
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
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const getThumbnail = () => {
    const variant = product.product_variants?.[0];
    return variant?.product_images?.[0]?.image_url || null;
  };

  const thumbnail = getThumbnail();
  const totalStock = product.product_variants?.reduce((sum: number, v: any) => {
    return sum + (v.variant_sizes?.reduce((s: number, vs: any) => s + (vs.stock || 0), 0) || 0);
  }, 0) || 0;

  return (
    <>
      <div className="group border border-black bg-white flex flex-col transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex h-32 border-b border-black">
           <div className="w-1/3 border-r border-black relative bg-zinc-50 flex items-center justify-center overflow-hidden">
             {thumbnail ? (
                <Image src={thumbnail} alt={product.name} fill className="object-cover" sizes="33vw" />
             ) : (
                <div className="text-[8px] font-black uppercase text-zinc-300">No Image</div>
             )}
           </div>
           <div className="w-2/3 p-4 flex flex-col">
              <h3 className="text-sm font-black uppercase italic tracking-tight truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="mt-1 text-[10px] text-zinc-500 line-clamp-2">
                {product.description || "No description provided."}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-[10px] font-bold text-zinc-500">
                 <div className="flex items-center gap-1">
                   <Package className="h-3 w-3" />
                   <span>{product.product_variants?.length || 0} Colors</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <Box className="h-3 w-3" />
                   <span>{totalStock} in stock</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-2 bg-zinc-50 flex flex-wrap gap-2 justify-between items-center">
           <div className="flex gap-1 overflow-x-auto custom-scrollbar flex-1 mr-2">
              {product.product_variants?.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}&color=${v.color}`)}
                  className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-white border border-black hover:bg-black hover:text-white transition-colors flex-shrink-0"
                >
                  {v.color}
                </button>
              ))}
              <button
                onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}&color=NEW`)}
                className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-zinc-200 border border-zinc-300 hover:bg-black hover:text-white hover:border-black transition-colors flex-shrink-0"
                title="Add new color variant"
              >
                + COLOR
              </button>
           </div>
           
           <div className="flex gap-1 flex-shrink-0">
             <button 
                onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=${product.id}&color=NEW`)}
                className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200"
                title="Edit Product Details"
             >
                <Pencil className="h-3.5 w-3.5" />
             </button>
             <button 
                onClick={() => setShowConfirm(true)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
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
