"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Package, MapPin, Upload, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  id: string; quantity: number; price_snapshot: number;
  product_name_snapshot: string; color_snapshot: string; size_snapshot: string;
}
interface Order {
  id: string; total_amount: number; payment_method: string; created_at: string;
  tracking_id: string | null; parcel_image: string | null;
  snapshot_order_full_address: string; snapshot_order_city: string;
  snapshot_order_state: string; snapshot_order_pincode: string;
  users: { name: string | null; email: string | null; mobile_number: string | null };
  order_items: OrderItem[];
}

function OrderCard({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
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
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total</p>
          <p className="text-sm font-black">₹{order.total_amount}</p>
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

      {/* Order Items */}
      {expanded && (
        <div className="p-4 border-b border-zinc-100">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2">Items</p>
          <div className="space-y-2">
            {order.order_items.map(item => (
              <div key={item.id} className="flex justify-between text-[10px] border border-zinc-100 p-2">
                <div>
                  <p className="font-bold">{item.product_name_snapshot}</p>
                  <p className="text-zinc-400">{item.color_snapshot} · {item.size_snapshot} · Qty {item.quantity}</p>
                </div>
                <p className="font-black">₹{item.price_snapshot * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking */}
      <div className="p-4 space-y-3">
        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Courier Info</p>
        <input value={trackingId} onChange={e => setTrackingId(e.target.value)}
          placeholder="Paste tracking ID (e.g. Shiprocket #)"
          className="w-full border border-black px-3 py-2 text-xs font-bold focus:outline-none" />

        <div className="flex items-center gap-3">
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 border border-black px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50">
            <Upload className="h-3 w-3" />{uploading ? "Uploading..." : "Upload Parcel Photo"}
          </button>
          {parcelImg && (
            <div className="relative h-12 w-12 border border-zinc-200 overflow-hidden">
              <Image src={parcelImg} alt="Parcel" fill sizes="48px" className="object-cover" />
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
    </div>
  );
}

export default function DeliveryReceivedPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    fetch("/api/admin/orders?status=paid").then(r => r.json()).then(d => {
      setOrders(d.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Package className="h-6 w-6" /> Delivery Received
          </h1>
          <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white px-3 py-1">{orders.length} Pending</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No pending deliveries</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
