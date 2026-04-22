"use client";

import React, { useState } from 'react';

interface ProductEntryFormProps {
  collectionName: string;
  subcategoryName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductEntryForm({ collectionName, subcategoryName, onSuccess, onCancel }: ProductEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    productname: '',
    original_price: '',
    discount_price: '',
    stars: '5',
    instoke: 'In Stock',
  });

  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [images, setImages] = useState<{ url: string; colurname: string }[]>([{ url: '', colurname: '' }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addSize = () => setSizes([...sizes, '']);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const handleImageFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index].url = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].colurname = value;
    setImages(newImages);
  };

  const addImage = () => setImages([...images, { url: '', colurname: '' }]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      ...formData,
      collectionname: collectionName,
      subcatagory: subcategoryName,
      original_price: parseFloat(formData.original_price),
      discount_price: parseFloat(formData.discount_price),
      stars: parseFloat(formData.stars),
      size: sizes.filter(s => s.trim() !== ''),
      images: images.filter(img => img.url !== ''),
    };

    if (payload.images.length === 0) {
      setMessage('❌ Please add at least one image.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Success: Product inserted!');
        setFormData({
          productname: '',
          original_price: '',
          discount_price: '',
          stars: '5',
          instoke: 'In Stock',
        });
        setImages([{ url: '', colurname: '' }]);
        if (onSuccess) {
           setTimeout(onSuccess, 1500); // give time to read success message before closing
        }
      } else {
        setMessage('❌ Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (err) {
      setMessage('❌ Connection Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Add New Product</h2>
          <p className="text-gray-500 text-sm mt-1">To collection <span className="font-bold text-black">{collectionName.replace(/_/g, ' ')}</span> &gt; <span className="font-bold text-black">{subcategoryName.replace(/_/g, ' ')}</span></p>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</label>
            <input
              type="text"
              name="productname"
              value={formData.productname}
              onChange={handleInputChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              placeholder="e.g. Vintage Oversized Tee"
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
              placeholder="e.g. 1999"
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
              placeholder="e.g. 999"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stars Rating</label>
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
        </div>

        {/* Sizes */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Available Sizes</label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-1 overflow-hidden group">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="bg-transparent w-12 text-center text-sm font-bold outline-none uppercase"
                />
                <button 
                  type="button" 
                  onClick={() => removeSize(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addSize}
              className="text-xs font-bold px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-black hover:text-black transition-colors"
            >
              + Add Size
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Product Images & Colors</label>
          <div className="space-y-4">
            {images.map((img, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Color Name</label>
                  <input
                    type="text"
                    value={img.colurname}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    placeholder="e.g. Midnight Black"
                    className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image File</label>
                  <div className="flex items-center gap-3">
                    {img.url ? (
                      <img src={img.url} className="w-10 h-10 object-cover rounded-md border border-gray-200 shadow-sm" alt="preview" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs border border-gray-300">Img</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(index, e)}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer file:transition-colors"
                      required={!img.url}
                    />
                  </div>
                </div>
                {images.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addImage}
              className="w-full py-3 border border-dashed border-gray-300 text-gray-500 text-sm font-bold rounded-xl hover:border-black hover:text-black transition-colors"
            >
              + Add Another Image & Color
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Upload...
              </>
            ) : "Save Product to Database"}
          </button>
          
          {message && (
            <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold tracking-wide ${message.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
