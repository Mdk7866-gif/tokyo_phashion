"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminOrderReceivedPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orderreceived?status=in progress");
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

  const handleMarkDelivered = async (orderId: string) => {
    if (!confirm("Are you sure you want to mark this order as delivered?")) return;
    
    try {
      const res = await fetch("/api/admin/orderreceived", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "delivered" })
      });
      
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Failed to update order", error);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Orders Received (In Progress)</h1>
        <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md">
          Total Received: {orders.length}
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No orders currently in progress.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order._id || idx} className="bg-white rounded-3xl border-2 border-zinc-200 shadow-md overflow-hidden">
              <div className="p-4 md:p-6 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Date</p>
                  <p className="text-sm font-black">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Customer Info</p>
                  <p className="text-sm font-bold uppercase">{order.customer_name || "Unknown"}</p>
                  <p className="text-xs font-bold text-zinc-500">{order.mobile_no}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-lg font-black text-emerald-600">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Delivery Type</p>
                  <p className="text-xs font-bold uppercase">{order.delivery_type}</p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleMarkDelivered(order._id)}
                    className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-md"
                  >
                    Mark as Delivered
                  </button>
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
                  <p className="text-xs text-zinc-700 italic">"{order.review_comment}"</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
