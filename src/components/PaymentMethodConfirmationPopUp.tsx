"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Wallet, X, Info } from "lucide-react";

interface PaymentMethodConfirmationPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: "cod" | "online") => void;
  subtotalAmount: number;
  /** If true, hides the COD option (e.g. when total ≤ ₹100 advance) */
  hideCOD?: boolean;
}

const PaymentMethodConfirmationPopUp: React.FC<PaymentMethodConfirmationPopUpProps> = ({
  isOpen,
  onClose,
  onSelect,
  subtotalAmount,
  hideCOD = false,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setShouldRender(true));
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const DELIVERY_COD = 150;
  const DELIVERY_ONLINE = 100;
  
  const totalCOD = subtotalAmount + DELIVERY_COD;
  const totalOnline = subtotalAmount + DELIVERY_ONLINE;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center transition-all duration-300 lg:items-center lg:p-4 ${
        isOpen ? "bg-black/40 backdrop-blur-sm" : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        onAnimationEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full border-t-2 border-black bg-white p-6 shadow-[0px_-4px_20px_rgba(0,0,0,0.2)]
          transition-all duration-500 ease-out
          fixed bottom-0 left-0 right-0
          lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-w-md lg:border-2 lg:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 lg:translate-y-8"}
        `}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Choose Payment</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Flexible Delivery Pricing Applied</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-zinc-100 border border-transparent hover:border-black transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* COD Option — hidden if total ≤ ₹100 */}
            {!hideCOD && (
              <button
                onClick={() => onSelect("cod")}
                className="group w-full flex flex-col text-left border-2 border-black p-4 hover:bg-zinc-50 transition-all active:translate-x-0.5 active:translate-y-0.5 bg-white"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-100 border border-black rounded-sm group-hover:bg-white transition-colors shrink-0">
                      <Wallet className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] leading-none text-black">Cash on Delivery</span>
                      <span className="text-[7px] font-bold text-zinc-400 uppercase mt-1">Pay at Delivery</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-black text-black">₹{totalCOD}</span>
                </div>
                
                <div className="w-full flex flex-col gap-1.5 p-3 bg-zinc-50 border border-dashed border-zinc-200 rounded-sm">
                  <div className="flex justify-between text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Product Subtotal</span>
                    <span className="text-zinc-600">₹{subtotalAmount}</span>
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Delivery Charge</span>
                    <span className="text-zinc-600">+ ₹{DELIVERY_COD}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-black mt-1.5 pt-1.5 border-t border-zinc-200">
                    <span>Total Payable</span>
                    <span>₹{totalCOD}</span>
                  </div>
                  <div className="flex gap-2 items-start mt-2 pt-2 border-t border-zinc-200">
                    <Info className="h-3 w-3 text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-[8px] font-bold text-zinc-500 leading-tight">
                      <span className="text-black font-black uppercase text-[7px]">₹100 Advanced Payment</span> required now. <br />
                      <span className="italic">Pay remaining ₹{totalCOD - 100} at delivery.</span>
                    </p>
                  </div>
                  
                  {/* Explicit Select Button */}
                  <div className="mt-4 border-t border-zinc-200 pt-3">
                    <div className="w-full bg-indigo-600 text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] text-center group-hover:bg-indigo-700 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] active:translate-y-0.5">
                      Pay ₹100 via COD
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Online Option */}
            <button
              onClick={() => onSelect("online")}
              className="group w-full flex flex-col text-left border-2 border-black p-4 bg-black text-white hover:bg-zinc-900 transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-sm shrink-0">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] leading-none text-white">Pay via Online</span>
                    <span className="text-[7px] font-bold text-zinc-500 uppercase mt-1">Instant Settlement</span>
                  </div>
                </div>
                <span className="text-[12px] font-black text-white">₹{totalOnline}</span>
              </div>
              
              <div className="w-full flex flex-col gap-1.5 p-3 bg-zinc-900 border border-dashed border-zinc-700 rounded-sm">
                <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Product Subtotal</span>
                  <span className="text-zinc-300">₹{subtotalAmount}</span>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Delivery Charge</span>
                  <span className="text-zinc-300">+ ₹{DELIVERY_ONLINE}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-white mt-1.5 pt-1.5 border-t border-zinc-700">
                  <span>Total Payable</span>
                  <span>₹{totalOnline}</span>
                </div>

                {/* Explicit Select Button */}
                <div className="mt-4 border-t border-zinc-700 pt-3">
                  <div className="w-full bg-indigo-600 text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] text-center group-hover:bg-indigo-700 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] active:translate-y-0.5">
                    Pay ₹{totalOnline} via Online
                  </div>
                </div>
              </div>
            </button>

            {/* Note when COD is hidden */}
            {hideCOD && (
              <p className="text-center text-[9px] font-bold text-amber-600 uppercase tracking-widest border border-dashed border-amber-300 bg-amber-50 p-2">
                COD unavailable — order total ≤ ₹100 (full payment required online)
              </p>
            )}
          </div>

          <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Secure checkout powered by Tokyo Fashion
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodConfirmationPopUp;
