import React from "react";
import PhotoCard1 from "@/components/PhotoCard1";
import VideoCard1 from "@/components/VideoCard1";
import PhotoCard2 from "@/components/PhotoCard2";

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

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section Container */}
      <section className="relative w-full h-[85vh] md:h-[calc(100vh-120px)] overflow-hidden">
        {/* Full Image background */}
        <div className="absolute inset-0">
          <img 
            src="https://www.gcclothing.in/admin/uploads/category_images/catimg_69ce7b4f04c243.25238678.webp" 
            alt="Tokyo Phashion Collection" 
            className="w-full h-full object-cover object-[center_20%] md:object-center"
          />
        </div>
        
        {/* Stronger Gradient and clear text content overlay */}
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

        {/* Floating Socials (Aesthetic) */}
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
          
          {/* Scrollable Row with smooth snapping */}
          <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar gap-5 md:gap-8 justify-start xl:justify-center overflow-y-hidden">
            {categories.map((cat, idx) => (
              <div key={idx} className="snap-start shrink-0 first:ml-0 last:mr-6 md:last:mr-0">
                <PhotoCard1 imageSrc={cat.image} category={cat.title} />
              </div>
            ))}
          </div>
          
          {/* Carousel Progress indicator */}
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
          
          {/* Reel Scrolling Row */}
          <div className="flex overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar gap-6 md:gap-10 justify-start xl:justify-center snap-x snap-mandatory pb-10">
            {reels.map((reel, idx) => (
              <div key={idx} className="snap-start">
                <VideoCard1 videoSrc={reel.src} title={reel.title} />
              </div>
            ))}
          </div>

          {/* Aesthetic divider / line */}
          <div className="w-24 h-[1px] bg-white/20 mx-auto mt-4"></div>
        </div>
      </section>

      {/* Break - Full Screen Image */}
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

      {/* NEW DROPS Section */}
      <section className="w-full py-20 md:py-32 bg-white flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1600px] flex flex-col items-center">
          <h2 className="text-center text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-12 md:mb-16 text-black px-6">
            NEW <span className="text-zinc-500">DROPS</span>
          </h2>
          
          {/* Marquee Wrapper */}
          <div className="w-full overflow-hidden relative">
            {/* The animated moving row */}
            <div className="flex w-max animate-swipe gap-4 md:gap-6 px-4 hover:pause-animation">
              {/* Duplicate array to create continuous infinite loop illusion */}
              {[...newDrops, ...newDrops, ...newDrops].map((drop, idx) => (
                <PhotoCard2 
                  key={idx}
                  title={drop.title}
                  imageSrc={drop.image}
                  originalPrice={drop.originalPrice}
                  currentPrice={drop.currentPrice}
                  discount={drop.discount}
                />
              ))}
            </div>
            
            {/* Seamless Edges for Marquee effect */}
            <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>

          <button className="mt-12 md:mt-16 bg-black text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2 group shadow-xl">
            MORE 31 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
