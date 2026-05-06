"use client";

import Link from "next/link";
import { Users, Package, CheckCircle, XCircle } from "lucide-react";

const cards = [
  { label: "Customers", icon: Users, href: "/admin/customers", color: "bg-blue-50 border-blue-200", iconColor: "text-blue-600" },
  { label: "Delivery Received", icon: Package, href: "/admin/deliveryreceived", color: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
  { label: "Delivered", icon: CheckCircle, href: "/admin/delivered", color: "bg-green-50 border-green-200", iconColor: "text-green-600" },
  { label: "Delivery Cancelled", icon: XCircle, href: "/admin/deliverycancelled", color: "bg-red-50 border-red-200", iconColor: "text-red-600" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Tokyo Fashion — Control Panel</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, icon: Icon, href, color, iconColor }) => (
            <Link key={href} href={href}
              className={`group flex flex-col gap-4 p-6 border-2 ${color} bg-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}>
              <div className={`w-10 h-10 flex items-center justify-center border border-black ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
                <p className="text-xs text-zinc-400 mt-1 group-hover:text-black transition-colors">View →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}