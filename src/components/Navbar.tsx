"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full flex flex-col sticky top-0 z-40 bg-white">
        {/* Top Announcement Bar */}
        <div className="w-full bg-black text-white py-2 px-4 text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase">
            USE GC FOR EXTRA OFF.
          </p>
        </div>

        {/* Main Navbar */}
        <div className="w-full border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
          {/* Left: Hamburger Menu */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-serif text-sm font-bold tracking-tight mb-1 transition-transform group-hover:scale-110">
              GC
            </div>
            <span className="font-serif text-[10px] tracking-widest uppercase font-bold">CLOTHING</span>
          </div>

          {/* Right: Cart Icon */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
              0
            </span>
          </button>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
