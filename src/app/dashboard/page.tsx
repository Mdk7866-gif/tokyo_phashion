"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import UserCartItemCard from "@/components/UserCartItemCard";
import { User, Heart, ShoppingCart, Package, LogOut } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeTab = (searchParams.get("tab") || "profile").toLowerCase();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    if (activeTab === "my cart") {
      fetchCart();
    }
  }, [activeTab]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me");
      const json = await res.json();
      if (!json.user) {
        router.push("/login");
        return;
      }
      setUser(json.user);
    } catch {
      router.push("/login");
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/getcart");
      if (res.ok) {
        const json = await res.json();
        setCartItems(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const deleteRes = await fetch(`/api/user/crudcart?id=${id}`, { method: "DELETE" });
      if (deleteRes.ok) {
        setCartItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "my whishlist", label: "My Wishlist", icon: Heart },
    { id: "my cart", label: "My Cart", icon: ShoppingCart },
    { id: "my orders", label: "My Orders", icon: Package },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4">
        
        {/* Compact Sidebar / Tab Box */}
        <div className="border border-black bg-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {/* Header with Full Email */}
          <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <User className="h-2.5 w-2.5 text-black" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest truncate">
                {user?.email}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-red-400 transition-colors border border-white/20 px-2 py-1 rounded-sm"
            >
              <LogOut className="h-2.5 w-2.5" /> Sign Out
            </button>
          </div>

          {/* Compact Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(`/dashboard?tab=${tab.id}`)}
                  className={`flex items-center justify-center gap-2 px-2 py-3.5 text-[8px] font-black uppercase tracking-widest border-r border-black last:border-r-0 transition-all ${
                    isActive ? 'bg-green-500 text-white shadow-[inset_0px_4px_0px_0px_rgba(255,255,255,0.1)]' : 'bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <Icon className={`h-3 w-3 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <main className="min-w-0">
          {activeTab === "profile" && (
            <div className="border border-black bg-white p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-100">
                 <User className="h-3 w-3 text-zinc-400" />
                 <h2 className="text-[10px] font-black uppercase tracking-widest">Account Details</h2>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 border border-zinc-100">
                    <label className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-1">Authenticated Email</label>
                    <p className="text-[10px] font-bold text-black truncate">{user?.email}</p>
                  </div>
                  <div className="bg-zinc-50 p-3 border border-zinc-100">
                    <label className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-1">User Identifier</label>
                    <p className="text-[9px] font-mono text-zinc-400 truncate">{user?.id}</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "my cart" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1.5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShoppingCart className="h-3.5 w-3.5" /> Cart Items
                </h2>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 border border-zinc-200">{cartItems.length}</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border border-zinc-200" />
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white py-12 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">Your bag is currently empty</p>
                  <button 
                    onClick={() => router.push("/")}
                    className="mt-4 border border-black bg-black text-white px-5 py-2 text-[8px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
                  >
                    Return to Shop
                  </button>
                </div>
              ) : (
                /* Compact 2-per-row grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {cartItems.map((item) => (
                    <UserCartItemCard 
                      key={item.id} 
                      item={item} 
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "my whishlist" && (
            <div className="border border-black bg-white py-12 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 italic">Whishlist Coming Soon</p>
            </div>
          )}

          {activeTab === "my orders" && (
            <div className="border border-black bg-white py-12 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 italic">No previous orders</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <Suspense fallback={<div className="p-8 text-center animate-pulse h-64 text-[8px] font-black uppercase tracking-widest text-zinc-300">Synchronising...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
