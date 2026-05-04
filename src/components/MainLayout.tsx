"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSplashChecking, setIsSplashChecking] = useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setIsSplashChecking(false);
    }
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  // If we are showing the splash, we wait for it to signal completion or just hide content
  // We'll pass a callback to SplashScreen or just use a shared logic.
  // For now, let's just make sure the main content doesn't flash.


  if (isAdminRoute || isAuthRoute) {
    return (
      <>
        <SplashScreen onComplete={() => setIsSplashChecking(false)} />
        <div className={isSplashChecking ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <SplashScreen onComplete={() => setIsSplashChecking(false)} />
      <div className={`min-h-screen flex flex-col bg-black text-white ${isSplashChecking ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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


