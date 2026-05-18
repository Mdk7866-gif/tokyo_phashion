"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Send, Star, ChevronDown, ChevronUp, CreditCard, Truck, Package, ZoomIn } from "lucide-react";
import ImageZoomPopUp from "@/components/ImageZoomPopUp";

const TABS = [
  { key: "online", label: "Paid Online", icon: CreditCard, color: "bg-blue-600" },
  { key: "cod",    label: "Paid COD",    icon: Truck,       color: "bg-amber-500" },
];

interface Review { id: string; rating: number; comment: string | null; created_at: string; users: { name: string | null } }
interface OrderItem {
  id: string; quantity: number; price_snapshot: number;
  product_name_snapshot: string; color_snapshot: string; size_snapshot: string;
  product_id: string; product_variant_id: string;
  product_variants: { product_images: { image_url: string }[] } | null;
}
interface Order {
  id: string; total_amount: number; payment_method: string; tracking_id: string | null;
  parcel_image: string | null; created_at: string;
  snapshot_order_full_address: string; snapshot_order_city: string;
  snapshot_order_state: string; snapshot_order_pincode: string;
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

// Brutalist Reusable Image Loader Component
function ImageWithLoader({ src, alt, fill, sizes, className }: { src: string; alt: string; fill?: boolean; sizes?: string; className?: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className={`relative w-full h-full overflow-hidden ${loading ? "bg-zinc-100 animate-pulse" : "bg-white"}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        onLoad={() => setLoading(false)}
        className={`${className} transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}

function DispatchedCard({ order, onZoomParcel }: { order: Order; onZoomParcel: (url: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [review, setReview] = useState<Review | null | undefined>(undefined);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const loadReviews = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (review !== undefined) return;
    setLoadingReviews(true);
    const res = await fetch(`/api/user/reviews?order_id=${order.id}`);
    const data = await res.json();
    setReview(data.data?.[0] ?? null);
    setLoadingReviews(false);
  };

  return (
    <div className="bg-white border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer</p>
            <p className="text-xs font-black">{order.users?.name ?? "—"}</p>
            <p className="text-[10px] text-zinc-500">{order.users?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Paid</p>
            <p className="text-sm font-black">₹{order.total_amount}</p>
            <p className="text-[9px] text-zinc-400">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-100">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Order ID</p>
          <p className="text-[9px] font-mono font-black break-all text-black">{order.id}</p>
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-100">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Shipped To</p>
          <p className="text-[10px] text-zinc-700 font-medium leading-snug">{order.snapshot_order_full_address}, {order.snapshot_order_city}, {order.snapshot_order_state} – {order.snapshot_order_pincode}</p>
        </div>
        {/* Dispatched badge */}
        <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center gap-2">
          <Send className="h-3 w-3 text-green-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-green-700">Dispatched via Courier</span>
        </div>
      </div>

      {/* Parcel + Tracking */}
      {(order.parcel_image || order.tracking_id) && (
        <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
          {order.parcel_image && (
            <button
              onClick={() => onZoomParcel(order.parcel_image!)}
              className="relative h-16 w-16 border border-zinc-200 overflow-hidden shrink-0 hover:border-black transition-colors group cursor-zoom-in bg-zinc-50"
              title="Click to zoom"
            >
              <ImageWithLoader src={order.parcel_image} alt="Parcel" fill sizes="64px" className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          )}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Tracking ID</p>
            <p className="text-xs font-bold text-black">{order.tracking_id ?? "—"}</p>
          </div>
        </div>
      )}

      {/* Items with thumbnails */}
      <div className="p-4 border-b border-zinc-100">
        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2">Items Ordered</p>
        <div className="space-y-1 mb-3">
          {order.order_items.map(item => {
            const imgUrl = item.product_variants?.product_images?.[0]?.image_url;
            return (
              <Link key={item.id} href={`/detailedproduct?product_id=${item.product_id}&variant_id=${item.product_variant_id}&size=${encodeURIComponent(item.size_snapshot)}`} target="_blank"
                className="flex items-center gap-3 text-[10px] py-1.5 px-2 border border-zinc-100 hover:border-black hover:bg-zinc-50 transition-all group">
                <div className="relative h-10 w-8 shrink-0 border border-zinc-200 bg-zinc-50 overflow-hidden">
                  {imgUrl ? (
                    <ImageWithLoader src={imgUrl} alt={item.product_name_snapshot} fill sizes="32px" className="object-cover" />
                  ) : (
                    <Package className="h-4 w-4 text-zinc-300 m-auto mt-3" />
                  )}
                </div>
                <span className="flex-1 text-zinc-700 group-hover:text-black group-hover:underline">{item.product_name_snapshot} · {item.color_snapshot} · {item.size_snapshot} × {item.quantity}</span>
                <span className="font-black text-black shrink-0">₹{item.price_snapshot * item.quantity}</span>
              </Link>
            );
          })}
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
            ) : review === null ? (
              <p className="text-[10px] text-zinc-400 italic">No review submitted yet for this order.</p>
            ) : review ? (
              <div className="border border-zinc-100 p-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-[9px] text-zinc-500 font-bold">{review.users?.name}</span>
                </div>
                {review.comment && <p className="text-[10px] text-zinc-700 mt-1 font-medium">&ldquo;{review.comment}&rdquo;</p>}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function DispatchedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "online";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevTab, setPrevTab] = useState(tab);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (tab !== prevTab) { setPrevTab(tab); setLoading(true); }

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders?status=dispatched&payment_method=${tab}`);
      const d = await res.json();
      setOrders(d.data || []);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchOrders(); }, [tab, fetchOrders]);

  const activeMeta = TABS.find(t => t.key === tab) ?? TABS[0];

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Send className="h-6 w-6 text-green-600" /> Dispatched Orders
          </h1>
          <span className={`ml-auto text-[10px] font-black uppercase tracking-widest ${activeMeta.color} text-white px-3 py-1`}>
            {orders.length} {activeMeta.label}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 pb-4">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => router.push(`/admin/dispatched?tab=${t.key}`)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${tab === t.key ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-50'}`}
              >
                <Icon className="h-3 w-3" />
                {t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300">
            <Package className="h-8 w-8 mx-auto mb-3 text-zinc-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No dispatched orders in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map(o => <DispatchedCard key={o.id} order={o} onZoomParcel={setZoomedImage} />)}
          </div>
        )}
      </div>

      <ImageZoomPopUp
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage ?? ""}
        alt="Parcel Zoom"
      />
    </div>
  );
}

export default function DispatchedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>}>
      <DispatchedContent />
    </Suspense>
  );
}
