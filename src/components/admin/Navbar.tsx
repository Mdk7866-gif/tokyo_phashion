"use client";

import React from "react";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Link from "next/link";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-black bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="rounded-md p-2 hover:bg-zinc-100 lg:hidden transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="h-6 w-px bg-zinc-200 hidden sm:block mx-2" />
          <h2 className="hidden text-[10px] font-black uppercase tracking-widest sm:block text-zinc-400">
            Admin Panel
          </h2>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-black bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit
          </button>
        </div>
      </div>
    </header>
  );
}
