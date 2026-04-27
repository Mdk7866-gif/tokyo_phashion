"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ContactForm {
  name?: string;
  fullname?: string;
  email: string;
  mobile_number: string;
  created_at?: string;
  detailes?: string;
  message?: string;
  photo_url?: string;
}

// Sub-component for individual form items to manage their own image loading state
const FormItem = ({ form, onImageClick }: { form: ContactForm, onImageClick: (url: string) => void }) => {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-zinc-200 shadow-md">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-200">
        <div className="break-words max-w-full">
          <h3 className="font-bold text-lg uppercase truncate">{form.name || form.fullname || "Anonymous"}</h3>
          <p className="text-xs font-bold text-zinc-500 break-words">{form.email}</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Mobile</p>
          <p className="text-xs font-bold text-zinc-800">{form.mobile_number}</p>
        </div>
        <div className="text-left md:text-right mt-2 md:mt-0 w-full md:w-auto">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</p>
          <p className="text-xs font-bold">{form.created_at ? new Date(form.created_at).toLocaleString() : "Unknown"}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Message</p>
          <div className="text-sm text-zinc-700 whitespace-pre-wrap font-medium break-words max-h-96 overflow-y-auto pr-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            {form.detailes || form.message}
          </div>
        </div>
        {form.photo_url && (
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Attachment (Click to expand)</p>
            <div 
              onClick={() => onImageClick(form.photo_url!)}
              className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 cursor-zoom-in hover:opacity-90 transition-opacity bg-zinc-100"
            >
              {imgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                   <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black animate-[shimmer_2s_infinite_linear]" style={{ width: '40%' }}></div>
                   </div>
                   <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Image Loading...</p>
                </div>
              )}
              <Image 
                src={form.photo_url} 
                alt="Form attachment" 
                fill 
                className={`object-cover transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImgLoading(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminFormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImgLoading, setModalImgLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch("/api/admin/contactformread");
      const data = await res.json();
      if (data.success) {
        setForms(data.forms);
      }
    } catch (error) {
      console.error("Failed to fetch forms", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (url: string) => {
    setModalImgLoading(true);
    setSelectedImage(url);
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Contact Forms</h1>
        <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md">
          Total Forms: {forms.length}
        </div>
      </div>
      
      {forms.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No forms submitted yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {forms.map((form, idx) => (
            <FormItem key={idx} form={form} onImageClick={openModal} />
          ))}
        </div>
      )}

      {/* Image Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <div className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center">
            {modalImgLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-[shimmer_1.5s_infinite_linear]" style={{ width: '30%' }}></div>
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-4">Processing Studio Image...</p>
              </div>
            )}
            <Image 
              src={selectedImage} 
              alt="Expanded attachment" 
              fill
              unoptimized
              className={`object-contain rounded-lg shadow-2xl transition-all duration-700 ${modalImgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`} 
              onLoad={() => setModalImgLoading(false)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
