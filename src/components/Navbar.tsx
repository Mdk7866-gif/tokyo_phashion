"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, loading, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#navbar-user-menu-root")) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  async function handleLogout() {
    setShowUserMenu(false);
    await logout();
    router.push("/");
  }

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const res = await fetch("/api/user/getcartitems");
          if (res.ok) {
            const data = await res.json();
            setCartCount(data.cartitems?.length || 0);
          }
        } catch (error) {
          console.error("Failed to fetch cart count:", error);
        }
      };
      fetchCartItems();
      
      // Also refresh on a custom event if we add items elsewhere
      const handleCartRefresh = () => fetchCartItems();
      window.addEventListener('cart-updated', handleCartRefresh);
      return () => window.removeEventListener('cart-updated', handleCartRefresh);
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleCartClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/cart");
    }
  };

  /* ── icon button base styles ── */
  const iconBtn = (dark: boolean) => ({
    backgroundColor: dark
      ? scrolled ? "rgba(255,255,255,0.12)" : "#0a0a0a"
      : scrolled ? "rgba(255,255,255,0.12)" : "#f4f4f5",
    color: dark ? "#fff" : scrolled ? "#fff" : "#0a0a0a",
  });

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
          <Link href="/" className="flex flex-col items-center cursor-pointer group select-none transition-all duration-300 active:scale-95">
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

            {/* Cart */}
            {!loading && (
              <button
                onClick={handleCartClick}
                style={iconBtn(true)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
                aria-label="Cart"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <line x1="3" x2="21" y1="6" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[8px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border transition-all duration-300"
                    style={{ backgroundColor: "#fff", color: "#0a0a0a", borderColor: scrolled ? "transparent" : "#0a0a0a" }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* ── Auth Button ── */}
            {!loading && (
              <>
                {!user ? (
                  /* Login button */
                  <Link
                    id="navbar-login-btn"
                    href="/login"
                    className="navbar-login-btn"
                    style={{
                      backgroundColor: "#000",
                      color: "#fff",
                      border: scrolled ? "1px solid rgba(255,255,255,0.3)" : "none",
                    }}
                  >
                    Login
                  </Link>
                ) : (
                  /* User avatar / menu */
                  <div id="navbar-user-menu-root" style={{ position: "relative" }}>
                    <button
                      id="navbar-user-avatar"
                      onClick={() => setShowUserMenu((v) => !v)}
                      className="navbar-avatar-btn"
                      title={user.mobile_no}
                      aria-label="Account menu"
                    >
                      {/* Avatar letter from last 2 digits of mobile_no */}
                      <span>{user.mobile_no.slice(-2)}</span>
                    </button>

                    {/* Dropdown */}
                    {showUserMenu && (
                      <div className="navbar-user-dropdown">
                        <div className="navbar-user-phone">
                          <span>📱</span>
                          <span>{user.mobile_no}</span>
                        </div>
                        <hr className="navbar-user-divider" />
                        <Link href="/account" onClick={() => setShowUserMenu(false)} className="navbar-user-item">
                          My Account
                        </Link>
                        <Link href="/orders" onClick={() => setShowUserMenu(false)} className="navbar-user-item">
                          My Orders
                        </Link>
                        <button id="navbar-logout-btn" onClick={handleLogout} className="navbar-user-item logout">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
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

        .navbar-avatar-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #000;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }
        .navbar-avatar-btn:hover {
          transform: scale(1.08);
          background: #333;
        }
        /* When scrolled, make avatar white for visibility on black navbar */
        header[style*="rgb(10, 10, 10)"] .navbar-avatar-btn {
          background: #fff;
          color: #000;
        }

        .navbar-user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 200px;
          background: rgba(15,15,20,0.97);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 0.6rem 0;
          box-shadow: 0 20px 48px rgba(0,0,0,0.6);
          animation: dropIn 0.18s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 100;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .navbar-user-phone {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem 0.4rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
        }

        .navbar-user-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 0.3rem 0;
        }

        .navbar-user-item {
          display: block;
          width: 100%;
          padding: 0.55rem 1rem;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, color 0.15s;
        }
        .navbar-user-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .navbar-user-item.logout {
          color: #f87171;
          margin-top: 0.1rem;
        }
        .navbar-user-item.logout:hover {
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }
      `}</style>
    </>
  );
};

export default Navbar;
