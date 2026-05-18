"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react";

interface ImageZoomPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export default function ImageZoomPopUp({ isOpen, onClose, imageUrl, alt = "Image" }: ImageZoomPopUpProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const touchStartRef = useRef({ distance: 0, scale: 1 });

  // Reset states when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setLoading(true);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      });
    }
  }, [isOpen, imageUrl]);

  // Handle Close on Escape keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Mouse wheel zoom helper
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.min(6, Math.max(1, prev - e.deltaY * 0.0025)));
  };

  // Drag controls for Desktop Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Mobile Touch Gestures (Pinch-to-zoom + Pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Setup pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      touchStartRef.current = { distance: dist, scale };
      setIsDragging(false);
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan with single finger when zoomed
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY, posX: position.x, posY: position.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Process pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / (touchStartRef.current.distance || 1);
      setScale(Math.min(6, Math.max(1, touchStartRef.current.scale * ratio)));
    } else if (e.touches.length === 1 && isDragging) {
      // Process pan
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPosition({
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      });
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 transition-all duration-300"
      onClick={onClose}
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setScale((s) => Math.min(6, s + 0.5))}
          className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-800 transition-all active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(1, s - 0.5))}
          className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-800 transition-all active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
          className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-800 transition-all active:scale-95"
          title="Reset View"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white text-black hover:bg-zinc-100 border border-white transition-all active:scale-95 font-bold"
          title="Close Modal"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Scale Badge */}
      <div className="absolute top-4 left-4 z-50 pointer-events-none bg-black/60 px-3 py-1.5 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-300">
        Zoom: {Math.round(scale * 100)}%
      </div>

      {/* Main Loader overlay while loading the image */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/85">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading High-Res Image...</p>
        </div>
      )}

      {/* Zoom / Pan viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={onClose}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={handleDoubleClick}
          className="relative max-w-[95vw] max-h-[90vh] transition-transform duration-75 select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={1600}
            height={1200}
            priority
            loading="eager"
            onLoad={() => setLoading(false)}
            className="object-contain max-h-[85vh] max-w-[95vw] select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* User Guides */}
      <p className="absolute bottom-4 left-0 right-0 text-center text-[9px] font-black uppercase tracking-widest text-zinc-500 pointer-events-none bg-black/40 py-2">
        Mobile: Pinch to Zoom & Drag to Pan · Desktop: Scroll Wheel / Double Click · Esc to Close
      </p>
    </div>
  );
}
