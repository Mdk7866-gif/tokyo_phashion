"use client";

import React from "react";
import { Trash2, Plus, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

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

interface ProductDetailedDescriptionVariantCardProps {
  variant: VariantData;
  vIndex: number;
  isRemoveVisible: boolean;
  saving: boolean;
  onRemoveVariant: (index: number) => void;
  onColorChange: (index: number, color: string) => void;
  onAddSize: (index: number) => void;
  onRemoveSize: (vIndex: number, sIndex: number) => void;
  onSizeChange: (vIndex: number, sIndex: number, field: keyof SizeData, value: string | number) => void;
  onImageUpload: (vIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (vIndex: number, iIndex: number) => void;
}

export default function ProductDetailedDescriptionVariantCard({
  variant,
  vIndex,
  isRemoveVisible,
  saving,
  onRemoveVariant,
  onColorChange,
  onAddSize,
  onRemoveSize,
  onSizeChange,
  onImageUpload,
  onRemoveImage
}: ProductDetailedDescriptionVariantCardProps) {
  return (
    <div className="p-4 border border-zinc-200 bg-zinc-50 relative group">
      {isRemoveVisible && (
        <button 
          onClick={() => onRemoveVariant(vIndex)}
          className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors z-10"
          title="Remove Variant"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Variant Color</label>
            <input
              type="text"
              value={variant.color}
              onChange={(e) => onColorChange(vIndex, e.target.value)}
              className="w-full max-w-xs border border-black bg-white p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="e.g. Crimson Red"
            />
          </div>
          
          <div className="pt-2 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Sizes & Pricing</label>
              <button 
                onClick={() => onAddSize(vIndex)}
                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-black hover:bg-zinc-200 px-2 py-1 transition-colors"
              >
                <Plus className="h-3 w-3" /> Size
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-white border border-zinc-200">
                <thead className="bg-zinc-100 uppercase tracking-widest text-[9px] font-black text-zinc-500">
                  <tr>
                    <th className="p-2">Size</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Orig. Price</th>
                    <th className="p-2">Disc. Price</th>
                    <th className="p-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {variant.sizes.map((s, sIndex) => (
                    <tr key={sIndex} className="border-b border-zinc-100 last:border-0">
                      <td className="p-1">
                        <input 
                          type="text" 
                          value={s.size} 
                          onChange={e => onSizeChange(vIndex, sIndex, 'size', e.target.value)} 
                          className="w-full min-w-[60px] border border-zinc-300 p-1.5 text-center focus:border-black focus:outline-none" 
                          placeholder="S, M..." 
                        />
                      </td>
                      <td className="p-1">
                        <input 
                          type="number" 
                          value={s.stock || ""} 
                          onChange={e => onSizeChange(vIndex, sIndex, 'stock', e.target.value === "" ? 0 : Number(e.target.value))} 
                          className="w-full min-w-[60px] border border-zinc-300 p-1.5 text-center focus:border-black focus:outline-none" 
                          placeholder="Stock"
                        />
                      </td>
                      <td className="p-1">
                        <input 
                          type="number" 
                          value={s.original_price || ""} 
                          onChange={e => onSizeChange(vIndex, sIndex, 'original_price', e.target.value === "" ? 0 : Number(e.target.value))} 
                          className="w-full min-w-[80px] border border-zinc-300 p-1.5 focus:border-black focus:outline-none" 
                          placeholder="Price"
                        />
                      </td>
                      <td className="p-1">
                        <input 
                          type="number" 
                          value={s.discount_price || ""} 
                          onChange={e => onSizeChange(vIndex, sIndex, 'discount_price', e.target.value === "" ? 0 : Number(e.target.value))} 
                          className="w-full min-w-[80px] border border-zinc-300 p-1.5 focus:border-black focus:outline-none" 
                          placeholder="Discount"
                        />
                      </td>
                      <td className="p-1 text-center">
                        <button onClick={() => onRemoveSize(vIndex, sIndex)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {variant.sizes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-[10px] text-zinc-400 font-bold">No sizes added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Variant Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {variant.images.map((img, iIndex) => (
              <div key={iIndex} className="group relative aspect-[3/4] border border-zinc-300 bg-white overflow-hidden">
                <Image src={img.url} alt={`${variant.color} Image ${iIndex}`} fill className="object-cover" />
                <button 
                  onClick={() => onRemoveImage(vIndex, iIndex)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white transition-opacity z-10"
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
              <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(vIndex, e)} disabled={saving} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
