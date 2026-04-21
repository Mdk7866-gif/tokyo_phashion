"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    address: {
      full_address: "",
      cityname: "",
      statename: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/portfolio");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setFormData({
            username: data.user.username || "",
            address: {
              full_address: data.user.address?.full_address || "",
              cityname: data.user.address?.cityname || "",
              statename: data.user.address?.statename || "",
              pincode: data.user.address?.pincode || "",
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_no: user?.mobile_no,
          username: formData.username,
          address: formData.address,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-zinc-50 py-12 px-4 md:px-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
        <h1 className="text-3xl font-black tracking-tight mb-8">MY DASHBOARD</h1>
        
        <div className="mb-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
          <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider mb-1">Registered Mobile Number</p>
          <p className="text-lg font-bold">{user?.mobile_no}</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Address</label>
                <textarea
                  name="full_address"
                  value={formData.address.full_address}
                  onChange={handleChange}
                  placeholder="Street address, apartment, suite, etc."
                  rows={3}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">City</label>
                  <input
                    type="text"
                    name="cityname"
                    value={formData.address.cityname}
                    onChange={handleChange}
                    placeholder="City name"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">State</label>
                  <input
                    type="text"
                    name="statename"
                    value={formData.address.statename}
                    onChange={handleChange}
                    placeholder="State name"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Postal / Zip code"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-6"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
