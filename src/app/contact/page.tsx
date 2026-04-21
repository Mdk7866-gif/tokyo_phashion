/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';

type ApiResult =
  | { success: true; message: string; insertedId?: unknown; photo_url?: string | null }
  | { error: string };

export default function TempContactFormPage() {
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
    } catch (err: any) {
      setResult({ error: err?.message || 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Temp Contact Form (API Test)
      </h1>

      <form
        onSubmit={onSubmit}
        style={{
          display: 'grid',
          gap: 12,
          padding: 16,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
            placeholder="Your name"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Mobile number</span>
          <input
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
            placeholder="e.g. 9876543210"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Detailes</span>
          <textarea
            value={detailes}
            onChange={(e) => setDetailes(e.target.value)}
            required
            rows={5}
            style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
            placeholder="Write details…"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Photo (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </label>

        {previewUrl ? (
          <div style={{ display: 'grid', gap: 6 }}>
            <span>Preview</span>
            <img
              src={previewUrl}
              alt="Selected preview"
              style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid #e5e7eb' }}
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #111827',
            background: submitting ? '#6b7280' : '#111827',
            color: 'white',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Result</h2>
        <pre
          style={{
            padding: 12,
            background: '#0b1020',
            color: '#e5e7eb',
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >
          {result ? JSON.stringify(result, null, 2) : 'No request yet.'}
        </pre>

        {'success' in (result || {}) && (result as any).photo_url ? (
          <p style={{ marginTop: 10 }}>
            Uploaded image URL:{' '}
            <a href={(result as any).photo_url} target="_blank" rel="noreferrer">
              {(result as any).photo_url}
            </a>
          </p>
        ) : null}
      </section>
    </main>
  );
}

