import React from "react";
import PhotoCard1 from "@/components/PhotoCard1";
import VideoCard1 from "@/components/VideoCard1";
import PhotoCard2Carousel from "@/components/PhotoCard2";

export default function Home() {
  const categories = [
    { title: "Full Pair", image: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800&auto=format&fit=crop" },
    { title: "Trends", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop" },
    { title: "Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
    { title: "Ethnic", image: "https://images.unsplash.com/photo-1629813210214-d023b7160759?q=80&w=800&auto=format&fit=crop" },
    { title: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" },
    { title: "Co-Ords", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop" },
  ];

  const reels = [
    { title: "MAFIA", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop" },
    { title: "OLD MONEY", src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop" },
    { title: "RETRO SHIRTS", src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop" },
    { title: "EID FIT", src: "https://images.unsplash.com/photo-1629813210214-d023b7160759?q=80&w=800&auto=format&fit=crop" },
    { title: "RETRO PAIR", src: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800&auto=format&fit=crop" },
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
    { title: "Golden Inferno Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1629813210214-d023b7160759?q=80&w=800&auto=format&fit=crop", price: "₹999" },
    { title: "Midnight Petals Neo Lachka Retro Pair", image: "https://images.unsplash.com/photo-1596755094514-f87e32f6b717?q=80&w=800&auto=format&fit=crop", price: "₹999" },
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
    { title: "Midnight Black Jeans", image: "https://images.unsplash.com/photo-1583391733958-b6ffb3c58908?q=80&w=800&auto=format&fit=crop", price: "₹1,199" },
    { title: "Distressed Retro Denim", image: "https://images.unsplash.com/photo-1596755094514-f87e32f6b717?q=80&w=800&auto=format&fit=crop", price: "₹1,499" },
    { title: "Vintage Washed Jeans", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop", price: "₹1,299" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section Container */}
      <section className="relative w-full h-[85vh] md:h-[calc(100vh-120px)] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://www.gcclothing.in/admin/uploads/category_images/catimg_69ce7b4f04c243.25238678.webp" 
            alt="Tokyo Phashion Collection" 
            className="w-full h-full object-cover object-[center_20%] md:object-center"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent z-10 flex flex-col justify-end md:justify-center pb-24 md:pb-0 px-8 md:px-24">
          <div className="max-w-2xl text-left">
            <h2 className="text-white/95 text-7xl md:text-[9rem] font-serif leading-none italic mb-2 select-none">
              Summer
            </h2>
            <h1 className="text-white text-[1.5rem] md:text-3xl font-light tracking-[0.25em] md:tracking-[0.4em] uppercase mb-10 md:mb-12">
              Essential <span className="font-bold">Linens</span>
            </h1>
            <button className="bg-white text-black px-8 md:px-10 py-4 w-max rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-100 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 group">
              Shop COLLECTION 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute right-8 bottom-12 hidden md:flex flex-col gap-6 items-center z-20">
          <div className="w-px h-12 bg-white/30"></div>
          <span className="text-white/60 text-[10px] tracking-[0.5em] uppercase [writing-mode:vertical-lr] mb-2">Follow Us</span>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-20 md:py-32 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <h2 className="text-left md:text-center text-xl md:text-3xl font-bold tracking-[0.2em] uppercase mb-12 md:mb-16 text-black border-l-4 md:border-l-0 border-black pl-4 md:pl-0">
            Shop By <span className="text-zinc-400">Category</span>
          </h2>
          
          <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar gap-5 md:gap-8 justify-start xl:justify-center overflow-y-hidden">
            {categories.map((cat, idx) => (
              <div key={idx} className="snap-start shrink-0 first:ml-0 last:mr-6 md:last:mr-0">
                <PhotoCard1 imageSrc={cat.image} category={cat.title} />
              </div>
            ))}
          </div>
          
          <div className="flex justify-start md:justify-center gap-3 mt-4 items-center">
            <div className="w-12 h-1 bg-black rounded-full transition-all"></div>
            <div className="w-2 h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-2 h-1 bg-zinc-200 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* SHOP VIA REEL Section */}
      <section className="w-full py-20 md:py-32 bg-black text-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <h2 className="text-center text-xl md:text-3xl font-black tracking-[0.3em] uppercase mb-16 md:mb-24">
            SHOP VIA <span className="text-zinc-500">REEL</span>
          </h2>
          
          <div className="flex overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar gap-6 md:gap-10 justify-start xl:justify-center snap-x snap-mandatory pb-10">
            {reels.map((reel, idx) => (
              <div key={idx} className="snap-start">
                <VideoCard1 videoSrc={reel.src} title={reel.title} />
              </div>
            ))}
          </div>

          <div className="w-24 h-[1px] bg-white/20 mx-auto mt-4"></div>
        </div>
      </section>

      {/* Hero Image Break 1 */}
      <section className="relative w-full h-[75vh] md:h-screen">
        <img 
          src="https://www.gcclothing.in/admin/uploads/variants/var_69c7c0df4b3645.17546873.webp" 
          alt="Style Divider"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
          <button className="bg-black text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 pointer-events-auto shadow-xl">
            VIEW CAMPAIGN 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* NEW DROPS Section (CoverflowCarousel) */}
      <section className="w-full py-20 md:py-28 bg-white flex flex-col items-center overflow-hidden">
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
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center border-t border-gray-100">
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-12 md:mb-16 text-black">
            UNDER <span className="text-zinc-500">999</span>
          </h2>
          
          <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar gap-5 md:gap-8 justify-start xl:justify-center overflow-y-hidden">
            {under999.map((item, idx) => (
              <div key={idx} className="snap-start shrink-0 first:ml-0 last:mr-6 md:last:mr-0">
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 group shadow-xl">
              MORE 40 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Image Break 2 */}
      <section className="relative w-full h-[75vh] md:h-screen">
        <img 
          src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1920&auto=format&fit=crop" 
          alt="Style Divider 2"
          className="w-full h-full object-cover"
        />
        {/* Simple black overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
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

      {/* Hero Image Break 3 */}
      <section className="relative w-full h-[75vh] md:h-screen">
        <img 
          src="https://www.gcclothing.in/admin/uploads/banners/banner_1774730968_69c83ed82952e.png" 
          alt="Style Divider 3"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
          <button className="bg-white text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors flex items-center gap-2 pointer-events-auto shadow-xl">
            EXPLORE 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* TP DENIMS Section */}
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-12 md:mb-16 text-black">
            TP <span className="text-zinc-500">DENIMS</span>
          </h2>
          
          <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar gap-5 md:gap-8 justify-start xl:justify-center overflow-y-hidden">
            {denims.map((item, idx) => (
              <div key={idx} className="snap-start shrink-0 first:ml-0 last:mr-6 md:last:mr-0">
                <PhotoCard1 imageSrc={item.image} category={item.title} price={item.price} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY Section */}
      <section className="w-full py-20 md:py-32 bg-white flex flex-col items-center">
        <div className="w-full max-w-[1400px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Image Container */}
          <div className="relative group overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
              alt="Our Story" 
              className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Right: Content Container */}
          <div className="flex flex-col text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-6 font-serif">
              OUR STORY
            </h2>
            <div className="w-16 h-1 bg-black mb-10" />
            
            <div className="flex flex-col gap-8 text-zinc-600 leading-relaxed max-w-xl">
              <p className="text-sm md:text-base font-medium">
                Welcome to the brand that started on a cycle and is now driving men's fashion forward. It all started with humble beginnings and a few clothes—no showroom, just passion on the streets. Selling suits door-to-door, we built trust one customer at a time.
              </p>
              
              <p className="text-sm md:text-base font-medium">
                From that hustle, we opened our first showroom, creating a space where men found more than style. But we didn't stop there. We moved into manufacturing, crafting every fabric, stitch, and silhouette in-house to deliver fashion with purpose.
              </p>
              
              <p className="text-sm md:text-base font-medium">
                Today, we're not just a clothing brand. We're a movement from streets to showrooms to full-scale creation. Driven by belief, built with hustle, worn with pride. And we're just getting started.
              </p>
            </div>

            <button className="mt-12 bg-black text-white px-10 py-4 w-max rounded-sm font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1">
              EXPLORE PRODUCTS
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
