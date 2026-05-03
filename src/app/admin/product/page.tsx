"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductDetailedDescriptionCard from "@/components/admin/ProductDetailedDescriptionCard";
import ProductBriefDescriptionCard from "@/components/admin/ProductBriefDescriptionCard";
import { Plus, Package } from "lucide-react";

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const cat_id = searchParams.get("cat_id");
  const sub_id = searchParams.get("sub_id");
  const product_id = searchParams.get("product_id");
  const color = searchParams.get("color");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!sub_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crudproduct?sub_id=${sub_id}`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sub_id && !product_id) {
      fetchProducts();
    }
  }, [sub_id, product_id]);

  if (!category || !subcategory || !cat_id || !sub_id) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 py-20 text-zinc-400">
        <Package className="mb-4 h-12 w-12" />
        <p className="text-xs font-black uppercase tracking-widest">No Selection</p>
        <p className="mt-1 text-[10px] font-bold">Please select a subcategory from the sidebar first</p>
      </div>
    );
  }

  // If adding or editing a product
  if (product_id) {
    return (
      <ProductDetailedDescriptionCard 
        category={category} 
        subcategory={subcategory} 
        cat_id={cat_id}
        sub_id={sub_id}
        product_id={product_id === "NEW" ? null : product_id} 
        color={color === "NEW" ? null : color}
        onBack={() => {
          router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}`);
        }}
      />
    );
  }

  // Listing all products in this subcategory
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            {subcategory} <span className="text-zinc-400">Products</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Category: {category}
          </p>
        </div>
        <button
          onClick={() => router.push(`/admin/product?category=${category}&subcategory=${subcategory}&cat_id=${cat_id}&sub_id=${sub_id}&product_id=NEW&color=NEW`)}
          className="flex items-center gap-2 border border-black bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse bg-zinc-100 border border-zinc-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-8">
          {products.map(p => (
             <ProductBriefDescriptionCard 
               key={p.id} 
               product={p} 
               category={category}
               subcategory={subcategory}
               cat_id={cat_id}
               sub_id={sub_id}
               onRefresh={fetchProducts}
             />
          ))}
          {products.length === 0 && (
             <div className="col-span-full py-12 text-center text-zinc-400 border border-dashed border-zinc-200">
               <p className="text-xs font-black uppercase tracking-widest">No Products</p>
               <p className="mt-1 text-[10px] font-bold">Click "Add Product" to create one.</p>
             </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ProductPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Suspense fallback={<div className="p-8 text-center animate-pulse bg-zinc-100 h-64" />}>
        <ProductContent />
      </Suspense>
    </div>
  );
}
