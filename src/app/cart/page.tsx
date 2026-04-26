"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface CartItem {
  name: string;
  link: string;
  originalprice: number;
  discountprice: number;
  image: string;
  colour: string;
  size: string;
  catagory: string;
  subcatagory: string;
  created_at: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch("/api/user/getcartitems");
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.cartitems || []);
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.discountprice, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-10 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col space-y-2 mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9]">
          Shopping Bag
        </h1>
        <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase leading-none">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in your bag
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-8">Your bag is currently empty</p>
          <Link 
            href="/shop" 
            className="inline-block bg-black text-white px-10 py-5 rounded-full font-black text-[11px] tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all shadow-xl"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            {cartItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 p-8 bg-white rounded-[2.5rem] border border-zinc-100 hover:shadow-2xl transition-all duration-500 group">
                {/* Product Image */}
                <div className="w-full md:w-48 aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-50 flex-shrink-0 border border-zinc-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase">
                          {item.catagory.replace(/_/g, ' ')}
                        </p>
                        <h3 className="text-3xl font-black text-black tracking-tighter uppercase leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-black text-black tracking-tight">₹{item.discountprice}</p>
                        {item.originalprice > item.discountprice && (
                          <p className="text-sm font-bold text-zinc-300 line-through tracking-tight">₹{item.originalprice}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Color</span>
                        <span className="text-[10px] font-black text-black uppercase tracking-wider">{item.colour}</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Size</span>
                        <span className="text-[10px] font-black text-black uppercase tracking-wider">{item.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-50">
                    <Link 
                      href={`/${item.link}`}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all hover:translate-x-1"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="bg-black text-white p-12 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] space-y-12 border border-white/5">
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Checkout Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Subtotal</span>
                  <span className="text-xl font-bold tracking-tight">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Shipping</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Complimentary</span>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-black uppercase tracking-[0.4em]">Total</span>
                  <span className="text-4xl font-black tracking-tighter">₹{totalPrice}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-white text-black h-18 py-6 rounded-[1.5rem] font-black text-[11px] tracking-[0.4em] uppercase hover:bg-zinc-100 transition-all shadow-xl active:scale-95">
                  Process Order
                </button>
                <Link 
                  href="/shop"
                  className="block w-full text-center py-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                >
                  Continue Browsing
                </Link>
              </div>

              <div className="pt-6 flex flex-col items-center gap-4 border-t border-white/5">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Secure Payment Protocol</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
