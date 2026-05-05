"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, ShoppingBag, Zap, CheckCircle, XCircle, Loader2 } from "lucide-react";
import RazorpayPayButton, { RazorpaySuccessResponse } from "@/components/RazorpayPayButton";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";

const DELIVERY_CHARGE = 49;
const COD_ADVANCE = 100;

interface VariantSize {
  id: string;
  size: string;
  discount_price: number;
  original_price: number;
  stock: number;
  product_variants: {
    id: string;
    color: string;
    product_images: { image_url: string; sort_order: number }[];
    products: { id: string; name: string };
  };
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  mobile_number: string | null;
  address: {
    id: string;
    full_address: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
}

type CheckoutStep = "review" | "paying" | "success" | "failed";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantSizeId = searchParams.get("variant_size_id") ?? "";
  const productId = searchParams.get("product_id") ?? "";
  const productVariantId = searchParams.get("product_variant_id") ?? "";
  const quantity = parseInt(searchParams.get("quantity") ?? "1", 10) || 1;
  const paymentMethod = (searchParams.get("payment_method") ?? "online") as "cod" | "online";

  const [step, setStep] = useState<CheckoutStep>("review");
  const [loadingData, setLoadingData] = useState(true);
  const [variantSize, setVariantSize] = useState<VariantSize | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [razorpayData, setRazorpayData] = useState<{
    razorpay_order_id: string;
    amount: number;
    currency: string;
    our_order_id: string;
  } | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: "success" | "error" | "info" | "warning" }>({
    isOpen: false, title: "", message: "", type: "info",
  });

  const showAlert = useCallback((title: string, message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setAlert({ isOpen: true, title, message, type });
  }, []);

  // Load user + product data
  useEffect(() => {
    const load = async () => {
      if (!variantSizeId || !productId || !productVariantId) {
        router.replace("/");
        return;
      }
      try {
        // Auth
        const meRes = await fetch("/api/user/me");
        const meJson = await meRes.json();
        if (!meJson.user) {
          router.replace(`/login?redirectTo=${encodeURIComponent(window.location.href)}`);
          return;
        }
        setUser(meJson.user);

        // Variant size details
        const vsRes = await fetch(`/api/user/getvariantsize?id=${variantSizeId}`);
        if (vsRes.ok) {
          const vsJson = await vsRes.json();
          setVariantSize(vsJson.data);
        }
      } catch (err) {
        console.error("Checkout load error:", err);
        showAlert("Error", "Failed to load checkout data. Please try again.", "error");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [variantSizeId, productId, productVariantId, router, showAlert]);

  const price = variantSize
    ? (variantSize.discount_price ?? variantSize.original_price)
    : 0;
  const subtotal = price * quantity;
  const total = subtotal + DELIVERY_CHARGE;

  // For COD: charge min(total, ₹100); for Online: charge full total
  const amountToPayNow = paymentMethod === "cod"
    ? Math.min(total, COD_ADVANCE)
    : total;
  const amountToPayNowPaise = Math.max(Math.round(amountToPayNow * 100), 100);

  const handleCreateOrder = async () => {
    if (!user?.address) {
      showAlert("No Address", "Please add a delivery address in your profile before placing an order.", "warning");
      return;
    }
    setCreatingOrder(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: paymentMethod,
          items: [{
            variant_size_id: variantSizeId,
            product_id: productId,
            product_variant_id: productVariantId,
            quantity,
          }],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showAlert("Order Failed", data.error || "Failed to create order. Please try again.", "error");
        return;
      }

      setRazorpayData({
        razorpay_order_id: data.razorpay_order_id,
        amount: data.amount,
        currency: data.currency,
        our_order_id: data.our_order_id,
      });
      setStep("paying");
    } catch (err) {
      console.error("Create order error:", err);
      showAlert("Error", "An unexpected error occurred. Please try again.", "error");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse, ourOrderId: string) => {
    try {
      const verifyRes = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          our_order_id: ourOrderId,
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setStep("failed");
        return;
      }

      setSuccessMessage(verifyData.message);
      setStep("success");
    } catch (err) {
      console.error("Verify payment error:", err);
      setStep("failed");
    }
  };

  const handlePaymentError = (message: string) => {
    showAlert("Payment Error", message, "error");
    setStep("review");
  };

  const handlePaymentDismiss = () => {
    setStep("review");
    setRazorpayData(null);
  };

  const productName = variantSize?.product_variants?.products?.name ?? "Product";
  const color = variantSize?.product_variants?.color ?? "";
  const size = variantSize?.size ?? "";
  const images = variantSize?.product_variants?.product_images ?? [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const thumbnailUrl = sortedImages[0]?.image_url ?? null;

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // ─── Success state ────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mb-6" strokeWidth={1.5} />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-3">Order Confirmed!</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-sm">{successMessage}</p>
        {paymentMethod === "cod" && (
          <div className="mb-8 border border-dashed border-zinc-300 p-4 max-w-sm w-full text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">COD Order Note</p>
            <p className="text-xs text-zinc-600">
              ₹{amountToPayNow} advance paid. Remaining <span className="font-bold">₹{(total - amountToPayNow).toFixed(0)}</span> to be paid at delivery.
            </p>
          </div>
        )}
        <Link
          href="/dashboard"
          className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  // ─── Failed state ─────────────────────────────────────────────────────────────
  if (step === "failed") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <XCircle className="h-20 w-20 text-red-500 mb-6" strokeWidth={1.5} />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-3">Payment Failed</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-sm">
          Your payment could not be verified. If money was debited, it will be refunded automatically within 5–7 business days.
        </p>
        <button
          onClick={() => { setStep("review"); setRazorpayData(null); }}
          className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── Main checkout review + payment ──────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen text-black pb-24">
      <AlertMessagePopUp
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      {/* Header */}
      <div className="border-b border-black">
        <div className="mx-auto max-w-screen-lg px-4 py-4 sm:px-6">
          <Link href="/detailedproduct" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Product
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-screen-lg px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Order summary */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product card */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-400">Your Order</h2>
              <div className="border border-black p-4 flex gap-4">
                {thumbnailUrl ? (
                  <div className="relative h-24 w-20 shrink-0 border border-zinc-200 overflow-hidden">
                    <Image src={thumbnailUrl} alt={productName} fill sizes="80px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-24 w-20 shrink-0 border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-zinc-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase italic tracking-tighter text-lg leading-tight">{productName}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    {color} · Size {size}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Qty: {quantity}</span>
                    <span className="font-black text-sm">₹{(price * quantity).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border border-black p-4 space-y-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-400">Price Details</h2>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-zinc-600">Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                <span className="font-bold">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-zinc-600">Delivery Charge</span>
                <span className="font-bold">₹{DELIVERY_CHARGE}</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between">
                <span className="font-black uppercase text-xs tracking-widest">Total</span>
                <span className="font-black text-lg">₹{total.toFixed(0)}</span>
              </div>
              {paymentMethod === "cod" && (
                <div className="bg-zinc-50 border border-dashed border-zinc-300 p-3 mt-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">COD Advance</p>
                  <p className="text-xs text-zinc-600">
                    Pay <span className="font-black text-black">₹{amountToPayNow.toFixed(0)}</span> now online.{" "}
                    Remaining <span className="font-bold">₹{(total - amountToPayNow).toFixed(0)}</span> at delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Delivery address */}
            <div className="border border-black p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivering To</h2>
              </div>
              {user?.address ? (
                <div>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-zinc-600 mt-1">{user.address.full_address}</p>
                  <p className="text-xs text-zinc-600">{user.address.city}, {user.address.state} – {user.address.pincode}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-red-500 font-bold mb-2">No delivery address found.</p>
                  <Link href="/dashboard?tab=profile" className="text-[10px] font-black uppercase tracking-widest underline">
                    Add Address →
                  </Link>
                </div>
              )}
            </div>

            {/* Payment method badge */}
            <div className="border border-black p-4 flex items-center gap-3">
              {paymentMethod === "online" ? (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Pay Online</p>
                    <p className="text-[9px] text-zinc-500">Full amount ₹{total} via Razorpay</p>
                  </div>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</p>
                    <p className="text-[9px] text-zinc-500">₹{amountToPayNow} advance online · ₹{(total - amountToPayNow).toFixed(0)} at delivery</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 border border-black p-6 space-y-4">
              <div className="mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Amount to pay now</p>
                <p className="text-3xl font-black">₹{amountToPayNow.toFixed(0)}</p>
                {paymentMethod === "cod" && (
                  <p className="text-[9px] text-zinc-400 mt-1">+ ₹{(total - amountToPayNow).toFixed(0)} at delivery</p>
                )}
              </div>

              {/* Buttons: step = review → Create Order → step = paying → Razorpay opens */}
              {step === "review" && (
                <button
                  id="checkout-confirm-btn"
                  onClick={handleCreateOrder}
                  disabled={creatingOrder || !user?.address}
                  className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all border border-black ${
                    creatingOrder || !user?.address
                      ? "opacity-40 cursor-not-allowed bg-zinc-100 text-zinc-400"
                      : "bg-black text-white hover:bg-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  }`}
                >
                  {creatingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 fill-current" />
                      Confirm &amp; Pay ₹{amountToPayNow.toFixed(0)}
                    </>
                  )}
                </button>
              )}

              {step === "paying" && razorpayData && (
                <RazorpayPayButton
                  razorpayOrderId={razorpayData.razorpay_order_id}
                  amountPaise={razorpayData.amount}
                  currency={razorpayData.currency}
                  ourOrderId={razorpayData.our_order_id}
                  userName={user?.name ?? undefined}
                  userEmail={user?.email ?? undefined}
                  userPhone={user?.mobile_number ?? undefined}
                  label={`Pay ₹${amountToPayNow.toFixed(0)} via Razorpay`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onDismiss={handlePaymentDismiss}
                  className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest bg-black text-white border border-black hover:bg-zinc-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
                />
              )}

              <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 pt-2">
                Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
