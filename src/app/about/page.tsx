import React from 'react';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="w-full bg-[#111] text-white py-24 md:py-36 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle diagonal stripes background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 2px, transparent 2px, transparent 12px)" }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase mb-4 font-serif">ABOUT TOKYO PHASHION</h1>
          <p className="text-sm md:text-lg font-medium text-gray-300">Fashion that defines confidence and style</p>
        </div>
      </section>

      {/* 2. Text Section */}
      <section className="w-full max-w-4xl mx-auto py-12 md:py-24 px-6 text-center md:text-center text-zinc-600 space-y-6 md:space-y-8 text-sm md:text-base leading-relaxed">
        <p>
          Welcome to <span className="font-black text-black">Tokyo Phashion</span> – your trusted online clothing brand where fashion meets comfort, quality, and style. We believe that clothes are more than just outfits – they are an expression of personality, confidence, and individuality.
        </p>
        <p>
          At Tokyo Phashion, we design and deliver premium-quality clothing for men and women, including casual wear, streetwear, trendy outfits, and everyday essentials. Every piece is crafted from high-quality fabrics with a perfect balance of comfort and modern style, ensuring you look good and feel great all day.
        </p>
        <p>
          Whether you&apos;re searching for stylish t-shirts, classic shirts, trendy dresses, chic tops, or everyday essentials, Tokyo Phashion brings you affordable fashion without compromising on quality.
        </p>
        <p>
          Our mission is simple – to make fashion accessible, stylish, and reliable for everyone. With Tokyo Phashion, you don&apos;t just wear clothes; <span className="font-black text-black">you wear confidence</span>.
        </p>
      </section>

      {/* 3. Stats Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-16 md:pb-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: "10K+", label: "HAPPY CUSTOMERS" },
            { value: "500+", label: "PRODUCTS" },
            { value: "50+", label: "CITIES" },
            { value: "99%", label: "SATISFACTION" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#18181b] text-white rounded-[1.5rem] py-10 md:py-14 px-4 flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-2">
              <h3 className="text-3xl md:text-5xl font-black mb-3 text-white">{stat.value}</h3>
              <p className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-gray-400 text-center">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What Makes Us Different */}
      <section className="w-full py-16 md:py-28 flex flex-col items-center relative gap-8">
        <div className="w-full max-w-6xl px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-gray-500 bg-white px-5 py-2 rounded-full border border-gray-200 shadow-sm inline-block mb-6">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black">What Makes Us Different</h2>
            <div className="w-16 h-1.5 bg-black mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>,
                title: "Premium Quality Clothing",
                desc: "Handpicked fabrics, crafted by skilled artisans with attention to every detail."
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
                title: "Affordable & Trendy",
                desc: "High fashion meets low pricing – no compromise on style or quality."
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>,
                title: "Fast Shipping & Easy Returns",
                desc: "We deliver happiness quickly and take it back if you&apos;re not 100% satisfied."
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
                title: "Made with Love in India",
                desc: "Locally designed with a global fashion outlook and sustainable practices."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-5">
                <div className="w-14 h-14 shrink-0 bg-black text-white rounded-[1rem] flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Mission & Vision */}
      <section className="w-full py-16 md:py-28 bg-white flex flex-col items-center">
         <div className="w-full max-w-6xl px-6">
           <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black">Mission & Vision</h2>
            <div className="w-16 h-1.5 bg-black mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
             <div className="bg-[#f4f4f5] p-10 md:p-14 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden group">
                <div className="text-5xl mb-8 transform transition-transform group-hover:scale-110">🎯</div>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-5">Our Mission</h3>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                  To make fashion simple, stylish, and sustainable — for every individual regardless of size, gender, or background. We&apos;re committed to delivering quality that doesn&apos;t cost the earth.
                </p>
             </div>
             <div className="bg-[#f4f4f5] p-10 md:p-14 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden group">
                <div className="text-5xl mb-8 transform transition-transform group-hover:scale-110">🌟</div>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-5">Our Vision</h3>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                  To become India&apos;s most trusted fashion brand known for innovation, quality, and community support. We envision a future where everyone has access to confidence through fashion.
                </p>
             </div>
          </div>
         </div>
      </section>

      {/* 6. Join Our Fashion Revolution */}
      <section className="w-full px-4 md:px-6 pb-24 md:pb-36 flex justify-center">
        <div className="w-full max-w-6xl bg-[#0a0a0a] text-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-24 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
           
           <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-6 relative z-10">Join Our Fashion Revolution</h2>
           <p className="text-sm md:text-xl text-gray-400 mb-10 max-w-2xl relative z-10 font-medium leading-relaxed">
             Experience the perfect blend of style, comfort, and quality. Start your fashion journey with Tokyo Phashion today.
           </p>
           <button className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3 relative z-10 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-y-0.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              SHOP NOW
           </button>
        </div>
      </section>

    </div>
  );
}
