"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PhotoCard1 from "@/components/PhotoCard1";
import VideoCard1 from "@/components/VideoCard1";
import PhotoCard2Carousel from "@/components/PhotoCard2";

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);
  const [catPage, setCatPage] = useState(0);

  const heroImages = [
    {
      img: "https://www.gcclothing.in/admin/uploads/category_images/catimg_69ce7b4f04c243.25238678.webp",
      text1: "Summer",
      text2: "Essential Linens",
    },
    {
      img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1920&auto=format&fit=crop",
      text1: "Autumn",
      text2: "Warm Textures",
    },
    {
      img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1920&auto=format&fit=crop",
      text1: "Winter",
      text2: "Premium Wool",
    }
  ];

  // Auto-slide hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const categories = [
    { title: "Full Pair", image: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800&auto=format&fit=crop" },
    { title: "Trends", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop" },
    { title: "Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
    { title: "Ethnic", image: "https://www.gcclothing.in/admin/uploads/variants/var_69b02fc61044e7.64888252.webp" },
    { title: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" },
    { title: "Co-Ords", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop" },
    { title: "Jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop" },
    { title: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
    { title: "Blazers", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop" },
    { title: "Trousers", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop" },
    { title: "Sneakers", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" },
    { title: "Accessories", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop" },
    { title: "Winter Wear", image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" },
    { title: "Summer Style", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" },
    { title: "Formal", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop" },
    { title: "Activewear", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=800&auto=format&fit=crop" },
    { title: "Streetwear", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop" },
    { title: "Lounge", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop" },
  ];

  const totalCatPages = Math.ceil(categories.length / 6);

  // Auto-slide categories
  useEffect(() => {
    const timer = setInterval(() => {
      setCatPage((p) => (p + 1) % totalCatPages);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalCatPages]);

  const nextCatPage = () => {
    setCatPage((p) => (p + 1) % totalCatPages);
  };
  const prevCatPage = () => {
    setCatPage((p) => (p - 1 + totalCatPages) % totalCatPages);
  };

  const reels = [
    { title: "MAFIA", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop" },
    { title: "OLD MONEY", src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
    { title: "RETRO SHIRTS", src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop" },
    { title: "EID FIT", src: "https://www.gcclothing.in/admin/uploads/variants/var_69b02fc61044e7.64888252.webp" },
    { title: "RETRO PAIR", src: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800&auto=format&fit=crop" },
    { title: "LINEN BREEZE", src: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop" },
    { title: "STREET CULTURE", src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop" },
    { title: "WINTER ESSENTIALS", src: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" }
  ];

  const newDrops = [
    { title: "Black Beast TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Mafia White TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Oxford Blue TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Plum Purple TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format&fit=crop", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Warm Tan TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
  ];

  const under999 = [
    { title: "Mocha Brownie Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop", price: "₹999" },
    { title: "Golden Inferno Neo Lachka Retro Pair", image: "https://www.gcclothing.in/admin/uploads/variants/var_69777039c75f57.41517251.webp", price: "₹999" },
    { title: "Midnight Petals Neo Lachka Retro Pair", image: "https://www.gcclothing.in/admin/uploads/variants/var_69777039c75f57.41517251.webp", price: "₹999" },
    { title: "Champagne Flora Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", price: "₹999" },
  ];

  const under499 = [
    { title: "Plum Purple TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Sufi Cream Zari Embroidered", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Black Resham Embroidered Kurta", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Dessert Tan Koti Kurta-Pyjama", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Black Bad-shash Zari Kurta", image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800&auto=format&fit=crop", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
  ];

  const denims = [
    { title: "Classic Blue Denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop", price: "₹1,299" },
    { title: "Midnight Black Jeans", image: "https://www.gcclothing.in/uploads/Our-Story-0gnZcn3m.webp", price: "₹1,199" },
    { title: "Distressed Retro Denim", image: "https://www.gcclothing.in/uploads/Our-Story-0gnZcn3m.webp", price: "₹1,499" },
    { title: "Vintage Washed Jeans", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop", price: "₹1,299" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      {/* ─── Hero Section with Swipe Carousel ─── */}
      <section className="relative w-full h-[75vh] md:h-[calc(100vh-120px)] overflow-hidden bg-black">
        {heroImages.map((hero, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(${(idx - currentHero) * 100}%)`,
              opacity: Math.abs(idx - currentHero) <= 1 ? 1 : 0
            }}
          >
            <Image 
              src={hero.img} 
              alt={hero.text2} 
              fill
              sizes="100vw"
              className="w-full h-full object-cover object-[center_20%] md:object-center"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent z-10 flex flex-col justify-end md:justify-center pb-24 md:pb-0 px-8 md:px-24">
              <div className="max-w-2xl text-left">
                <h2 className="text-white/95 text-7xl md:text-[9rem] font-serif leading-none italic mb-2 select-none">
                  {hero.text1}
                </h2>
                <h1 className="text-white text-[1.5rem] md:text-3xl font-light tracking-[0.25em] md:tracking-[0.4em] uppercase mb-10 md:mb-12">
                  <span className="font-bold">{hero.text2}</span>
                </h1>
                <button className="bg-white text-black px-8 md:px-10 py-4 w-max rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-100 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 group">
                  Shop COLLECTION 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Hero Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHero(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentHero === idx ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Categories Section with 6-item Grid Paging ─── */}
      <section className="w-full py-8 md:py-28 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1500px] px-4 md:px-12 relative flex flex-col items-center">
          <h2 className="text-center text-lg md:text-3xl font-black tracking-[0.2em] uppercase mb-6 md:mb-16 text-black heading-underline visible">
            SHOP BY <span className="text-zinc-400">CATEGORY</span>
          </h2>

          {/* Wrapper for sliding pages */}
          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${catPage * 100}%)` }}
            >
              {/* Render pages of 6 items each */}
              {Array.from({ length: totalCatPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="w-full shrink-0 flex-none px-2">
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 justify-items-center">
                    {categories.slice(pageIdx * 6, pageIdx * 6 + 6).map((cat, idx) => (
                      <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-2 transition-transform duration-500">
                        <PhotoCard1 imageSrc={cat.image} category={cat.title} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 mt-8 md:mt-12 items-center">
            <button 
              onClick={prevCatPage}
              className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalCatPages }).map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    catPage === idx ? "w-6 bg-black" : "w-1.5 bg-zinc-200"
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={nextCatPage}
              className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ─── SHOP VIA REEL Section (Infinite Marquee) ─── */}
      <section className="w-full py-8 md:py-28 bg-black text-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1500px]">
          <h2 className="text-center text-lg md:text-3xl font-black tracking-[0.3em] uppercase mb-8 md:mb-16">
            SHOP VIA <span className="text-zinc-500">REEL</span>
          </h2>
          <div className="w-10 h-0.5 bg-white/30 mx-auto mb-10 md:hidden" />
          
          <div className="relative w-full flex overflow-hidden group cursor-pointer">
            {/* The animated flex container that shifts slowly leftwards */}
            <div className="flex w-max animate-[swipeLeft_35s_linear_infinite] group-hover:[animation-play-state:paused] gap-4 md:gap-8 px-4">
              {/* Duplicate reels to create endless seamless loop */}
              {[...reels, ...reels, ...reels].map((reel, idx) => (
                <div key={idx} className="shrink-0 group/card">
                  <div className="transform transition-transform duration-500 group-hover/card:scale-[1.02]">
                    <VideoCard1 videoSrc={reel.src} title={reel.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Break 1 - Parallax */}
      <section 
        className="relative w-full h-[60vh] md:h-[80vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: 'url("https://www.gcclothing.in/admin/uploads/variants/var_69c7c0df4b3645.17546873.webp")' }}
      >
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-white text-sm md:text-xl font-light tracking-[0.5em] uppercase mb-6 drop-shadow-lg">
            Elegance Defined
          </p>
          <button className="bg-white/90 backdrop-blur-sm text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-3 pointer-events-auto shadow-2xl group hover:scale-105">
            VIEW CAMPAIGN 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* NEW DROPS Section (CoverflowCarousel) */}
      <section className="w-full py-8 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full flex justify-center items-center flex-col relative w-full">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-6 md:mb-10 text-black px-6">
            NEW <span className="text-zinc-500">DROPS</span>
          </h2>
          
          <div className="w-full relative px-2">
            <PhotoCard2Carousel items={newDrops} />
          </div>

          <button className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 group shadow-xl">
            MORE 31 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* UNDER 999 Section */}
      <section className="w-full py-12 md:py-24 bg-white flex flex-col items-center border-t border-gray-100">
        <div className="w-full max-w-[1500px] px-4 md:px-12">
          <h2 className="text-center text-xl md:text-4xl font-black tracking-[0.2em] uppercase mb-6 md:mb-16 text-black">
            UNDER <span className="text-zinc-400">999</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 w-full justify-items-center">
            {under999.map((item, idx) => (
              <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-2 transition-transform duration-500">
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 md:mt-10">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 group shadow-xl">
              MORE 40
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Image Break 2 - Parallax */}
      <section 
        className="relative w-full h-[50vh] md:h-[60vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1920&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* UNDER 499 Section (CoverflowCarousel) */}
      <section className="w-full py-20 md:py-28 bg-zinc-50 flex flex-col items-center overflow-hidden">
        <div className="w-full flex justify-center items-center flex-col relative w-full">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-6 md:mb-10 text-black px-6">
            UNDER <span className="text-zinc-500">499</span>
          </h2>
          
          <div className="w-full relative px-2">
            <PhotoCard2Carousel items={under499} />
          </div>

          <button className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 group shadow-xl">
            MORE 20 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Hero Image Break 3 - Parallax */}
      <section 
        className="relative w-full h-[60vh] md:h-[80vh] bg-fixed bg-[center_top] bg-cover"
        style={{ backgroundImage: 'url("https://www.gcclothing.in/admin/uploads/banners/banner_1774730968_69c83ed82952e.png")' }}
      >
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
          <button className="bg-white/90 backdrop-blur-sm text-black px-8 md:px-12 py-3 md:py-5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-white hover:scale-105 transition-all flex items-center gap-3 pointer-events-auto shadow-2xl group">
            EXPLORE NOSTALGIA
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* TP DENIMS Section */}
      <section className="w-full py-12 md:py-24 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1500px] px-4 md:px-12">
          <h2 className="text-center text-xl md:text-4xl font-black tracking-[0.2em] uppercase mb-6 md:mb-16 text-black">
            TP <span className="text-zinc-400">DENIMS</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 w-full justify-items-center">
            {denims.map((item, idx) => (
              <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-2 transition-transform duration-500">
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY Section */}
      <section className="w-full py-12 md:py-32 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1400px] px-4 md:px-12 flex flex-col lg:flex-row gap-8 md:gap-20 items-center">
          {/* Image */}
          <div className="relative group overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full lg:w-1/2 aspect-[4/3] md:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
              alt="Our Story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Content */}
          <div className="flex flex-col w-full lg:w-1/2 text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black mb-4 md:mb-6 font-serif">
              OUR STORY
            </h2>
            <div className="w-12 h-1 bg-black mb-6 md:mb-10" />

            <div className="flex flex-col gap-5 md:gap-8 text-zinc-600 leading-relaxed">
              <p className="text-xs md:text-base font-medium">
                Welcome to the brand that started on a cycle and is now driving men&apos;s fashion forward. It all started with humble beginnings and a few clothes—no showroom, just passion on the streets. Selling suits door-to-door, we built trust one customer at a time.
              </p>
              <p className="text-xs md:text-base font-medium">
                From that hustle, we opened our first showroom, creating a space where men found more than style. But we didn&apos;t stop there. We moved into manufacturing, crafting every fabric, stitch, and silhouette in-house to deliver fashion with purpose.
              </p>
              <p className="text-xs md:text-base font-medium">
                Today, we&apos;re not just a clothing brand. We&apos;re a movement from streets to showrooms to full-scale creation. Driven by belief, built with hustle, worn with pride. And we&apos;re just getting started.
              </p>
            </div>

            <button className="mt-8 md:mt-12 bg-black text-white px-8 py-3.5 w-max rounded-sm font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1">
              EXPLORE PRODUCTS
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
