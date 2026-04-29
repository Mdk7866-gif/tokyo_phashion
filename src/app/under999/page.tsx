"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ShortProductCard from "@/components/ShortProductCard";
import DetailedProductCard from "@/components/DetailedProductCard";

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

function Under999Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const collectionOfProduct = searchParams.get('collection');
  const currentSort = searchParams.get('filter') || 'newest first';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/user/under999?sort=${encodeURIComponent(currentSort)}&page=${currentPage}&limit=25`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, [currentSort, currentPage]);

  const fetchSingleProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/getsingleproduct?collection=${encodeURIComponent(collectionOfProduct || '')}&id=${productId}`);
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
  }, [productId, collectionOfProduct]);

  useEffect(() => {
    if (productId && collectionOfProduct) {
      fetchSingleProduct();
    } else {
      fetchProducts();
    }
  }, [productId, collectionOfProduct, fetchProducts, fetchSingleProduct]);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', newSort);
    params.set('page', '1');
    router.push(`/under999?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/under999?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (productId && singleProduct) {
    return (
      <div className="pt-8 pb-16">
        <DetailedProductCard 
          product={{...singleProduct, collectionname: collectionOfProduct || ''}} 
        />
      </div>
    );
  }

  return (
    <div className="pt-4 md:pt-8 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2 md:space-y-4">
          <p className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-violet-500 uppercase">
            Value Selection
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none">
            Under <span className="text-violet-600">₹999</span>
          </h1>
          <div className="h-1 w-12 md:w-20 bg-violet-600 mt-4 md:mt-6"></div>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Sort By</label>
          <div className="relative group">
            <select 
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-white border-2 border-zinc-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:border-violet-600 transition-all cursor-pointer"
            >
              <option value="newest first">Newest First</option>
              <option value="price: low to high">Price: Low to High</option>
              <option value="price: high to low">Price: High to Low</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Filtering Deals...</p>
        </div>
      ) : error ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-8 py-4 bg-black text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-zinc-800 transition-colors">Retry</button>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
            {products.map((product) => (
              <ShortProductCard 
                key={product._id} 
                product={product} 
                collectionName={product.collectionname} 
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center border-2 border-zinc-100 rounded-full hover:border-black transition-all disabled:opacity-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span className="text-sm font-black tracking-widest">{currentPage} / {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center border-2 border-zinc-100 rounded-full hover:border-black transition-all disabled:opacity-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-32 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No products found</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">We are currently updating our budget catalog.</p>
        </div>
      )}
    </div>
  );
}

export default function Under999Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Under999Content />
    </Suspense>
  );
}
