'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Script from 'next/script';
import Logo from '@/components/Logo';
import Link from 'next/link';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleBlocked, setIsGoogleBlocked] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCallback = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed.');

      await refreshUser();
      const from = searchParams.get('from') || '/';
      router.replace(from);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.';
      setError(errorMessage);
      setLoading(false);
    }
  }, [refreshUser, router, searchParams]);

  const initializeGoogle = useCallback(() => {
    if (window.google && GOOGLE_CLIENT_ID && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCallback,
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: Math.min(window.innerWidth - 64, 320),
          shape: 'pill',
          logo_alignment: 'center'
        });
      } catch (err) {
        console.error("Google Init Error:", err);
      }
    }
  }, [GOOGLE_CLIENT_ID, handleCallback]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured.');
      return;
    }
    
    const interval = setInterval(() => {
      if (window.google && googleBtnRef.current) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      if (!window.google) setIsGoogleBlocked(true);
      clearInterval(interval);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [GOOGLE_CLIENT_ID, initializeGoogle]);

  return (
    <div className="login-root">
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={initializeGoogle}
      />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1600&q=80&auto=format&fit=crop"
          alt="Fashion Background"
          className="w-full h-full object-cover animate-image-zoom"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Glass Card */}
      <div className="login-card">
        {/* Brand */}
        <Link href="/" className="mb-10 block transform transition-transform hover:scale-105 active:scale-95">
          <Logo width={120} color="#fff" className="mx-auto" />
        </Link>

        <div className="login-content">
          <h1 className="login-title">Join the Collective</h1>
          <p className="login-subtitle">Access exclusive drops and personalized fashion recommendations.</p>

          <div className="google-btn-container">
            {loading ? (
              <div className="login-loading-state">
                <div className="login-spinner" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-6">Verifying Identity</span>
              </div>
            ) : isGoogleBlocked ? (
              <div className="google-blocked-state">
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-6 text-center leading-relaxed">
                  Authentication service blocked. <br/> 
                  <span className="text-[9px] text-white/30 normal-case font-medium mt-2 block">Please disable ad-blockers to continue.</span>
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="login-retry-btn"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-rose-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div ref={googleBtnRef} className="relative google-btn-wrapper" />
              </div>
            )}
          </div>

          {error && (
            <div className="login-error animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] leading-loose">
            By entering, you accept our <br/>
            <span className="text-white/60 font-bold hover:text-white cursor-pointer transition-colors">Terms</span> & <span className="text-white/60 font-bold hover:text-white cursor-pointer transition-colors">Privacy</span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem 1.5rem;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }

        .animate-image-zoom {
          animation: imageZoom 20s infinite alternate ease-in-out;
        }

        @keyframes imageZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .login-card {
          background: rgba(15, 15, 15, 0.4);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border-radius: 3rem;
          padding: 4.5rem 3rem;
          width: 100%;
          max-width: 460px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 10;
          animation: cardReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes cardReveal {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .login-subtitle {
          font-size: 0.95rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 3.5rem;
          line-height: 1.6;
          max-width: 280px;
          margin-left: auto;
          margin-right: auto;
        }

        .google-btn-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
          margin-bottom: 1.5rem;
        }

        .login-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-spinner {
          width: 28px;
          height: 28px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(220, 38, 38, 0.1);
          color: #fca5a5;
          border-radius: 1.25rem;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid rgba(220, 38, 38, 0.2);
          margin-top: 1.5rem;
        }

        .login-retry-btn {
          padding: 0.85rem 2.25rem;
          background: #fff;
          color: #000;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.3s ease;
        }

        .login-retry-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }

        .login-footer {
          margin-top: 4.5rem;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 3.5rem 2rem;
            border-radius: 2.5rem;
          }
          .login-title {
            font-size: 1.85rem;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
