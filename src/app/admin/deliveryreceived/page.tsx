"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Package, MapPin, Upload, CheckCircle, XCircle, ChevronDown, ChevronUp, CreditCard, Truck, AlertCircle } from "lucide-react";

interface OrderItem {
  id: string; quantity: number; price_snapshot: number;
  product_name_snapshot: string; color_snapshot: string; size_snapshot: string;
  product_id: string;
  product_variants: {
    product_images: { image_url: string }[];
  };
}
interface Order {
  id: string; total_amount: number; payment_method: string; payment_status: string;
  delivery_status: string; created_at: string;
  tracking_id: string | null; parcel_image: string | null;
  snapshot_order_full_address: string; snapshot_order_city: string;
  snapshot_order_state: string; snapshot_order_pincode: string;
  cancellation_note: string | null; cancelled_by: string | null;
  users: { name: string | null; email: string | null; mobile_number: string | null };
  order_items: OrderItem[];
}

const TABS = [
  { key: "paid",      label: "Paid Online",   icon: CreditCard,    color: "bg-blue-600" },
  { key: "cod",       label: "Pending COD",   icon: Truck,         color: "bg-amber-500" },
  { key: "cancelled", label: "Cancelled",     icon: XCircle,       color: "bg-zinc-600" },
  { key: "failed",    label: "Failed Payment",icon: AlertCircle,   color: "bg-red-500" },
];

function OrderCard({ order, onUpdate, readOnly }: { order: Order; onUpdate: () => void; readOnly?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [trackingId, setTrackingId] = useState(order.tracking_id ?? "");
  const [parcelImg, setParcelImg] = useState(order.parcel_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "tokyo_fashion");
    const res = await fetch("https://api.cloudinary.com/v1_1/" + process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + "/image/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    return data.secure_url as string;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    setParcelImg(url);
  };

  const handleSaveTracking = async () => {
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id, tracking_id: trackingId, parcel_image: parcelImg }),
    });
    setSaving(false);
    alert("Tracking info saved!");
  };

  const handleDeliver = async () => {
    if (!confirm("Mark this order as DELIVERED?")) return;
    setDelivering(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id, delivery_status: "delivered" }),
    });
    setDelivering(false);
    onUpdate();
  };

  const handleCancel = async () => {
    const note = prompt("Reason for cancellation (shown to customer):");
    if (note === null) return;
    setCancelling(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id, delivery_status: "cancelled", cancellation_note: note }),
    });
    setCancelling(false);
    onUpdate();
  };

  return (
    <div className="bg-white border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-100">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Order ID</p>
          <p className="text-xs font-black">{order.id.slice(0, 16)}...</p>
          <p className="text-[9px] text-zinc-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total</p>
          <p className="text-sm font-black">₹{order.total_amount}</p>
          <span className={`text-[8px] font-black uppercase px-2 py-0.5 ${order.payment_method === "online" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
            {order.payment_method === "online" ? "Online" : "COD"}
          </span>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="ml-4 p-1 border border-zinc-200 hover:border-black transition-colors">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Customer + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border-b border-zinc-100">
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Customer</p>
          <p className="text-xs font-bold">{order.users?.name ?? "—"}</p>
          <p className="text-[10px] text-zinc-500">{order.users?.email}</p>
          <p className="text-[10px] text-zinc-500">{order.users?.mobile_number}</p>
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Ship To</p>
          <p className="text-[10px] text-zinc-600">{order.snapshot_order_full_address}</p>
          <p className="text-[10px] text-zinc-600">{order.snapshot_order_city}, {order.snapshot_order_state} – {order.snapshot_order_pincode}</p>
        </div>
      </div>

      {/* Cancellation note (for cancelled tab) */}
      {order.delivery_status === "cancelled" && order.cancellation_note && (
        <div className="px-4 py-3 border-b border-zinc-100 bg-red-50">
          <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Cancellation Reason</p>
          <p className="text-[10px] text-red-600">{order.cancellation_note} — by {order.cancelled_by}</p>
        </div>
      )}

      {/* Order Items — always visible summary, expanded for full detail */}
      <div className="p-4 border-b border-zinc-100">
        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2">Items Ordered</p>
        <div className="space-y-2">
          {order.order_items.slice(0, expanded ? undefined : 2).map(item => {
            const itemImg = item.product_variants?.product_images?.[0]?.image_url;
            return (
              <Link
                key={item.id}
                href={`/detailedproduct?product_id=${item.product_id}`}
                target="_blank"
                className="flex items-center gap-3 text-[10px] border border-zinc-100 p-2 hover:border-black hover:bg-zinc-50 transition-all group"
              >
                <div className="relative h-10 w-10 shrink-0 border border-zinc-200 bg-white overflow-hidden">
                  {itemImg ? (
                    <Image src={itemImg} alt="Product" fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold group-hover:underline">{item.product_name_snapshot}</p>
                  <p className="text-zinc-400">{item.color_snapshot} · {item.size_snapshot} · Qty {item.quantity}</p>
                </div>
                <p className="font-black">₹{item.price_snapshot * item.quantity}</p>
              </Link>
            );
          })}
          {order.order_items.length > 2 && !expanded && (
            <p className="text-[9px] text-zinc-400 font-bold text-center">+ {order.order_items.length - 2} more item(s)</p>
          )}
        </div>
      </div>

      {/* Tracking — only for active dispatch tabs */}
      {!readOnly && (
        <div className="p-4 space-y-3">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Courier Info</p>
          <input value={trackingId} onChange={e => setTrackingId(e.target.value)}
            placeholder="Paste tracking ID (e.g. Shiprocket #)"
            className="w-full border border-black px-3 py-2 text-xs font-bold focus:outline-none" />

          <div className="flex items-center gap-3 flex-wrap">
            <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 border border-black px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50">
              <Upload className="h-3 w-3" />{uploading ? "Uploading..." : "Upload Parcel Photo"}
            </button>
            {parcelImg && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Parcel Photo Preview</p>
                <div className="relative h-48 w-full border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                  <Image src={parcelImg} alt="Parcel" fill sizes="(max-width: 768px) 100vw, 500px" className="object-contain" />
                </div>
                <p className="text-[9px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Photo successfully linked to order
                </p>
              </div>
            )}
          </div>

          <button onClick={handleSaveTracking} disabled={saving}
            className="w-full border border-zinc-400 py-2 text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors disabled:opacity-40">
            {saving ? "Saving..." : "Save Tracking Info"}
          </button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button onClick={handleDeliver} disabled={delivering}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-40">
              <CheckCircle className="h-3.5 w-3.5" />{delivering ? "..." : "Mark Delivered"}
            </button>
            <button onClick={handleCancel} disabled={cancelling}
              className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-40">
              <XCircle className="h-3.5 w-3.5" />{cancelling ? "..." : "Cancel Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DeliveryReceivedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "paid";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${tab}`).then(r => r.json()).then(d => {
      setOrders(d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const activeTabMeta = TABS.find(t => t.key === tab) ?? TABS[0];
  const isReadOnly = tab === "failed" || tab === "cancelled";

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Package className="h-6 w-6" /> Orders
          </h1>
          <span className={`ml-auto text-[10px] font-black uppercase tracking-widest ${activeTabMeta.color} text-white px-3 py-1`}>
            {orders.length} {activeTabMeta.label}
          </span>
        </div>

        {/* 4 Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 pb-4">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => router.push(`/admin/deliveryreceived?tab=${t.key}`)}
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
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No orders in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onUpdate={fetchOrders} readOnly={isReadOnly} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeliveryReceivedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>}>
      <DeliveryReceivedContent />
    </Suspense>
  );
}
