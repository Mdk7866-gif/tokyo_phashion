"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, XCircle } from "lucide-react";

interface OrderItem { id: string; quantity: number; price_snapshot: number; product_name_snapshot: string; color_snapshot: string; size_snapshot: string }
interface Order {
  id: string; total_amount: number; payment_method: string; cancelled_by: string | null;
  cancellation_note: string | null; created_at: string;
  users: { name: string | null; email: string | null; mobile_number: string | null };
  order_items: OrderItem[];
  snapshot_order_full_address: string; snapshot_order_city: string; snapshot_order_state: string; snapshot_order_pincode: string;
}

export default function DeliveryCancelledPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders?status=cancelled").then(r => r.json()).then(d => {
      setOrders(d.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-500" /> Cancelled Orders
          </h1>
          <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-red-500 text-white px-3 py-1">{orders.length} Cancelled</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No cancelled orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer</p>
                    <p className="text-xs font-black">{order.users?.name ?? "—"}</p>
                    <p className="text-[10px] text-zinc-400">{order.users?.email}</p>
                    <p className="text-[10px] text-zinc-400">{order.users?.mobile_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Order Value</p>
                    <p className="text-sm font-black">₹{order.total_amount}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 ${order.cancelled_by === "user" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                      By {order.cancelled_by ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="p-4 border-b border-zinc-100">
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Shipping Address</p>
                  <p className="text-[10px] text-zinc-600">{order.snapshot_order_full_address}</p>
                  <p className="text-[10px] text-zinc-600">{order.snapshot_order_city}, {order.snapshot_order_state} – {order.snapshot_order_pincode}</p>
                </div>

                {order.cancellation_note && (
                  <div className="px-4 py-3 border-b border-zinc-100 bg-red-50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Cancellation Reason</p>
                    <p className="text-[10px] text-red-600">{order.cancellation_note}</p>
                  </div>
                )}

                <div className="p-4 space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2">Items</p>
                  {order.order_items.map(item => (
                    <div key={item.id} className="flex justify-between text-[10px]">
                      <span className="text-zinc-600">{item.product_name_snapshot} · {item.color_snapshot} · {item.size_snapshot} × {item.quantity}</span>
                      <span className="font-bold">₹{item.price_snapshot * item.quantity}</span>
                    </div>
                  ))}
                  <p className="text-[9px] text-zinc-400 pt-2">Cancelled on {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
