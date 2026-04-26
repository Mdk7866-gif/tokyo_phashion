"use client";

import React, { useEffect, useState } from "react";

export default function AdminFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch("/api/admin/contactformread");
      const data = await res.json();
      if (data.success) {
        setForms(data.forms);
      }
    } catch (error) {
      console.error("Failed to fetch forms", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Contact Forms</h1>
      
      {forms.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No forms submitted yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {forms.map((form, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-50">
                <div>
                  <h3 className="font-bold text-lg uppercase">{form.name || form.fullname || "Anonymous"}</h3>
                  <p className="text-xs font-bold text-zinc-500">{form.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</p>
                  <p className="text-xs font-bold">{form.created_at ? new Date(form.created_at).toLocaleString() : "Unknown"}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Message</p>
                <p className="text-sm text-zinc-700 whitespace-pre-wrap font-medium">{form.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
