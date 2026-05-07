"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Trash2, 
  Pencil,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ConfirmationMessagePopUp from "../ConfirmationMessagePopUp";
import Logo from "@/components/Logo";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  
  interface Subcategory {
    id: string;
    name: string;
  }
  interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCatSection, setShowCatSection] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*, subcategories(*)')
      .order('name');
    if (data) setCategories(data as unknown as Category[]);
  }, [supabase]);

  // Fetch categories on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
    };
    loadData();
  }, [fetchCategories]);

  const toggleCategory = (id: string) => {
    setExpandedCatIds(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setLoading(true);
    const res = await fetch('/api/admin/crudcategory', {
      method: 'POST',
      body: JSON.stringify({ name: newCatName })
    });
    if (res.ok) {
      setNewCatName("");
      fetchCategories();
    }
    setLoading(false);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editValue) return;
    setLoading(true);
    const res = await fetch('/api/admin/crudcategory', {
      method: 'PATCH',
      body: JSON.stringify({ id, name: editValue })
    });
    if (res.ok) {
      setEditingId(null);
      fetchCategories();
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure? This will permanently remove this category and all its subcategories.",
      onConfirm: async () => {
        setLoading(true);
        const res = await fetch('/api/admin/crudcategory', {
          method: 'DELETE',
          body: JSON.stringify({ id })
        });
        if (res.ok) fetchCategories();
        setLoading(false);
      }
    });
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !selectedCatId) return;
    setLoading(true);
    const res = await fetch('/api/admin/crudsubcategory', {
      method: 'POST',
      body: JSON.stringify({ category_id: selectedCatId, name: newSubName })
    });
    if (res.ok) {
      setNewSubName("");
      fetchCategories();
    }
    setLoading(false);
  };

  const handleUpdateSubcategory = async (id: string) => {
    if (!editValue) return;
    setLoading(true);
    const res = await fetch('/api/admin/crudsubcategory', {
      method: 'PATCH',
      body: JSON.stringify({ id, name: editValue })
    });
    if (res.ok) {
      setEditingId(null);
      fetchCategories();
    }
    setLoading(false);
  };

  const handleDeleteSubcategory = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Subcategory",
      message: "Are you sure you want to remove this subcategory?",
      onConfirm: async () => {
        setLoading(true);
        const res = await fetch('/api/admin/crudsubcategory', {
          method: 'DELETE',
          body: JSON.stringify({ id })
        });
        if (res.ok) fetchCategories();
        setLoading(false);
      }
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-72 transform border-r border-black bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black px-6">
          <Link href="/admin" className="flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-zinc-100 rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col gap-1 p-4">
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 text-[13px] font-black uppercase tracking-widest transition-all ${
                pathname === "/admin"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/admin/homepagethumbnail"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 text-[13px] font-black uppercase tracking-widest transition-all ${
                pathname === "/admin/homepagethumbnail"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Homepage Thumbnails
            </Link>

            <div className="mt-6">
              <button 
                onClick={() => setShowCatSection(!showCatSection)}
                className="flex w-full items-center justify-between px-2 mb-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-black"
              >
                Category Management
                {showCatSection ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              {showCatSection && (
                <div className="space-y-6">
                  {/* Add Main Category Form */}
                  <form onSubmit={handleAddCategory} className="px-2">
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="New Category..."
                        className="flex-1 border border-zinc-200 bg-zinc-50 px-2 py-2 text-[11px] font-bold focus:border-black focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-black p-2 text-white hover:bg-zinc-800 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </form>

                  {/* List of Categories */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto px-2">
                    {categories.map((cat) => {
                      const isExpanded = expandedCatIds.includes(cat.id);
                      return (
                        <div key={cat.id} className="border-l-2 border-zinc-100 pl-3 py-1">
                          <div className="flex items-center justify-between group">
                            {editingId === cat.id ? (
                              <div className="flex flex-1 gap-1">
                                <input 
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="flex-1 border border-black px-1 py-0.5 text-[11px] font-bold"
                                />
                                <button onClick={() => handleUpdateCategory(cat.id)} className="bg-black text-white px-1 text-[10px]">SAVE</button>
                                <button onClick={() => setEditingId(null)} className="text-[10px] uppercase">X</button>
                              </div>
                            ) : (
                              <>
                                <button 
                                  onClick={() => toggleCategory(cat.id)}
                                  className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2 flex-1 text-left"
                                >
                                  {isExpanded ? <ChevronDown className="h-3 w-3 text-black" /> : <ChevronRight className="h-3 w-3 text-zinc-400" />}
                                  {cat.name}
                                </button>
                                <div className="flex items-center gap-1 transition-opacity">
                                  <button onClick={() => {setEditingId(cat.id); setEditValue(cat.name);}} className="p-1 hover:bg-zinc-100 rounded">
                                    <Pencil className="h-2.5 w-2.5 text-zinc-400" />
                                  </button>
                                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 hover:bg-red-50 rounded">
                                    <Trash2 className="h-2.5 w-2.5 text-red-400" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (!isExpanded) toggleCategory(cat.id);
                                      setSelectedCatId(selectedCatId === cat.id ? null : cat.id);
                                    }}
                                    className={`p-1 rounded transition-colors ${selectedCatId === cat.id ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Subcategories list */}
                          {isExpanded && (
                            <div className="mt-2 ml-2 space-y-2 animate-in fade-in duration-300">
                              {cat.subcategories?.map((sub: Subcategory) => (
                                <div key={sub.id} className="flex items-center justify-between group/sub">
                                  {editingId === sub.id ? (
                                    <div className="flex flex-1 gap-1">
                                      <input 
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 border border-black px-1 py-0.5 text-[11px] font-bold"
                                      />
                                      <button onClick={() => handleUpdateSubcategory(sub.id)} className="bg-black text-white px-1 text-[10px]">SAVE</button>
                                      <button onClick={() => setEditingId(null)} className="text-[10px] uppercase">X</button>
                                    </div>
                                  ) : (
                                    <>
                                      <Link 
                                        href={`/admin/product?category=${cat.name}&subcategory=${sub.name}&cat_id=${cat.id}&sub_id=${sub.id}`}
                                        onClick={onClose}
                                        className="flex flex-1 items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase hover:text-black transition-colors"
                                      >
                                        <Tag className="h-2.5 w-2.5" />
                                        {sub.name}
                                      </Link>
                                      <div className="flex items-center gap-1 transition-opacity">
                                        <button onClick={() => {setEditingId(sub.id); setEditValue(sub.name);}} className="p-1 hover:bg-zinc-100 rounded">
                                          <Pencil className="h-2 w-2 text-zinc-400" />
                                        </button>
                                        <button onClick={() => handleDeleteSubcategory(sub.id)} className="p-1 hover:bg-red-50 rounded">
                                          <Trash2 className="h-2 w-2 text-red-400" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}

                              {/* Inline Add Subcategory Form */}
                              {selectedCatId === cat.id && (
                                <form onSubmit={handleAddSubcategory} className="mt-3 ml-2 animate-in slide-in-from-left-2 duration-200">
                                  <div className="flex gap-1">
                                    <input
                                      autoFocus
                                      type="text"
                                      value={newSubName}
                                      onChange={(e) => setNewSubName(e.target.value)}
                                      placeholder={`Sub to ${cat.name}...`}
                                      className="flex-1 border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[11px] font-bold focus:border-black focus:outline-none"
                                    />
                                    <button type="submit" disabled={loading} className="bg-zinc-200 p-1.5 hover:bg-black hover:text-white transition-colors">
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </nav>
        </div>

        <div className="border-t border-black bg-zinc-50 p-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-black flex items-center justify-center text-white text-xs font-black">
              AD
            </div>
            <div>
              <p className="text-[13px] font-bold">System Admin</p>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Master</p>
            </div>
          </div>
        </div>
      </aside>

      <ConfirmationMessagePopUp
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="warning"
        confirmText="Confirm Delete"
        cancelText="Keep it"
      />
    </>
  );
}
