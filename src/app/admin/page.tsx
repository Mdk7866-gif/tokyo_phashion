"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, CheckCircle, Loader2 } from "lucide-react";

interface Stats {
  customers: number;
  ordersReceived: number;
  delivered: number;
  cancelled: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/customers").then(r => r.json()),
      fetch("/api/admin/orders?status=paid").then(r => r.json()),
      fetch("/api/admin/orders?status=cod").then(r => r.json()),
      fetch("/api/admin/orders?status=delivered").then(r => r.json()),
      fetch("/api/admin/orders?status=cancelled").then(r => r.json()),
    ]).then(([customers, paid, cod, delivered, cancelled]) => {
      setStats({
        customers: customers.data?.length ?? 0,
        ordersReceived: (paid.data?.length ?? 0) + (cod.data?.length ?? 0),
        delivered: delivered.data?.length ?? 0,
        cancelled: cancelled.data?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    {
      label: "Customers",
      icon: Users,
      href: "/admin/customers",
      color: "border-blue-500",
      iconBg: "bg-blue-50 text-blue-600",
      stat: stats?.customers,
    },
    {
      label: "Orders Received",
      icon: Package,
      href: "/admin/deliveryreceived",
      color: "border-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
      stat: stats?.ordersReceived,
    },
    {
      label: "Delivered",
      icon: CheckCircle,
      href: "/admin/delivered",
      color: "border-green-500",
      iconBg: "bg-green-50 text-green-600",
      stat: stats?.delivered,
    },

  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Tokyo Fashion — Control Panel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, icon: Icon, href, color, iconBg, stat }) => (
            <Link key={href} href={href}
              className={`group flex flex-col gap-4 p-6 bg-white border-2 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none relative overflow-hidden`}>
              {/* Accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${color.replace("border-", "bg-")}`} />
              <div className={`w-10 h-10 flex items-center justify-center border border-black ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
                {stat !== null ? (
                  stat === undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-300 mt-1" />
                  ) : (
                    <p className="text-3xl font-black tracking-tighter mt-1">{stat}</p>
                  )
                ) : (
                  <p className="text-xs text-zinc-400 mt-1 group-hover:text-black transition-colors">Manage →</p>
                )}
              </div>
            </Link>
          ))}
        </div>

 
      </div>
    </div>
  );
}