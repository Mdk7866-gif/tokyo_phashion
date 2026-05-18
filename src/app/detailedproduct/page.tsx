"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";
// ConfirmationMessagePopUp no longer needed — COD flow handled on /checkout
import PaymentMethodConfirmationPopUp from "@/components/PaymentMethodConfirmationPopUp";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Ruler, Share2, Check, Minus, Plus, Heart, Zap } from "lucide-react";

interface Size {
  id: string;
  size: string;
  stock: number;
  original_price: number;
  discount_price: number | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface ProductVariant {
  id: string;
  color: string;
  variant_sizes: Size[];
  product_images: ProductImage[];
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  categories: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  subcategory_id: string;
  subcategories: Subcategory;
  product_variants: ProductVariant[];
}

function DetailedProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const id = searchParams.get("id") || searchParams.get("product_id");
  // urlVariantId and urlSizeId are read inside fetchProduct on mount only — not reactive

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = React.useCallback((title: string, message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setAlert({ isOpen: true, title, message, type });
  }, []);

  // Wishlist state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [wishlistedVariantIds, setWishlistedVariantIds] = useState<Set<string>>(new Set());
  const isWishlisted = selectedVariant?.id ? wishlistedVariantIds.has(selectedVariant.id) : false;
  const [isPaymentPopUpOpen, setIsPaymentPopUpOpen] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  // codConfirmation removed — flow now redirects to /checkout

