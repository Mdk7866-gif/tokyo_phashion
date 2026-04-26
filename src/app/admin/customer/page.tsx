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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Customers List</h1>
      
      {customers.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No customers found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Name</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Mobile No</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Address</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Created At</th>
                  <th className="p-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {customers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm uppercase">{cust.username || "Unknown"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm">{cust.mobile_no}</p>
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
