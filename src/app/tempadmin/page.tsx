'use client';

import React, { useState } from 'react';

export default function TempAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    collectionname: '',
    productname: '',
    original_price: '',
    discount_price: '',
    stars: '5',
    subcatagory: '',
    instoke: 'In Stock',
  });

  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [images, setImages] = useState<{ url: string; colurname: string }[]>([]);

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
      original_price: parseFloat(formData.original_price),
      discount_price: parseFloat(formData.discount_price),
      stars: parseFloat(formData.stars),
      size: sizes.filter(s => s.trim() !== ''),
      images: images.filter(img => img.url !== ''),
    };

    try {
      const response = await fetch('/api/admin/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Success: ' + (data.message || 'Product inserted!'));
        // Optionally reset some fields
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
    <div className="admin-container">
      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #0a0a0a;
          color: #e5e5e5;
          padding: 40px 20px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .form-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #121212;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border: 1px solid #222;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(to right, #fff, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p.subtitle {
          color: #666;
          margin-bottom: 40px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        input, select {
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 12px 16px;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }
        input:focus {
          border-color: #6366f1;
          outline: none;
          background: #1f1f1f;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .section-title {
          margin-top: 40px;
          margin-bottom: 20px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #222;
        }
        .dynamic-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .size-tag {
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 4px 8px;
        }
        .size-tag input {
          border: none;
          padding: 4px;
          width: 50px;
          background: transparent;
          text-align: center;
        }
        .btn-add {
          background: transparent;
          border: 1px dashed #444;
          color: #888;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-add:hover {
          border-color: #6366f1;
          color: #6366f1;
        }
        .image-card {
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 16px;
          border-radius: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          margin-bottom: 12px;
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 40px;
        }
        .submit-btn:hover {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }
        .submit-btn:disabled {
          background: #333;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .message-box {
          margin-top: 24px;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
        }
        .remove-btn {
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .preview-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          background: #333;
        }
      `}</style>

      <div className="form-wrapper">
        <h1>Temp Admin</h1>
        <p className="subtitle">Upload new product to MongoDB and Cloudinary</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Collection Name</label>
              <input
                type="text"
                name="collectionname"
                value={formData.collectionname}
                onChange={handleInputChange}
                placeholder="e.g. summer_collection"
                required
              />
            </div>

            <div className="input-group full-width">
              <label>Product Name</label>
              <input
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleInputChange}
                placeholder="Tokyo Phashion Tee"
                required
              />
            </div>

            <div className="input-group">
              <label>Original Price</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Discount Price</label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Stars (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="stars"
                value={formData.stars}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Stock Status</label>
              <select name="instoke" value={formData.instoke} onChange={handleInputChange}>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Limited">Limited</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Subcategory</label>
              <input
                type="text"
                name="subcatagory"
                value={formData.subcatagory}
                onChange={handleInputChange}
                placeholder="e.g. t-shirts"
              />
            </div>
          </div>

          <div className="section-title">Sizes</div>
          <div className="dynamic-list">
            {sizes.map((size, index) => (
              <div key={index} className="size-tag">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                />
                <button type="button" className="remove-btn" onClick={() => removeSize(index)}>&times;</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addSize}>+ Add Size</button>
          </div>

          <div className="section-title">Images (Cloudinary Upload)</div>
          {images.map((img, index) => (
            <div key={index} className="image-card">
              <div className="input-group">
                <label>Color Name</label>
                <input
                  type="text"
                  value={img.colurname}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  placeholder="e.g. Midnight Black"
                  required
                />
              </div>
              <div className="input-group">
                <label>File</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {img.url && <img src={img.url} className="preview-img" alt="preview" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(index, e)}
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>
              </div>
              <button type="button" className="remove-btn" onClick={() => removeImage(index)}>&times;</button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addImage} style={{ width: '100%', marginTop: '8px' }}>
            + Add Image & Color
          </button>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Inserting Product...' : 'Insert Product to Database'}
          </button>

          {message && (
            <div className={`message-box ${message.includes('Success') ? 'success' : 'error'}`}
                 style={{ 
                   color: message.includes('Success') ? '#4ade80' : '#f87171',
                   background: message.includes('Success') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                   border: `1px solid ${message.includes('Success') ? '#4ade8033' : '#f8717133'}`
                 }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
