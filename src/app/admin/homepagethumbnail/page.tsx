"use client";

import React, { useEffect, useState } from "react";
import HomePageThumbnailCard from "@/components/admin/HomePageThumbnailCard";
import { Image as ImageIcon, LayoutGrid } from "lucide-react";

export default function HomePageThumbnailPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/crudhomepagethumnail');
      if (res.ok) {
        const result = await res.json();
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            Homepage <span className="text-zinc-400">Thumbnails</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Assign cover photos to categories for the shop homepage
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => (
            <HomePageThumbnailCard 
              key={category.id} 
              category={category} 
              onUpdate={fetchData} 
            />
          ))}
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 py-20 text-zinc-400">
          <ImageIcon className="mb-4 h-12 w-12" />
          <p className="text-xs font-black uppercase tracking-widest">No categories found</p>
          <p className="mt-1 text-[10px] font-bold">Add categories in the sidebar first</p>
        </div>
      )}
    </div>
  );
}
