"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import BuyNow from "@/components/BuyNow";

type Tab = "profile" | "cart" | "orders";

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cart" || tab === "profile" || tab === "orders") {
      setActiveTab(tab as Tab);
    }
  }, [searchParams]);
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

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      if (activeTab === "profile" || activeTab === "cart") {
        fetchProfile();
      }
      if (activeTab === "orders") {
        fetchOrders();
      }
    }
  }, [user, authLoading, router, activeTab]);

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
          setCartItems(data.user.cartitems || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/getordereddata");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
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

  const handleDeleteCartItem = async (item: any) => {
    try {
      const res = await fetch("/api/user/deletecartitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_no: user?.mobile_no,
          name: item.name,
          link: item.link,
          size: item.size,
          colour: item.colour,
        }),
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((i) => 
          !(i.name === item.name && i.link === item.link && i.size === item.size && i.colour === item.colour)
        ));
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleCheckout = () => {
    if (!formData.username || !formData.address.full_address) {
      alert("Please complete your profile (name and address) before purchasing.");
      setActiveTab("profile");
      return;
    }
    setIsBuyNowOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch("/api/user/cancelorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        setOrders((prev) => 
          prev.map((o) => o._id === orderId ? { ...o, status: "cancelled" } : o)
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Failed to cancel order", error);
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
    <div className="min-h-screen bg-white py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-2">
            <h1 className="text-2xl font-black mb-6 tracking-tight">DASHBOARD</h1>
            <nav className="flex flex-col space-y-1">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all ${activeTab === "profile" ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </button>
              <button 
                onClick={() => setActiveTab("cart")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all ${activeTab === "cart" ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                My Carts
                {cartItems.length > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{cartItems.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all ${activeTab === "orders" ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h6"/></svg>
                My Orders
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-zinc-50/50 rounded-3xl p-6 md:p-10 border border-zinc-100">
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black mb-8">PERSONAL INFORMATION</h2>
                
                <div className="mb-8 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1">Registered Mobile</p>
                  <p className="text-lg font-bold">{user?.mobile_no}</p>
                </div>

                {message && (
                  <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm focus:shadow-md"
                    />
                  </div>

                  <div className="pt-6 border-t border-zinc-100">
                    <h3 className="text-sm font-black mb-6 uppercase tracking-wider">Default Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Full Address</label>
                        <textarea
                          name="full_address"
                          value={formData.address.full_address}
                          onChange={handleChange}
                          placeholder="House No, Building, Street..."
                          rows={3}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm focus:shadow-md resize-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">City</label>
                          <input
                            type="text"
                            name="cityname"
                            value={formData.address.cityname}
                            onChange={handleChange}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">State</label>
                          <input
                            type="text"
                            name="statename"
                            value={formData.address.statename}
                            onChange={handleChange}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.address.pincode}
                          onChange={handleChange}
                          className="w-full md:w-1/2 bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-black/10 active:scale-95"
                  >
                    {saving ? "Processing..." : "Update Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black mb-8 uppercase tracking-tight">Shopping Cart</h2>
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-200 mb-4"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Your cart is empty</p>
                    <Link href="/" className="mt-6 text-xs font-black underline underline-offset-4 tracking-widest uppercase">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="relative w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-300">NO IMAGE</div>
                          )}
                        </div>
                        <div 
                          className="flex-1 cursor-pointer group/item"
                          onClick={() => router.push(`/${item.link}`)}
                        >
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.catagory || "Clothing"}</p>
                          <h4 className="font-bold text-sm uppercase mb-1 group-hover/item:underline">{item.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">₹{item.discountprice || item.originalprice}</span>
                            {item.discountprice && item.originalprice > item.discountprice && (
                              <span className="text-[10px] text-zinc-400 line-through">₹{item.originalprice}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-2 uppercase font-medium">Size: {item.size || "M"} • Colour: {item.colour || "Standard"}</p>
                        </div>
                        <div className="pr-4">
                          <button 
                            onClick={() => handleDeleteCartItem(item)}
                            className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-10 p-8 bg-black text-white rounded-3xl space-y-6 shadow-2xl">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Bag Total</span>
                        <span className="text-2xl font-black tracking-tighter">₹{cartItems.reduce((acc, item) => acc + (item.discountprice || item.originalprice), 0)}</span>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-white text-black h-16 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-100 transition-all active:scale-95"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black mb-8 uppercase tracking-tight">Order History</h2>
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-200 mb-4"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h6"/></svg>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order, idx) => (
                      <div key={order._id || idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                        <div className="p-4 bg-zinc-50/50 border-b border-zinc-100 flex flex-wrap justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Date</p>
                            <p className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-xs font-bold text-emerald-600">₹{order.total_amount || order.price || 0}</p>
                          </div>
                           <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${order.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                              {order.status || "Processing"}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                            <p className="text-xs font-bold text-zinc-900">
                              {(() => {
                                const d = new Date(order.created_at);
                                d.setDate(d.getDate() + 7);
                                return d.toLocaleDateString();
                              })()}
                            </p>
                          </div>
                          {order.status === 'in progress' && (
                            <div className="flex items-end">
                              <button 
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-1.5 bg-white border border-rose-200 text-rose-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-4">
                          {order.items && order.items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative">
                                  {item.image && <Image src={item.image} alt={item.name || ""} fill className="object-cover" />}
                               </div>
                               <div>
                                  <h5 className="text-xs font-bold uppercase">{item.name || "Fashion Item"}</h5>
                                  <p className="text-[10px] text-zinc-500">Qty: {item.quantity || 1} • Size: {item.size || "M"}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      
      <BuyNow 
        isOpen={isBuyNowOpen} 
        onClose={() => setIsBuyNowOpen(false)} 
        items={cartItems} 
        totalAmount={cartItems.reduce((acc, item) => acc + (item.discountprice || item.originalprice), 0)} 
        userProfile={{ mobile_no: user?.mobile_no, username: formData.username, address: formData.address }} 
      />
    </div>
  );
}
