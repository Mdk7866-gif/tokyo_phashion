"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, ShoppingBag, Zap, CheckCircle, XCircle, Loader2 } from "lucide-react";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";

const DELIVERY_CHARGE = 49;
const COD_ADVANCE = 100;

// ── Razorpay script loader ────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void; on(e: string, cb: (r: unknown) => void): void };
  }
}
function loadRzpScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

interface VariantSize {
  id: string; size: string; discount_price: number; original_price: number; stock: number;
  product_variants: { id: string; color: string; product_images: { image_url: string; sort_order: number }[]; products: { id: string; name: string } };
}
interface UserProfile {
  id: string; name: string | null; email: string | null; mobile_number: string | null;
  address: { id: string; full_address: string; city: string; state: string; pincode: string } | null;
}
interface RzpData { razorpay_order_id: string; amount: number; currency: string; our_order_id: string }

type Step = "review" | "processing" | "success" | "failed";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isCartCheckout    = searchParams.get("cart_checkout") === "true";
  const variantSizeId     = searchParams.get("variant_size_id") ?? "";
  const productId         = searchParams.get("product_id") ?? "";
  const productVariantId  = searchParams.get("product_variant_id") ?? "";
  const quantity          = Math.max(1, parseInt(searchParams.get("quantity") ?? "1", 10) || 1);
  const quantitiesRaw     = searchParams.get("quantities") ?? "{}";
  const paymentMethod     = (searchParams.get("payment_method") ?? "online") as "cod" | "online";

  const [step, setStep]               = useState<Step>("review");
  const [loadingData, setLoadingData] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState<{ variantSize: VariantSize, quantity: number }[]>([]);
  const [user, setUser]               = useState<UserProfile | null>(null);
  const [successMsg, setSuccessMsg]   = useState("");
  const [alert, setAlert]             = useState<{ isOpen: boolean; title: string; message: string; type: "success"|"error"|"info"|"warning" }>({ isOpen: false, title: "", message: "", type: "info" });
  const [isRetry, setIsRetry]         = useState(false);

  // Keep a single razorpay order across retries — never create a new one on retry
  const rzpDataRef = useRef<RzpData | null>(null);
  const openingRef = useRef(false); // guard against double-click

  const showAlert = useCallback((title: string, message: string, type: "success"|"error"|"info"|"warning" = "info") => {
    setAlert({ isOpen: true, title, message, type });
  }, []);

  // Load user + products
  useEffect(() => {
    if (!isCartCheckout && (!variantSizeId || !productId || !productVariantId)) { router.replace("/"); return; }
    (async () => {
      try {
        const fetchPromises: Promise<Response>[] = [fetch("/api/user/me")];
        if (isCartCheckout) {
          fetchPromises.push(fetch("/api/user/getcart"));
        } else {
          fetchPromises.push(fetch(`/api/user/getvariantsize?id=${variantSizeId}`));
        }
        const [meRes, dataRes] = await Promise.all(fetchPromises);
        const meJson = await meRes.json();
        if (!meJson.user) { router.replace(`/login?redirectTo=${encodeURIComponent(window.location.href)}`); return; }
        setUser(meJson.user);
        if (dataRes.ok) { 
          const dataJson = await dataRes.json(); 
          if (isCartCheckout) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let qtyMap: Record<string, number> = {};
            try { qtyMap = JSON.parse(quantitiesRaw); } catch { qtyMap = {}; }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items = (dataJson.data || []).map((ci: any) => {
              const vs = ci.variant_sizes;
              const pv = vs?.product_variants;
              return {
                quantity: qtyMap[ci.id] || 1,
                variantSize: {
                  id: vs.id,
                  size: vs.size,
                  discount_price: vs.discount_price,
                  original_price: vs.original_price,
                  stock: vs.stock ?? 0,
                  product_variants: {
                    id: pv.id,
                    color: pv.color,
                    product_images: pv.product_images ?? [],
                    products: { id: pv.products.id, name: pv.products.name },
                  },
                },
              };
            });
            if (items.length === 0) {
              router.replace("/dashboard?tab=my%20cart");
              return;
            }
            setCheckoutItems(items);
          } else {
            setCheckoutItems([{ variantSize: dataJson.data, quantity }]);
          }
        }
      } catch (e) { console.error(e); showAlert("Error", "Failed to load checkout data.", "error"); }
      finally { setLoadingData(false); }
    })();
  }, [isCartCheckout, variantSizeId, productId, productVariantId, quantity, router, showAlert]);

  const subtotal = checkoutItems.reduce((acc, item) => acc + (item.variantSize.discount_price ?? item.variantSize.original_price) * item.quantity, 0);
  const total = subtotal + DELIVERY_CHARGE;
  const amountNow = paymentMethod === "cod" ? Math.min(total, COD_ADVANCE) : total;

  // Open the Razorpay modal with given data
  const openRazorpayModal = useCallback(async (data: RzpData) => {
    if (openingRef.current) return;
    openingRef.current = true;
    try {
      const loaded = await loadRzpScript();
      if (!loaded) { showAlert("Error", "Could not load payment gateway. Check your internet connection.", "error"); return; }

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKey) { showAlert("Error", "Payment gateway not configured.", "error"); return; }

      const rzp = new window.Razorpay({
        key: rzpKey,
        amount: data.amount,
        currency: data.currency,
        name: "Tokyo Fashion",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        prefill: { name: user?.name ?? "", email: user?.email ?? "", contact: user?.mobile_number ?? "" },
        theme: { color: "#000000" },
        handler: async (response: unknown) => {
          const res = response as { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpay_payment_id: res.razorpay_payment_id, razorpay_order_id: res.razorpay_order_id, razorpay_signature: res.razorpay_signature, our_order_id: data.our_order_id }),
            });
            const vData = await verifyRes.json();
            if (!verifyRes.ok || !vData.success) { setStep("failed"); return; }
            setSuccessMsg(vData.message);
            setStep("success");
          } catch { setStep("failed"); }
        },
        modal: {
          ondismiss: async () => {
            // Mark as failed in DB when user closes modal
            try {
              await fetch("/api/razorpay/cancel-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ our_order_id: data.our_order_id }),
              });
            } catch { /* non-fatal */ }
            openingRef.current = false;
            setStep("review");
          },
        },
      });

      rzp.on("payment.failed", async () => {
        openingRef.current = false;
        // Mark payment as failed in DB (best-effort)
        try {
          await fetch("/api/razorpay/cancel-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ our_order_id: data.our_order_id }),
          });
        } catch { /* non-fatal */ }
        showAlert("Payment Failed", "Your payment could not be processed. You can retry using the same order.", "error");
        setStep("review");
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      openingRef.current = false;
      showAlert("Error", "An error occurred while opening the payment gateway.", "error");
    }
  }, [user, showAlert]);

  // Main CTA handler — creates order ONCE, then opens modal; on retry reuses existing order
  const handleConfirmAndPay = useCallback(async () => {
    if (openingRef.current) return;
    if (!user?.address) { showAlert("No Address", "Please add a delivery address in your profile first.", "warning"); return; }

    // RETRY: reuse existing Razorpay order — do NOT call create-order again
    if (rzpDataRef.current) {
      await openRazorpayModal(rzpDataRef.current);
      return;
    }

    setStep("processing");
    try {
      const payloadItems = checkoutItems.map(i => ({
        variant_size_id: i.variantSize.id,
        product_id: i.variantSize.product_variants.products.id,
        product_variant_id: i.variantSize.product_variants.id,
        quantity: i.quantity
      }));
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: paymentMethod, items: payloadItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStep("review");
        showAlert("Order Failed", data.error || "Failed to create order.", "error");
        return;
      }
      const rzpData: RzpData = { razorpay_order_id: data.razorpay_order_id, amount: data.amount, currency: data.currency, our_order_id: data.our_order_id };
      rzpDataRef.current = rzpData; // store for retries
      setIsRetry(true);
      setStep("review");
      await openRazorpayModal(rzpData);
    } catch (e) {
      console.error(e);
      setStep("review");
      showAlert("Error", "An unexpected error occurred. Please try again.", "error");
    }
  }, [user, paymentMethod, checkoutItems, openRazorpayModal, showAlert]);

  if (loadingData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;

  if (step === "success") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" strokeWidth={1.5} />
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-3">Order Confirmed!</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-sm">{successMsg}</p>
      {paymentMethod === "cod" && (
        <div className="mb-8 border border-dashed border-zinc-300 p-4 max-w-sm w-full text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">COD Note</p>
          <p className="text-xs text-zinc-600">₹{amountNow} advance paid. Remaining <span className="font-bold">₹{(total - amountNow).toFixed(0)}</span> payable at delivery.</p>
        </div>
      )}
      <Link href="/dashboard?tab=my%20orders" className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">View My Orders</Link>
    </div>
  );

  if (step === "failed") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <XCircle className="h-20 w-20 text-red-500 mb-6" strokeWidth={1.5} />
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-3">Payment Failed</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-sm">Payment signature verification failed. If money was debited it will be refunded within 5-7 days.</p>
      <button onClick={() => setStep("review")} className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">Try Again</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-black pb-24">
      <AlertMessagePopUp isOpen={alert.isOpen} onClose={() => setAlert({ ...alert, isOpen: false })} title={alert.title} message={alert.message} type={alert.type} />

      <div className="border-b border-black">
        <div className="mx-auto max-w-screen-lg px-4 py-4 sm:px-6">
          {isCartCheckout ? (
            <Link href="/dashboard?tab=my%20cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Cart
            </Link>
          ) : (
            <Link href={`/detailedproduct?product_id=${productId}&variant_id=${productVariantId}&size_id=${variantSizeId}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
              <ArrowLeft className="h-3 w-3" /> Back to Product
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-screen-lg px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-400">Your Order</h2>
              <div className="space-y-4">
                {checkoutItems.map((item, idx) => {
                  const images = item.variantSize.product_variants.product_images ?? [];
                  const thumbUrl = [...images].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ?? null;
                  return (
                    <div key={idx} className="border border-black p-4 flex gap-4">
                      {thumbUrl ? (
                        <div className="relative h-24 w-20 shrink-0 border border-zinc-200 overflow-hidden">
                          <Image src={thumbUrl} alt={item.variantSize.product_variants.products.name} fill sizes="80px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-24 w-20 shrink-0 border border-zinc-200 bg-zinc-50 flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-zinc-300" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase italic tracking-tighter text-lg leading-tight">{item.variantSize.product_variants.products.name}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{item.variantSize.product_variants.color} · Size {item.variantSize.size}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Qty: {item.quantity}</span>
                          <span className="font-black text-sm">₹{((item.variantSize.discount_price ?? item.variantSize.original_price) * item.quantity).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="border border-black p-4 space-y-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-400">Price Details</h2>
              <div className="flex justify-between text-sm"><span className="text-zinc-600">Subtotal</span><span className="font-bold">₹{subtotal.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-600">Delivery Charge</span><span className="font-bold">₹{DELIVERY_CHARGE}</span></div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between"><span className="font-black uppercase text-xs tracking-widest">Total</span><span className="font-black text-lg">₹{total.toFixed(0)}</span></div>
              {paymentMethod === "cod" && (
                <div className="bg-zinc-50 border border-dashed border-zinc-300 p-3 mt-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">COD Advance</p>
                  <p className="text-xs text-zinc-600">Pay <span className="font-black text-black">₹{amountNow.toFixed(0)}</span> now · Remaining <span className="font-bold">₹{(total - amountNow).toFixed(0)}</span> at delivery.</p>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="border border-black p-4">
              <div className="flex items-center gap-2 mb-3"><MapPin className="h-4 w-4" /><h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivering To</h2></div>
              {user?.address ? (
                <div>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-zinc-600 mt-1">{user.address.full_address}</p>
                  <p className="text-xs text-zinc-600">{user.address.city}, {user.address.state} – {user.address.pincode}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-red-500 font-bold mb-2">No delivery address found.</p>
                  <Link href="/dashboard?tab=profile" className="text-[10px] font-black uppercase tracking-widest underline">Add Address →</Link>
                </div>
              )}
            </div>

            {/* Method */}
            <div className="border border-black p-4 flex items-center gap-3">
              {paymentMethod === "online" ? <><Zap className="h-4 w-4 fill-current" /><div><p className="text-[10px] font-black uppercase tracking-widest">Pay Online</p><p className="text-[9px] text-zinc-500">Full amount ₹{total} via Razorpay</p></div></> : <><ShoppingBag className="h-4 w-4" /><div><p className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</p><p className="text-[9px] text-zinc-500">₹{amountNow} advance · ₹{(total - amountNow).toFixed(0)} at delivery</p></div></>}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 border border-black p-6 space-y-4">
              <div className="mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Amount to pay now</p>
                <p className="text-3xl font-black">₹{amountNow.toFixed(0)}</p>
                {paymentMethod === "cod" && <p className="text-[9px] text-zinc-400 mt-1">+ ₹{(total - amountNow).toFixed(0)} at delivery</p>}
              </div>

              <button
                id="checkout-confirm-btn"
                onClick={handleConfirmAndPay}
                disabled={step === "processing" || !user?.address}
                className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all border border-black ${
                  step === "processing" || !user?.address
                    ? "opacity-40 cursor-not-allowed bg-zinc-100 text-zinc-400"
                    : "bg-black text-white hover:bg-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
                }`}
              >
                {step === "processing" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Processing…</>
                ) : isRetry ? (
                  <><Zap className="h-4 w-4 fill-current" />Retry Payment ₹{amountNow.toFixed(0)}</>
                ) : (
                  <><Zap className="h-4 w-4 fill-current" />Confirm &amp; Pay ₹{amountNow.toFixed(0)}</>
                )}
              </button>

              <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 pt-2">Secured by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
