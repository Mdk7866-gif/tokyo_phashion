"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Ruler } from "lucide-react";

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

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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
    }
    setLoading(false);
  };

  const handleVariantChange = (v: any) => {
    setSelectedVariant(v);
    setSelectedSize(null);
    updateQueryParams(v.id, null);
    
    if (v.product_images && v.product_images.length > 0) {
       const sortedImages = [...v.product_images].sort((a:any, b:any) => a.sort_order - b.sort_order);
       setMainImage(sortedImages[0].image_url);
    }
  };

  const handleSizeChange = (s: any) => {
    setSelectedSize(s);
    if (selectedVariant) {
      updateQueryParams(selectedVariant.id, s.id);
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
                <Image src={mainImage} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black uppercase tracking-widest text-zinc-300">No Image</div>
              )}
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
                    <Image src={img.image_url} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col pt-4">
            <div className="mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl xl:text-6xl mb-4">{product.name}</h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-black">${displayPrice.toFixed(2)}</span>
                {originalPrice > displayPrice && (
                  <span className="text-sm font-bold text-zinc-400 line-through">${originalPrice.toFixed(2)}</span>
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

            {/* Actions */}
            <div className="mb-12">
              <button 
                disabled={!selectedSize}
                className={`w-full flex items-center justify-center gap-2 border border-black py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  selectedSize 
                    ? 'bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-800 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]' 
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                {selectedSize ? 'Add to Cart' : 'Select a Size'}
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
