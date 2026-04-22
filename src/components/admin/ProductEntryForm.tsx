"use client";

import React, { useState, useEffect } from 'react';

interface ProductEntryFormProps {
  collectionName: string;
  subcategoryName: string;
  initialData?: any; // Data for editing
  onSuccess?: () => void;
  onCancel?: () => void;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800;
        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function ProductEntryForm({ collectionName, subcategoryName, initialData, onSuccess, onCancel }: ProductEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    productname: initialData?.productname || '',
    original_price: initialData?.original_price?.toString() || '',
    discount_price: initialData?.discount_price?.toString() || '',
    stars: initialData?.stars?.toString() || '5.0',
    instoke: initialData?.instoke || 'In Stock',
    description: initialData?.description || '',
  });

  const [sizes, setSizes] = useState<string[]>(initialData?.size || ['S', 'M', 'L', 'XL']);
  const [images, setImages] = useState<{ url: string; colurname: string }[]>(
    initialData?.images || [{ url: '', colurname: '' }]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value.toUpperCase();
    setSizes(newSizes);
  };

  const addSize = () => setSizes([...sizes, '']);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const handleImageFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Max 10MB allowed.");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        const newImages = [...images];
        newImages[index].url = compressedBase64;
        setImages(newImages);
      } catch (err) {
        alert("Failed to process image");
      }
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].colurname = value;
    setImages(newImages);
  };

  const addImage = () => setImages([...images, { url: '', colurname: '' }]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const validateForm = () => {
    if (!formData.productname.trim()) return "Product Name is required.";
    const op = parseFloat(formData.original_price);
    const dp = parseFloat(formData.discount_price);
    if (isNaN(op) || op <= 0) return "Original Price must be a valid number > 0.";
    if (isNaN(dp) || dp <= 0) return "Discount Price must be a valid number > 0.";
    const stars = parseFloat(formData.stars);
    if (isNaN(stars) || stars < 0 || stars > 5) return "Stars rating must be between 0 and 5.";
    if (sizes.filter(s => s.trim() !== '').length === 0) return "Please add at least one valid size.";
    const validImages = images.filter(img => img.url !== '' && img.colurname.trim() !== '');
    if (validImages.length === 0) return "Please add at least one image with a color name.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const errorMsg = validateForm();
    if (errorMsg) {
      setMessage(`❌ Validation Error: ${errorMsg}`);
      return;
    }

    setLoading(true);

    let starsValue = parseFloat(formData.stars);
    if (isNaN(starsValue) || starsValue < 0 || starsValue > 5) {
      setMessage("❌ Validation Error: Stars rating must be between 0 and 5.");
      return;
    }

    const payload = {
      ...formData,
      _id: initialData?._id, // Only for updates
      collectionname: collectionName,
      subcatagory: subcategoryName,
      original_price: parseFloat(formData.original_price),
      discount_price: parseFloat(formData.discount_price),
      stars: parseFloat(starsValue.toFixed(1)), 
      size: sizes.filter(s => s.trim() !== ''),
      images: images.filter(img => img.url !== ''),
      description: formData.description,
    };

    const url = initialData ? '/api/admin/updateproduct' : '/api/admin/insert';
    const method = initialData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Success: Product ${initialData ? 'updated' : 'inserted'}!`);
        if (onSuccess) {
           setTimeout(onSuccess, 1000);
        }
      } else {
        setMessage('❌ Error: ' + (data.error || 'Something went wrong.'));
      }
    } catch (err) {
      setMessage('❌ Connection Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase">{initialData ? 'Update Product' : 'Add New Product'}</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              In <span className="font-bold text-black">{collectionName.replace(/_/g, ' ')}</span> &gt; <span className="font-bold text-black">{subcategoryName.replace(/_/g, ' ')}</span>
            </p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 scroll-smooth">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</label>
                <input
                  type="text"
                  name="productname"
                  value={formData.productname}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Original Price (₹)</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Discount Price (₹)</label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stars (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="stars"
                  value={formData.stars}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Status</label>
                <select
                  name="instoke"
                  value={formData.instoke}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all min-h-[100px] resize-none"
                  placeholder="e.g. Premium cotton t-shirt with oversized fit and vintage wash."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {sizes.map((size, index) => (
                  <div key={index} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg pl-2 pr-1 overflow-hidden">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      className="bg-transparent w-10 md:w-12 text-center text-sm font-bold outline-none uppercase"
                    />
                    <button type="button" onClick={() => removeSize(index)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                  </div>
                ))}
                <button type="button" onClick={addSize} className="text-xs font-bold px-3 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-black hover:text-black transition-colors">+ Size</button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Product Images & Colors</label>
              <div className="space-y-3 md:space-y-4">
                {images.map((img, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Color Name</label>
                      <input
                        type="text"
                        value={img.colurname}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image File</label>
                      <div className="flex items-center gap-2">
                        {img.url ? (
                          <img src={img.url} className="w-10 h-10 object-cover rounded-md border border-gray-200 shadow-sm shrink-0" alt="preview" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs border border-gray-300 shrink-0">Img</div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(index, e)}
                          className="text-sm w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer transition-colors"
                        />
                      </div>
                    </div>
                    {images.length > 1 && (
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white border border-gray-200 text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">&times;</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImage} className="w-full py-2.5 md:py-3 border border-dashed border-gray-300 text-gray-500 text-xs md:text-sm font-bold rounded-xl hover:border-black hover:text-black transition-colors">+ Add Another Image & Color</button>
              </div>
            </div>
            
            {message && (
              <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold tracking-wide ${message.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <button 
            type="submit" 
            form="productForm"
            disabled={loading}
            className="w-full bg-black text-white font-bold tracking-widest uppercase text-xs md:text-sm py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
          >
            {loading ? "Syncing with Cloud..." : initialData ? "Update Inventory" : "Save to Inventory"}
          </button>
        </div>

      </div>
    </div>
  );
}
