"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-5xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            東京
          </span>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase mt-2">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h1 className="text-white font-black text-xl uppercase tracking-tight mb-2">
            Admin Access
          </h1>
          <p className="text-white/40 text-xs font-medium mb-8">
            Enter your admin password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white outline-none focus:border-white/50 transition-all text-sm font-bold"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
                <p className="text-rose-400 text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-white text-black h-14 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-zinc-100 transition-all disabled:opacity-40 active:scale-95"
            >
              {loading ? "Verifying..." : "Enter Admin Panel"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-[10px] font-bold tracking-widest uppercase mt-8">
          Tokyo Phashion © 2026
        </p>
      </div>
    </div>
  );
}
