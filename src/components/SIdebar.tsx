"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  Home, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  User, 
  LogOut, 
  LayoutDashboard,
  ShoppingBag
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
    fetchCategories();
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/getsidebarcategoryandsubcategory');
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const response = await fetch('/api/user/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = "/";
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCatIds(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 transform border-r border-black bg-white text-black transition-transform duration-500 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-black">
          <Link href="/" className="text-xl font-black uppercase italic tracking-tighter">
            Tokyo <span className="opacity-40 font-light">Fashion</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-black hover:text-white lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          
          {/* SECTION 1: USER ACCOUNT */}
          <div className="p-6 border-b border-zinc-100">
            {user ? (
              <div className="space-y-4">
                <div className="px-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Account</p>
                  <p className="text-[11px] font-bold text-black truncate mt-1">{user.email}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
               
                  <Link 
                    href="/dashboard" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest border border-black hover:bg-zinc-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-black hover:bg-zinc-800 transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={onClose}
                className="flex items-center justify-center gap-3 px-4 py-4 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>

          {/* SECTION 2: NAVIGATION & CATEGORIES */}
          <div className="flex-1 p-6 space-y-8">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  pathname === "/" ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
              >
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  pathname === "/about" ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
              >
                <Info className="h-3.5 w-3.5" /> Our Story
              </Link>
            </nav>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Collections</p>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const isExpanded = expandedCatIds.includes(cat.id);
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="flex w-full items-center justify-between px-3 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all border-l-2 border-transparent hover:border-black"
                      >
                        <span className="flex items-center gap-3">
                          <ShoppingBag className="h-3.5 w-3.5 opacity-40" />
                          {cat.name}
                        </span>
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-8 space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
                          {cat.subcategories?.map((sub: any) => (
                            <Link
                              key={sub.id}
                              href={`/shop?category=${cat.id}&sub=${sub.id}`}
                              onClick={onClose}
                              className="block px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase hover:text-black transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: SOCIALS */}
          <div className="p-6 mt-auto border-t border-zinc-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Connect</p>
            <div className="flex gap-4 px-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              {/* Add more social buttons here later */}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
