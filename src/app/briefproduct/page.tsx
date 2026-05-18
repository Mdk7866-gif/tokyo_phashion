"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ArrowRight, X, Check, Heart } from "lucide-react";

interface BriefSubcategory {
  id: string;
  name: string;
}

interface BriefProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number;
  defaultVariantId: string | null;
}

interface FilterPanelProps {
  sort: string;
  handleSortChange: (newSort: string) => void;
  availableSubs: BriefSubcategory[];
  activeSubIds: string[];
  toggleSubcategory: (subId: string) => void;
  updateUrl: (subs: string, newSort: string) => void;
}

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
];

function FilterPanel({
  sort,
  handleSortChange,
  availableSubs,
  activeSubIds,
  toggleSubcategory,
  updateUrl,
}: FilterPanelProps) {
  return (
    <div className="space-y-10">
      {/* Sort By */}
      <div>
        <h3 className="text-[9px] font-black uppercase tracking-[0.25em] mb-5 text-zinc-400">
          Sort By
        </h3>
        <div className="space-y-1">
          {sortOptions.map(option => {
            const isActive = sort === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-all group rounded-sm ${isActive ? "bg-black text-white" : "hover:bg-zinc-100 text-black"
                  }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {option.label}
                </span>
                {isActive && <Check className="h-3 w-3 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories */}
      {availableSubs.length > 0 && (
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-[0.25em] mb-5 text-zinc-400">
            Filter by Type
          </h3>
          <div className="space-y-1">
            {availableSubs.map(sub => {
              const isActive = activeSubIds.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleSubcategory(sub.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-all border ${isActive
                      ? "border-black bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                      : "border-transparent hover:border-black hover:bg-zinc-50 text-black"
                    }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {sub.name}
                  </span>
                  {isActive && <Check className="h-3 w-3 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {activeSubIds.length > 0 && (
            <button
              onClick={() => updateUrl("", sort)}
              className="mt-4 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black underline transition-colors"
            >
              Clear type filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function BriefProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category_id = searchParams.get("category_id");
  const subcategory_ids = searchParams.get("subcategory_ids") || "";
  const sort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<BriefProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryName, setCategoryName] = useState("");
  const [availableSubs, setAvailableSubs] = useState<BriefSubcategory[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Wishlist state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistedVariantIds, setWishlistedVariantIds] = useState<Set<string>>(new Set());
  const [togglingVariantIds, setTogglingVariantIds] = useState<Set<string>>(new Set());

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/user/getsidebarcategoryandsubcategory');
      if (res.ok) {
        const json = await res.json();
        const cat = json.data?.find((c: { id: string, name: string, subcategories: BriefSubcategory[] }) => c.id === category_id);
        if (cat) {
          setCategoryName(cat.name);
          setAvailableSubs(cat.subcategories || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [category_id]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (category_id) query.set("category_id", category_id);
      if (subcategory_ids) query.set("subcategory_ids", subcategory_ids);
      query.set("sort", sort);

      const res = await fetch(`/api/user/getbriefproducts?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [category_id, subcategory_ids, sort]);

  useEffect(() => {
    const loadData = async () => {
      if (category_id) {
        await Promise.all([fetchCategories(), fetchProducts()]);
      }
    };
    loadData();
  }, [category_id, fetchCategories, fetchProducts]);

  // Check auth and load wishlist on mount
  useEffect(() => {
    const checkAuthAndWishlist = async () => {
      try {
        const meRes = await fetch("/api/user/me");
        const meJson = await meRes.json();
        if (!meJson.user) return;
        setIsLoggedIn(true);

        const wRes = await fetch("/api/user/wishlist");
        if (wRes.ok) {
          const wJson = await wRes.json();
          const ids = new Set<string>(
            (wJson.data || []).map((item: { product_variant_id: string }) => item.product_variant_id)
          );
          setWishlistedVariantIds(ids);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkAuthAndWishlist();
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, product: BriefProduct) => {
    e.preventDefault();
    e.stopPropagation();

    const variantId = product.defaultVariantId;
    if (!variantId) return;

    if (!isLoggedIn) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    setTogglingVariantIds(prev => new Set(prev).add(variantId));
    const isWishlisted = wishlistedVariantIds.has(variantId);

    try {
      if (isWishlisted) {
        const res = await fetch(`/api/user/wishlist?variant_id=${variantId}`, { method: "DELETE" });
        if (res.ok) {
          setWishlistedVariantIds(prev => {
            const next = new Set(prev);
            next.delete(variantId);
            return next;
          });
          window.dispatchEvent(new Event('navbar-update'));
        }
      } else {
        const res = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_variant_id: variantId }),
        });
        if (res.ok) {
          setWishlistedVariantIds(prev => new Set(prev).add(variantId));
          window.dispatchEvent(new Event('navbar-update'));
        }
      }
    } catch (e) {
      console.error(e);
    }

    setTogglingVariantIds(prev => {
      const next = new Set(prev);
      next.delete(variantId);
      return next;
    });
  };

  const toggleSubcategory = (subId: string) => {
    const currentSubs = subcategory_ids ? subcategory_ids.split(",") : [];
    const newSubs = currentSubs.includes(subId)
      ? currentSubs.filter(id => id !== subId)
      : [...currentSubs, subId];
    updateUrl(newSubs.join(","), sort);
  };

  const handleSortChange = (newSort: string) => {
    updateUrl(subcategory_ids, newSort);
  };

  const updateUrl = (subs: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subs) params.set("subcategory_ids", subs);
    else params.delete("subcategory_ids");
    params.set("sort", newSort);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeSubIds = subcategory_ids ? subcategory_ids.split(",") : [];
  const activeFilterCount = activeSubIds.length + (sort !== "newest" ? 1 : 0);



  return (
    <div className="min-h-screen bg-white text-black pb-24">
      {/* Header */}
      <div className="border-b border-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-2xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl lg:text-6xl">
              {categoryName || "Collection"}
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {loading ? "Loading..." : `${products.length} Products`}
            </p>
          </div>
          {/* Active filter badges */}
          {activeSubIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeSubIds.map(id => {
                const sub = availableSubs.find(s => s.id === id);
                if (!sub) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 border border-black bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                  >
                    {sub.name}
                    <button onClick={() => toggleSubcategory(id)} className="hover:opacity-70">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => updateUrl("", sort)}
                className="inline-flex items-center gap-1.5 border border-black px-3 py-1 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors"
              >
                Clear All <X className="h-2.5 w-2.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Filter Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden border-b border-black pb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters & Sort
            {activeFilterCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <FilterPanel
              sort={sort}
              handleSortChange={handleSortChange}
              availableSubs={availableSubs}
              activeSubIds={activeSubIds}
              toggleSubcategory={toggleSubcategory}
              updateUrl={updateUrl}
            />
          </aside>

          {/* ── Mobile Filter Drawer ── */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="relative ml-auto w-72 h-full bg-white overflow-y-auto p-6 shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black uppercase italic tracking-tighter">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="border border-black p-1 hover:bg-zinc-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel
                  sort={sort}
                  handleSortChange={handleSortChange}
                  availableSubs={availableSubs}
                  activeSubIds={activeSubIds}
                  toggleSubcategory={toggleSubcategory}
                  updateUrl={updateUrl}
                />
                <div className="mt-12">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    Show {products.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-black animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-zinc-200 rounded w-3/4" />
                      <div className="h-3 bg-zinc-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-black">
                <p className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-2">
                  No products found
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-6">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() => updateUrl("", "newest")}
                  className="border border-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => {
                  const variantId = product.defaultVariantId;
                  const isWishlisted = variantId ? wishlistedVariantIds.has(variantId) : false;
                  const isToggling = variantId ? togglingVariantIds.has(variantId) : false;

                  return (
                    <Link
                      key={product.id}
                      href={`/detailedproduct?product_id=${product.id}`}
                      className="group flex flex-col bg-white border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                      <div className="aspect-[3/4] relative w-full overflow-hidden bg-zinc-100 border-b border-black">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase">
                            No Image
                          </div>
                        )}

                        {/* Wishlist Heart Button */}
                        {variantId && (
                          <button
                            onClick={(e) => handleToggleWishlist(e, product)}
                            disabled={isToggling}
                            className={`absolute top-2 right-2 z-10 p-1.5 border transition-all ${isWishlisted
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white border-black text-black hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                              } shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${isToggling ? "opacity-60" : ""}`}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        )}
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                        <h3 className="text-[11px] font-black uppercase italic tracking-tight line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black">₹{product.price.toFixed(0)}</p>
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BriefProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Loading collection...</p>
      </div>
    }>
      <BriefProductContent />
    </Suspense>
  );
}
