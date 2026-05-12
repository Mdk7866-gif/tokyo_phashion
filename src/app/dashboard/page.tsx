"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import UserCartItemCard, { CartItem } from "@/components/UserCartItemCard";
import UserWishlistCard, { WishlistItem } from "@/components/UserWishlistCard";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";
import PaymentMethodConfirmationPopUp from "@/components/PaymentMethodConfirmationPopUp";
import ImageZoomPopUp from "@/components/ImageZoomPopUp";
import { User, Heart, ShoppingCart, Package, LayoutDashboard, Zap, Clock, CheckCircle, XCircle, AlertTriangle, MessageSquare, Star, Loader2, Truck } from "lucide-react";

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

  interface OrderItem {
    id: string;
    product_name_snapshot: string;
    color_snapshot: string;
    size_snapshot: string;
    quantity: number;
    price_snapshot: number;
    product_id: string;
    product_variant_id: string;
    product_variants: {
      id: string;
      product_images: { image_url: string; sort_order: number }[];
    } | null;
  }

  interface Order {
    id: string;
    created_at: string;
    delivery_status: "pending" | "delivered" | "cancelled";
    payment_status: "pending" | "paid" | "failed";
    payment_method: "cod" | "online";
    total_amount: number;
    snapshot_order_full_address: string;
    snapshot_order_city: string;
    snapshot_order_state: string;
    snapshot_order_pincode: string;
    cancelled_by?: string;
    cancellation_note?: string;
    tracking_id?: string;
    parcel_image?: string;
    order_items: OrderItem[];
  }

  const activeTab = (searchParams.get("tab") || "profile").toLowerCase();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{ orderId: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(new Set());
  const [reviewsMap, setReviewsMap] = useState<Record<string, { rating: number, comment: string }>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
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
  
  // Tab Load Tracking
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());
  
  const [isPaymentPopUpOpen, setIsPaymentPopUpOpen] = useState(false);
  const [paymentSubtotal, setPaymentSubtotal] = useState(0);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<{item: CartItem, quantity: number} | 'all' | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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
        const items = json.data || [];
        setCartItems(items);
        
        // Initialize quantities
        const q: Record<string, number> = {};
        items.forEach((item: CartItem) => {
          q[item.id] = 1;
        });
        setCartQuantities(q);
      } else {
        const error = await res.json();
        showAlert("Error", error.error || "Failed to fetch cart", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
    setLoading(false);
    setLoadedTabs(prev => new Set(prev).add("my cart"));
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
    setLoadedTabs(prev => new Set(prev).add("my whishlist"));
  }, [showAlert]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const [ordersRes, reviewsRes] = await Promise.all([
        fetch("/api/user/orders"),
        fetch("/api/user/reviews") // Fetch all reviews for this user
      ]);

      if (ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        setOrders(ordersJson.data || []);
      }

      if (reviewsRes.ok) {
        const reviewsJson = await reviewsRes.json();
        const map: Record<string, { rating: number, comment: string }> = {};
        const submittedSet = new Set<string>();
        
        reviewsJson.data?.forEach((rev: any) => {
          if (rev.order_id) {
            map[rev.order_id] = { rating: rev.rating, comment: rev.comment };
            submittedSet.add(rev.order_id);
          }
        });
        setReviewsMap(map);
        setSubmittedReviews(submittedSet);
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
    setOrdersLoading(false);
    setLoadedTabs(prev => new Set(prev).add("my orders"));
  }, [showAlert]);

  // Initial Load: Profile only
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Tab Switching: Fetch data only if not loaded
  useEffect(() => {
    if (activeTab === "my cart" && !loadedTabs.has("my cart")) {
      fetchCart();
    }
    if (activeTab === "my whishlist" && !loadedTabs.has("my whishlist")) {
      fetchWishlist();
    }
    if (activeTab === "my orders" && !loadedTabs.has("my orders")) {
      fetchOrders();
    }
  }, [activeTab, loadedTabs, fetchCart, fetchWishlist, fetchOrders]);

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

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? No refund will be issued if payment was made.")) return;
    try {
      const res = await fetch("/api/user/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });
      if (res.ok) {
        showAlert("Order Cancelled", "Your order has been cancelled.", "success");
        fetchOrders();
      } else {
        const err = await res.json();
        showAlert("Error", err.error || "Failed to cancel order", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingItem) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/user/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: reviewingItem.orderId,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });
      if (res.ok) {
        showAlert("Review Submitted", "Thank you for your feedback!", "success");
        setSubmittedReviews(prev => new Set(prev).add(reviewingItem.orderId));
        setReviewsMap(prev => ({
          ...prev,
          [reviewingItem.orderId]: { rating: reviewForm.rating, comment: reviewForm.comment }
        }));
        setReviewingItem(null);
        setReviewForm({ rating: 5, comment: "" });
      } else {
        const err = await res.json();
        showAlert("Error", err.error || "Failed to submit review", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "An unexpected error occurred", "error");
    }
    setSubmittingReview(false);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartQuantities(prev => ({ ...prev, [id]: quantity }));
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
    setSelectedItemForPurchase({ item, quantity });
    setIsPaymentPopUpOpen(true);
  };

  const handleBuyAll = () => {
    if (cartItems.length === 0) return;
    if (!checkProfileBeforePurchase()) return;

    // Check if any item is out of stock
    const outOfStockItem = cartItems.find(item => (item.variant_sizes?.stock ?? 0) <= 0);
    if (outOfStockItem) {
      showAlert("Out of Stock", `One or more items in your cart (like "${outOfStockItem.variant_sizes.product_variants.products.name}") are out of stock. Please remove them to continue.`, "warning");
      return;
    }
    
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.variant_sizes?.discount_price || item.variant_sizes?.original_price || 0;
      const qty = cartQuantities[item.id] || 1;
      return acc + (price * qty); 
    }, 0);
    
    setPaymentSubtotal(subtotal);
    setSelectedItemForPurchase('all');
    setIsPaymentPopUpOpen(true);
  };

  const onPaymentSelect = (method: "cod" | "online") => {
    setIsPaymentPopUpOpen(false);
    if (selectedItemForPurchase === 'all') {
      const params = new URLSearchParams({
        cart_checkout: "true",
        payment_method: method,
        quantities: JSON.stringify(cartQuantities)
      });
      router.push(`/checkout?${params.toString()}`);
    } else if (selectedItemForPurchase) {
      const { item, quantity } = selectedItemForPurchase;
      const params = new URLSearchParams({
        variant_size_id: item.variant_sizes.id,
        product_id: item.variant_sizes.product_variants.products.id,
        product_variant_id: item.variant_sizes.product_variants.id,
        quantity: quantity.toString(),
        payment_method: method,
      });
      router.push(`/checkout?${params.toString()}`);
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
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Pincode {pincodeLoading && <span className="text-blue-400">↻ Looking up...</span>}</label>
                          <input 
                            type="text" 
                            value={profileForm.pincode} 
                            onChange={async (e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setProfileForm(prev => ({ ...prev, pincode: val }));
                              if (val.length === 6) {
                                setPincodeLoading(true);
                                try {
                                  const res = await fetch(`/api/user/pincode?pin=${val}`);
                                  const data = await res.json();
                                  if (data.city && data.state) {
                                    setProfileForm(prev => ({ ...prev, city: data.city, state: data.state }));
                                  } else {
                                    showAlert("Invalid Pincode", data.error || "Please enter a correct 6-digit pincode.", "warning");
                                    setProfileForm(prev => ({ ...prev, city: "", state: "" }));
                                  }
                                } catch { 
                                  showAlert("Lookup Failed", "Could not verify pincode. Please enter city/state manually.", "info");
                                } finally {
                                  setPincodeLoading(false);
                                }
                              }
                            }}
                            placeholder="XXXXXX"
                            maxLength={6}
                            className="w-full border border-black px-4 py-2.5 text-[10px] font-bold text-black focus:outline-none focus:ring-0 focus:border-zinc-400 bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">City {pincodeLoading && <span className="text-blue-400 animate-pulse">auto-filling...</span>}</label>
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
                          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block ml-1">State {pincodeLoading && <span className="text-blue-400 animate-pulse">auto-filling...</span>}</label>
                          <input 
                            type="text" 
                            value={profileForm.state} 
                            onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                            placeholder="State"
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
                      onQuantityChange={handleQuantityChange}
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
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" /></div>
              ) : orders.length === 0 ? (
                <div className="border border-black bg-white py-12 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Package className="h-8 w-8 mx-auto mb-4 text-zinc-300" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No Orders Yet</p>
                  <button onClick={() => router.push("/")} className="mt-4 border border-black bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">Start Shopping</button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row">
                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-zinc-200 gap-2">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Order #{order.id}</p>
                          <p className="text-[10px] text-zinc-800 font-bold">{new Date(order.created_at).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${
                            order.delivery_status === 'delivered' ? 'border-green-500 text-green-700 bg-green-50' : 
                            order.delivery_status === 'cancelled' ? 'border-red-500 text-red-700 bg-red-50' : 
                            'border-amber-500 text-amber-700 bg-amber-50'
                          }`}>
                            {order.delivery_status === 'delivered' ? <CheckCircle className="h-3 w-3" /> : 
                             order.delivery_status === 'cancelled' ? <XCircle className="h-3 w-3" /> : 
                             <Clock className="h-3 w-3" />}
                            {order.delivery_status}
                          </span>
                        </div>
                      </div>

                      {/* ── Tracking / Parcel section ── */}
                      {order.payment_status === 'paid' && order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                        <div className="mb-4 border border-amber-300 bg-amber-50 p-3">
                          <div className="flex items-start gap-2.5">
                            <Truck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-0.5">Order Confirmed — Preparing Shipment</p>
                              <p className="text-[10px] font-medium text-amber-700 leading-snug">
                                Your payment was received! We are packing your order. Your tracking ID and parcel photo will appear here once dispatched.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dispatched banner with tracking + parcel photo */}
                      {order.delivery_status === 'delivered' && (order.tracking_id || order.parcel_image) && (
                        <div className="mb-4 border border-green-400 bg-green-50 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-2 shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-700">Dispatched</span>
                          </div>
                          <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-center">
                            {order.tracking_id && (
                              <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-green-600 mb-0.5">Tracking ID</p>
                                <p className="text-[11px] font-black text-black tracking-tight">{order.tracking_id}</p>
                              </div>
                            )}
                            {order.parcel_image && (
                              <button
                                onClick={() => setZoomedImage(order.parcel_image!)}
                                className="shrink-0 relative h-14 w-14 border-2 border-green-400 hover:border-green-600 overflow-hidden transition-colors group cursor-zoom-in"
                                title="Click to zoom"
                              >
                                <Image src={order.parcel_image} alt="Parcel" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <span className="text-white text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Zoom</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Cancellation Info — visible to user */}
                      {order.delivery_status === "cancelled" && (order.cancelled_by || order.cancellation_note) && (
                        <div className="mb-4 border border-red-200 bg-red-50 p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-700">Cancellation Details</span>
                          </div>
                          <div className="space-y-1 pl-5.5">
                            {order.cancelled_by && (
                              <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-tight">
                                <span className="text-zinc-400 font-medium">Cancelled By:</span> {order.cancelled_by === 'admin' ? 'Tokyo Fashion (Admin)' : 'You'}
                              </p>
                            )}
                            {order.cancellation_note && (
                              <p className="text-[10px] font-bold text-zinc-700">
                                <span className="text-zinc-400 font-medium uppercase tracking-tight">Reason:</span> {order.cancellation_note}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Order Items with images */}
                      <div className="space-y-2 mb-4">
                        {order.order_items.map((item) => {
                          const imgUrl = item.product_variants?.product_images
                            ?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.image_url;
                          return (
                            <a
                              key={item.id}
                              href={`/detailedproduct?product_id=${item.product_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 border border-zinc-200 p-2 hover:border-black hover:bg-zinc-50 transition-all group"
                            >
                              {/* Product thumbnail */}
                              <div className="relative h-12 w-10 shrink-0 border border-zinc-200 bg-zinc-50 overflow-hidden">
                                {imgUrl ? (
                                  <Image src={imgUrl} alt={item.product_name_snapshot} fill className="object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-zinc-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black uppercase tracking-tight text-black group-hover:underline">{item.product_name_snapshot}</p>
                                <p className="text-[9px] text-zinc-600 font-bold mt-0.5 uppercase tracking-widest">{item.color_snapshot} · Size {item.size_snapshot} · Qty {item.quantity}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-black text-black">₹{item.price_snapshot * item.quantity}</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>

                       {/* Tracking / Address info (bottom) */}
                       <div className="bg-zinc-50 border border-zinc-200 p-3 mt-auto">
                         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Shipping To</p>
                         <p className="text-[10px] text-zinc-700 font-medium leading-snug">{order.snapshot_order_full_address}, {order.snapshot_order_city}, {order.snapshot_order_state} {order.snapshot_order_pincode}</p>
                       </div>
                    </div>
                    
                    {/* Action Panel */}
                    <div className="bg-zinc-100 border-t sm:border-t-0 sm:border-l border-zinc-200 w-full sm:w-48 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Payment</p>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] text-zinc-600 font-bold">Method</span>
                           <span className="text-[10px] font-black uppercase text-black">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] text-zinc-600 font-bold">Status</span>
                            <span className={`text-[10px] font-black uppercase ${
                              order.payment_status === 'paid' ? 'text-green-700' :
                              order.payment_status === 'failed' ? 'text-red-700' :
                              'text-amber-700'
                            }`}>{order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'failed' ? 'Failed' : 'Pending'}</span>
                         </div>
                        <div className="flex justify-between items-end border-t border-zinc-300 pt-2 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">Total</span>
                          <span className="text-lg font-black tracking-tighter leading-none text-black">₹{order.total_amount}</span>
                        </div>
                      </div>
                      
                      {/* Rate & Review Order — one button per delivered order */}
                       {order.delivery_status === "delivered" && (
                         <div className="mt-3">
                           {submittedReviews.has(order.id) ? (
                             <div className="flex flex-col gap-2 p-3 bg-zinc-50 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                               <div className="flex items-center justify-between">
                                 <div className="flex gap-1">
                                   {[1,2,3,4,5].map(star => (
                                     <Star key={star} className={`h-3 w-3 ${reviewsMap[order.id]?.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                                   ))}
                                 </div>
                                 <span className="text-[8px] font-black uppercase tracking-widest text-green-600">Review Verified</span>
                               </div>
                               {reviewsMap[order.id]?.comment && (
                                 <p className="text-[10px] font-medium text-zinc-600 italic">"{reviewsMap[order.id].comment}"</p>
                               )}
                             </div>
                           ) : (
                             <button
                               onClick={() => setReviewingItem({ orderId: order.id })}
                               className="w-full flex items-center justify-center gap-2 border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 text-[9px] font-black uppercase tracking-widest transition-colors"
                             >
                               <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Rate & Review This Order
                             </button>
                           )}
                         </div>
                       )}

                      {/* Cancel button — only for pending delivery AND paid payments */}
                      {order.delivery_status === "pending" && order.payment_status === "paid" && (
                        <div className="mt-4 pt-4 border-t border-zinc-300 text-center">
                          <p className="text-[8px] font-bold text-zinc-600 mb-2 leading-tight">Note: Cancelling a paid order will not result in a refund automatically.</p>
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="w-full bg-white border border-red-300 text-red-700 hover:bg-red-50 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                          >
                            <AlertTriangle className="h-3 w-3" /> Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Review Modal */}
          {reviewingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white border-2 border-black p-6 w-full max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
                <button 
                  onClick={() => setReviewingItem(null)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-black"
                >
                  <XCircle className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1 text-black">Rate This Order</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Order #{reviewingItem.orderId.slice(0, 12)}...</p>
                
                <div className="mb-6 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star className={`h-10 w-10 ${reviewForm.rating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`} />
                    </button>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Write a Review (Optional)</label>
                  <textarea 
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this order..."
                    className="w-full border border-black p-3 text-sm text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black h-24 resize-none bg-white"
                  />
                </div>
                
                <button 
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="w-full border border-black bg-black text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                >
                  {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </main>

        <PaymentMethodConfirmationPopUp
          isOpen={isPaymentPopUpOpen}
          onClose={() => {
            setIsPaymentPopUpOpen(false);
            setSelectedItemForPurchase(null);
          }}
          onSelect={onPaymentSelect}
          subtotalAmount={paymentSubtotal}
          hideCOD={(paymentSubtotal + 150) <= 100}
        />

        <ImageZoomPopUp
          isOpen={!!zoomedImage}
          onClose={() => setZoomedImage(null)}
          imageUrl={zoomedImage ?? ""}
          alt="Parcel Photo"
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
