"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Loader2, Mail, Phone, Calendar } from "lucide-react";

interface Customer {
  id: string; name: string | null; email: string | null;
  mobile_number: string | null; profile_image: string | null;
  created_at: string | null; updated_at: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers").then(r => r.json()).then(d => {
      if (d.error) {
        setError(d.error);
      } else {
        setCustomers(d.data || []);
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(c =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
            <ArrowLeft className="h-3 w-3" /> Admin
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Customers</h1>
          <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1">{customers.length} Total</span>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full border border-black px-4 py-2.5 text-xs font-bold mb-6 focus:outline-none bg-white" />

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-8 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Error Fetching Data</p>
            <p className="text-[10px] font-bold text-red-400">{error}</p>
            {error === "Unauthorized" && (
              <Link href="/admin/login" className="mt-4 inline-block bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest">Login Again</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="bg-white border border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-3">
                  {c.profile_image ? (
                    <div className="relative h-10 w-10 shrink-0 border border-zinc-200 overflow-hidden rounded-full">
                      <Image src={c.profile_image} alt={c.name ?? ""} fill className="object-cover" sizes="40px" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 border border-black bg-zinc-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-zinc-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-tight truncate">{c.name ?? "—"}</p>
                    <p className="text-[9px] text-zinc-400 font-bold truncate">{c.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                    <Mail className="h-3 w-3 shrink-0 text-zinc-300" />
                    <span className="truncate">{c.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                    <Phone className="h-3 w-3 shrink-0 text-zinc-300" />
                    <span>{c.mobile_number ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <Calendar className="h-3 w-3 shrink-0 text-zinc-300" />
                    <span>Joined {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <Calendar className="h-3 w-3 shrink-0 text-zinc-300" />
                    <span>Last seen {c.updated_at ? new Date(c.updated_at).toLocaleDateString("en-IN") : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No customers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
