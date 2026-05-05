"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import UserCartItemCard, { CartItem } from "@/components/UserCartItemCard";
import UserWishlistCard, { WishlistItem } from "@/components/UserWishlistCard";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";
import ConfirmationMessagePopUp from "@/components/ConfirmationMessagePopUp";
import PaymentMethodConfirmationPopUp from "@/components/PaymentMethodConfirmationPopUp";
import { User, Heart, ShoppingCart, Package, LayoutDashboard, Zap } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  interface UserProfile {
    id: string;
    email: string;
    name: string;
    mobile_number: string;
    address: {
      full_address: string;
      city: string;
      state: string;
      pincode: string;
    } | null;
  }

  const activeTab = (searchParams.get("tab") || "profile").toLowerCase();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: "",
    mobile_number: "",
    full_address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  
  // Payment Flow State
  const [isPaymentPopUpOpen, setIsPaymentPopUpOpen] = useState(false);
  const [paymentSubtotal, setPaymentSubtotal] = useState(0);
  const [codConfirmation, setCodConfirmation] = useState({
    isOpen: false,
    total: 0
  });

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = useCallback((title: string, message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setAlert({ isOpen: true, title, message, type });
  }, []);

  const fetchUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const res = await fetch("/api/user/me");
      const json = await res.json();
      if (!json.user) {
        router.push("/login");
        return;
      }
      setUser(json.user);

      // Check profile completeness
      const u = json.user;
      const isIncomplete = !u.name || !u.mobile_number || !u.address?.full_address || !u.address?.city || !u.address?.state || !u.address?.pincode;
      setProfileIncomplete(isIncomplete);
    } catch {
      router.push("/login");
    } finally {
      setUserLoading(false);
    }
  }, [router]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/getcart");
      if (res.ok) {
        const json = await res.json();
        setCartItems(json.data || []);
      } else {
        const error = await res.json();
        showAlert("Error", error.error || "Failed to fetch cart", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
    setLoading(false);
  }, [showAlert]);

  const fetchWishlist = useCallback(async () => {
    setWishlistLoading(true);
    try {
      const res = await fetch("/api/user/wishlist");
      if (res.ok) {
        const json = await res.json();
        setWishlistItems(json.data || []);
      } else {
        const error = await res.json();
        showAlert("Error", error.error || "Failed to fetch wishlist", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
    setWishlistLoading(false);
  }, [showAlert]);

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchUser();
      if (activeTab === "my cart") {
        fetchCart();
      }
      if (activeTab === "my whishlist") {
        fetchWishlist();
      }
    });
  }, [activeTab, fetchUser, fetchCart, fetchWishlist]);

  useEffect(() => {
    if (user) {
      requestAnimationFrame(() => {
        setProfileForm({
          name: user.name || "",
          mobile_number: user.mobile_number || "",
          full_address: user.address?.full_address || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || ""
        });
      });
    }
  }, [user]);



  const checkProfileBeforePurchase = () => {
    if (profileIncomplete) {
      showAlert("Profile Incomplete", "Please complete your profile (name, mobile, address) before purchasing.", "warning");
      router.push(`/dashboard?tab=profile&redirectTo=${encodeURIComponent("/dashboard?tab=my%20cart")}`);
      return false;
    }
    return true;
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const deleteRes = await fetch(`/api/user/crudcart?id=${id}`, { method: "DELETE" });
      if (deleteRes.ok) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        window.dispatchEvent(new Event('navbar-update'));
      } else {
        const error = await deleteRes.json();
        showAlert("Error", error.error || "Failed to remove item", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
  };

  const handleBuyItem = (item: CartItem, quantity: number) => {
    if (!checkProfileBeforePurchase()) return;
    const price = item.variant_sizes?.discount_price || item.variant_sizes?.original_price || 0;
    setPaymentSubtotal(price * quantity);
    setIsPaymentPopUpOpen(true);
  };

  const handleBuyAll = () => {
    if (cartItems.length === 0) return;
    if (!checkProfileBeforePurchase()) return;
    
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.variant_sizes?.discount_price || item.variant_sizes?.original_price || 0;
      return acc + (price * 1); 
    }, 0);
    
    setPaymentSubtotal(subtotal);
    setIsPaymentPopUpOpen(true);
  };

  const onPaymentSelect = (method: "cod" | "online") => {
    if (method === "cod") {
      setCodConfirmation({ isOpen: true, total: paymentSubtotal + 49 });
    } else {
      setIsPaymentPopUpOpen(false);
      showAlert(
        "Order Initialized", 
        `Redirecting to secure online payment gateway for ₹${paymentSubtotal + 49}...`, 
        "info"
      );
    }
  };

  const handleRemoveWishlistItem = async (id: string) => {
    try {
      const deleteRes = await fetch(`/api/user/wishlist?id=${id}`, { method: "DELETE" });
      if (deleteRes.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        window.dispatchEvent(new Event('navbar-update'));
      } else {
        const error = await deleteRes.json();
        showAlert("Error", error.error || "Failed to remove from wishlist", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    if (profileForm.mobile_number.length !== 10) {
      showAlert("Error", "Mobile number must be exactly 10 digits (e.g. 8511274216)", "error");
      setUpdatingProfile(false);
      return;
    }

    try {
      const res = await fetch("/api/user/updateuserprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        showAlert("Success", "Profile updated successfully", "success");
        fetchUser();
        const redirectTo = searchParams.get("redirectTo");
        if (redirectTo) {
          router.push(redirectTo);
        }
      } else {
        const err = await res.json();
        showAlert("Error", err.error || "Failed to update profile", "error");
      }
    } catch {
      showAlert("Error", "Something went wrong", "error");
    }
    setUpdatingProfile(false);
  };



  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "my whishlist", label: "My Wishlist", icon: Heart },
    { id: "my cart", label: "My Cart", icon: ShoppingCart },
    { id: "my orders", label: "My Orders", icon: Package },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-6">
        
        <AlertMessagePopUp
          isOpen={alert.isOpen}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          title={alert.title}
          message={alert.message}
          type={alert.type}
        />

        {/* Improved Tab Box */}
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row">
            <div className="bg-black text-white px-6 py-4 flex items-center gap-3 sm:border-r sm:border-zinc-800">
              <LayoutDashboard className="h-4 w-4" />
              <h1 className="text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Dashboard</h1>
            </div>
            
            <div className="flex-1 grid grid-cols-2 sm:flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(`/dashboard?tab=${tab.id}`)}
                    className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-4 text-[9px] font-black uppercase tracking-widest border-b border-black last:border-b-0 sm:border-b-0 sm:border-r sm:border-black last:sm:border-r-0 transition-all ${
                      isActive ? 'bg-zinc-100 text-black shadow-[inset_0px_-2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-400 hover:bg-zinc-50 hover:text-black'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-black' : 'text-zinc-300'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="min-w-0">
          {activeTab === "profile" && (
            userLoading ? (
              <div className="border border-black bg-white p-12 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 animate-pulse">Synchronising Profile...</p>
              </div>
            ) : (
            <div className="border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               <div className="bg-zinc-50 border-b border-black px-5 py-3 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <User className="h-3.5 w-3.5" />
                   <h2 className="text-[10px] font-black uppercase tracking-widest">Account Settings</h2>
                 </div>
                 <p className="text-[9px] font-bold text-zinc-400">ID: {user?.id?.slice(0,8)}...</p>
               </div>
               
               <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Email Address (Read Only)</label>
                     <input 
                       type="text" 
                       value={user?.email || ""} 
                       disabled 
                       className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-[10px] font-bold text-zinc-400 cursor-not-allowed"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Full Name</label>
                     <input 
                       type="text" 
                       value={profileForm.name} 
                       onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                       placeholder="Enter your name"
                       className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                       required
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Mobile Number</label>
                     <input 
                       type="tel" 
                       value={profileForm.mobile_number} 
                       onChange={(e) => {
                         const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                         setProfileForm({...profileForm, mobile_number: val});
                       }}
                       placeholder="8511274216"
                       maxLength={10}
                       className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                       required
                     />
                   </div>
                 </div>

                 {/* Address Info */}
                 <div className="pt-6 border-t border-zinc-100">
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Package className="h-3 w-3 text-zinc-300" /> Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Full Address (Street, House No, Locality)</label>
                        <textarea 
                          rows={2}
                          value={profileForm.full_address} 
                          onChange={(e) => setProfileForm({...profileForm, full_address: e.target.value})}
                          placeholder="e.g. 123 Shibuya Crossing, Tokyo"
                          className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white resize-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">City</label>
                          <input 
                            type="text" 
                            value={profileForm.city} 
                            onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                            placeholder="City"
                            className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">State</label>
                          <input 
                            type="text" 
                            value={profileForm.state} 
                            onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                            placeholder="State"
                            className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Pincode</label>
                          <input 
                            type="text" 
                            value={profileForm.pincode} 
                            onChange={(e) => setProfileForm({...profileForm, pincode: e.target.value})}
                            placeholder="XXXXXX"
                            className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="pt-4">
                   <button 
                     type="submit" 
                     disabled={updatingProfile}
                     className="bg-black text-white px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-0.5 active:translate-y-0.5"
                   >
                     {updatingProfile ? "Synchronising..." : "Save Changes"}
                   </button>
                 </div>
               </form>
            </div>
            )
          )}

          {activeTab === "my cart" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShoppingCart className="h-3.5 w-3.5" /> Cart Items
                  </h2>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 border border-zinc-200">{cartItems.length}</span>
                </div>
                {cartItems.length > 0 && (
                  <button 
                    onClick={handleBuyAll}
                    className="flex items-center gap-1.5 border border-black bg-black text-white px-3 py-1.5 text-[8px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Zap className="h-2.5 w-2.5 fill-current" /> Buy All
                  </button>
                )}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {cartItems.map((item) => (
                    <UserCartItemCard 
                      key={item.id} 
                      item={item} 
                      onRemove={handleRemoveItem}
                      onBuy={handleBuyItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "my whishlist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1.5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Heart className="h-3.5 w-3.5 text-red-500" /> Wishlist
                </h2>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 border border-zinc-200">{wishlistItems.length}</span>
              </div>

              {wishlistLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border border-zinc-200" />
                  ))}
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white py-12 text-center">
                  <Heart className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">Your wishlist is empty</p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 border border-black bg-black text-white px-5 py-2 text-[8px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {wishlistItems.map((item) => (
                    <UserWishlistCard
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveWishlistItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "my orders" && (
            <div className="border border-black bg-white py-12 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 italic">No previous orders</p>
            </div>
          )}
        </main>

        <PaymentMethodConfirmationPopUp
          isOpen={isPaymentPopUpOpen}
          onClose={() => setIsPaymentPopUpOpen(false)}
          onSelect={onPaymentSelect}
          subtotalAmount={paymentSubtotal}
        />

        <ConfirmationMessagePopUp
          isOpen={codConfirmation.isOpen}
          onClose={() => setCodConfirmation({ ...codConfirmation, isOpen: false })}
          onConfirm={() => {
            setCodConfirmation({ ...codConfirmation, isOpen: false });
            setIsPaymentPopUpOpen(false);
            showAlert("Order Confirmed", "Your COD order has been placed successfully. Please pay the advance ₹100 via the link sent to your email.", "success");
          }}
          title="Confirm COD Advance"
          message={`You have to pay ₹100 now via online to confirm your order. The remaining balance of ₹${codConfirmation.total - 100} is payable at the time of delivery.`}
          confirmText="Pay ₹100 & Confirm"
          type="info"
        />
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
