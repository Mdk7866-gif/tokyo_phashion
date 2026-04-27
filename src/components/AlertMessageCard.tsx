"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertType = "success" | "error" | "info" | "confirm";

interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = (opt: AlertOptions) => setOptions(opt);
  const hideAlert = () => setOptions(null);

  const handleConfirm = () => {
    if (options?.onConfirm) options.onConfirm();
    hideAlert();
  };

  const handleCancel = () => {
    if (options?.onCancel) options.onCancel();
    hideAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500"
            onClick={options.type !== 'confirm' ? hideAlert : undefined}
          />
          
          {/* Card - Premium Monochromatic Bordered Style */}
          <div className="relative bg-white w-full max-w-[380px] rounded-[24px] shadow-2xl border-2 border-black overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-400">
            
            {/* Branding Accent */}
            <div className="bg-black py-2 px-6 flex justify-between items-center">
               <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">Tokyo Phashion</span>
               <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-white/40" />
                 <div className="w-1 h-1 rounded-full bg-white/40" />
               </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Header section with Icon */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {options.type === 'success' && (
                    <div className="w-14 h-14 bg-zinc-50 border-2 border-black rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                  {options.type === 'error' && (
                    <div className="w-14 h-14 bg-zinc-50 border-2 border-rose-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                  )}
                  {options.type === 'confirm' && (
                    <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
                       <span className="text-lg font-black italic">!</span>
                    </div>
                  )}
                  {options.type === 'info' && (
                    <div className="w-14 h-14 bg-zinc-50 border-2 border-black rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-black leading-none">
                  {options.title || (options.type === 'confirm' ? 'Wait a minute' : 'Notice')}
                </h3>
                <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed max-w-[260px]">
                  {options.message}
                </p>
              </div>

              {/* Actions */}
              <div className={`mt-10 flex flex-col gap-3`}>
                <button
                  onClick={handleConfirm}
                  className="w-full bg-black text-white h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 border-2 border-black"
                >
                  {options.confirmText || (options.type === 'confirm' ? 'Yes, Proceed' : 'Got it')}
                </button>
                
                {options.type === 'confirm' && (
                  <button
                    onClick={handleCancel}
                    className="w-full bg-white text-black h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all active:scale-95 border-2 border-zinc-200"
                  >
                    {options.cancelText || 'No, Cancel'}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-zinc-50 py-3 border-t-2 border-black flex justify-center items-center gap-2">
               <div className="w-1 h-1 bg-black rounded-full" />
               <span className="text-[8px] font-black tracking-[0.3em] text-black uppercase">TP Quality Control</span>
               <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
