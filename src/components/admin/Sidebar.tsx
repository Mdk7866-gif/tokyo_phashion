"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Package,
  X
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-64 transform border-r border-black bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black px-6">
          <Link href="/admin" className="text-lg font-black uppercase italic tracking-tighter">
            Tokyo <span className="font-light opacity-50">Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-zinc-100 rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Overview
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full border-t border-black bg-zinc-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-black flex items-center justify-center text-white text-xs font-black">
              AD
            </div>
            <div>
              <p className="text-xs font-bold">System Admin</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Master</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
