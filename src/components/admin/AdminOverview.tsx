"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    customers: 0,
    received: 0,
    delivered: 0,
    cancelled: 0,
    forms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Customers",
      value: stats.customers,
      link: "/admin/customer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: "Orders Received",
      value: stats.received,
      link: "/admin/orderreceived",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      color: "bg-zinc-50 text-zinc-900 border-zinc-200",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      link: "/admin/orderdelivered",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      link: "/admin/ordercancelled",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      label: "Forms",
      value: stats.forms,
      link: "/admin/form",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
        <p className="text-xs font-semibold uppercase tracking-widest">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm font-medium">Store overview and performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {statCards.map((card, idx) => (
          <Link 
            key={idx} 
            href={card.link}
            className="group bg-white p-4 md:p-6 rounded-2xl border border-gray-200 hover:border-black hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className={`p-2.5 rounded-xl ${card.color} border transition-colors group-hover:bg-black group-hover:text-white group-hover:border-black`}>
                {card.icon}
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{card.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{card.value}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-40 transition-opacity">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
