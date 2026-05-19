"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  if (isAdminRoute || isAuthRoute) {
    return (
      <>
        <SplashScreen />
        <div id="main-content-layout">
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <SplashScreen />
      <div id="main-content-layout" className="min-h-screen flex flex-col bg-black text-white">
        <div className="flex flex-1">
          {/* Sidebar */}
          <React.Suspense fallback={<div className="w-72 bg-white hidden lg:block border-r border-black" />}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </React.Suspense>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
