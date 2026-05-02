"use client";

import React from "react";
import Link from "next/link";
import { X, Home, Info, LayoutGrid, Tag, User, Settings, ShoppingBag, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "New Arrivals", href: "/new", icon: Tag },
    { name: "Shop All", href: "/shop", icon: ShoppingBag },
    { name: "Categories", href: "/categories", icon: LayoutGrid },
    { name: "Our Story", href: "/about", icon: Info },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 transform border-r border-black bg-white text-black transition-transform duration-500 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-black">
          <Link href="/" className="text-xl font-black uppercase italic tracking-tighter">
            Tokyo <span className="opacity-40">PH</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-black hover:text-white lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 px-2">Navigation</p>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`group flex items-center justify-between rounded-none px-4 py-4 text-xs font-black uppercase tracking-widest transition-all duration-200 border border-transparent ${
                    isActive(item.href) 
                      ? "bg-black text-white" 
                      : "text-black hover:border-black hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-white" : "text-black opacity-40 group-hover:opacity-100"}`} />
                    {item.name}
                  </div>
                  {isActive(item.href) && <ArrowRight className="h-3 w-3" />}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-zinc-100 space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-2">Account</p>
              <div className="space-y-1">
                <Link href="/account" className="flex items-center gap-4 px-4 py-3 text-xs font-bold text-black/60 hover:text-black transition-colors">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-4 px-4 py-3 text-xs font-bold text-black/60 hover:text-black transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </div>
            </div>

            <div className="bg-black p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Phashion Club</p>
              <h4 className="mt-2 text-sm font-black italic">GET 20% OFF</h4>
              <p className="mt-2 text-[11px] leading-relaxed opacity-70">Join our community and get exclusive early access to drops.</p>
              <Link href="/join" className="mt-6 block w-full bg-white py-3 text-center text-[10px] font-black uppercase tracking-widest text-black hover:bg-zinc-200 transition-colors">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
