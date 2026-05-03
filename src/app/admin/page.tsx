import React from "react";
import { Users, ShoppingBag, Package, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Revenue", value: "¥1,245,000", icon: DollarSign },
    { title: "Active Orders", value: "42", icon: ShoppingBag },
    { title: "Total Products", value: "156", icon: Package },
    { title: "Total Customers", value: "892", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Overview
        </h1>
        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">
          Store Performance Metrics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {stat.title}
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-black text-white">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border border-zinc-200 p-4">
                <div>
                  <p className="text-xs font-bold uppercase">Order #{1000 + i}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black">¥12,500</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {["Oversized Graphic Tee", "Cargo Parachute Pants", "Platform Sneakers"].map((product, i) => (
              <div key={i} className="flex items-center justify-between border border-zinc-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 border border-black flex items-center justify-center">
                    <Package className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase truncate max-w-[150px] sm:max-w-xs">{product}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{24 - i * 5} Sold</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
