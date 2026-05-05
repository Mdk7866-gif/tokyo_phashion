"use client";

import { useCallback } from "react";

// NOTE: Window.Razorpay global is declared in checkout/page.tsx to avoid duplicate declarations.
// This component uses it via the shared global scope.

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

// Extend the global Window type locally without redeclaring it
type RzpWindow = Window & { Razorpay: new (options: RazorpayOptions) => RazorpayInstance };

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPayButtonProps {
  razorpayOrderId: string;
  amountPaise: number;
  currency?: string;
  ourOrderId: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  label?: string;
  disabled?: boolean;
  onSuccess: (response: RazorpaySuccessResponse, ourOrderId: string) => void;
  onError: (message: string) => void;
  onDismiss?: () => void;
  className?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window !== "undefined" && (window as unknown as RzpWindow).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export default function RazorpayPayButton({
  razorpayOrderId,
  amountPaise,
  currency = "INR",
  ourOrderId,
  userEmail,
  userName,
  userPhone,
  label = "Pay Now",
  disabled = false,
  onSuccess,
  onError,
  onDismiss,
  className = "",
}: RazorpayPayButtonProps) {
  const handlePay = useCallback(async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onError("Failed to load payment gateway. Please check your internet connection.");
      return;
    }

    const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!rzpKey) {
      onError("Payment gateway is not configured.");
      return;
    }

    const rzpWin = window as unknown as RzpWindow;
    const options: RazorpayOptions = {
      key: rzpKey,
      amount: amountPaise,
      currency,
      name: "Tokyo Fashion",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: (response: RazorpaySuccessResponse) => {
        onSuccess(response, ourOrderId);
      },
      prefill: { name: userName, email: userEmail, contact: userPhone },
      theme: { color: "#000000" },
      modal: { ondismiss: () => { onDismiss?.(); } },
    };

    const rzp = new rzpWin.Razorpay(options);
    rzp.on("payment.failed", () => {
      onError("Payment failed. Please try again or use a different payment method.");
    });
    rzp.open();
  }, [razorpayOrderId, amountPaise, currency, ourOrderId, userEmail, userName, userPhone, onSuccess, onError, onDismiss]);

  return (
    <button
      id="razorpay-pay-btn"
      onClick={handlePay}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  );
}
