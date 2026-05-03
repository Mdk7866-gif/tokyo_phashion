"use client";

import React, { useState } from "react";
import { Upload, ImageIcon, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import ConfirmationMessagePopUp from "../ConfirmationMessagePopUp";

interface Category {
  id: string;
  name: string;
  category_thumbnails?: {
    image_url: string;
  } | {
    image_url: string;
  }[] | null;
}

interface HomePageThumbnailCardProps {
  category: Category;
  onUpdate: () => void;
}

export default function HomePageThumbnailCard({ category, onUpdate }: HomePageThumbnailCardProps) {
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const thumbnail = category.category_thumbnails;
  const currentImage = Array.isArray(thumbnail) ? thumbnail[0]?.image_url : thumbnail?.image_url;
  const displayImage = currentImage ? `${currentImage}?t=${Date.now()}` : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category_id', category.id);

    try {
      const res = await fetch('/api/admin/crudhomepagethumnail', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/admin/crudhomepagethumnail', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: category.id }),
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="group relative border border-black bg-white p-4 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 aspect-[4/5] relative w-full overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-300">
            <ImageIcon className="h-12 w-12" />
            <span className="text-[10px] font-black uppercase tracking-widest">No Thumbnail</span>
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</p>
          <h3 className="truncate text-sm font-black uppercase italic tracking-tight" title={category.name}>
            {category.name}
          </h3>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {currentImage && (
            <button 
              onClick={handleDelete} 
              disabled={uploading}
              className="bg-red-50 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <label className="cursor-pointer bg-black p-2 text-white transition-colors hover:bg-zinc-800">
            <Upload className="h-4 w-4" />
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={uploading} />
          </label>
        </div>
      </div>

      <ConfirmationMessagePopUp
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Thumbnail"
        message={`Are you sure you want to remove the thumbnail for ${category.name}?`}
        confirmText="Remove"
        type="warning"
      />
    </div>
  );
}
