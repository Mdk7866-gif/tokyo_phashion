"use client";

import React, { useEffect, useState } from "react";
import HomePageThumbnailCard from "@/components/HomePageThumbnailCard";

interface Category {
  id: string;
  name: string;
  category_thumbnails: {
    image_url: string;
  } | null;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/user/gethomepagethumbnail');
        if (res.ok) {
          const json = await res.json();
          // Filter to only categories that have a thumbnail
          const validCategories = (json.data || []).filter((c: Category) => c.category_thumbnails && c.category_thumbnails.image_url);
          setCategories(validCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-12 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-6xl">
            Collections
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Curated Drops / Tokyo Streetwear
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 font-black uppercase italic text-zinc-300 animate-pulse">
            Loading drops...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 py-20">
            No collections found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {categories.map((cat) => (
              <HomePageThumbnailCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                imageUrl={cat.category_thumbnails?.image_url || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

