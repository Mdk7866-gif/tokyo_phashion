/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';

type ApiResult =
  | { success: true; message: string; insertedId?: unknown; photo_url?: string | null }
  | { error: string };

export default function ContactPage() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [detailes, setDetailes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const previewUrl = useMemo(() => {
    if (!photo) return null;
    return URL.createObjectURL(photo);
  }, [photo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const form = new FormData();
      form.set('name', name);
      form.set('mobile_number', mobileNumber);
      form.set('detailes', detailes);
      if (photo) form.set('photo', photo);

      const res = await fetch('/api/user/contactformsend', {
        method: 'POST',
        body: form,
      });

      const data = (await res.json()) as ApiResult;
      setResult(data);
      if (res.ok) {
        setName('');
        setMobileNumber('');
        setDetailes('');
        setPhoto(null);
      }
    } catch (err: any) {
      setResult({ error: err?.message || 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Contact Us</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Reach out for any queries or custom orders</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Address</h3>
              <p className="text-sm font-black uppercase leading-relaxed">
                11-12, 14 Valkeshwar Flora,<br />
                Nr. Shahid Circle Nava Naroda,<br />
                Ahmedabad, Gujarat - 382346
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Contact</h3>
              <p className="text-sm font-black uppercase mb-1">Email: info@tokyophashion.com</p>
              <p className="text-sm font-black uppercase">Phone: +91 98765 43210</p>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <span className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 cursor-pointer hover:opacity-50 transition-opacity">Instagram</span>
                <span className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 cursor-pointer hover:opacity-50 transition-opacity">Facebook</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold uppercase outline-none focus:border-black transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Mobile Number</label>
                <input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-black transition-colors"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Details</label>
                <textarea
                  value={detailes}
                  onChange={(e) => setDetailes(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-black transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Attachment (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label 
                    htmlFor="photo-upload"
                    className="w-full bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl px-6 py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 mb-2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white h-16 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>

              {result && 'success' in result && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
                  <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Message Sent Successfully</p>
                </div>
              )}
              {result && 'error' in result && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center">
                  <p className="text-rose-600 text-xs font-black uppercase tracking-widest">{result.error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
