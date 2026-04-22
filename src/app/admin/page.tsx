"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductEntryForm from "@/components/admin/ProductEntryForm";

function AdminDashboard() {
  const searchParams = useSearchParams();
  const collection = searchParams.get('collection');
  const subcategory = searchParams.get('subcategory');
  
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[60vh] flex flex-col ${showAddForm ? '' : 'items-center justify-center'}`}>
      
      {!showAddForm && (
        <>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase text-center">Admin Dashboard</h1>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Welcome to the Tokyo Phashion Admin Panel. Use the sidebar menu to manage your product collections.
          </p>
        </>
      )}

      {(collection || subcategory) && (
        <div className={`w-full ${showAddForm ? '' : 'max-w-2xl text-center'}`}>
          {!showAddForm && (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800 mb-4">Current View</h2>
              <div className="flex items-center justify-center gap-4 text-sm font-medium mb-6 flex-wrap">
                {collection && (
                  <span className="bg-black text-white px-4 py-2 rounded-lg tracking-wider">
                    Collection: {collection.replace(/_/g, ' ')}
                  </span>
                )}
                {subcategory && (
                  <span className="bg-gray-200 text-black px-4 py-2 rounded-lg tracking-wider">
                    Subcategory: {subcategory.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              
              {collection && subcategory && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Product
                </button>
              )}
            </div>
          )}

          {showAddForm && collection && subcategory && (
            <ProductEntryForm 
              collectionName={collection} 
              subcategoryName={subcategory} 
              onCancel={() => setShowAddForm(false)}
              onSuccess={() => {
                // Optionally auto-close the form after success
                // setShowAddForm(false);
              }}
            />
          )}

          {!showAddForm && (
            <div className="mt-8">
               <p className="text-gray-400 text-xs tracking-widest uppercase">
                 Product list will go here...
               </p>
            </div>
          )}
        </div>
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
