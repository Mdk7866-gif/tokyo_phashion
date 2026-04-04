"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

const articles: BlogPost[] = [
  {
    id: 1,
    title: "The Modern Renaissance: Tokyo's 2026 Streetwear Scene",
    category: "STREETWEAR",
    date: "April 04, 2026",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1520&auto=format&fit=crop",
    excerpt: "Exploring the fusion of traditional craftsmanship and avant-garde street style in the heart of Harajuku. Discover how the next generation is redefining urban aesthetics."
  },
  {
    id: 2,
    title: "Minimalist Essentials: Building Your Core Wardrobe",
    category: "STYLE GUIDE",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1470&auto=format&fit=crop",
    excerpt: "Why less is more when it comes to timeless fashion. A comprehensive guide to the only pieces you really need for a versatile closet."
  },
  {
    id: 3,
    title: "The Return of the Tailored Silhouette",
    category: "EDITORIAL",
    date: "March 15, 2026",
    image: "https://images.unsplash.com/photo-1539109132314-34a9c6553876?q=80&w=1470&auto=format&fit=crop",
    excerpt: "Moving away from oversized fits towards a more refined, structured approach to modern menswear. Structure meets fluidity."
  },
  {
    id: 4,
    title: "Accentuating the Detail: Luxury Accessories",
    category: "ACCESSORIES",
    date: "March 02, 2026",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1470&auto=format&fit=crop",
    excerpt: "How the right watch or leather good can elevate a simple outfit into something extraordinary. It's all in the details."
  },
  {
    id: 5,
    title: "Behind the Scenes: The Phashion Studio",
    category: "INSIDER",
    date: "February 20, 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1470&auto=format&fit=crop",
    excerpt: "A look at our design process, from initial moodboard and fabric sourcing to the final hand-stitched garment."
  },
  {
    id: 6,
    title: "Sourcing Excellence: Our Sustainable Commitment",
    category: "CRAFT",
    date: "February 10, 2026",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1470&auto=format&fit=crop",
    excerpt: "Discover the eco-friendly materials and ethical workshops that form the backbone of Tokyo Phashion's production."
  }
];

