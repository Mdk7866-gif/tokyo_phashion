"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function TrendPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-12 animate-in fade-in zoom-in duration-1000">
        <Logo width={180} color="#000" className="mx-auto" />
      </div>
      
      <div className="space-y-6 max-w-lg animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.8em] text-rose-600 block mb-4">
          Drop SS '25
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">
          Trends <br/> <span className="text-zinc-300">Loading</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-medium uppercase tracking-widest leading-loose">
          Our global trend curators are currently <br/> finalizing the next collection.
        </p>
        
        <div className="pt-10 flex flex-col items-center gap-6">
          <div className="h-0.5 w-32 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"></div>
          <Link 
            href="/"
            className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            Go Back Home
          </Link>
        </div>
      </div>

      <div className="fixed bottom-12 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em] select-none">
        Tokyo Fashion • Trend Report
      </div>
    </div>
  );
}
