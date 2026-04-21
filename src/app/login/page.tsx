'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = useCallback(() => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  /* ─── Send OTP ─────────────────────────────────────────────── */
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (phone.length !== 10) {
      setError('Please enter exactly 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/sendotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
      setStep('otp');
      startResendTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  /* ─── OTP Input Handling ───────────────────────────────────── */
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  }

  /* ─── Verify OTP ───────────────────────────────────────────── */
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+${phone}`, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');

      await refreshUser();
      const from = searchParams.get('from') || '/';
      router.replace(from);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  /* ─── Resend ───────────────────────────────────────────────── */
  async function handleResend() {
    if (resendTimer > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/sendotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend OTP.');
      startResendTimer();
      otpRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  /* ─── Render ───────────────────────────────────────────────── */
  return (
    <div className="login-root">

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-none tracking-tighter">東京</span>
          <span className="login-brand-name">TOKYO PHASHION</span>
        </div>

        {/* Step indicator */}
        <div className="login-steps">
          <div className={`login-step ${step === 'phone' ? 'active' : 'done'}`}>
            <div className="login-step-dot">
              {step === 'otp' ? <span>✓</span> : <span>1</span>}
            </div>
            <span>Mobile</span>
          </div>
          <div className="login-step-line" />
          <div className={`login-step ${step === 'otp' ? 'active' : ''}`}>
            <div className="login-step-dot"><span>2</span></div>
            <span>Verify</span>
          </div>
        </div>

        {/* ── Phone step ── */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="login-form">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Enter your 10-digit mobile number.</p>

            <div className="login-field">
              <label htmlFor="phone-input" className="login-label">Mobile Number</label>
              <div className="login-phone-wrapper">
                <span className="login-phone-icon">📱</span>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    if (val.length > 0 && val.length < 10) {
                      setError('Mobile number must be 10 digits.');
                    } else {
                      setError('');
                    }
                  }}
                  placeholder="9876543210"
                  className="login-input"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              id="send-otp-btn"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : 'Send OTP'}
            </button>
          </form>
        )}

        {/* ── OTP step ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <h1 className="login-title">Enter the code</h1>
            <p className="login-subtitle">
              We sent a 6-digit OTP to <strong>{phone}</strong>.
            </p>

            <div className="login-otp-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`login-otp-box ${digit ? 'filled' : ''}`}
                  disabled={loading}
                />
              ))}
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              id="verify-otp-btn"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : 'Verify & Login'}
            </button>

            <div className="login-resend">
              {resendTimer > 0 ? (
                <span className="login-resend-timer">Resend OTP in {resendTimer}s</span>
              ) : (
                <button
                  id="resend-otp-btn"
                  type="button"
                  onClick={handleResend}
                  className="login-resend-btn"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
              <button
                id="change-number-btn"
                type="button"
                onClick={() => { setStep('phone'); setError(''); setOtp(['','','','','','']); }}
                className="login-change-btn"
              >
                Change number
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        /* ── Root ─────────────────────────────────────── */
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        /* ── Card ─────────────────────────────────────── */
        .login-card {
          position: relative;
          z-index: 10;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 28px;
          padding: 2.75rem 2.25rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
          animation: cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Brand ────────────────────────────────────── */
        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.8rem;
          justify-content: center;
        }
        .login-brand-name {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #000;
        }

        /* ── Steps ────────────────────────────────────── */
        .login-steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 2rem;
        }
        .login-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          flex: 0 0 auto;
        }
        .login-step span:last-child {
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: #a1a1aa;
          text-transform: uppercase;
        }
        .login-step.active span:last-child,
        .login-step.done span:last-child {
          color: #000;
        }
        .login-step-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700;
          border: 2px solid #e5e5e5;
          color: #a1a1aa;
          transition: all 0.3s;
        }
        .login-step.active .login-step-dot {
          border-color: #000;
          color: #000;
        }
        .login-step.done .login-step-dot {
          background: #000;
          border-color: #000;
          color: #fff;
        }
        .login-step-line {
          flex: 1;
          height: 2px;
          background: #f0f0f0;
          margin: 0 0.5rem;
          margin-bottom: 1.2rem;
        }
        .login-step.done + .login-step-line {
          background: #000;
        }

        /* ── Form ─────────────────────────────────────── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .login-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #000;
          margin: 0;
          line-height: 1.2;
        }
        .login-subtitle {
          font-size: 0.875rem;
          color: #71717a;
          margin: 0;
          line-height: 1.5;
        }
        .login-subtitle strong {
          color: #000;
        }

        /* ── Phone field ──────────────────────────────── */
        .login-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .login-label { font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; color: #a1a1aa; }
        .login-phone-wrapper {
          display: flex; align-items: center;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 0 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-phone-wrapper:focus-within {
          border-color: #000;
        }
        .login-phone-icon { font-size: 1.1rem; margin-right: 0.6rem; }
        .login-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #000;
          font-size: 1rem;
          padding: 0.85rem 0;
          font-family: inherit;
        }
        .login-input::placeholder { color: #a1a1aa; }

        /* ── OTP boxes ────────────────────────────────── */
        .login-otp-row {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .login-otp-box {
          width: 48px; height: 56px;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          color: #000;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
          caret-color: #000;
        }
        .login-otp-box:focus {
          border-color: #000;
          background: #fff;
        }
        .login-otp-box.filled {
          border-color: #000;
          background: #fff;
        }

        /* ── Button ───────────────────────────────────── */
        .login-btn {
          width: 100%;
          padding: 0.95rem;
          border: none;
          border-radius: 14px;
          background: #000;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          text-transform: uppercase;
        }
        .login-btn:hover:not(:disabled) {
          background: #222;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ── Spinner ──────────────────────────────────── */
        .login-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error ────────────────────────────────────── */
        .login-error {
          font-size: 0.82rem;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          margin: 0;
        }

        /* ── Resend row ───────────────────────────────── */
        .login-resend {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .login-resend-timer { font-size: 0.8rem; color: #a1a1aa; }
        .login-resend-btn, .login-change-btn {
          background: none; border: none; cursor: pointer;
          font-size: 0.82rem; padding: 0; font-family: inherit;
          transition: color 0.2s;
        }
        .login-resend-btn { color: #000; font-weight: 600; }
        .login-resend-btn:hover { color: #555; }
        .login-change-btn { color: #71717a; }
        .login-change-btn:hover { color: #000; }

        /* ── Mobile ───────────────────────────────────── */
        @media (max-width: 480px) {
          .login-card { padding: 1.75rem 1.25rem; border-radius: 22px; }
          .login-otp-box { width: 40px; height: 48px; font-size: 1.2rem; border-radius: 10px; }
          .login-otp-row { gap: 6px; }
          .login-title { font-size: 1.4rem; }
        }

        /* ── Shimmer on brand logo ── */
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-brand-logo {
          font-size: 1.8rem;
          line-height: 1;
          background: linear-gradient(90deg, #c084fc, #f472b6, #818cf8, #c084fc);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
