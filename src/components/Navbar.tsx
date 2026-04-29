"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, loading } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click


  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Fetch both cart and wishlist counts from portfolio
          const res = await fetch("/api/user/portfolio");
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setCartCount(data.user.cartitems?.length || 0);
              setWishlistCount(data.user.wishlistitems?.length || 0);
            }
          }
        } catch (error) {
          console.error("Failed to fetch counts:", error);
        }
      };
      fetchData();
      
      const handleUpdate = () => fetchData();
      window.addEventListener('cart-updated', handleUpdate);
      window.addEventListener('wishlist-updated', handleUpdate);
      return () => {
        window.removeEventListener('cart-updated', handleUpdate);
        window.removeEventListener('wishlist-updated', handleUpdate);
      };
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [user]);

  const handleCartClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/account?tab=cart");
    }
  };

  /* ── icon button base styles ── */
  const iconBtn = (dark: boolean) => ({
    backgroundColor: dark ? "#0a0a0a" : "#f4f4f5",
    color: dark ? "#fff" : "#0a0a0a",
  });

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="w-full bg-black text-white text-center overflow-hidden transition-[max-height,padding] duration-500 ease-in-out"
        style={{ maxHeight: scrolled ? "0px" : "40px", padding: scrolled ? "0" : "8px 16px" }}
      >
        <p className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
          USE TF FOR EXTRA OFF.
        </p>
      </div>

      {/* ── Header ── */}
      <header
        style={{
          backgroundColor: "#ffffff",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
        }}
        className="w-full sticky top-0 z-50 transition-shadow duration-300 border-b border-zinc-100"
      >
        <div
          className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-12 py-2 md:py-3 transition-[padding] duration-300"
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
          <Link href="/" className="flex flex-col items-center cursor-pointer group select-none transition-all duration-300 active:scale-95">
            <Logo 
              width={75} 
              color="#0a0a0a" 
              className="transition-all duration-300"
            />
          </Link>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search – desktop only */}
            <button
              style={iconBtn(false)}
              className="flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 hover:opacity-80"
              aria-label="Search"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (!user) router.push("/login");
                else router.push("/account?tab=wishlist");
              }}
              style={iconBtn(false)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
              aria-label="Wishlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[8px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full transition-all duration-300 bg-rose-600 text-white"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              style={iconBtn(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[8px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full transition-all duration-300 bg-rose-600 text-white"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <style>{`
        .navbar-login-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .navbar-login-btn:hover { 
          opacity: 0.9; 
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

      `}</style>
    </>
  );
};

export default Navbar;
