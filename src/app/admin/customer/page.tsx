"use client";

import React, { useEffect, useState } from "react";

export default function AdminCustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/getallcustomer");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Customers List</h1>
        <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md">
          Total Customers: {customers.length}
        </div>
      </div>
      
      {customers.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No customers found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-zinc-200 shadow-md overflow-hidden">
          {/* Mobile view */}
          <div className="md:hidden divide-y divide-zinc-100">
            {customers.map((cust, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm uppercase">{cust.username || "Unknown"}</p>
                    <p className="text-[10px] font-bold text-zinc-400 truncate">{cust.email}</p>
                    <p className="text-[11px] font-bold text-zinc-500">{cust.mobile_no || "No Mobile"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Joined</p>
                    <p className="text-[11px] font-bold">{cust.created_At ? new Date(cust.created_At).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-xs font-medium text-zinc-600 line-clamp-2">{cust.address?.full_address || "N/A"}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 uppercase">
                    {cust.address?.cityname ? `${cust.address.cityname}, ` : ""}{cust.address?.statename || ""}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Login</p>
                  <p className="text-[11px] font-bold">{cust.last_login ? new Date(cust.last_login).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Name</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Contact Info</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Address</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Created At</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm uppercase">{cust.username || "Unknown"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm truncate max-w-[150px]" title={cust.email}>{cust.email}</p>
                      <p className="text-[11px] font-bold text-zinc-500">{cust.mobile_no || "N/A"}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-medium text-zinc-600 max-w-[250px] truncate" title={cust.address?.full_address}>
                        {cust.address?.full_address || "N/A"}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 uppercase">
                        {cust.address?.cityname ? `${cust.address.cityname}, ` : ""}{cust.address?.statename || ""}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-zinc-700">
                        {cust.created_At ? new Date(cust.created_At).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-zinc-700">
                        {cust.last_login ? new Date(cust.last_login).toLocaleString() : "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
