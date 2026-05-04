"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AlertMessagePopUp from "@/components/AlertMessagePopUp";
import ConfirmationMessagePopUp from "@/components/ConfirmationMessagePopUp";
import PaymentMethodConfirmationPopUp from "@/components/PaymentMethodConfirmationPopUp";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Ruler, Share2, Check, Minus, Plus, Heart, Zap } from "lucide-react";

export default function DetailedProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const id = searchParams.get("id") || searchParams.get("product_id");
  const urlVariantId = searchParams.get("variant_id");
  const urlSizeId = searchParams.get("size_id");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const showAlert = (title: string, message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setAlert({ isOpen: true, title, message, type });
  };

  // Wishlist state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [wishlistedVariantIds, setWishlistedVariantIds] = useState<Set<string>>(new Set());
  const [isPaymentPopUpOpen, setIsPaymentPopUpOpen] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [codConfirmation, setCodConfirmation] = useState({
    isOpen: false,
    total: 0
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Load auth + wishlist on mount
  useEffect(() => {
    const checkAuthAndWishlist = async () => {
      try {
        const meRes = await fetch("/api/user/me");
        const meJson = await meRes.json();
        if (meJson.user) {
          setIsLoggedIn(true);
          setUserProfile(meJson.user);
          
          // Check if profile is incomplete
          const u = meJson.user;
          const isIncomplete = !u.name || !u.mobile_number || !u.address?.full_address || !u.address?.city || !u.address?.state || !u.address?.pincode;
          setProfileIncomplete(isIncomplete);

          const wishRes = await fetch("/api/user/wishlist");
          if (wishRes.ok) {
            const wishData = await wishRes.json();
            const ids = new Set<string>((wishData.data || []).map((item: any) => item.product_variant_id));
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
  useEffect(() => {
    if (selectedVariant?.id) {
      setIsWishlisted(wishlistedVariantIds.has(selectedVariant.id));
    }
  }, [selectedVariant, wishlistedVariantIds]);

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
          setIsWishlisted(false);
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
          setIsWishlisted(true);
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
  const handleShare = () => {
    const shareableUrl = window.location.href;
    navigator.clipboard.writeText(shareableUrl);
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

  const updateQueryParams = (variantId?: string, sizeId?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (product) {
      if (product.subcategories?.categories?.name) params.set("category", product.subcategories.categories.name.toLowerCase());
      if (product.subcategories?.name) params.set("subcategory", product.subcategories.name.toLowerCase());
      if (product.subcategories?.category_id) params.set("category_id", product.subcategories.category_id);
      if (product.subcategory_id) params.set("subcategory_id", product.subcategory_id);
    }
    
    if (variantId) {
      params.set("variant_id", variantId);
    }
    
    if (sizeId) {
      params.set("size_id", sizeId);
    } else if (sizeId === null) {
      params.delete("size_id");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/getproductdetail?product_id=${id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setProduct(data);
          
          if (data.product_variants && data.product_variants.length > 0) {
            let initialVariant = data.product_variants[0];
            if (urlVariantId) {
              const found = data.product_variants.find((v: any) => v.id === urlVariantId);
              if (found) initialVariant = found;
            }
            setSelectedVariant(initialVariant);
            
            if (urlSizeId && initialVariant.variant_sizes) {
              const foundSize = initialVariant.variant_sizes.find((s: any) => s.id === urlSizeId);
              if (foundSize && foundSize.stock > 0) setSelectedSize(foundSize);
            }
            
            if (initialVariant.product_images && initialVariant.product_images.length > 0) {
               const sortedImages = [...initialVariant.product_images].sort((a:any,b:any) => a.sort_order - b.sort_order);
               setMainImage(sortedImages[0].image_url);
            }

            if (!urlVariantId) {
              updateQueryParams(initialVariant.id);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to fetch product details", "error");
    }
    setLoading(false);
  };

  const handleVariantChange = (v: any) => {
    setSelectedVariant(v);
    setMainImage(v.product_images?.[0]?.image_url || "");
    // Update URL without reloading
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("variant_id", v.id);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    
    // Check if new variant has a size that matches current selection, else reset size
    if (selectedSize) {
      const matchingSize = v.variant_sizes?.find((s: any) => s.size === selectedSize.size);
      if (matchingSize) {
        setSelectedSize(matchingSize);
        newParams.set("size_id", matchingSize.id);
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      } else {
        setSelectedSize(null);
        newParams.delete("size_id");
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      }
    }
  };

  const handleSizeChange = (s: any) => {
    setSelectedSize(s);
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
    // For now, we show a success message as the order system is pending
    const subtotal = (selectedSize ? (selectedSize.discount_price || selectedSize.original_price) : 0) * quantity;
    const total = subtotal + 49;

    if (method === "cod") {
      setCodConfirmation({ isOpen: true, total });
    } else {
      setIsPaymentPopUpOpen(false);
      showAlert(
        "Order Initialized", 
        `Redirecting to secure online payment gateway for ₹${total}...`, 
        "info"
      );
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl text-zinc-300">Loading Product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase italic tracking-tighter text-2xl text-zinc-300">Product Not Found</div>;
  }

  const categoryName = product.subcategories?.categories?.name || "Category";
  const subcategoryName = product.subcategories?.name || "Subcategory";

  let displayPrice = 0;
  let originalPrice = 0;
  
  if (selectedSize) {
     displayPrice = selectedSize.discount_price || selectedSize.original_price;
     originalPrice = selectedSize.original_price;
  } else if (selectedVariant && selectedVariant.variant_sizes && selectedVariant.variant_sizes.length > 0) {
     displayPrice = selectedVariant.variant_sizes[0].discount_price || selectedVariant.variant_sizes[0].original_price;
     originalPrice = selectedVariant.variant_sizes[0].original_price;
  }

  const sortedImages = selectedVariant?.product_images ? [...selectedVariant.product_images].sort((a:any, b:any) => a.sort_order - b.sort_order) : [];

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
      />

      <ConfirmationMessagePopUp
        isOpen={codConfirmation.isOpen}
        onClose={() => setCodConfirmation({ ...codConfirmation, isOpen: false })}
        onConfirm={() => {
          setCodConfirmation({ ...codConfirmation, isOpen: false });
          setIsPaymentPopUpOpen(false);
          showAlert("Order Confirmed", "Your COD order has been placed successfully. Please pay the advance ₹100 via the link sent to your email.", "success");
        }}
        title="Confirm COD Advance"
        message={`You have to pay ₹100 now via online to confirm your order. The remaining balance of ₹${codConfirmation.total - 100} is payable at the time of delivery.`}
        confirmText="Pay ₹100 & Confirm"
        type="info"
      />

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
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
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
                {sortedImages.map((img: any) => (
                  <button 
                    key={img.id}
                    onClick={() => setMainImage(img.image_url)}
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
                {product.product_variants?.map((v: any) => (
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
                {selectedVariant?.variant_sizes?.map((s: any) => {
                  const isOutOfStock = s.stock <= 0;
                  return (
                    <button
                      key={s.id}
                      onClick={() => !isOutOfStock && handleSizeChange(s)}
                      disabled={isOutOfStock}
                      className={`
                        py-3 text-[10px] font-black uppercase tracking-widest transition-all border border-black
                        ${isOutOfStock ? 'opacity-30 cursor-not-allowed bg-zinc-100' : ''}
                        ${selectedSize?.id === s.id 
                          ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-[2px] translate-y-[2px]' 
                          : (!isOutOfStock ? 'bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : '')
                        }
                      `}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {selectedSize?.stock > 0 && selectedSize?.stock <= 5 && (
                 <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-red-500">Only {selectedSize.stock} left in stock!</p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
               <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">Quantity</h3>
               <div className="flex items-center border border-black w-fit">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="p-3 hover:bg-zinc-100 transition-colors border-r border-black"
                 >
                   <Minus className="h-3 w-3" />
                 </button>
                 <input 
                   type="number" 
                   value={quantity}
                   onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                   className="w-12 text-center text-xs font-black bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 />
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="p-3 hover:bg-zinc-100 transition-colors border-l border-black"
                 >
                   <Plus className="h-3 w-3" />
                 </button>
               </div>
            </div>

            {/* Actions */}
            <div className="mb-12 space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || addingToCart}
                className={`w-full flex items-center justify-center gap-2 border border-black py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  !selectedSize || addingToCart
                    ? 'opacity-30 cursor-not-allowed bg-zinc-100 text-zinc-400' 
                    : 'bg-white text-black hover:bg-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {addingToCart ? "Adding..." : "Add to Bag"}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-2 border border-black py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  !selectedSize
                    ? 'opacity-30 cursor-not-allowed bg-zinc-100 text-zinc-400' 
                    : 'bg-black text-white hover:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1'
                }`}
              >
                <Zap className="h-4 w-4 fill-current" />
                Buy Now
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
