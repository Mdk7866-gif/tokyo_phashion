"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Plus } from "lucide-react";
import ProductDetailedDescriptionVariantCard from "./ProductDetailedDescriptionVariantCard";
import AlertMessagePopUp from "../AlertMessagePopUp";

interface SizeData {
  size: string;
  stock: number;
  original_price: number;
  discount_price: number;
}

interface VariantData {
  id: string | null;
  color: string;
  sizes: SizeData[];
  images: { url: string }[];
}

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
  sub_id,
  product_id,
  color,
  onBack
}: ProductDetailedDescriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [variants, setVariants] = useState<VariantData[]>([
    {
      id: null,
      color: "",
      sizes: [{ size: "", stock: 0, original_price: 0, discount_price: 0 }],
      images: []
    }
  ]);

  // Alert State
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning" as "success" | "error" | "warning" | "info"
  });

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "warning") => {
    setAlertInfo({ isOpen: true, title, message, type });
  };

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
            const mappedVariants: VariantData[] = data.product_variants.map((v: any) => ({
              id: v.id,
              color: v.color,
              sizes: v.variant_sizes ? v.variant_sizes.map((s: any) => ({
                size: s.size,
                stock: s.stock,
                original_price: s.original_price,
                discount_price: s.discount_price
              })) : [],
              images: v.product_images ? v.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => ({
                url: img.image_url
              })) : []
            }));
            
            if (color === "NEW") {
              mappedVariants.push({
                id: null,
                color: "",
                sizes: [{ size: "", stock: 0, original_price: 0, discount_price: 0 }],
                images: []
              });
            }
            
            setVariants(mappedVariants);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Variant Handlers
  const handleAddVariant = () => {
    setVariants([...variants, { id: null, color: "", sizes: [{ size: "", stock: 0, original_price: 0, discount_price: 0 }], images: [] }]);
  };

  const handleRemoveVariant = (vIndex: number) => {
    setVariants(variants.filter((_, i) => i !== vIndex));
  };

  const handleVariantColorChange = (vIndex: number, color: string) => {
    const newVariants = [...variants];
    newVariants[vIndex].color = color;
    setVariants(newVariants);
  };

  // Size Handlers
  const handleAddSize = (vIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].sizes.push({ size: "", stock: 0, original_price: 0, discount_price: 0 });
    setVariants(newVariants);
  };

  const handleRemoveSize = (vIndex: number, sIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].sizes = newVariants[vIndex].sizes.filter((_, i) => i !== sIndex);
    setVariants(newVariants);
  };

  const handleSizeChange = (vIndex: number, sIndex: number, field: keyof SizeData, value: string | number) => {
    const newVariants = [...variants];
    newVariants[vIndex].sizes[sIndex] = { ...newVariants[vIndex].sizes[sIndex], [field]: value };
    setVariants(newVariants);
  };

  // Image Handlers
  const handleImageUpload = async (vIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newVariants = [...variants];
        newVariants[vIndex].images.push({ url: json.url });
        setVariants(newVariants);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleRemoveImage = (vIndex: number, iIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].images = newVariants[vIndex].images.filter((_, i) => i !== iIndex);
    setVariants(newVariants);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert("Invalid Input", "Please enter a product name.", "warning");
      return;
    }

    // Description is now optional, no validation needed here.

    if (variants.length === 0) {
      showAlert("Invalid Input", "Please add at least one variant.", "warning");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const vNum = i + 1;

      if (!v.color.trim()) {
        showAlert("Variant Error", `Variant ${vNum}: Please enter a color name.`, "error");
        return;
      }

      if (v.images.length === 0) {
        showAlert("Variant Error", `Variant ${vNum} (${v.color}): Please upload at least one image.`, "error");
        return;
      }

      if (v.sizes.length === 0) {
        showAlert("Variant Error", `Variant ${vNum} (${v.color}): Please add at least one size.`, "error");
        return;
      }

      for (let j = 0; j < v.sizes.length; j++) {
        const s = v.sizes[j];
        const sNum = j + 1;

        if (!s.size.trim()) {
          showAlert("Size Error", `Variant ${vNum} (${v.color}), Size ${sNum}: Please enter a size name.`, "error");
          return;
        }

        if (s.original_price <= 0) {
          showAlert("Pricing Error", `Variant ${vNum} (${v.color}), Size ${sNum}: Original price must be greater than 0.`, "error");
          return;
        }

        if (s.discount_price < 0) {
          showAlert("Pricing Error", `Variant ${vNum} (${v.color}), Size ${sNum}: Discount price cannot be negative.`, "error");
          return;
        }

        if (s.discount_price > s.original_price) {
          showAlert("Pricing Error", `Variant ${vNum} (${v.color}), Size ${sNum}: Discount price cannot be greater than original price.`, "error");
          return;
        }

        if (s.stock < 0) {
          showAlert("Stock Error", `Variant ${vNum} (${v.color}), Size ${sNum}: Stock cannot be negative.`, "error");
          return;
        }
      }
    }
    
    setSaving(true);
    
    const payload = {
      id: product_id,
      subcategory_id: sub_id,
      name,
      description,
      variants
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
        showAlert("Save Failed", "Failed to save product to database.", "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("System Error", "An unexpected error occurred while saving.", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-12 text-center animate-pulse bg-zinc-100 uppercase font-black italic tracking-tighter">Loading editor...</div>;
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
          className="flex items-center gap-2 border border-black bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* CARD 1: Basic Info */}
        <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-sm font-black uppercase italic tracking-tight underline decoration-black underline-offset-4">Product Details</h2>
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

        {/* CARD 2: Variants Box */}
        <div className="border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <h2 className="text-sm font-black uppercase italic tracking-tight underline decoration-black underline-offset-4">Product Variants (Colors)</h2>

          <div className="space-y-12">
            {variants.map((v, vIndex) => (
              <ProductDetailedDescriptionVariantCard
                key={vIndex}
                variant={v}
                vIndex={vIndex}
                isRemoveVisible={variants.length > 1}
                saving={saving}
                onRemoveVariant={handleRemoveVariant}
                onColorChange={handleVariantColorChange}
                onAddSize={handleAddSize}
                onRemoveSize={handleRemoveSize}
                onSizeChange={handleSizeChange}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
              />
            ))}
          </div>

          <div className="flex justify-center border-t border-dashed border-black pt-8">
            <button 
              onClick={handleAddVariant}
              className="flex items-center gap-2 border border-black bg-white px-8 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-zinc-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Plus className="h-4 w-4" /> Add Another Variant
            </button>
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
