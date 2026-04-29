"use client";

import { usePathname } from "next/navigation";
import Loading from "./loading";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Only show loading on exact home page path
    setIsHomePage(pathname === "/");
  }, [pathname]);

  return (
    <>
      {/* 
        Key is important here to force a fresh component instance 
        whenever the pathname changes back to home.
      */}
      {isHomePage && <Loading key={`home-loader-${pathname}`} />}
      {children}
    </>
  );
}
