"use client";

import React, { useEffect, useState } from "react";
import { useAlert } from "@/components/AlertMessageCard";

import Link from "next/link";

interface Collection {
  name: string;
  subcategories?: string[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  // Manage expanded state for each collection
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  // Manage state for adding new subcategories
  const [newSubcategories, setNewSubcategories] = useState<Record<string, string>>({});
  const [addingSubcategory, setAddingSubcategory] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchCollections();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/getallcollection');
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/createcollection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName: newCollectionName.trim().toLowerCase().replace(/\s+/g, '_') })
      });
      const data = await res.json();
      if (res.ok) {
        setNewCollectionName("");
        fetchCollections();
        showAlert({ type: "success", message: "Collection created successfully." });
      } else {
        showAlert({ type: "error", message: data.error || "Failed to create collection" });
      }
    } catch (err) {
      console.error("Failed to add collection:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCollection = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent toggle expand
    showAlert({
      type: "confirm",
      message: `Are you sure you want to delete the collection '${name}'? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/deletecollection?name=${encodeURIComponent(name)}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            fetchCollections();
            showAlert({ type: "success", message: "Collection deleted successfully." });
          } else {
            const data = await res.json();
            showAlert({ type: "error", message: data.error || "Failed to delete collection" });
          }
        } catch (err) {
          console.error("Failed to delete collection:", err);
          showAlert({ type: "error", message: "An error occurred while deleting the collection." });
        }
      }
    });
  };

  const toggleCollection = (name: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleAddSubcategory = async (colName: string) => {
    const subcat = newSubcategories[colName];
    if (!subcat || !subcat.trim()) return;
    
    setAddingSubcategory(prev => ({ ...prev, [colName]: true }));
    try {
      const res = await fetch('/api/admin/createsubcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          collectionName: colName, 
          subcategory: subcat.trim().toLowerCase().replace(/\s+/g, '_') 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNewSubcategories(prev => ({ ...prev, [colName]: "" }));
        fetchCollections(); // refresh to show new subcategory
        showAlert({ type: "success", message: "Subcategory created successfully." });
      } else {
        showAlert({ type: "error", message: data.error || "Failed to create subcategory" });
      }
    } catch (err) {
      console.error("Failed to add subcategory:", err);
    } finally {
      setAddingSubcategory(prev => ({ ...prev, [colName]: false }));
    }
  };

  const handleDeleteSubcategory = async (colName: string, subName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    showAlert({
      type: "confirm",
      message: `Are you sure you want to delete subcategory "${subName}"? All products within this subcategory will be deleted.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/deletesubcategory?collection=${colName}&subcategory=${subName}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            fetchCollections();
            showAlert({ type: "success", message: "Subcategory deleted successfully." });
          } else {
            const data = await res.json();
            showAlert({ type: "error", message: data.error || "Failed to delete subcategory" });
          }
        } catch (err) {
          console.error("Failed to delete subcategory:", err);
          showAlert({ type: "error", message: "An error occurred while deleting the subcategory." });
        }
      }
    });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <div 
        className={`fixed left-0 top-0 h-full w-[320px] bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 group select-none">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-none">
              東京
            </span>
            <div className="flex flex-col border-l border-white/20 pl-3 leading-none">
              <span className="text-xs font-black tracking-[0.2em] text-white">ADMIN</span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-white opacity-50 mt-1 uppercase">PANEL</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Main Menus */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Main Menu</h3>
            <div className="space-y-1">
              {[
                { label: "Dashboard", path: "/admin" },
                { label: "Customer", path: "/admin/customer" },
                { label: "Order Received", path: "/admin/orderreceived" },
                { label: "Order Delivered", path: "/admin/orderdelivered" },
                { label: "Order Cancelled", path: "/admin/ordercancelled" },
                { label: "Forms", path: "/admin/form" }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={onClose}
                  className="block p-3 rounded-lg text-sm font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Add Collection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">Add Collection</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..." 
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 outline-none focus:border-white/40 transition-colors text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
              />
              <button 
                onClick={handleAddCollection}
                disabled={isAdding}
                className="bg-white text-black px-4 rounded-lg font-bold text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                aria-label="Add Collection"
              >
                {isAdding ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "+"
                )}
              </button>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Manage Collections */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">Manage Collections</h3>
            <div className="space-y-2">
              {loading ? (
                <div className="p-3 text-[10px] text-gray-500 tracking-widest uppercase animate-pulse">Loading collections...</div>
              ) : collections.length === 0 ? (
                <div className="p-3 text-[10px] text-gray-500 tracking-widest uppercase">No collections found.</div>
              ) : (
                collections.map((col) => {
                  const isExpanded = expandedCollections.has(col.name);
                  return (
                    <div key={col.name} className="flex flex-col">
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg group transition-colors cursor-pointer ${isExpanded ? "bg-white/10" : "bg-white/5 hover:bg-white/10"}`}
                        onClick={() => toggleCollection(col.name)}
                      >
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 shrink-0 text-gray-400 ${isExpanded ? "rotate-180 text-white" : ""}`}
                          >
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                          <span className="text-sm font-bold tracking-wider uppercase truncate">
                            {col.name.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteCollection(col.name, e)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition-colors opacity-100 md:opacity-50 md:hover:opacity-100 shrink-0 ml-2"
                          title="Delete Collection"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                          </svg>
                        </button>
                      </div>

                      {/* Subcategories */}
                      {isExpanded && (
                        <div className="pl-4 border-l border-white/10 ml-4 mt-2 mb-2 space-y-2">
                          {col.subcategories && col.subcategories.length > 0 ? (
                            col.subcategories.map((sub) => (
                              <div key={sub} className="flex items-center justify-between group/sub hover:bg-white/5 rounded-md pr-2 transition-colors">
                                <Link
                                  href={`/admin/?collection=${col.name}&subcategory=${sub}`}
                                  onClick={onClose}
                                  className="flex-1 p-2 text-[11px] text-gray-400 font-bold tracking-widest uppercase hover:text-white transition-colors truncate"
                                >
                                  {sub.replace(/_/g, ' ')}
                                </Link>
                                <button 
                                  onClick={(e) => handleDeleteSubcategory(col.name, sub, e)}
                                  className="p-1 text-red-500/60 hover:text-red-500 transition-colors shrink-0"
                                  title="Delete Subcategory"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                  </svg>
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-[10px] text-gray-600 tracking-widest uppercase">No subcategories</div>
                          )}
                          
                          {/* Add Subcategory */}
                          <div className="flex gap-2 mt-2 pr-2">
                            <input 
                              type="text" 
                              value={newSubcategories[col.name] || ""}
                              onChange={(e) => setNewSubcategories(prev => ({ ...prev, [col.name]: e.target.value }))}
                              placeholder="New subcategory..." 
                              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 outline-none focus:border-white/30 transition-colors text-[11px]"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory(col.name)}
                            />
                            <button 
                              onClick={() => handleAddSubcategory(col.name)}
                              disabled={addingSubcategory[col.name]}
                              className="bg-white/20 text-white px-3 rounded-lg font-bold text-xs tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center"
                            >
                              {addingSubcategory[col.name] ? (
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : "+"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SideBar;
