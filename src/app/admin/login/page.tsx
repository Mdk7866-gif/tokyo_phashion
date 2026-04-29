"use client";

import React, { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError("Incorrect password. Access denied.");
        setPassword("");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1600&q=80&auto=format&fit=crop"
          alt="Admin Background"
          className="w-full h-full object-cover animate-image-zoom"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Brand */}
        <Link href="/" className="mb-12 block transform transition-transform hover:scale-105 active:scale-95">
          <Logo width={140} color="#fff" className="mx-auto" />
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[0.6em] text-white/40 uppercase">
              Admin Access
            </span>
            <div className="w-12 h-[1px] bg-white/20 mt-2" />
          </div>
        </Link>

        {/* Card */}
        <div className="login-card">
          <h1 className="text-white font-black text-2xl uppercase tracking-tight mb-2">
            Secure Login
          </h1>
          <p className="text-white/40 text-xs font-medium mb-10">
            Authorization required to access the panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">
                Security Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm font-bold placeholder:text-white/10"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-4 animate-fade-in">
                <p className="text-rose-400 text-[11px] font-bold tracking-wide flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="group relative w-full h-16 rounded-2xl overflow-hidden font-black text-[11px] tracking-[0.2em] uppercase transition-all active:scale-95 disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative text-black">
                {loading ? "Authenticating..." : "Establish Session"}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-white/10 text-[9px] font-bold tracking-[0.5em] uppercase mt-12">
          Tokyo Fashion System • v2.0
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem 1.5rem;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
          background: #000;
        }

        .animate-image-zoom {
          animation: imageZoom 25s infinite alternate ease-in-out;
        }

        @keyframes imageZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(30px) saturate(150%);
          -webkit-backdrop-filter: blur(30px) saturate(150%);
          border-radius: 2.5rem;
          padding: 3.5rem 2.5rem;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.6);
          animation: cardReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes cardReveal {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
