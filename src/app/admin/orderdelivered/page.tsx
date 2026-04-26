"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminOrderDeliveredPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orderreceived?status=delivered");
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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Orders Delivered</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No delivered orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order._id || idx} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-zinc-50/50 border-b border-zinc-100 flex flex-wrap justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Date</p>
                  <p className="text-sm font-black">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Delivered On</p>
                  <p className="text-sm font-black text-emerald-600">{order.updated_at ? new Date(order.updated_at).toLocaleString() : "N/A"}</p>
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
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Delivered
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
                    {order.items && order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
                         <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 relative border border-zinc-100">
                            {item.image && <Image src={item.image} alt={item.name || ""} fill className="object-cover" />}
                         </div>
                         <div>
                            <h5 className="text-xs font-bold uppercase truncate max-w-[200px]" title={item.name}>{item.name || "Fashion Item"}</h5>
                            <p className="text-[10px] text-zinc-500 uppercase mt-1 font-bold">Qty: {item.quantity || 1} • Size: {item.size || "M"} • Color: {item.colour}</p>
                            <p className="text-xs font-black mt-1 text-black">₹{item.discountprice || item.originalprice}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {(order.review_stars || order.review_comment) && (
                <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100">
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Customer Review</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500 font-bold text-sm">★ {order.review_stars}</span>
                  </div>
                  <p className="text-xs text-zinc-700 italic font-medium">"{order.review_comment}"</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
