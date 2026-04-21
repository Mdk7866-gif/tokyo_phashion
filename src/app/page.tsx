"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import PhotoCard1 from "@/components/PhotoCard1";
import VideoCard1 from "@/components/VideoCard1";
import PhotoCard2Carousel from "@/components/PhotoCard2";

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);

  const heroImages = [
    { img: "https://www.gcclothing.in/admin/uploads/category_images/catimg_69ce7b4f04c243.25238678.webp", text1: "Summer", text2: "Essential Linens" },
    { img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1920&auto=format&fit=crop", text1: "Autumn", text2: "Warm Textures" },
    { img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1920&auto=format&fit=crop", text1: "Winter", text2: "Premium Wool" },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentHero(p => (p + 1) % heroImages.length), 4500);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const categories = [
    { title: "Full Pair", image: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800" },
    { title: "Trends", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800" },
    { title: "Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800" },
    { title: "Ethnic", image: "https://www.gcclothing.in/admin/uploads/variants/var_69b02fc61044e7.64888252.webp" },
    { title: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800" },
    { title: "Co-Ords", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800" },
    { title: "Jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800" },
    { title: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800" },
    { title: "Blazers", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800" },
    { title: "Trousers", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800" },
    { title: "Sneakers", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800" },
    { title: "Accessories", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800" },
  ];

  const reels = [
    { title: "MAFIA", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800" },
    { title: "OLD MONEY", src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800" },
    { title: "RETRO SHIRTS", src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800" },
    { title: "EID FIT", src: "https://www.gcclothing.in/admin/uploads/variants/var_69b02fc61044e7.64888252.webp" },
    { title: "RETRO PAIR", src: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800" },
    { title: "LINEN BREEZE", src: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800" },
    { title: "STREET CULTURE", src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800" },
    { title: "WINTER ESSENTIALS", src: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800" },
  ];

  const newDrops = [
    { title: "Black Beast TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Mafia White TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Oxford Blue TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Plum Purple TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
    { title: "Warm Tan TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800", originalPrice: "₹3,999", currentPrice: "₹1,999", discount: "50% OFF" },
  ];

  const under999 = [
    { title: "Mocha Brownie Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800", price: "₹999" },
    { title: "Golden Inferno Neo Lachka Retro Pair", image: "https://www.gcclothing.in/admin/uploads/variants/var_69777039c75f57.41517251.webp", price: "₹999" },
    { title: "Midnight Petals Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800", price: "₹999" },
    { title: "Champagne Flora Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800", price: "₹999" },
  ];

  const under499 = [
    { title: "Plum Purple TP Double-breasted Blazer", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Sufi Cream Zari Embroidered", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Black Resham Embroidered Kurta", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Dessert Tan Koti Kurta-Pyjama", image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
    { title: "Black Bad-shash Zari Kurta", image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800", originalPrice: "₹1,499", currentPrice: "₹499", discount: "60% OFF" },
  ];

  const denims = [
    { title: "Classic Blue Denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800", price: "₹1,299" },
    { title: "Midnight Black Jeans", image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800", price: "₹1,199" },
    { title: "Distressed Retro Denim", image: "https://www.gcclothing.in/admin/uploads/variants/var_69c7c50ade02b1.34397559.png", price: "₹1,499" },
    { title: "Vintage Washed Jeans", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800", price: "₹1,299" },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-up, .heading-underline").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );

  return (
    <div className="flex flex-col w-full min-h-screen items-center overflow-x-hidden bg-white">
      <main className="w-full flex flex-col items-center">

      {/* ─── HERO ─── */}
      <section style={{ position: "relative", width: "100%", height: "80vh", overflow: "hidden", background: "#000" }} className="md:h-[calc(100vh-100px)] group">
        {heroImages.map((hero, idx) => (
          <div key={idx} style={{ position: "absolute", inset: 0, transform: `translateX(${(idx - currentHero) * 100}%)`, transition: "transform 1.2s cubic-bezier(0.4,0,0.2,1)", zIndex: currentHero === idx ? 10 : 0 }}>
            <div style={{ position: "absolute", inset: 0, transition: "transform 6s ease-out", transform: currentHero === idx ? "scale(1.05)" : "scale(1)" }}>
              <Image src={hero.img} alt={hero.text2} fill sizes="100vw" className="object-cover object-[center_20%] md:object-center" priority={idx === 0} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent flex flex-col justify-end md:justify-center pb-20 md:pb-0 px-6 md:px-24">
              <div style={{ transition: "all 1s ease 0.3s", transform: currentHero === idx ? "translateY(0)" : "translateY(40px)", opacity: currentHero === idx ? 1 : 0 }}>
                <h2 className="text-white/90 text-6xl md:text-[8rem] font-serif leading-none italic mb-2 select-none drop-shadow-lg">{hero.text1}</h2>
                <h1 className="text-white text-xl md:text-3xl font-light tracking-[0.3em] uppercase mb-8 drop-shadow-md"><span className="font-bold">{hero.text2}</span></h1>
                <button className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl flex items-center gap-3 group">
                  Shop Collection <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {heroImages.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentHero(idx)} style={{ height: 6, borderRadius: 999, background: currentHero === idx ? "#fff" : "rgba(255,255,255,0.35)", width: currentHero === idx ? 28 : 8, transition: "all 0.4s ease", border: "none", cursor: "pointer" }} />
          ))}
        </div>
        {/* Arrows */}
        <button onClick={() => setCurrentHero(p => (p - 1 + heroImages.length) % heroImages.length)} className="hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button onClick={() => setCurrentHero(p => (p + 1) % heroImages.length)} className="hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="w-full py-14 md:py-24 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-12 fade-up">
          <h2 className="sec-heading heading-underline">SHOP BY <span className="text-zinc-400">CATEGORY</span></h2>
          <div className="cat-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="w-full">
                <PhotoCard1 imageSrc={cat.image} category={cat.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP VIA REEL ─── */}
      <section className="w-full py-14 md:py-24 bg-black text-white flex flex-col items-center overflow-hidden">
        <div className="w-full">
          <h2 className="sec-heading fade-up px-4 md:px-12 mb-10" style={{ color: "#fff", textAlign: "left", width: "100%", maxWidth: "1440px", margin: "0 auto" }}>SHOP VIA <span style={{ color: "#555" }}>REEL</span></h2>
          <div style={{ position: "relative", width: "100%", overflow: "hidden", cursor: "pointer" }}>
            <div className="reel-belt">
              {[...reels, ...reels, ...reels].map((reel, idx) => (
                <VideoCard1 key={idx} videoSrc={reel.src} title={reel.title} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARALLAX BREAK 1 ─── */}
      <section className="parallax-section h-[50vh] md:h-[70vh]" style={{ backgroundImage: 'url("https://www.gcclothing.in/admin/uploads/variants/var_69c7c0df4b3645.17546873.webp")' }}>
        <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center gap-5">
          <p className="text-white text-sm md:text-lg font-light tracking-[0.5em] uppercase drop-shadow-lg">Elegance Defined</p>
          <button className="bg-white/90 backdrop-blur-sm text-black px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center gap-3 group">
            VIEW CAMPAIGN <ArrowRight />
          </button>
        </div>
      </section>

      {/* ─── NEW DROPS ─── */}
      <section className="w-full py-14 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1440px] flex flex-col items-center">
          <h2 className="sec-heading heading-underline fade-up">NEW <span className="text-zinc-400">DROPS</span></h2>
          <div className="w-full">
            <PhotoCard2Carousel items={newDrops} />
          </div>
          <button className="mt-10 bg-black text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 hover:-translate-y-1 transition-all shadow-xl flex items-center gap-3 group fade-up">
            VIEW ALL DROPS <ArrowRight />
          </button>
        </div>
      </section>

      {/* ─── UNDER 999 ─── */}
      <section className="w-full py-14 md:py-24 bg-zinc-50 flex flex-col items-center border-t border-zinc-100">
        <div className="w-full max-w-[1440px] px-4 md:px-12 fade-up">
          <h2 className="sec-heading">UNDER <span className="text-zinc-400">₹999</span></h2>
          <div className="prod-grid">
            {under999.map((item, idx) => (
              <PhotoCard1 key={idx} imageSrc={item.image} category={item.title} price={item.price} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARALLAX BREAK 2 ─── */}
      <section className="parallax-section h-[40vh] md:h-[55vh]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1920&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent" />
      </section>

      {/* ─── UNDER 499 ─── */}
      <section className="w-full py-14 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1440px] flex flex-col items-center">
          <h2 className="sec-heading heading-underline fade-up">UNDER <span className="text-zinc-500">₹499</span></h2>
          <div className="w-full">
            <PhotoCard2Carousel items={under499} />
          </div>
        </div>
      </section>

      {/* ─── PARALLAX BREAK 3 ─── */}
      <section className="parallax-section h-[50vh] md:h-[70vh]" style={{ backgroundImage: 'url("https://www.gcclothing.in/admin/uploads/banners/banner_1774730968_69c83ed82952e.png")' }}>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <button className="bg-white/95 backdrop-blur-md text-black px-10 py-4 rounded-full font-black text-xs tracking-[0.3em] uppercase hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center gap-4 group">
            EXPLORE NOSTALGIA <ArrowRight />
          </button>
        </div>
      </section>

      {/* ─── TP DENIMS ─── */}
      <section className="w-full py-14 md:py-24 bg-zinc-50 flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-12 fade-up">
          <h2 className="sec-heading">TP <span className="text-zinc-400">DENIMS</span></h2>
          <div className="prod-grid">
            {denims.map((item, idx) => (
              <PhotoCard1 key={idx} imageSrc={item.image} category={item.title} price={item.price} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="w-full py-16 md:py-32 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-12 flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
          <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl w-full lg:w-1/2 aspect-[4/3] md:aspect-[4/5] fade-up">
            <Image src="https://www.gcclothing.in/uploads/Our-Story-0gnZcn3m.webp" alt="Our Story" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="flex flex-col w-full lg:w-1/2 fade-up">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-4 font-serif italic">OUR STORY</h2>
            <div className="w-16 h-1.5 bg-black mb-8 rounded-full" />
            <div className="flex flex-col gap-5 text-zinc-600 leading-relaxed md:text-lg">
              <p className="font-medium text-black">Welcome to the brand that started on a cycle and is now driving men&apos;s fashion forward.</p>
              <p>It all started with humble beginnings and a few clothes — no showroom, just passion on the streets. Selling suits door-to-door, we built trust one customer at a time.</p>
              <p>We moved into manufacturing, crafting every fabric, stitch, and silhouette in-house. Today we&apos;re not just a clothing brand — we&apos;re a movement. Driven by belief, built with hustle, worn with pride.</p>
            </div>
            <button className="mt-10 bg-black text-white px-10 py-4 w-max rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3 group">
              DISCOVER MORE <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      </main>
    </div>
  );
}
