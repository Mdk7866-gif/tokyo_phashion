"use client";

import { usePathname } from "next/navigation";
import Loading from "./loading";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage && <Loading />}
      {children}
    </>
  );
}
