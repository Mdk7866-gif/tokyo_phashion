'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

/**
 * Routes where the global Navbar / Footer / BackToTop should be hidden.
 * The login page gets its own fullscreen standalone UI.
 */
const NO_SHELL_PATHS = ['/login', '/admin'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      {!hideShell && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideShell && <Footer />}
      {!hideShell && <BackToTop />}
    </>
  );
}
