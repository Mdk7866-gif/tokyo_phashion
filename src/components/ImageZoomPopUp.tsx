"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.min(5, Math.max(0.5, prev - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: dragStart.current.posX + (e.clientX - dragStart.current.x),
      y: dragStart.current.posY + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: touch.clientX, y: touch.clientY, posX: position.x, posY: position.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: dragStart.current.posX + (touch.clientX - dragStart.current.x),
      y: dragStart.current.posY + (touch.clientY - dragStart.current.y),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setScale(s => Math.min(5, s + 0.5))}
          className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setScale(s => Math.max(0.5, s - 0.5))}
          className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
          className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white text-black hover:bg-zinc-100 border border-white transition-all"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={e => e.stopPropagation()}
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
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease",
            maxWidth: "90vw",
            maxHeight: "90vh",
            position: "relative",
            userSelect: "none",
          }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={1200}
            height={900}
            className="object-contain max-h-[85vh] max-w-[90vw] pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="absolute bottom-4 left-0 right-0 text-center text-[9px] font-black uppercase tracking-widest text-white/30 pointer-events-none">
        Scroll to zoom · Drag to pan · Press Esc to close
      </p>
    </div>
  );
}
