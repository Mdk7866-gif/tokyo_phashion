"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShortProductCard from "@/components/ShortProductCard";
import DetailedProductCard from "@/components/DetailedProductCard";
import { useCallback } from "react";

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
  isPlaceholder?: boolean;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const collection = searchParams.get('collection');
  const subcatagory = searchParams.get('subcatagory');
  const productId = searchParams.get('id');

  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Use raw collection and subcatagory names for the API
      const res = await fetch(`/api/admin/getproducts?collection=${encodeURIComponent(collection || '')}${subcatagory ? `&subcategory=${encodeURIComponent(subcatagory)}` : ''}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products.filter((p: Product) => !p.isPlaceholder));
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, [collection, subcatagory]);

  const fetchSingleProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/getsingleproduct?collection=${encodeURIComponent(collection || '')}&id=${productId}`);
      const data = await res.json();
      if (data.success) {
        setSingleProduct(data.product);
      } else {
        setError(data.error || "Product not found");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, [collection, productId]);

  useEffect(() => {
    if (productId) {
      fetchSingleProduct();
    } else if (collection) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [collection, subcatagory, productId, fetchProducts, fetchSingleProduct]);

  if (productId && singleProduct) {
    return (
      <div className="pt-8 pb-16">
        <DetailedProductCard product={{...singleProduct, collectionname: collection || ''}} />
      </div>
    );
  }

  return (
    <div className="pt-4 md:pt-8 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Shop Header - only show if not viewing a single product */}
      {!productId && (
        <div className="mb-12 md:mb-16 space-y-2 md:space-y-4">
          <p className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase min-h-[14px]">
            {collection?.replace(/_/g, ' ')}
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none min-h-[1em]">
            {subcatagory ? subcatagory.replace(/_/g, ' ') : collection?.replace(/_/g, ' ')}
          </h1>
          <div className="h-1 w-12 md:w-20 bg-black mt-4 md:mt-6"></div>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Syncing Catalog...</p>
        </div>
      ) : error ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{error}</p>
          <div className="flex gap-4">
            <button onClick={() => window.history.back()} className="mt-8 px-8 py-4 border-2 border-black text-black font-black text-xs tracking-widest uppercase rounded-full hover:bg-black hover:text-white transition-colors">Go Back</button>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-black text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-zinc-800 transition-colors">Retry</button>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
          {products.map((product) => (
            <ShortProductCard 
              key={product._id} 
              product={product} 
              collectionName={collection || ''} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">No products found in this collection yet.</p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
