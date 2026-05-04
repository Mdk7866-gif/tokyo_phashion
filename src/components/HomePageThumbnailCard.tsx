"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HomePageThumbnailCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

export default function HomePageThumbnailCard({ id, name, imageUrl }: HomePageThumbnailCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <Link
      href={`/shop?category=${id}`}
      className="group relative flex flex-col overflow-hidden bg-white border border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="aspect-[4/5] relative w-full overflow-hidden bg-zinc-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
          </div>
        )}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover transition-all duration-[1s] group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 50vw, 33vw"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      
      <div className="p-3 bg-white flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase italic tracking-tighter truncate pr-2">
          {name}
        </h3>
        <ArrowRight className="h-3 w-3 flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

