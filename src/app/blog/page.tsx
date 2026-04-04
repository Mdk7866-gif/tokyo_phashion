import React from 'react';

export default function BlogPage() {
  return (
    <div className="min-h-[75vh] w-full bg-[#050505] flex flex-col items-center justify-center py-24 px-6 overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-[100%] blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-widest uppercase font-serif">
          OUR FASHION BLOG
        </h1>
        <div className="w-16 h-1 bg-white/20 mx-auto my-8 rounded-full" />
        <p className="text-gray-400 text-sm md:text-lg leading-relaxed tracking-wide font-medium">
          Stay ahead of the curve with the latest trends, styling tips, and insights from the world of fashion.
        </p>
      </div>

      {/* Decorative skeleton grid to hint at articles and fill space elegantly */}
      <div className="w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 opacity-[0.15] select-none pointer-events-none">
         {[1, 2, 3].map(i => (
           <div key={i} className="flex flex-col gap-5">
             <div className="w-full aspect-[4/3] bg-white rounded-xl"></div>
             <div className="w-3/4 h-6 bg-white rounded-md"></div>
             <div className="w-1/2 h-4 bg-white rounded-md"></div>
           </div>
         ))}
      </div>
    </div>
  );
}