export default function BlogPage() {
  const featuredPosts = articles.slice(0, 3);
  const [currentHero, setCurrentHero] = useState(0);

  // Auto-slide hero (like on Homepage)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % featuredPosts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  useEffect(() => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .heading-underline');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ─── Hero Section (Pure Black like Homepage) ─── */}
      <section className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-black">
        {featuredPosts.map((post, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-transform duration-[1200ms] ease-in-out"
            style={{
              transform: `translateX(${(idx - currentHero) * 100}%)`,
              opacity: Math.abs(idx - currentHero) <= 1 ? 1 : 0
            }}
          >
            <Image 
              src={post.image} 
              alt={post.title} 
              fill
              className="w-full h-full object-cover brightness-75 scale-105"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-24">
              <div className="max-w-4xl text-left">
                <span className="text-white/60 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-4 block animate-pulse">
                  FEATURED STORY
                </span>
                <h1 className="text-white text-5xl md:text-[8rem] font-serif leading-none italic mb-8 select-none tracking-tighter">
                  {post.title.split(':')[0]}
                </h1>
                <button className="bg-white text-black px-10 py-5 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-zinc-100 hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group">
                  READ STORY 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-2">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Hero Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {featuredPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHero(idx)}
              className={`h-1 rounded-full transition-all duration-700 ${
                currentHero === idx ? "w-12 bg-white" : "w-3 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Category Selection (Clean White like Homepage) ─── */}
      <section className="w-full py-12 md:py-24 bg-white flex flex-col items-center">
        <div className="max-w-7xl w-full px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 fade-up">
                <h2 className="text-2xl md:text-4xl font-black tracking-[0.2em] uppercase text-black heading-underline">
                    BROWSE <span className="text-zinc-400">JOURNAL</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                    {["ALL", "STREETWEAR", "EDITORIAL", "INSIDER", "CRAFT"].map((cat) => (
                        <button key={cat} className="text-[10px] tracking-[0.3em] font-black text-zinc-400 hover:text-black transition-colors uppercase border-b-2 border-transparent hover:border-black pb-1">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Grid (White background style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {articles.slice(3, 6).map((post, i) => (
                    <article key={post.id} className="group cursor-pointer flex flex-col fade-up" style={{ transitionDelay: `${i * 150}ms` }}>
                        <div className="relative aspect-[4/5] overflow-hidden mb-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <Image 
                                src={post.image} 
                                alt={post.title} 
                                fill 
                                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                        <div className="space-y-4 px-2">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">{post.category}</span>
                                <span className="text-[9px] text-zinc-300 font-bold uppercase">{post.date}</span>
                            </div>
                            <h3 className="text-2xl font-black text-black leading-tight group-hover:text-zinc-600 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
      </section>

      {/* ─── Parallax Narrative Break (Deep Black background style) ─── */}
      <section 
        className="relative w-full h-[60vh] md:h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1539109132314-34a9c6553876?q=80&w=1920&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 fade-up">
            <h4 className="text-white text-xs md:text-base font-light tracking-[0.8em] uppercase mb-8 opacity-80">
                Editorial Collection 2026
            </h4>
            <h2 className="text-white text-5xl md:text-[7rem] font-serif italic leading-none mb-12 drop-shadow-2xl">
                The Fabric of Time
            </h2>
            <button className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-zinc-100 hover:scale-110 transition-all flex items-center gap-3 mx-auto shadow-2xl">
                VIEW EDITORIAL 
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
            </button>
        </div>
      </section>

      {/* ─── Archive Section (Zinc-50 background style like Under 499) ─── */}
      <section className="w-full py-20 md:py-32 bg-zinc-50 flex flex-col items-center">
        <div className="max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 fade-up">
                <span className="text-zinc-400 text-[10px] font-black tracking-[0.4em] uppercase mb-4 block">
                    THE ARCHIVE
                </span>
                <h2 className="text-4xl md:text-6xl font-serif italic text-black mb-10 leading-tight">
                    Preserving the Heritage of Modern Craftsmanship.
                </h2>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-12 max-w-xl">
                    Our digital journal is more than just trends—it&apos;s a chronicling of the hustle, from cycle-door-to-door suits to the full-scale manufacturing powerhouse that Tokyo Phashion is today.
                </p>
                <div className="flex flex-col gap-6">
                    {[
                        "2025: The Street Era",
                        "2024: Tailored Silhouettes",
                        "2023: The Beginning"
                    ].map((year, i) => (
                        <div key={year} className="flex items-center justify-between border-b border-zinc-200 pb-4 group cursor-pointer" style={{ transitionDelay: `${i * 100}ms` }}>
                            <span className="text-black font-black tracking-widest uppercase text-xs">{year}</span>
                            <span className="text-zinc-300 group-hover:text-black transition-colors transform group-hover:translate-x-2 duration-300">→</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl fade-up">
                <Image 
                    src="https://www.gcclothing.in/admin/uploads/variants/var_69c6bbdb0cae37.27627187.webp"
                    alt="Archive"
                    fill
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                />
            </div>
        </div>
      </section>

      {/* ─── Newsletter Marquee (Black section like Reels) ─── */}
      <section className="w-full py-12 bg-black overflow-hidden border-y border-white/5">
        <div className="flex w-max animate-[swipeLeft_40s_linear_infinite] gap-20 whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                    <span className="text-white/20 text-4xl md:text-7xl font-serif italic tracking-tighter">SUBSCRIBE TO THE JOURNAL _</span>
                    <span className="text-white/40 text-sm md:text-xl font-black tracking-[0.5em] uppercase">TOKYO PHASHION EDITION 2026</span>
                </div>
            ))}
        </div>
      </section>

    </div>
  );
}
