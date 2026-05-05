"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import AlertMessagePopUp from "../AlertMessagePopUp";

interface ColorData {
  color: string;
  images: { url: string }[];
}

interface AddProductSimpleFormProps {
  category: string;
  subcategory: string;
  cat_id: string;
  sub_id: string;
  onBack: () => void;
}

export default function AddProductSimpleForm({
  category,
  subcategory,
  cat_id,
  sub_id,
  onBack
}: AddProductSimpleFormProps) {
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [newSize, setNewSize] = useState("");
  
  const [colors, setColors] = useState<ColorData[]>([
    { color: "", images: [] }
  ]);

  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning" as "success" | "error" | "warning" | "info"
  });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "warning") => {
    setAlertInfo({ isOpen: true, title, message, type });
  };

  const handleAddSize = () => {
    const s = newSize.trim().toUpperCase();
    if (s && !sizes.includes(s)) {
      setSizes([...sizes, s]);
    }
    setNewSize("");
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    setColors([...colors, { color: "", images: [] }]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleColorNameChange = (index: number, name: string) => {
    const newColors = [...colors];
    newColors[index].color = name;
    setColors(newColors);
  };

  const handleImageUpload = async (cIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newColors = [...colors];
        newColors[cIndex].images.push({ url: json.url });
        setColors(newColors);
      }
    } catch (err) {
      console.error(err);
      showAlert("Upload Error", "Failed to upload image.", "error");
    }
    setSaving(false);
  };

  const handleRemoveImage = (cIndex: number, iIndex: number) => {
    const newColors = [...colors];
    newColors[cIndex].images = newColors[cIndex].images.filter((_, i) => i !== iIndex);
    setColors(newColors);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert("Invalid Input", "Please enter a product name.", "warning");
      return;
    }

    if (sizes.length === 0) {
      showAlert("Invalid Input", "Please add at least one size.", "warning");
      return;
    }

    if (originalPrice === "" || Number(originalPrice) <= 0) {
      showAlert("Invalid Input", "Please enter a valid original price.", "warning");
      return;
    }

    if (discountPrice === "" || Number(discountPrice) < 0 || Number(discountPrice) > Number(originalPrice)) {
      showAlert("Invalid Input", "Please enter a valid discount price (must not exceed original price).", "warning");
      return;
    }

    if (colors.length === 0) {
      showAlert("Invalid Input", "Please add at least one color variant.", "warning");
      return;
    }

    for (let i = 0; i < colors.length; i++) {
      if (!colors[i].color.trim()) {
        showAlert("Variant Error", `Please enter a color name for variant ${i + 1}.`, "error");
        return;
      }
      if (colors[i].images.length === 0) {
        showAlert("Variant Error", `Please upload at least one image for color "${colors[i].color}".`, "error");
        return;
      }
    }

    setSaving(true);

    const variantsPayload = colors.map(c => ({
      id: null,
      color: c.color,
      sizes: sizes.map(s => ({
        size: s,
        stock: 100, // Hardcoded stock for simple form
        original_price: Number(originalPrice),
        discount_price: Number(discountPrice)
      })),
      images: c.images
    }));

    const payload = {
      subcategory_id: sub_id,
      name,
      description,
      variants: variantsPayload
    };

    try {
      const res = await fetch('/api/admin/crudproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onBack();
      } else {
        showAlert("Save Failed", "Failed to save product to database.", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("System Error", "An unexpected error occurred while saving.", "error");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black pb-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black mb-2 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
            Add <span className="text-zinc-400">Product</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {category} / {subcategory}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 border border-black bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Basic Info & Pricing */}
        <div className="space-y-6">
          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h2 className="text-sm font-black uppercase italic tracking-tight underline decoration-black underline-offset-4">Product Details</h2>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-black bg-zinc-50 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g. Premium Graphic Tee"
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

          <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h2 className="text-sm font-black uppercase italic tracking-tight underline decoration-black underline-offset-4">Global Pricing & Sizes</h2>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Applied to all colors</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Original Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-black bg-zinc-50 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. 1999"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Discount Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-black bg-zinc-50 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. 1499"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Sizes</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {sizes.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 border border-black bg-zinc-100 px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {s}
                    <button onClick={() => handleRemoveSize(s)} className="text-zinc-400 hover:text-red-500 ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {sizes.length === 0 && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">No sizes added</span>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                  className="border border-black bg-white p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black w-24 uppercase"
                  placeholder="e.g. XXL"
                />
                <button 
                  type="button" 
                  onClick={handleAddSize}
                  className="border border-black bg-black text-white p-2 hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Colors & Images */}
        <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase italic tracking-tight underline decoration-black underline-offset-4">Colors & Images</h2>
            <button 
              onClick={handleAddColor}
              className="flex items-center gap-1 border border-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Color
            </button>
          </div>

          <div className="space-y-8">
            {colors.map((c, cIndex) => (
              <div key={cIndex} className="p-4 border border-zinc-200 bg-zinc-50 relative group">
                {colors.length > 1 && (
                  <button 
                    onClick={() => handleRemoveColor(cIndex)}
                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors z-10"
                    title="Remove Color"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                
                <div className="mb-4">
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Color Name</label>
                  <input
                    type="text"
                    value={c.color}
                    onChange={(e) => handleColorNameChange(cIndex, e.target.value)}
                    className="w-full max-w-[200px] border border-black bg-white p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="e.g. Midnight Black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {c.images.map((img, iIndex) => (
                      <div key={iIndex} className="group/img relative aspect-[3/4] border border-zinc-300 bg-white overflow-hidden">
                        <Image src={img.url} alt={`${c.color} ${iIndex}`} fill className="object-cover" />
                        <button 
                          onClick={() => handleRemoveImage(cIndex, iIndex)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white opacity-0 group-hover/img:opacity-100 transition-opacity z-10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-300 bg-white hover:bg-zinc-100 transition-colors">
                      {saving ? (
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                      ) : (
                        <>
                          <Upload className="mb-1 h-5 w-5 text-zinc-400" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Upload</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(cIndex, e)} disabled={saving} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertMessagePopUp
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
      />
    </div>
  );
}
