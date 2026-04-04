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

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroImages.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  // Auto-slide hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4500);
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

  const nextCatPage = () => setCatPage((p) => (p + 1) % totalCatPages);
  const prevCatPage = () => setCatPage((p) => (p - 1 + totalCatPages) % totalCatPages);

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
    { title: "Midnight Petals Neo Lachka Retro Pair", image: "https://www.gcclothing.in/admin/uploads/variants/var_69b6e71edbd168.48302284.webp", price: "₹999" },
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
    { title: "Midnight Black Jeans", image: "https://www.gcclothing.in/admin/uploads/variants/var_69b57eea107229.79676526.webp", price: "₹1,199" },
    { title: "Distressed Retro Denim", image: "https://www.gcclothing.in/admin/uploads/variants/var_69c7c50ade02b1.34397559.png", price: "₹1,499" },
    { title: "Vintage Washed Jeans", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop", price: "₹1,299" },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".fade-up, .heading-underline");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-slide categories
  useEffect(() => {
    const timer = setInterval(() => {
      setCatPage((p) => (p + 1) % totalCatPages);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalCatPages]);

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      
      {/* ─── Hero Section with Swipe Carousel & Ken Burns Effect ─── */}
      <section className="relative w-full h-[75vh] md:h-[calc(100vh-120px)] overflow-hidden bg-black group">
        {heroImages.map((hero, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1)"
            style={{
              transform: `translateX(${(idx - currentHero) * 100}%)`,
              opacity: Math.abs(idx - currentHero) <= 1 ? 1 : 0,
              zIndex: currentHero === idx ? 10 : 0,
              pointerEvents: currentHero === idx ? "auto" : "none"
            }}
          >
            {/* Image with Ken Burns scaling animation when active */}
            <div className={`absolute inset-0 w-full h-full transition-transform duration-[6000ms] ease-out ${currentHero === idx ? "scale-105" : "scale-100"}`}>
              <Image 
                src={hero.img} 
                alt={hero.text2} 
                fill
                sizes="100vw"
                className="w-full h-full object-cover object-[center_20%] md:object-center pointer-events-none"
                priority={idx === 0}
              />
            </div>
            
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent flex flex-col justify-end md:justify-center pb-24 md:pb-0 px-8 md:px-24 pointer-events-none">
              <div className={`max-w-2xl text-left transition-all duration-[1000ms] delay-300 transform ${currentHero === idx ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                <h2 className="text-white/95 text-7xl md:text-[9rem] font-serif leading-none italic mb-2 select-none drop-shadow-lg">
                  {hero.text1}
                </h2>
                <h1 className="text-white text-[1.5rem] md:text-3xl font-light tracking-[0.25em] md:tracking-[0.4em] uppercase mb-10 md:mb-12 drop-shadow-md">
                  <span className="font-bold">{hero.text2}</span>
                </h1>
                <button className="bg-white text-black px-8 md:px-10 py-4 w-max rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-100 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 group/btn pointer-events-auto">
                  Shop COLLECTION 
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-1.5">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Previous/Next Arrows for Desktop */}
        <button onClick={(e) => { e.stopPropagation(); prevHero(); }} className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); nextHero(); }} className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Hero Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-none">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentHero(idx); }}
              className={`h-1.5 rounded-full transition-all duration-500 pointer-events-auto ${
                currentHero === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Categories Section with Swipe & Grid ─── */}
      <section className="w-full py-16 md:py-28 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1500px] px-4 md:px-12 relative flex flex-col items-center fade-up">
          <h2 className="text-center text-lg md:text-3xl font-black tracking-[0.2em] uppercase mb-10 md:mb-16 text-black heading-underline">
            SHOP BY <span className="text-zinc-400">CATEGORY</span>
          </h2>

          {/* Slider Container */}
          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-[800ms] ease-out"
              style={{ transform: `translateX(-${catPage * 100}%)` }}
            >
              {Array.from({ length: totalCatPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="w-full shrink-0 flex-none px-2 pointer-events-none">
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 justify-items-center">
                    {categories.slice(pageIdx * 6, pageIdx * 6 + 6).map((cat, idx) => (
                      <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-2 transition-transform duration-500 pointer-events-auto">
                        <PhotoCard1 imageSrc={cat.image} category={cat.title} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 mt-12 md:mt-16 items-center fade-up delay-200">
            <button 
              onClick={prevCatPage}
              className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalCatPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCatPage(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    catPage === idx ? "w-6 bg-black" : "w-1.5 bg-zinc-200 hover:bg-zinc-400"
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

      {/* ─── SHOP VIA REEL (Draggable Native Scroll) ─── */}
      <section className="w-full py-16 md:py-28 bg-black text-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1500px]">
          <div className="fade-up">
            <h2 className="text-center text-lg md:text-3xl font-black tracking-[0.3em] uppercase mb-8 md:mb-16">
              SHOP VIA <span className="text-zinc-500">REEL</span>
            </h2>
            <div className="w-10 h-0.5 bg-white/30 mx-auto mb-10 md:hidden" />
          </div>
          
          <div className="relative w-full flex overflow-hidden group cursor-pointer mt-4 md:mt-8">
            <div className="flex w-max animate-[swipeLeft_35s_linear_infinite] group-hover:[animation-play-state:paused] gap-4 md:gap-8 px-4">
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

      {/* NEW DROPS Section */}
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full flex justify-center items-center flex-col relative w-full fade-up">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-10 text-black px-6 heading-underline">
            NEW <span className="text-zinc-500">DROPS</span>
          </h2>
          
          <div className="w-full relative px-2">
            <PhotoCard2Carousel items={newDrops} />
          </div>

          <button className="mt-12 bg-black text-white px-8 py-4 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 hover:-translate-y-1 transition-all flex items-center gap-3 group shadow-xl fade-up delay-200">
            VIEW ALL DROPS 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* UNDER 999 Section */}
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center border-t border-gray-100">
        <div className="w-full max-w-[1500px] px-4 md:px-12 fade-up">
          <h2 className="text-center text-xl md:text-4xl font-black tracking-[0.2em] uppercase mb-10 text-black">
            UNDER <span className="text-zinc-400">999</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full justify-items-center">
            {under999.map((item, idx) => (
              <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-3 transition-transform duration-500" style={{ transitionDelay: `${idx * 100}ms` }}>
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
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

      {/* UNDER 499 Section */}
      <section className="w-full py-20 md:py-28 bg-zinc-50 flex flex-col items-center overflow-hidden">
        <div className="w-full flex justify-center items-center flex-col relative w-full fade-up">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-10 text-black px-6 heading-underline">
            UNDER <span className="text-zinc-500">499</span>
          </h2>
          
          <div className="w-full relative px-2">
            <PhotoCard2Carousel items={under499} />
          </div>
        </div>
      </section>

      {/* Hero Image Break 3 - Parallax */}
      <section 
        className="relative w-full h-[60vh] md:h-[80vh] bg-fixed bg-[center_top] bg-cover"
        style={{ backgroundImage: 'url("https://www.gcclothing.in/admin/uploads/banners/banner_1774730968_69c83ed82952e.png")' }}
      >
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
          <button className="bg-white/95 backdrop-blur-md text-black px-10 md:px-14 py-4 md:py-5 rounded-full font-black text-xs md:text-sm tracking-[0.3em] uppercase hover:bg-white hover:scale-105 transition-all flex items-center gap-4 pointer-events-auto shadow-2xl group">
            EXPLORE NOSTALGIA
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* TP DENIMS Section */}
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1500px] px-4 md:px-12 fade-up">
          <h2 className="text-center text-xl md:text-4xl font-black tracking-[0.2em] uppercase mb-10 text-black">
            TP <span className="text-zinc-400">DENIMS</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full justify-items-center">
            {denims.map((item, idx) => (
              <div key={idx} className="w-full lg:w-[210px] transform hover:-translate-y-3 transition-transform duration-500" style={{ transitionDelay: `${idx * 100}ms` }}>
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY Section */}
      <section className="w-full py-16 md:py-32 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1400px] px-4 md:px-12 flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
          {/* Image */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full lg:w-1/2 aspect-[4/3] md:aspect-[4/5] fade-up">
            <Image
              src="https://www.gcclothing.in/uploads/Our-Story-0gnZcn3m.webp"
              alt="Our Story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
          </div>

          {/* Content */}
          <div className="flex flex-col w-full lg:w-1/2 text-left fade-up delay-200">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-4 md:mb-6 font-serif italic">
              OUR STORY
            </h2>
            <div className="w-16 h-1.5 bg-black mb-8 md:mb-12 rounded-full" />

            <div className="flex flex-col gap-6 md:gap-8 text-zinc-600 leading-relaxed md:text-lg">
              <p className="font-medium text-black">
                Welcome to the brand that started on a cycle and is now driving men&apos;s fashion forward.
              </p>
              <p>
                It all started with humble beginnings and a few clothes—no showroom, just passion on the streets. Selling suits door-to-door, we built trust one customer at a time. From that hustle, we opened our first showroom, creating a space where men found more than style.
              </p>
              <p>
                But we didn&apos;t stop there. We moved into manufacturing, crafting every fabric, stitch, and silhouette in-house to deliver fashion with purpose. Today, we&apos;re not just a clothing brand. We&apos;re a movement from streets to showrooms to full-scale creation. Driven by belief, built with hustle, worn with pride. And we&apos;re just getting started.
              </p>
            </div>

            <button className="mt-10 md:mt-12 bg-black text-white px-10 py-4 w-max rounded-full font-black text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3 group">
              DISCOVER MORE
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
