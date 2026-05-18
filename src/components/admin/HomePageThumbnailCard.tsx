"use client";

import React, { useState } from "react";
import { Upload, ImageIcon, Loader2, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import ConfirmationMessagePopUp from "../ConfirmationMessagePopUp";
import AlertMessagePopUp from "../AlertMessagePopUp";

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: "success" | "error" | "warning" | "info" }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info"
  });

  const thumbnail = category.category_thumbnails;
  const currentImage = Array.isArray(thumbnail) ? thumbnail[0]?.image_url : thumbnail?.image_url;

  const [timestamp, setTimestamp] = useState(0);

  React.useEffect(() => {
    requestAnimationFrame(() => setTimestamp(Date.now()));
  }, [currentImage]);

  const displayImage = React.useMemo(() => {
    return currentImage ? `${currentImage}?t=${timestamp}` : null;
  }, [currentImage, timestamp]);

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "error") => {
    setAlert({ isOpen: true, title, message, type });
  };

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
        showAlert("Success", "Category thumbnail updated successfully", "success");
        setImageLoading(true);
        setImageError(false);
        onUpdate();
      } else {
        const err = await res.json();
        showAlert("Upload Failed", err.error || "Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Upload failed", error);
      showAlert("Upload Failed", "An unexpected error occurred during upload", "error");
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
        showAlert("Success", "Thumbnail removed successfully", "success");
        onUpdate();
      } else {
        const err = await res.json();
        showAlert("Delete Failed", err.error || "Failed to remove thumbnail", "error");
      }
    } catch (error) {
      console.error("Delete failed", error);
      showAlert("Delete Failed", "An unexpected error occurred", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="group relative border border-black bg-white p-4 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 aspect-[4/5] relative w-full overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center group-hover:border-black transition-colors">
        {displayImage && !imageError ? (
          <>
            <Image
              src={displayImage}
              alt={category.name}
              fill
              unoptimized
              className={`object-cover transition-all duration-500 ${imageLoading ? 'scale-110 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/50">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-300">
            {imageError ? (
               <>
                 <AlertCircle className="h-10 w-10 text-red-200" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-red-300">Load Failed</span>
               </>
            ) : (
               <>
                 <ImageIcon className="h-10 w-10" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Empty</span>
               </>
            )}
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

      <AlertMessagePopUp
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}
