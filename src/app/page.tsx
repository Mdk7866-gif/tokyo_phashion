import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section - Stark B&W */}
      <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden border-b border-black">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1523381235208-2593450f60f6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 rounded-none border border-black bg-white px-5 py-2 mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Season Drop Available</span>
          </div>
          
          <h1 className="text-7xl font-black uppercase italic tracking-tighter sm:text-9xl lg:text-[12rem] leading-[0.8] mb-12">
            <span className="block">Tokyo</span>
            <span className="block opacity-20">Phashion</span>
          </h1>
          
          <p className="mx-auto max-w-xl text-lg font-medium text-black/60 leading-relaxed mb-16">
            Where Shibuya street culture meets high-end minimalism. 
            Redefining the urban silhouette for the modern avant-garde.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/shop"
              className="group flex items-center gap-4 bg-black px-12 py-6 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar - High Contrast */}
      <section className="border-b border-black bg-zinc-50 py-20">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Global Shipping", desc: "Express delivery in 72 hours" },
              { icon: ShieldCheck, title: "Authentic Only", desc: "100% verified street apparel" },
              { icon: Zap, title: "Priority Drop", desc: "Early access for club members" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-6">
                <div className="rounded-none border-2 border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">{f.title}</h3>
                  <p className="mt-2 text-xs font-medium text-black/40">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories - Minimalist Grid */}
      <section className="mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter sm:text-6xl mb-6">Curated Drops</h2>
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest">Selected for the season</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-black border border-black">
          {[
            { name: "Outerwear", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop" },
            { name: "Streetwear", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${cat.name.toLowerCase()}`}
              className="group relative h-[600px] overflow-hidden bg-white"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover grayscale transition-all duration-[2s] group-hover:scale-110 group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
                <div>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{cat.name}</h3>
                  <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2 inline-flex transition-transform duration-300 group-hover:-translate-y-2">
                    Shop Collection <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-black py-32 text-white">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter sm:text-6xl mb-8">Join the Movement</h2>
          <p className="mx-auto max-w-xl text-lg opacity-60 mb-12">Be the first to know about exclusive drops and secret collections.</p>
          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="flex-1 bg-white px-6 py-4 text-xs font-black text-black placeholder-zinc-400 focus:outline-none"
              />
              <button className="bg-white/10 border border-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
