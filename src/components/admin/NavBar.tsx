"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideBar from "./SideBar";

const NavBar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── icon button base styles ── */
  const iconBtn = (dark: boolean) => ({
    backgroundColor: dark
      ? scrolled ? "rgba(255,255,255,0.12)" : "#0a0a0a"
      : scrolled ? "rgba(255,255,255,0.12)" : "#f4f4f5",
    color: dark ? "#fff" : scrolled ? "#fff" : "#0a0a0a",
  });

  return (
    <>
      {/* ── Header ── */}
      <header
        style={{
          backgroundColor: scrolled ? "rgb(10,10,10)" : "#ffffff",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
        }}
        className="w-full sticky top-0 z-50 transition-[background-color,box-shadow] duration-300"
      >
        <div
          className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-12 transition-[padding] duration-300"
          style={{ paddingTop: scrolled ? "6px" : "10px", paddingBottom: scrolled ? "4px" : "8px" }}
        >
          {/* ── Hamburger ── */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={iconBtn(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="7"  y2="7"  />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="17" y2="17" />
            </svg>
          </button>

          {/* ── Logo ── */}
          <Link href="/admin" className="flex flex-col items-center cursor-pointer group select-none transition-all duration-300 active:scale-95">
            <div className="relative flex items-center justify-center">
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-none tracking-tighter">
                東京
              </span>
              <div 
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500 group-hover:w-full opacity-80"
              />
            </div>
            <span 
              style={{ color: scrolled ? "#fff" : "#0a0a0a" }}
              className="text-[7px] md:text-[9px] font-black tracking-[0.4em] uppercase mt-2 transition-colors duration-300"
            >
              TOKYO PHASHION
            </span>
          </Link>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await fetch('/api/admin/auth', { method: 'DELETE' });
                router.push('/');
              }}
              className="flex items-center gap-2 text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Exit
            </button>
          </div>
        </div>
      </header>

      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default NavBar;
