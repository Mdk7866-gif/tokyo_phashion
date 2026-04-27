/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import { useAlert } from '@/components/AlertMessageCard';

type ApiResult =
  | { success: true; message: string; insertedId?: unknown; photo_url?: string | null }
  | { error: string };

export default function ContactPage() {
  const { showAlert } = useAlert();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [detailes, setDetailes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const previewUrl = useMemo(() => {
    if (!photo) return null;
    return URL.createObjectURL(photo);
  }, [photo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

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
      if (res.ok) {
        showAlert({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setName('');
        setMobileNumber('');
        setDetailes('');
        setPhoto(null);
      } else {
        showAlert({ type: 'error', message: 'error' in data ? data.error : 'Failed to send message.' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      showAlert({ type: 'error', message: errorMessage });
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

        <div className="max-w-xl mx-auto">
          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-[32px] border-2 border-zinc-100 shadow-xl shadow-zinc-100/50">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-2">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold uppercase outline-none focus:border-black transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-2">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobileNumber(value);
                  }}
                  required
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-black transition-colors"
                  placeholder="8511274216"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-2">Details</label>
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
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-2">Attachment (Optional)</label>
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
                className="w-full bg-black text-white h-16 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