  // IMPORTANT: Uses window.location.search instead of reactive searchParams so that
  // calling this function does NOT trigger a re-creation of fetchProduct (avoids the
  // URL-change → searchParams update → fetchProduct re-create → useEffect re-fire loop).
  const updateQueryParams = useCallback((variantId?: string, sizeId?: string | null, productData?: Product | null) => {
    const params = new URLSearchParams(window.location.search);
    
    // Standardize on product_id
    const currentProductId = params.get("product_id") || params.get("id");
    if (currentProductId) {
      params.set("product_id", currentProductId);
      params.delete("id");
    }

    if (productData) {
      if (productData.subcategories?.categories?.name) params.set("category", productData.subcategories.categories.name.toLowerCase());
      if (productData.subcategories?.name) params.set("subcategory", productData.subcategories.name.toLowerCase());
      if (productData.subcategories?.category_id) params.set("category_id", productData.subcategories.category_id);
      if (productData.subcategory_id) params.set("subcategory_id", productData.subcategory_id);
    }
    
    if (variantId) params.set("variant_id", variantId);
    if (sizeId) {
      params.set("size_id", sizeId);
    } else if (sizeId === null) {
      params.delete("size_id");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]); // Stable — does NOT depend on searchParams

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    // Defer state updates to next microtask tick to prevent synchronous setState inside useEffect warning
    await Promise.resolve();
    setProduct(null);
    setSelectedVariant(null);
    setSelectedSize(null);
    setQuantity(1);
    try {
      const res = await fetch(`/api/user/getproductdetail?product_id=${id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setProduct(data);
          
          const params = new URLSearchParams(window.location.search);
          const currentVariantId = params.get("variant_id");
          const currentSizeId = params.get("size_id");

          if (data.product_variants && data.product_variants.length > 0) {
            let initialVariant = data.product_variants[0];
            if (currentVariantId) {
              const found = data.product_variants.find((v: ProductVariant) => v.id === currentVariantId);
              if (found) initialVariant = found;
            }
            setSelectedVariant(initialVariant);
            
            if (currentSizeId && initialVariant.variant_sizes) {
              const foundSize = initialVariant.variant_sizes.find((s: Size) => s.id === currentSizeId);
              if (foundSize) {
                setSelectedSize(foundSize);
              } else {
                const availableSize = initialVariant.variant_sizes.find((s: Size) => s.stock > 0) || initialVariant.variant_sizes[0];
                if (availableSize) {
                  setSelectedSize(availableSize);
                  updateQueryParams(initialVariant.id, availableSize.id, data);
                }
              }
            } else if (initialVariant.variant_sizes) {
              const availableSize = initialVariant.variant_sizes.find((s: Size) => s.stock > 0) || initialVariant.variant_sizes[0];
              if (availableSize) {
                setSelectedSize(availableSize);
                updateQueryParams(initialVariant.id, availableSize.id, data);
              }
            }
            
            if (initialVariant.product_images && initialVariant.product_images.length > 0) {
               const sortedImages = [...initialVariant.product_images].sort((a:ProductImage, b:ProductImage) => a.sort_order - b.sort_order);
               setMainImage(sortedImages[0].image_url);
            }

            if (!currentVariantId && !currentSizeId) {
              // Only update variant id if size auto-selection above didn't already update everything
              if (!initialVariant.variant_sizes || !initialVariant.variant_sizes.find((s:Size) => s.stock > 0)) {
                updateQueryParams(initialVariant.id);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to fetch product details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, updateQueryParams, showAlert]);

  useEffect(() => {
    if (id) {
      // Fetch new product which also resets/clears previous state inside the callback
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, fetchProduct]); // fetchProduct is now more stable

  // Preload images for all variants to ensure fast switching
  useEffect(() => {
    if (product?.product_variants) {
      product.product_variants.forEach(variant => {
        variant.product_images?.forEach(img => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = img.image_url;
          document.head.appendChild(link);
        });
      });
    }
  }, [product]);

  // Load auth + wishlist on mount
  useEffect(() => {
    const checkAuthAndWishlist = async () => {
      try {
        const meRes = await fetch("/api/user/me");
        const meJson = await meRes.json();
        if (meJson.user) {
          setIsLoggedIn(true);
          // setUserProfile removed as unused
          
          // Check if profile is incomplete
          const u = meJson.user;
          const isIncomplete = !u.name || !u.mobile_number || !u.address?.full_address || !u.address?.city || !u.address?.state || !u.address?.pincode;
          setProfileIncomplete(isIncomplete);

          const wishRes = await fetch("/api/user/wishlist");
          if (wishRes.ok) {
            const wishData = await wishRes.json();
            const ids = new Set<string>((wishData.data || []).map((item: { product_variant_id: string }) => item.product_variant_id));
            setWishlistedVariantIds(ids);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };
    checkAuthAndWishlist();
  }, []);

  // Update isWishlisted when variant changes
  // Removed useEffect for isWishlisted as it's now a derived state

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const variantId = selectedVariant?.id;
    if (!variantId) return;

    if (!isLoggedIn) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }

    setTogglingWishlist(true);
    try {
      if (isWishlisted) {
        const res = await fetch(`/api/user/wishlist?variant_id=${variantId}`, { method: "DELETE" });
        if (res.ok) {
          setWishlistedVariantIds(prev => { const n = new Set(prev); n.delete(variantId); return n; });
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
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to update wishlist", "error");
    } finally {
      setTogglingWishlist(false);
    }
  };
  let displayPrice = 0;
  let originalPrice = 0;
  
  if (selectedSize) {
     displayPrice = selectedSize.discount_price || selectedSize.original_price;
     originalPrice = selectedSize.original_price;
  } else if (selectedVariant && selectedVariant.variant_sizes && selectedVariant.variant_sizes.length > 0) {
     displayPrice = selectedVariant.variant_sizes[0].discount_price || selectedVariant.variant_sizes[0].original_price;
     originalPrice = selectedVariant.variant_sizes[0].original_price;
  }

  const handleShare = async () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedVariant) params.set("variant_id", selectedVariant.id);
    if (selectedSize) params.set("size_id", selectedSize.id);
    
    const shareableUrl = `${window.location.origin}${pathname}?${params.toString()}`;

    const shareData: ShareData = {
      title: product?.name || "Tokyo Fashion",
      text: `Check out this ${product?.name} at Tokyo Fashion for ₹${displayPrice.toFixed(0)}!`,
      url: shareableUrl,
    };

    // Try to include the image file if supported (allows direct image sharing on mobile)
    if (mainImage) {
      try {
        const response = await fetch(mainImage);
        const blob = await response.blob();
        const file = new File([blob], 'product.jpg', { type: blob.type });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      } catch (err) {
        console.error("File sharing not supported or image fetch failed:", err);
      }
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Only fallback if it's not an AbortError (user cancelled)
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
          copyToClipboard(shareableUrl);
        }
      }
    } else {
      copyToClipboard(shareableUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    setAddingToCart(true);
    try {
      // Check auth via API (no client-side Supabase)
      const meRes = await fetch("/api/user/me");
      const meJson = await meRes.json();

      if (!meJson.user) {
        // Redirect to login with current page as redirect target
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }

      const res = await fetch("/api/user/addtocart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_size_id: selectedSize.id
        })
      });

      if (res.ok) {
        showAlert("Success", "Item added to your bag", "success");
        window.dispatchEvent(new Event('navbar-update'));
      } else {
        const error = await res.json();
        showAlert("Error", error.error || "Failed to add to cart", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "An unexpected error occurred", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  // Removed updateQueryParams from here as it was moved up

  // Removed fetchProduct from here as it was moved up

  const handleVariantChange = (v: ProductVariant) => {
    if (selectedVariant?.id === v.id) return;
    
    const newImageUrl = v.product_images?.[0]?.image_url;
    if (newImageUrl) {
      setIsImageLoading(true);
    } else {
      setIsImageLoading(false);
    }

    setSelectedVariant(v);
    setMainImage(newImageUrl || "");
    // Update URL without reloading
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("variant_id", v.id);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    
    // Check if new variant has a size that matches current selection, else select first available
    if (selectedSize) {
      const matchingSize = v.variant_sizes?.find((s: Size) => s.size === selectedSize.size);
      if (matchingSize) {
        setSelectedSize(matchingSize);
        newParams.set("size_id", matchingSize.id);
      } else {
        const firstAvailable = v.variant_sizes?.find((s: Size) => s.stock > 0) || v.variant_sizes?.[0];
        if (firstAvailable) {
          setSelectedSize(firstAvailable);
          newParams.set("size_id", firstAvailable.id);
        } else {
          setSelectedSize(null);
          newParams.delete("size_id");
        }
      }
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    } else {
      const firstAvailable = v.variant_sizes?.find((s: Size) => s.stock > 0) || v.variant_sizes?.[0];
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
        newParams.set("size_id", firstAvailable.id);
      }
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  };

  const handleSizeChange = (s: Size) => {
    setSelectedSize(s);
    // If current quantity exceeds new size stock, cap it
    if (quantity > s.stock) {
      setQuantity(Math.max(1, s.stock));
    }
    if (selectedVariant) {
      updateQueryParams(selectedVariant.id, s.id);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    if (profileIncomplete) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/dashboard?tab=profile&redirectTo=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    setIsPaymentPopUpOpen(true);
  };

  const onPaymentSelect = (method: "cod" | "online") => {
    if (!selectedSize || !selectedVariant || !product) return;
    setIsPaymentPopUpOpen(false);
    const params = new URLSearchParams({
      variant_size_id: selectedSize.id,
      product_id: product.id,
      product_variant_id: selectedVariant.id,
      quantity: quantity.toString(),
      payment_method: method,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl text-zinc-300">Loading Product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl text-zinc-300">Product Not Found</div>;
  }

  const categoryName = product.subcategories?.categories?.name || "Category";
  const subcategoryName = product.subcategories?.name || "Subcategory";



  const sortedImages = selectedVariant?.product_images ? [...selectedVariant.product_images].sort((a:ProductImage, b:ProductImage) => a.sort_order - b.sort_order) : [];

  return (
    <div className="bg-white min-h-screen text-black pb-24">
      <AlertMessagePopUp
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      <PaymentMethodConfirmationPopUp
        isOpen={isPaymentPopUpOpen}
        onClose={() => setIsPaymentPopUpOpen(false)}
        onSelect={onPaymentSelect}
        subtotalAmount={(selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0) * quantity}
        hideCOD={((selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0) * quantity + 150) <= 100}
      />

      {/* COD confirmation popup removed — handled on /checkout page */}

      {/* Breadcrumb */}
      <div className="border-b border-black">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/briefproduct?category_id=${product.subcategories?.category_id}&subcategory_id=${product.subcategory_id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
            <ArrowLeft className="h-3 w-3" />
            {categoryName} / {subcategoryName}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative border border-black bg-zinc-50 overflow-hidden group">
              {/* Skeleton/Loading State */}
              <div className={`absolute inset-0 bg-zinc-100 animate-pulse flex items-center justify-center transition-opacity duration-300 ${isImageLoading ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Loading...</span>
                 </div>
              </div>

              {mainImage ? (
                <Image 
                  src={mainImage} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 50vw" 
                  priority 
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                  className={`object-cover transition-all duration-700 group-hover:scale-105 ${isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`} 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black uppercase tracking-widest text-zinc-300">No Image</div>
              )}
              {/* Wishlist Heart Overlay */}
              <button
                onClick={handleToggleWishlist}
                disabled={togglingWishlist}
                className={`absolute top-3 right-3 z-10 p-2.5 border transition-all ${
                  isWishlisted
                    ? "bg-red-500 border-red-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)]"
                    : "bg-white border-black text-black hover:bg-red-50 hover:border-red-400 hover:text-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                } ${togglingWishlist ? "opacity-60" : ""}`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
              </button>
            </div>
            
            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sortedImages.map((img: ProductImage) => (
                  <button 
                    key={img.id}
                    onClick={() => {
                      if (mainImage === img.image_url) return;
                      setIsImageLoading(true);
                      setMainImage(img.image_url);
                    }}
                    className={`aspect-[3/4] relative border cursor-pointer transition-all ${mainImage === img.image_url ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:border-black/30'}`}
                  >
                    <Image src={img.image_url} alt="Thumbnail" fill sizes="15vw" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col pt-4">
            <div className="mb-8 flex justify-between items-start relative">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl xl:text-6xl mb-4">{product.name}</h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-black">₹{displayPrice.toFixed(0)}</span>
                  {originalPrice > displayPrice && (
                    <span className="text-sm font-bold text-zinc-400 line-through">₹{originalPrice.toFixed(0)}</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className={`p-3 border border-black transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-white text-black hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'}`}
                  title={copied ? "Copied!" : "Share Product"}
                >
                  {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                </button>
                {copied && (
                  <span className="absolute -bottom-8 right-0 bg-black text-white text-[9px] px-2 py-1 uppercase font-black tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                    Link Copied
                  </span>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">Color: <span className="text-zinc-500">{selectedVariant?.color}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.product_variants?.map((v: ProductVariant) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedVariant?.id === v.id 
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-[2px] translate-y-[2px]' 
                        : 'bg-white text-black border border-black hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Select Size</h3>
                <button className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
                  <Ruler className="h-3 w-3" /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {selectedVariant?.variant_sizes?.map((s: Size) => {
                  const isOutOfStock = s.stock <= 0;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSizeChange(s)}
                      className={`
                        py-3 text-[10px] font-black uppercase tracking-widest transition-all border border-black
                        ${isOutOfStock ? 'opacity-50 line-through decoration-red-500 decoration-2' : ''}
                        ${selectedSize?.id === s.id 
                          ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-[2px] translate-y-[2px]' 
                          : 'bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }
                      `}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                 <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${selectedSize.stock <= 0 ? 'text-red-600' : selectedSize.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                   {selectedSize.stock <= 0 ? 'Out of Stock' : `In Stock: ${selectedSize.stock}`}
                 </p>
              )}
            </div>

             {/* Quantity */}
             <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Quantity</h3>
                  {selectedSize && (
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedSize.stock <= 5 ? 'text-amber-600' : 'text-zinc-400'}`}>
                      {selectedSize.stock} available
                    </span>
                  )}
                </div>
                <div className="flex items-center border border-black w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-zinc-100 transition-colors border-r border-black disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      const max = selectedSize ? selectedSize.stock : 99;
                      setQuantity(Math.min(val, max));
                    }}
                    className="w-12 text-center text-xs font-black bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(quantity + 1, selectedSize?.stock || 1))}
                    className="p-3 hover:bg-zinc-100 transition-colors border-l border-black disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={selectedSize ? quantity >= selectedSize.stock : false}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
             </div>

            {/* Actions */}
            <div className="mb-12 space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || addingToCart || (selectedSize?.stock ?? 0) <= 0}
                className={`w-full flex items-center justify-center gap-2 border border-black py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  !selectedSize || addingToCart || (selectedSize?.stock ?? 0) <= 0
                    ? 'opacity-30 cursor-not-allowed bg-zinc-100 text-zinc-400' 
                    : 'bg-white text-black hover:bg-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {addingToCart ? "Adding..." : (selectedSize?.stock ?? 0) <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={!selectedSize || (selectedSize?.stock ?? 0) <= 0}
                className={`w-full flex items-center justify-center gap-2 border border-black py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  !selectedSize || (selectedSize?.stock ?? 0) <= 0
                    ? 'opacity-30 cursor-not-allowed bg-zinc-100 text-zinc-400' 
                    : 'bg-black text-white hover:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1'
                }`}
              >
                <Zap className="h-4 w-4 fill-current" />
                {(selectedSize?.stock ?? 0) <= 0 ? "Unavailable" : "Buy Now"}
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-black pt-8 mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4">Details</h3>
              <div className="text-sm font-medium leading-relaxed text-zinc-600 whitespace-pre-line">
                {product.description || "No description available for this product."}
              </div>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-4 border border-black bg-zinc-50 p-6">
              <div className="flex flex-col gap-2">
                <Truck className="h-5 w-5" />
                <h4 className="text-[9px] font-black uppercase tracking-widest">Free Shipping</h4>
                <p className="text-[10px] text-zinc-500">On all orders over $150</p>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="text-[9px] font-black uppercase tracking-widest">Authentic</h4>
                <p className="text-[10px] text-zinc-500">100% verified genuine</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailedProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl text-zinc-300">
        Loading Product...
      </div>
    }>
      <DetailedProductContent />
    </Suspense>
  );
}
