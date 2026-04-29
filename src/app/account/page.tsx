"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import BuyNow from "@/components/BuyNow";
import { useAlert } from "@/components/AlertMessageCard";

import UserWishListCard from "@/components/UserWishListCard";

type Tab = "profile" | "cart" | "orders" | "wishlist";

interface CartItem {
  name: string;
  link: string;
  size: string;
  colour: string;
  image: string;
  catagory: string;
  subcatagory: string;
  discountprice: number;
  originalprice: number;
  quantity?: number;
}

interface OrderItem {
  name: string;
  image?: string;
  link?: string;
  size?: string;
  colour?: string;
  discountprice?: number;
  originalprice?: number;
}

interface Order {
  _id: string;
  created_at: string;
  total_amount?: number;
  price?: number;
  status: string;
  items: OrderItem[];
  review_stars?: number;
  review_comment?: string;
}


export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cart" || tab === "profile" || tab === "orders" || tab === "wishlist") {
      setActiveTab(tab as Tab);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    mobile_no: "",
    address: {
      full_address: "",
      cityname: "",
      statename: "",
      pincode: "",
    },
  });

  const [reviewData, setReviewData] = useState<{ [key: string]: { stars: number, comment: string } }>({});

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  // Persistence: Restore form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("profileFormDraft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
    setFormInitialized(true);
  }, []);

  // Persistence: Save form data to localStorage whenever it changes
  useEffect(() => {
    if (formInitialized) {
      localStorage.setItem("profileFormDraft", JSON.stringify(formData));
    }
  }, [formData, formInitialized]);

  useEffect(() => {
    if (!authLoading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (user) {
      if (activeTab === "profile" || activeTab === "cart" || activeTab === "wishlist") {
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
            mobile_no: (data.user.mobile_no || "").replace(/\D/g, "").slice(-10),
            address: {
              full_address: data.user.address?.full_address || "",
              cityname: data.user.address?.cityname || "",
              statename: data.user.address?.statename || "",
              pincode: data.user.address?.pincode || "",
            },
          });
          // After fetching real data, we can clear the draft if it matches or just let it stay
          // But usually, we want to clear it after a successful SUBMIT
          setCartItems(data.user.cartitems || []);
          setWishlistItems(data.user.wishlistitems || []);
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
    let { name, value } = e.target;
    
    // Numeric validation for mobile number - strict 10 digits
    if (name === "mobile_no") {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showAlert({ type: "error", message: "Please enter your name." });
      return false;
    }
    if (formData.mobile_no.length !== 10) {
      showAlert({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return false;
    }
    if (!formData.address.full_address.trim()) {
      showAlert({ type: "error", message: "Please enter your full address." });
      return false;
    }
    if (!formData.address.cityname.trim() || !formData.address.pincode.trim()) {
      showAlert({ type: "error", message: "Please enter your city and pincode." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_no: formData.mobile_no,
          username: formData.username,
          address: formData.address,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        showAlert({ type: "success", message: "Profile updated successfully!" });
        localStorage.removeItem("profileFormDraft"); // Clear draft on success
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCartItem = async (item: CartItem) => {
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
    if (!validateForm()) {
      setActiveTab("profile");
      return;
    }
    setIsBuyNowOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    showAlert({
      type: "confirm",
      message: "Are you sure you want to cancel this order?",
      onConfirm: async () => {
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
            showAlert({ type: "success", message: "Order cancelled successfully." });
          } else {
            const data = await res.json();
            showAlert({ type: "error", message: data.error || "Failed to cancel order" });
          }
        } catch (error) {
          console.error("Failed to cancel order", error);
          showAlert({ type: "error", message: "An error occurred while cancelling the order." });
        }
      }
    });
  };

  const handleReviewSubmit = async (orderId: string) => {
    const data = reviewData[orderId];
    if (!data?.stars) {
      showAlert({ type: "error", message: "Please select a star rating" });
      return;
    }
    
    try {
      const res = await fetch("/api/user/submitreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, review_stars: data.stars, review_comment: data.comment || "" }),
      });
      if (res.ok) {
        showAlert({ type: "success", message: "Review submitted successfully!" });
        fetchOrders(); // Refresh to show review
      } else {
        showAlert({ type: "error", message: "Failed to submit review" });
      }
    } catch(e) {
      console.error(e);
      showAlert({ type: "error", message: "An error occurred while submitting review." });
    }
  };

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
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all ${activeTab === "wishlist" ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                My Wishlist
                {wishlistItems.length > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{wishlistItems.length}</span>}
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
          <div className="flex-1 bg-zinc-50/50 rounded-3xl p-6 md:p-10 border-2 border-zinc-200 min-h-[500px] shadow-inner">
            {authLoading || loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loading Account Info...</p>
              </div>
            ) : (
              <>
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black mb-8">PERSONAL INFORMATION</h2>
                
                <div className="mb-8 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1">Registered Email</p>
                  <p className="text-lg font-bold">{user?.email}</p>
                </div>

                {message && (
                  <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={handleChange}
                        placeholder="10-digit number (e.g. 9876543210)"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-5 py-4 outline-none focus:border-black transition-all shadow-sm focus:shadow-md"
                      />
                      <p className="text-[9px] text-zinc-400 mt-2 font-medium">Enter 10 digits without any prefix like +91</p>
                    </div>
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
                    {cartItems.map((item, idx) => {
                      const cleanLink = item.link ? (item.link.startsWith('/') ? item.link : '/' + item.link).replace(/&cartid=[^&]*/g, '') : "/shop";
                      
                      return (
                        <div key={idx} className="group/cart-item bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden hover:border-black transition-all">
                          <div className="flex items-center gap-6 p-4">
                            <Link href={cleanLink} className="relative w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0 block group-hover/cart-item:scale-[1.02] transition-transform">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-300">NO IMAGE</div>
                              )}
                            </Link>
                            <Link href={cleanLink} className="flex-1 min-w-0 py-1 block">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.catagory || "Clothing"}</p>
                              <h4 className="font-bold text-sm uppercase mb-1 group-hover/cart-item:underline truncate">{item.name}</h4>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold">₹{item.discountprice || item.originalprice}</span>
                                {item.discountprice && item.originalprice > item.discountprice && (
                                  <span className="text-[10px] text-zinc-400 line-through">₹{item.originalprice}</span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-500 mt-2 uppercase font-medium">Size: {item.size || "M"} • Colour: {item.colour || "Standard"}</p>
                            </Link>
                            <div className="pr-2">
                              <button 
                                onClick={() => handleDeleteCartItem(item)}
                                className="p-3 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors active:scale-90"
                                title="Remove from cart"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
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

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-black mb-8 uppercase tracking-tight">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-200 mb-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Your wishlist is empty</p>
                    <Link href="/shop" className="mt-6 text-xs font-black underline underline-offset-4 tracking-widest uppercase">Explore Items</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {wishlistItems.map((item, idx) => (
                      <UserWishListCard 
                        key={idx} 
                        item={item} 
                        onRemove={(removedItem) => {
                          setWishlistItems((prev) => prev.filter((i) => 
                            !(i.name === removedItem.name && i.link === removedItem.link && i.size === removedItem.size && i.colour === removedItem.colour)
                          ));
                        }} 
                      />
                    ))}
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
                      <div key={order._id || idx} className="bg-white rounded-2xl border-2 border-zinc-200 shadow-md overflow-hidden">
                        <div className="p-4 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Date</p>
                            <p className="text-xs font-bold" suppressHydrationWarning>{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-xs font-bold text-emerald-600">₹{order.total_amount || order.price || 0}</p>
                          </div>
                           <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${order.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {order.status || "Processing"}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                            <p className="text-xs font-bold text-zinc-900" suppressHydrationWarning>
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
                          {order.items && order.items.map((item: OrderItem, i: number) => {
                            const cleanLink = item.link ? (item.link.startsWith('/') ? item.link : '/' + item.link).replace(/&cartid=[^&]*/g, '') : "/shop";
                            
                            return (
                              <Link key={i} href={cleanLink} className="flex items-center gap-4 group/order-item p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                 <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative border border-zinc-200">
                                    {item.image && <Image src={item.image} alt={item.name || ""} fill className="object-cover transition-transform group-hover/order-item:scale-110" />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-bold uppercase truncate group-hover/order-item:underline">{item.name || "Fashion Item"}</h5>
                                    {item.size && <p className="text-[9px] text-zinc-500 font-bold uppercase">Size: {item.size} • Color: {item.colour}</p>}
                                 </div>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover/order-item:text-black transition-colors">
                                   <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                                 </svg>
                              </Link>
                            );
                          })}
                        </div>

                        {order.status === 'delivered' && !order.review_stars && (
                          <div className="p-4 border-t border-zinc-200 bg-zinc-50/80">
                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-3">Leave a Review</h4>
                            <div className="space-y-3 max-w-sm">
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewData(prev => ({ ...prev, [order._id]: { ...prev[order._id], stars: star } }))}
                                    className={`text-xl ${reviewData[order._id]?.stars >= star ? 'text-yellow-400' : 'text-zinc-300'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                              <textarea
                                placeholder="How was your experience?"
                                value={reviewData[order._id]?.comment || ""}
                                onChange={(e) => setReviewData(prev => ({ ...prev, [order._id]: { ...prev[order._id], comment: e.target.value } }))}
                                className="w-full text-xs p-3 rounded-xl border border-zinc-300 outline-none focus:border-black resize-none"
                                rows={2}
                              />
                              <button
                                onClick={() => handleReviewSubmit(order._id)}
                                className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                              >
                                Submit Review
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {order.review_stars && (
                          <div className="p-4 border-t border-zinc-200 bg-green-50/50">
                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Your Review</h4>
                            <div className="text-yellow-500 text-sm mb-1">{'★'.repeat(Number(order.review_stars))}{'☆'.repeat(5 - Number(order.review_stars))}</div>
                            {order.review_comment && <p className="text-xs text-zinc-600 italic">&quot;{order.review_comment}&quot;</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
        </div>
      </div>
      
      <BuyNow 
        isOpen={isBuyNowOpen} 
        onClose={() => setIsBuyNowOpen(false)} 
        items={cartItems.map(item => ({
          ...item,
          image: item.image || "",
          catagory: item.catagory || "",
          subcatagory: item.subcatagory || "",
          discountprice: item.discountprice || item.originalprice
        }))} 
        totalAmount={cartItems.reduce((acc, item) => acc + (item.discountprice || item.originalprice), 0)} 
        userProfile={{ 
          mobile_no: formData.mobile_no, 
          username: formData.username, 
          address: {
            full_address: formData.address.full_address,
            cityname: formData.address.cityname,
            statename: formData.address.statename,
            pincode: formData.address.pincode
          }
        }} 
      />
    </div>
  );
}
