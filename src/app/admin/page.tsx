"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";


interface Product {
  _id: string;
  productname: string;
  original_price: number;
  discount_price: number;
  stars: number;
  images: { url: string; colurname: string }[];
  collectionname: string;
  subcatagory: string;
  size: string[];
  description?: string;
  instoke: string;
  isPlaceholder?: boolean;
}

import ProductEntryForm from "@/components/admin/ProductEntryForm";
import AdminOverview from "@/components/admin/AdminOverview";

function AdminDashboard() {
  const searchParams = useSearchParams();
  const collection = searchParams.get('collection');
  const subcategory = searchParams.get('subcategory');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/admin/getproducts?collection=${collection}${subcategory ? `&subcategory=${subcategory}` : ''}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products.filter((p: Product) => !p.isPlaceholder));
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [collection, subcategory]);

  useEffect(() => {
    if (collection) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [collection, subcategory, fetchProducts]);


  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/deleteproduct?collection=${collection}&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (!collection) {
    return <AdminOverview />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8 min-h-[75vh] flex flex-col">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">Manage Inventory</h1>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Collection:</span>
              <span className="bg-zinc-100 text-zinc-900 px-3 py-1 rounded-md">{collection.replace(/_/g, ' ')}</span>
              {subcategory && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-400">Subcategory:</span>
                  <span className="bg-black text-white px-3 py-1 rounded-md">{subcategory.replace(/_/g, ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {subcategory && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full md:w-auto bg-black text-white px-6 py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {loadingProducts ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-black mb-6"></div>
            <p className="text-xs font-black uppercase tracking-[0.3em]">Syncing Database...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-8">
            {products.map((product) => (
              <div key={product._id} className="group bg-white border border-gray-100 rounded-[1rem] md:rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                  
                  {/* Image Display - 2x2 grid if multiple images */}
                  <div className={`w-full h-full grid ${product.images && product.images.length > 1 ? "grid-cols-2 grid-rows-2" : "grid-cols-1 grid-rows-1"}`}>
                    {product.images && product.images.length > 0 ? (
                      product.images.slice(0, 4).map((img, idx: number) => (
                        <div key={idx} className="relative w-full h-full overflow-hidden">
                          <Image 
                            src={img.url} 
                            alt={`${product.productname} ${idx}`} 
                            fill
                            className={`object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out ${product.images.length === 1 ? "" : "border-[0.5px] border-white/20"}`} 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1 md:gap-2 transition-transform duration-500">
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="w-7 h-7 md:w-10 md:h-10 bg-white/95 backdrop-blur-md text-red-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:rotate-12"
                      title="Delete Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="w-7 h-7 md:w-10 md:h-10 bg-white/95 backdrop-blur-md text-black rounded-full shadow-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all"
                      title="Edit Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                      </svg>
                    </button>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4">
                    <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md shadow-sm ${
                      product.instoke === 'In Stock' 
                      ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                      {product.instoke}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-6 flex flex-col flex-1">
                  <h3 className="font-black text-[10px] md:text-sm tracking-tight uppercase truncate mb-1 md:mb-3 text-gray-900">{product.productname}</h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <span className="font-black text-xs md:text-base">₹{product.discount_price}</span>
                        <span className="text-gray-300 text-[8px] md:text-xs line-through font-bold">₹{product.original_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M12 18h.01"/><path d="M12 14h.01"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
              Inventory is empty
            </h2>
            <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto uppercase tracking-widest leading-loose">
              Start adding your first product to this category using the button above.
            </p>
          </div>
        )}
      </div>

      {showAddForm && collection && subcategory && (
        <ProductEntryForm 
          collectionName={collection} 
          subcategoryName={subcategory} 
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
        />
      )}

      {editingProduct && collection && subcategory && (
        <ProductEntryForm 
          collectionName={collection} 
          subcategoryName={subcategory} 
          initialData={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
