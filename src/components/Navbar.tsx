"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Run once on mount to catch initial position
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="w-full bg-black text-white text-center overflow-hidden transition-[max-height,padding] duration-500 ease-in-out"
        style={{ maxHeight: scrolled ? "0px" : "40px", padding: scrolled ? "0" : "8px 16px" }}
      >
        <p className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
          USE TP FOR EXTRA OFF.
        </p>
      </div>

      {/* ── Header ── */}
      <header
        style={{
          backgroundColor: scrolled ? "rgb(10,10,10)" : "#ffffff",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
        }}
        className="w-full sticky top-0 z-50 transition-[background-color,box-shadow] duration-300"
      >
        <div
          className="w-full flex items-center justify-between px-4 md:px-12 transition-[padding] duration-300"
          style={{ paddingTop: scrolled ? "6px" : "10px", paddingBottom: scrolled ? "4px" : "8px" }}
        >
          {/* ── Hamburger ── */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              backgroundColor: scrolled ? "rgba(255,255,255,0.12)" : "#0a0a0a",
              color: "#fff",
            }}
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
          <Link href="/" className="flex flex-col items-center cursor-pointer group select-none">
            <div
              style={{
                borderColor: scrolled ? "#fff" : "#0a0a0a",
                color: scrolled ? "#fff" : "#0a0a0a",
              }}
              className="w-7 h-7 border-2 flex items-center justify-center font-serif text-[11px] font-bold transition-all duration-300 group-hover:scale-105"
            >
              TP
            </div>
            <span
              style={{ color: scrolled ? "#fff" : "#0a0a0a" }}
              className="text-[8px] tracking-[0.28em] font-black uppercase mt-[3px] transition-colors duration-300"
            >
              PHASHION
            </span>
          </Link>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search – desktop only */}
            <button
              style={{
                backgroundColor: scrolled ? "rgba(255,255,255,0.12)" : "#f4f4f5",
                color: scrolled ? "#fff" : "#0a0a0a",
              }}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 hover:opacity-80"
              aria-label="Search"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </button>

            {/* Cart */}
            <button
              style={{
                backgroundColor: scrolled ? "rgba(255,255,255,0.12)" : "#0a0a0a",
                color: "#fff",
              }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
              aria-label="Cart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span
                style={{
                  backgroundColor: scrolled ? "#fff" : "#fff",
                  color: "#0a0a0a",
                  borderColor: scrolled ? "transparent" : "#0a0a0a",
                }}
                className="absolute -top-1 -right-1 text-[8px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border transition-all duration-300"
              >
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
