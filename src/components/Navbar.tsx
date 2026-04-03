"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`w-full flex flex-col sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black shadow-xl" : "bg-white"
        }`}
      >
        {/* Top Announcement Bar */}
        <div
          className={`w-full bg-black text-white px-4 text-center transition-all duration-300 overflow-hidden ${
            scrolled ? "max-h-0 py-0" : "max-h-10 py-2 border-b border-white/10"
          }`}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase">
            USE TP FOR EXTRA OFF.
          </p>
        </div>

        {/* Main Navbar */}
        <div
          className={`w-full transition-all duration-300 px-4 md:px-12 flex items-center justify-between ${
            scrolled ? "py-1.5 md:py-2" : "py-3 md:py-4"
          }`}
        >
          {/* Left: Hamburger Menu */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              scrolled
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-black text-white hover:bg-zinc-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div
              className={`flex flex-col items-center justify-center font-serif transition-colors duration-300 ${
                scrolled ? "text-white" : "text-black"
              }`}
            >
              <div className={`w-6 h-6 border-2 flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${scrolled ? 'border-white' : 'border-black'}`}>
                TP
              </div>
              <span className="text-[9px] tracking-[0.25em] font-black uppercase mt-1 transition-all duration-300">
                PHASHION
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon */}
            <button
              className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 ${
                scrolled ? "bg-zinc-900 text-white" : "bg-zinc-50 text-black border border-zinc-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </button>

            {/* Cart Icon */}
            <button
              className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
                scrolled
                  ? "bg-zinc-900 text-white"
                  : "bg-black text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className={`absolute -top-1 -right-1 text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border transition-colors duration-300 ${scrolled ? 'bg-white text-black border-transparent' : 'bg-white text-black border-black'}`}>
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
