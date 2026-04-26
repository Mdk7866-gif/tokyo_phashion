"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Collection {
  name: string;
  subcategories: string[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchCollections = async () => {
    if (collections.length > 0) return;
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

  const toggleShop = () => {
    const newState = !isShopOpen;
    setIsShopOpen(newState);
    if (newState) fetchCollections();
  };

  const toggleCollection = (name: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push('/');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <div 
        className={`fixed left-0 top-0 h-full w-[300px] bg-black text-white z-[101] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3 group select-none">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-none">
              東京
            </span>
            <div className="flex flex-col border-l border-white/20 pl-3 leading-none">
              <span className="text-xs font-black tracking-[0.2em] text-white">TOKYO</span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-white opacity-50 mt-1 uppercase">PHASHION</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* User Section */}
          {!authLoading && (
            <div className="space-y-4">
              {!user ? (
                <button 
                  onClick={() => { onClose(); router.push('/login'); }}
                  className="w-full bg-white text-black py-4 rounded-xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Sign In
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center font-black text-xs shrink-0">
                      {user.email ? user.email[0].toUpperCase() : "?"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Welcome back</span>
                      <span className="text-xs font-black tracking-tight truncate">{user.email || "User"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { onClose(); router.push('/account'); }}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95 text-rose-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2 pt-4">
            <Link href="/" onClick={onClose} className="flex items-center gap-4 p-3.5 bg-white/5 rounded-xl font-bold tracking-widest text-xs uppercase group transition-all hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              HOME
            </Link>
            
            <div 
              onClick={toggleShop}
              className={`flex items-center justify-between p-3.5 rounded-xl font-bold tracking-widest text-xs uppercase transition-all cursor-pointer group ${isShopOpen ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Shop
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${isShopOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>

            {/* Dynamic Collections */}
            {isShopOpen && (
              <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                {loading ? (
                  <div className="p-3 text-[9px] text-gray-500 tracking-widest uppercase animate-pulse">Loading collections...</div>
                ) : (
                  collections.map((col) => {
                    const hasSubs = col.subcategories && col.subcategories.length > 0;
                    const isExpanded = expandedCollections.has(col.name);
                    
                    return (
                      <div key={col.name} className="flex flex-col">
                        <div 
                          className={`flex items-center justify-between p-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${isExpanded ? "bg-white/5" : "hover:bg-white/5"}`}
                          onClick={() => {
                            if (hasSubs) toggleCollection(col.name);
                            else {
                              onClose();
                              router.push(`/shop?collection=${encodeURIComponent(col.name)}`);
                            }
                          }}
                        >
                          <span className="flex-1">{col.name.replace(/_/g, ' ')}</span>
                          {hasSubs && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className={`transition-transform duration-300 text-gray-400 ${isExpanded ? "rotate-180 text-white" : ""}`}
                            >
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          )}
                        </div>
                        
                        {hasSubs && isExpanded && (
                          <div className="pl-4 border-l border-white/10 ml-3 mt-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                            {col.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?collection=${encodeURIComponent(col.name)}&subcatagory=${encodeURIComponent(sub)}`}
                                onClick={onClose}
                                className="block p-2 text-[9px] text-gray-400 font-bold tracking-widest uppercase hover:text-white transition-colors"
                              >
                                {sub.replace(/_/g, ' ')}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <Link href="/about" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              ABOUT US
            </Link>
            <Link href="/blog" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white">
                <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>
              </svg>
              BLOG
            </Link>
            <Link href="/contact" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              CONTACT
            </Link>

            {/* Admin Access */}
            <div className="pt-2 mt-4 border-t border-white/10">
              <Link
                href="/admin/login"
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-lg font-bold tracking-widest text-[9px] uppercase text-white/30 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Admin
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 border-t border-white/10 bg-black">
          <p className="text-center text-[9px] uppercase font-bold tracking-[0.3em] text-gray-500">CONNECT WITH US</p>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
          <p className="text-center text-[8px] text-gray-600 tracking-[0.5em] uppercase mt-4">
            &copy; 2026 TOKYO PHASHION
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
