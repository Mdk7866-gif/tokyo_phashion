"use client";

import HeroSectionCard from "@/components/homepage/HeroSectionCard";
import NewTrendCard from "@/components/homepage/NewTrendCard";
import CatagoriesOuterCard from "@/components/homepage/CatagoriesOuterCard";
import UnderCard from "@/components/homepage/UnderCard";

/* ── Thin section divider ── */
function SectionDivider() {
  return (
    <div className="relative flex items-center w-full my-8 md:my-14 max-w-[1200px] mx-auto px-4">
      <div className="flex-1 h-px bg-red-800" />
      <span className="mx-4 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase text-red-800 whitespace-nowrap select-none">
        TOKYO FASHION
      </span>
      <div className="flex-1 h-px bg-red-800" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* ─── 1. HERO SECTION ─────────────────────────────── */}
      <div className="w-full">
        <HeroSectionCard />
      </div>

      <SectionDivider />

      <div className="w-full max-w-[1200px] mx-auto">
        {/* ─── 2. NEW TRENDS ───────────────────────────────── */}
        <NewTrendCard />

        <SectionDivider />

        {/* ─── 3. CATEGORIES ───────────────────────────────── */}
        <CatagoriesOuterCard />

        <SectionDivider />

        {/* ─── 4. BUDGET PICKS (Under ₹499 / ₹999) ─────────── */}
        <UnderCard />
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

    </div>
  );
}
