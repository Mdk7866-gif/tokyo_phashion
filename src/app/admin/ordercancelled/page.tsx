"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  name: string;
  image?: string;
  quantity?: number;
  size?: string;
  colour?: string;
  discountprice?: number;
  originalprice?: number;
  link?: string;
}

interface AdminOrder {
  _id: string;
  created_at: string;
  updated_at?: string;
  customer_name: string;
  mobile_no: string;
  total_amount: number;
  user_address?: {
    full_address: string;
    cityname: string;
    statename: string;
    pincode: string;
  };
  items: OrderItem[];
}


export default function AdminOrderCancelledPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orderreceived?status=cancelled");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Orders Cancelled</h1>
        <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md">
          Total Cancelled: {orders.length}
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No cancelled orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order._id || idx} className="bg-white rounded-3xl border-2 border-zinc-200 shadow-md overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
              <div className="p-4 md:p-6 bg-rose-50/50 border-b border-zinc-200 flex flex-wrap justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Date</p>
                  <p className="text-sm font-black">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Cancelled On</p>
                  <p className="text-sm font-black text-rose-600">{order.updated_at ? new Date(order.updated_at).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Customer Info</p>
                  <p className="text-sm font-bold uppercase">{order.customer_name || "Unknown"}</p>
                  <p className="text-xs font-bold text-zinc-500">{order.mobile_no}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-lg font-black text-black">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Cancelled
                  </span>
                </div>
              </div>
              
              <div className="p-6 grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-4 border-b border-zinc-100 pb-2">Shipping Address</h4>
                  <p className="text-sm font-bold uppercase mb-1">{order.customer_name}</p>
                  <p className="text-xs text-zinc-600 font-medium whitespace-pre-wrap leading-relaxed">{order.user_address?.full_address}</p>
                  <p className="text-xs text-zinc-600 font-medium mt-1 uppercase">
                    {order.user_address?.cityname}, {order.user_address?.statename} - {order.user_address?.pincode}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-4 border-b border-zinc-100 pb-2">Order Items ({order.items?.length || 0})</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {order.items && order.items.map((item: OrderItem, i: number) => {
                      const cleanLink = item.link ? (item.link.startsWith('/') ? item.link : '/' + item.link).split('&cartid=')[0] : "/shop";
                      
                      return (
                        <Link key={i} href={cleanLink} className="block group/item">
                          <div className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 hover:bg-white hover:border-black transition-all shadow-sm group-hover/item:shadow-md">
                             <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 relative border border-zinc-100">
                                {item.image && (
                                  <Image src={item.image} alt={item.name || ""} fill className="object-cover transition-transform group-hover/item:scale-110" />
                                )}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h5 className="text-xs font-bold uppercase truncate" title={item.name}>{item.name || "Fashion Item"}</h5>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/item:opacity-100 transition-all text-black">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                  </svg>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase mt-1 font-bold">Qty: {item.quantity || 1} • Size: {item.size || "M"} • Color: {item.colour}</p>
                                <p className="text-xs font-black mt-1 text-black">₹{item.discountprice || item.originalprice}</p>
                             </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
