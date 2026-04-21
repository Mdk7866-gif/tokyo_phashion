"use client";
import React, { useEffect, useState } from 'react';

export default function Loading() {
  const [stage, setStage] = useState<'showing' | 'fading' | 'hidden'>('hidden');

  useEffect(() => {
    // Check if user has already seen the splash screen
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (hasVisited) {
      setStage('hidden');
      return;
    }

    // If first visit, show the splash screen and mark as visited
    setStage('showing');
    localStorage.setItem('hasVisited', 'true');

    const fadeTimer = setTimeout(() => setStage('fading'), 1800); // Start fade out at 1.8s
    const hideTimer = setTimeout(() => setStage('hidden'), 2400); // Fully hide at 2.4s
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); }
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 ease-in-out"
      style={{ opacity: stage === 'fading' ? 0 : 1 }}
    >
      <div className="flex flex-col items-center justify-center gap-10 max-w-sm w-full px-6 text-center">
        
        {/* Animated TP Logo */}
        <div className="relative group" style={{ animation: 'logoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-white flex items-center justify-center relative rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-transparent opacity-50" />
            <span className="relative z-10 text-white font-serif text-3xl md:text-4xl font-black tracking-tighter">
              TP
            </span>
          </div>
          {/* Outer Ring */}
          <div className="absolute -inset-4 border border-white/20 rounded-full animate-[spin_4s_linear_infinite]" />
        </div>
        
        {/* Company Name */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent" style={{ animation: 'lineReveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
          
          <div className="flex overflow-hidden py-2 px-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white">
            {"TOKYO PHASHION".split("").map((char, index) => (
              <span 
                key={index} 
                className="font-serif text-[11px] md:text-sm tracking-[0.4em] font-black uppercase inline-block"
                style={{ 
                  animation: 'letterReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  animationDelay: `${0.4 + index * 0.05}s`,
                  opacity: 0,
                  transform: 'translateY(100%)'
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent" style={{ animation: 'lineReveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '1s', opacity: 0 }} />
        </div>
      </div>
      
      {/* Decorative background flair */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-zinc-900/30 to-transparent pointer-events-none" />

      {/* Inline styles guarantee animations play immediately without globals.css sync issues */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes letterReveal {
          0% { transform: translateY(100%); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes logoReveal {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes lineReveal {
          0% { width: 0%; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
      `}} />
    </div>
  );
}
