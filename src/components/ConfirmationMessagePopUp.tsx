"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, Info, X } from "lucide-react";

interface ConfirmationMessagePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationMessagePopUp: React.FC<ConfirmationMessagePopUpProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
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

  const icons = {
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertCircle className="h-6 w-6 text-yellow-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-end justify-center transition-all duration-300 lg:items-center lg:p-4 ${
        isOpen ? "bg-black/20" : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        onAnimationEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full border-t-2 border-black bg-white p-4 shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]
          transition-all duration-500 ease-out
          /* Mobile: Full width at the very bottom */
          fixed bottom-0 left-0 right-0
          lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:max-w-sm lg:border-2 lg:p-6 lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 lg:translate-y-4 lg:opacity-0"}
        `}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 lg:h-12 lg:w-12">
            {icons[type]}
          </div>

          <h3 className="mb-1 text-base font-black uppercase italic tracking-tight lg:text-lg">
            {title}
          </h3>
          <p className="mb-6 text-[11px] font-bold text-zinc-500 lg:text-sm">
            {message}
          </p>

          <div className="flex w-full gap-2">
            <button
              onClick={onClose}
              className="flex-1 border border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-100 active:translate-y-1 lg:py-3 lg:text-xs"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 border border-black bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 active:translate-y-1 lg:py-3 lg:text-xs"
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-black lg:block hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationMessagePopUp;
