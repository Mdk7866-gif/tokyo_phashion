"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ArrowRight, X } from "lucide-react";

export default function BriefProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category_id = searchParams.get("category_id");
  const subcategory_ids = searchParams.get("subcategory_ids") || "";
  const sort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryName, setCategoryName] = useState("");
  const [availableSubs, setAvailableSubs] = useState<any[]>([]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (category_id) {
      fetchCategories();
      fetchProducts();
    }
  }, [category_id, subcategory_ids, sort]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/user/getsidebarcategoryandsubcategory');
      if (res.ok) {
        const json = await res.json();
        const cat = json.data?.find((c: any) => c.id === category_id);
        if (cat) {
          setCategoryName(cat.name);
          setAvailableSubs(cat.subcategories || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("category_id", category_id!);
      if (subcategory_ids) query.set("subcategory_ids", subcategory_ids);
      query.set("sort", sort);

      const res = await fetch(`/api/user/getbriefproducts?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleSubcategory = (subId: string) => {
    const currentSubs = subcategory_ids ? subcategory_ids.split(",") : [];
    let newSubs;
    if (currentSubs.includes(subId)) {
      newSubs = currentSubs.filter(id => id !== subId);
    } else {
      newSubs = [...currentSubs, subId];
    }
    
    updateUrl(newSubs.join(","), sort);
  };

  const handleSortChange = (newSort: string) => {
    updateUrl(subcategory_ids, newSort);
  };

  const updateUrl = (subs: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subs) {
      params.set("subcategory_ids", subs);
    } else {
      params.delete("subcategory_ids");
    }
    params.set("sort", newSort);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeSubIds = subcategory_ids ? subcategory_ids.split(",") : [];

  return (
    <div className="min-h-screen bg-white text-black pb-24">
      {/* Header */}
      <div className="border-b border-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl lg:text-6xl">
            {categoryName || "Collection"}
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            {products.length} Products Available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="mb-6 flex items-center justify-between lg:hidden border-b border-black pb-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 bg-white p-6 transition-transform duration-300 lg:static lg:block lg:w-64 lg:p-0 lg:z-auto lg:translate-x-0
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <h2 className="text-lg font-black uppercase italic tracking-tighter">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X className="h-6 w-6" /></button>
            </div>

            <div className="space-y-10">
              {/* Sort By */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 underline decoration-black underline-offset-4">Sort By</h3>
                <div className="space-y-3">
                  {[
                    { id: "newest", label: "Newest First" },
                    { id: "price_low", label: "Price: Low to High" },
                    { id: "price_high", label: "Price: High to Low" }
                  ].map(option => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-3 h-3 border border-black flex items-center justify-center transition-colors ${sort === option.id ? 'bg-black' : 'group-hover:bg-zinc-200'}`}>
                        {sort === option.id && <div className="w-1.5 h-1.5 bg-white" />}
                      </div>
                      <input 
                        type="radio" 
                        name="sort" 
                        value={option.id} 
                        checked={sort === option.id}
                        onChange={() => handleSortChange(option.id)}
                        className="hidden" 
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {availableSubs.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 underline decoration-black underline-offset-4">Filter by Type</h3>
                  <div className="space-y-3">
                    {availableSubs.map(sub => (
                      <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-3 h-3 border border-black flex items-center justify-center transition-colors ${activeSubIds.includes(sub.id) ? 'bg-black' : 'group-hover:bg-zinc-200'}`}>
                          {activeSubIds.includes(sub.id) && <div className="w-1.5 h-1.5 bg-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          checked={activeSubIds.includes(sub.id)}
                          onChange={() => toggleSubcategory(sub.id)}
                          className="hidden" 
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-12 lg:hidden">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center text-xl font-black uppercase italic tracking-tighter text-zinc-300 animate-pulse">
                Loading Drops...
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-zinc-400">No products found matching your criteria.</p>
                <button 
                  onClick={() => updateUrl("", "newest")}
                  className="mt-6 border border-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => (
                  <Link 
                    key={product.id}
                    href={`/detailedproduct?product_id=${product.id}`}
                    className="group relative flex flex-col bg-white border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="aspect-[3/4] relative w-full overflow-hidden bg-zinc-100 border-b border-black">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase">No Image</div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-[11px] font-black uppercase italic tracking-tight line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <p className="text-sm font-black">${product.price.toFixed(2)}</p>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
