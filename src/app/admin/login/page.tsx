"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm border border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-black bg-black text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-black uppercase italic tracking-tighter">
            Admin <span className="font-light text-gray-1000 opacity-50">Access</span>
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Restricted Area
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black text-gray-900 bg-zinc-50 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-0"
              placeholder="Enter admin passcode"
              required
            />
          </div>

          {error && (
            <p className="text-xs font-bold uppercase text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Authorize"}
          </button>
        </form>
      </div>
    </div>
  );
}
