"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, XCircle, LayoutDashboard, Search } from "lucide-react";

interface ProductImage {
  image_url: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  color: string;
  products: Product;
  product_images: ProductImage[];
}

interface VariantSize {
  id: string;
  size: string;
  stock: number;
  product_variants: ProductVariant;
}

function StokesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "critical stoke";

  const [items, setItems] = useState<VariantSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingStock, setAddingStock] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const handleStockUpdate = async (variant_size_id: string) => {
    const additionalStock = addingStock[variant_size_id];
    if (!additionalStock || additionalStock <= 0) return;

    setSubmitting(prev => ({ ...prev, [variant_size_id]: true }));
    try {
      const res = await fetch('/api/admin/stokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_size_id, additional_stock: additionalStock })
      });
      const json = await res.json();
      if (json.success) {
        // Remove item from the current view if it's no longer "critical" or "out of stock"
        // Tab "critical stoke": threshold is <= 5
        // Tab "out of stoke": threshold is <= 0
        const isStillValid = (tab === 'critical stoke' && json.newStock > 0 && json.newStock <= 5) || 
                             (tab === 'out of stoke' && json.newStock <= 0);

        if (!isStillValid) {
          setItems(prev => prev.filter(item => item.id !== variant_size_id));
        } else {
          setItems(prev => prev.map(item => item.id === variant_size_id ? { ...item, stock: json.newStock } : item));
        }
        setAddingStock(prev => ({ ...prev, [variant_size_id]: 0 }));
      } else {
        alert(json.error || 'Failed to update stock');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating stock');
    }
    setSubmitting(prev => ({ ...prev, [variant_size_id]: false }));
  };

  useEffect(() => {
    const fetchStokes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/stokes?tab=${encodeURIComponent(tab)}`);
        const json = await res.json();
        if (json.data) {
          setItems(json.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchStokes();
  }, [tab]);

  const tabs = [
    { id: "critical stoke", label: "Critical Stock", icon: AlertTriangle },
    { id: "out of stoke", label: "Out of Stock", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Stock Management</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Monitor Low & Depleted Inventory</p>
          </div>

          <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-black text-white px-6 py-4 flex items-center gap-3 sm:border-r sm:border-zinc-800">
                <LayoutDashboard className="h-4 w-4" />
                <h1 className="text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Status</h1>
              </div>
              
              <div className="flex-1 grid grid-cols-2">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => router.push(`/admin/stokes?tab=${t.id}`)}
                      className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-4 text-[9px] font-black uppercase tracking-widest border-r border-black last:border-r-0 transition-all ${
                        isActive ? 'bg-zinc-100 text-black shadow-[inset_0px_-2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-400 hover:bg-zinc-50 hover:text-black'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? (t.id === 'out of stoke' ? 'text-red-500' : 'text-amber-500') : 'text-zinc-300'}`} />
                      <span className="truncate">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border-2 border-black" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="border-2 border-dashed border-zinc-300 bg-white py-20 text-center">
              <Search className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">All Good Here</p>
              <p className="text-[9px] font-bold text-zinc-300 mt-1">No items found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {items.map((item) => {
                const variantImages = item.product_variants?.product_images || [];
                const thumbnail = variantImages.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
                const productName = item.product_variants?.products?.name || "Unknown Product";
                const color = item.product_variants?.color || "Unknown Color";

                return (
                  <div key={item.id} className="group relative border-2 border-black bg-white flex flex-col transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
                    <div className="aspect-[3/4] relative bg-zinc-100 border-b-2 border-black overflow-hidden">
                      {thumbnail ? (
                        <Image 
                          src={thumbnail} 
                          alt={productName} 
                          fill 
                          className="object-cover" 
                          sizes="(max-width: 640px) 50vw, 20vw" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-zinc-300">No Image</div>
                      )}
                      
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.stock <= 0 ? 'text-red-400' : 'text-white'}`}>
                           {item.stock} in Stock
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-[10px] font-black uppercase italic tracking-tight leading-snug line-clamp-2 mb-1" title={productName}>
                        {productName}
                      </h3>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        {color} / Size {item.size}
                      </p>
                      
                      <div className="mt-auto pt-3 flex flex-col gap-2 border-t border-zinc-100">
                        <div className="flex justify-between items-center">
                          {item.stock <= 0 ? (
                            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-1"><XCircle className="w-3 h-3"/> Out</span>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Low</span>
                          )}
                          <a 
                            href={`/admin/products/variants/${item.product_variants?.id}`}
                            className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                          >
                            Manage
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="number"
                            min="1"
                            placeholder="+ Qty"
                            value={addingStock[item.id] || ""}
                            onChange={(e) => setAddingStock(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
                            className="w-full text-[10px] font-bold border border-zinc-300 px-2 py-1.5 focus:border-black outline-none"
                          />
                          <button 
                            onClick={() => handleStockUpdate(item.id)}
                            disabled={submitting[item.id] || !addingStock[item.id]}
                            className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {submitting[item.id] ? "..." : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}

export default function AdminStokesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    }>
      <StokesContent />
    </Suspense>
  );
}
