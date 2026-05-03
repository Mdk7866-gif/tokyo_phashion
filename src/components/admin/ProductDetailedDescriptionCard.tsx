"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Upload, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductDetailedDescriptionCardProps {
  category: string;
  subcategory: string;
  cat_id: string;
  sub_id: string;
  product_id: string | null;
  color: string | null;
  onBack: () => void;
}

export default function ProductDetailedDescriptionCard({
  category,
  subcategory,
  cat_id,
  sub_id,
  product_id,
  color,
  onBack
}: ProductDetailedDescriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variantColor, setVariantColor] = useState(color || "");
  const [variantId, setVariantId] = useState<string | null>(null);
  
  const [sizes, setSizes] = useState<{size: string; stock: number; original_price: number; discount_price: number}[]>([
    { size: "", stock: 0, original_price: 0, discount_price: 0 }
  ]);
  
  const [images, setImages] = useState<{url: string}[]>([]);

  useEffect(() => {
    if (product_id) {
      fetchProductData();
    }
  }, [product_id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crudproduct?product_id=${product_id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setName(data.name || "");
          setDescription(data.description || "");
          
          if (data.product_variants && data.product_variants.length > 0) {
            // Find the specific color variant if provided
            const targetVariant = color ? data.product_variants.find((v:any) => v.color === color) : null;
            
            // If we found the variant, populate it. If color was null (NEW color), leave fields empty.
            if (targetVariant) {
              setVariantColor(targetVariant.color);
              setVariantId(targetVariant.id);
              
              if (targetVariant.variant_sizes && targetVariant.variant_sizes.length > 0) {
                setSizes(targetVariant.variant_sizes.map((s:any) => ({
                  size: s.size,
                  stock: s.stock,
                  original_price: s.original_price,
                  discount_price: s.discount_price
                })));
              }
              
              if (targetVariant.product_images && targetVariant.product_images.length > 0) {
                setImages(targetVariant.product_images.sort((a:any, b:any) => a.sort_order - b.sort_order).map((img:any) => ({
                  url: img.image_url
                })));
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: "", stock: 0, original_price: 0, discount_price: 0 }]);
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, field: string, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/uploadimage', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        setImages([...images, { url: json.url }]);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name || !variantColor) {
      alert("Name and Color are required.");
      return;
    }
    
    setSaving(true);
    
    const payload = {
      id: product_id,
      subcategory_id: sub_id,
      name,
      description,
      variant: {
        id: variantId,
        color: variantColor,
        sizes,
        images
      }
    };
    
    try {
      const url = '/api/admin/crudproduct';
      const method = product_id ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onBack();
      } else {
        alert("Failed to save product.");
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-12 text-center animate-pulse bg-zinc-100">Loading editor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black pb-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black mb-2 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            {product_id ? "Edit" : "Add"} <span className="text-zinc-400">Product</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {category} / {subcategory}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 border border-black bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-sm font-black uppercase italic tracking-tight">Basic Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-black bg-zinc-50 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. Oversized Anime Graphic Tee"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-black bg-zinc-50 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Product description goes here..."
                />
              </div>
            </div>
          </div>

          {/* Sizes & Pricing Table */}
          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase italic tracking-tight">Sizes & Pricing</h2>
              <button 
                onClick={handleAddSize}
                className="flex items-center gap-1 bg-black text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Size
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 uppercase tracking-widest text-[9px] font-black text-zinc-500">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Orig. Price</th>
                    <th className="p-3">Disc. Price</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((s, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      <td className="p-2">
                        <input type="text" value={s.size} onChange={e => handleSizeChange(i, 'size', e.target.value)} className="w-16 border border-zinc-300 p-2 text-center focus:border-black focus:outline-none" placeholder="S, M, L..." />
                      </td>
                      <td className="p-2">
                        <input type="number" value={s.stock} onChange={e => handleSizeChange(i, 'stock', Number(e.target.value))} className="w-20 border border-zinc-300 p-2 text-center focus:border-black focus:outline-none" />
                      </td>
                      <td className="p-2">
                        <input type="number" value={s.original_price} onChange={e => handleSizeChange(i, 'original_price', Number(e.target.value))} className="w-24 border border-zinc-300 p-2 focus:border-black focus:outline-none" />
                      </td>
                      <td className="p-2">
                        <input type="number" value={s.discount_price} onChange={e => handleSizeChange(i, 'discount_price', Number(e.target.value))} className="w-24 border border-zinc-300 p-2 focus:border-black focus:outline-none" />
                      </td>
                      <td className="p-2 text-right">
                        <button onClick={() => handleRemoveSize(i)} className="text-red-400 hover:text-red-600 p-2">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Variant & Images */}
        <div className="space-y-6">
          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-sm font-black uppercase italic tracking-tight">Variant Settings</h2>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Color Name</label>
              <input
                type="text"
                value={variantColor}
                onChange={(e) => setVariantColor(e.target.value)}
                className="w-full border border-black bg-zinc-50 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g. Crimson Red"
              />
            </div>
          </div>

          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-sm font-black uppercase italic tracking-tight">Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-[3/4] border border-black bg-zinc-100 overflow-hidden">
                  <Image src={img.url} alt={`Image ${i}`} fill className="object-cover" />
                  <button 
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                {saving ? (
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                ) : (
                  <>
                    <Upload className="mb-2 h-6 w-6 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Upload</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={saving} />
              </label>
            </div>
            <p className="mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">
              First image will be used as thumbnail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
