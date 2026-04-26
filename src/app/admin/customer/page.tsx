"use client";

import React, { useEffect, useState } from "react";

interface Customer {
  username?: string;
  email: string;
  mobile_no?: string;
  created_At?: string;
  last_login?: string;
  address?: {
    full_address?: string;
    cityname?: string;
    statename?: string;
  };
}

export default function AdminCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
        <div className="space-y-6">
          {customers.map((cust, idx) => (
            <div key={idx} className="bg-white rounded-3xl border-2 border-zinc-200 shadow-md overflow-hidden">
              {/* Customer Header */}
              <div className="p-4 md:p-6 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">
                    {(cust.username || cust.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-base md:text-lg uppercase tracking-tight">{cust.username || "Anonymous Customer"}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-zinc-500 tracking-wider uppercase">{cust.email}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {/* Contact Info */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mobile Number</p>
                    <p className="text-sm font-black text-zinc-900">{cust.mobile_no || "Not Provided"}</p>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 lg:col-span-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                    <div className="text-sm font-medium text-zinc-800">
                      <p className="line-clamp-1" title={cust.address?.full_address}>{cust.address?.full_address || "No address saved"}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                        {cust.address?.cityname ? `${cust.address.cityname}, ` : ""}{cust.address?.statename || ""}
                      </p>
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Joined Date</p>
                    <p className="text-sm font-black text-zinc-900">
                      {cust.created_At ? new Date(cust.created_At).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                    </p>
                  </div>

                  {/* Last Active */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Login</p>
                    <p className="text-sm font-black text-zinc-900">
                      {cust.last_login ? new Date(cust.last_login).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
