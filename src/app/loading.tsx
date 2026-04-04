import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Animated TP Logo */}
        <div className="w-16 h-16 border-[3px] border-white/10 flex items-center justify-center relative overflow-hidden group rounded-md">
          {/* Fill animation */}
          <div className="absolute bottom-0 left-0 w-full bg-white animate-[fillUp_1.5s_cubic-bezier(0.65,0,0.35,1)_forwards] origin-bottom" style={{ height: '0%' }} />
          
          <span className="relative z-10 mix-blend-difference text-white font-serif text-2xl font-black tracking-tighter">
            TP
          </span>
        </div>
        
        {/* Text animation (staggered fade in) */}
        <div className="flex space-x-1 overflow-hidden">
           {"TOKYO PHASHION".split("").map((char, index) => (
              <span 
                key={index} 
                className="text-white font-serif text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase opacity-0 translate-y-4 animate-[fadeUpText_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${0.5 + index * 0.05}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes fillUp {
          0% { height: 0%; }
          50% { height: 100%; border-radius: 0; }
          100% { height: 100%; border-radius: 0; }
        }
        @keyframes fadeUpText {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
