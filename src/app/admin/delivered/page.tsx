"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, CheckCircle, Star, ChevronDown, ChevronUp } from "lucide-react";

interface Review { id: string; rating: number; comment: string | null; created_at: string; users: { name: string | null } }
interface OrderItem { id: string; quantity: number; price_snapshot: number; product_name_snapshot: string; color_snapshot: string; size_snapshot: string; product_id: string }
interface Order {
  id: string; total_amount: number; tracking_id: string | null; parcel_image: string | null; created_at: string;
  users: { name: string | null; email: string | null };
  order_items: OrderItem[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3 w-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`} />
      ))}
    </div>
  );
}

function DeliveredCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const loadReviews = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    setLoadingReviews(true);
    const productIds = [...new Set(order.order_items.map(i => i.product_id))];
    const entries = await Promise.all(productIds.map(async pid => {
      const res = await fetch(`/api/user/reviews?product_id=${pid}`);
      const data = await res.json();
      return [pid, data.data ?? []] as [string, Review[]];
    }));
    setReviews(Object.fromEntries(entries));
    setLoadingReviews(false);
  };

  return (
    <div className="bg-white border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between p-4 border-b border-zinc-100">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer</p>
          <p className="text-xs font-black">{order.users?.name ?? "—"}</p>
          <p className="text-[10px] text-zinc-400">{order.users?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Paid</p>
          <p className="text-sm font-black">₹{order.total_amount}</p>
          <p className="text-[9px] text-zinc-400">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {order.parcel_image && (
        <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
          <div className="relative h-16 w-16 border border-zinc-200 overflow-hidden">
            <Image src={order.parcel_image} alt="Parcel" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tracking ID</p>
            <p className="text-xs font-bold">{order.tracking_id ?? "—"}</p>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="space-y-1 mb-3">
          {order.order_items.map(item => (
            <div key={item.id} className="flex justify-between text-[10px]">
              <span className="text-zinc-600">{item.product_name_snapshot} · {item.color_snapshot} · {item.size_snapshot} × {item.quantity}</span>
              <span className="font-bold">₹{item.price_snapshot * item.quantity}</span>
            </div>
          ))}
        </div>
        <button onClick={loadReviews}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-black px-3 py-2 hover:bg-zinc-50 transition-colors w-full justify-center">
          <Star className="h-3 w-3" />
          {expanded ? "Hide Reviews" : "View Customer Reviews"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {loadingReviews ? (
              <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-zinc-300" /></div>
            ) : (
              order.order_items.map(item => {
                const itemReviews = reviews[item.product_id] ?? [];
                return (
                  <div key={item.id} className="border border-zinc-100 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{item.product_name_snapshot}</p>
                    {itemReviews.length === 0 ? (
                      <p className="text-[10px] text-zinc-300 italic">No review yet</p>
                    ) : itemReviews.map(r => (
                      <div key={r.id} className="mt-2">
                        <div className="flex items-center gap-2">
                          <StarRating rating={r.rating} />
                          <span className="text-[9px] text-zinc-400">{r.users?.name}</span>
                        </div>
                        {r.comment && <p className="text-[10px] text-zinc-600 mt-1">&quot;{r.comment}&quot;</p>}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeliveredPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders?status=delivered").then(r => r.json()).then(d => {
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
            <CheckCircle className="h-6 w-6 text-green-600" /> Delivered Orders
          </h1>
          <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-green-600 text-white px-3 py-1">{orders.length} Delivered</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No delivered orders yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map(o => <DeliveredCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}
