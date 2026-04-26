'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Script from 'next/script';

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
    console.log("Initializing Google Sign-In...", { 
      hasGoogle: !!window.google, 
      hasClientId: !!GOOGLE_CLIENT_ID, 
      hasRef: !!googleBtnRef.current 
    });

    if (window.google && GOOGLE_CLIENT_ID && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCallback,
        });

        console.log("Rendering Google Button...");
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 340,
          shape: 'pill',
          logo_alignment: 'center'
        });
      } catch (err) {
        console.error("Google Init Error:", err);
      }
    } else {
      console.warn("Initialization conditions not met.");
    }
  }, [GOOGLE_CLIENT_ID, handleCallback]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID is missing from process.env!");
      setError('Google Client ID is not configured in .env');
      return;
    }
    
    // Poll for both window.google and the ref to be ready
    const interval = setInterval(() => {
      if (window.google && googleBtnRef.current) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 6 seconds to detect blocking
    const timeout = setTimeout(() => {
      if (!window.google) {
        console.warn("Google script seems to be blocked or taking too long.");
        setIsGoogleBlocked(true);
      }
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

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <span className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent leading-none tracking-tighter">東京</span>
          <span className="login-brand-name">TOKYO PHASHION</span>
        </div>

        <div className="login-content">
          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Sign in with your Google account to continue.</p>

          <div className="google-btn-container">
            {loading ? (
              <div className="login-loading-state">
                <div className="login-spinner" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Authenticating...</span>
              </div>
            ) : isGoogleBlocked ? (
              <div className="google-blocked-state">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 text-center px-4">
                  Google Sign-In is blocked. <br/> 
                  <span className="text-[10px] text-gray-400 normal-case font-medium mt-1 block">Try disabling ad-blockers or tracking protection (especially in Edge/Safari).</span>
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="login-retry-btn"
                >
                  Retry Login
                </button>
              </div>
            ) : (
              <div ref={googleBtnRef} className="google-btn-wrapper" />
            )}
          </div>

          {error && (
            <div className="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
            By signing in, you agree to our <br/>
            <span className="text-black font-bold cursor-pointer">Terms of Service</span> & <span className="text-black font-bold cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .login-card {
          background: #ffffff;
          border-radius: 40px;
          padding: 4rem 2.5rem;
          width: 100%;
          max-width: 440px;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
          animation: cardIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 3.5rem;
        }

        .login-brand-name {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.4em;
          color: #000;
          opacity: 0.5;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 900;
          color: #000;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: #71717a;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .google-btn-container {
          display: flex;
          justify-content: center;
          min-height: 50px;
          margin-bottom: 2rem;
        }

        .google-btn-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .login-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 1rem;
          border: 1px solid #fee2e2;
        }

        .google-blocked-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          animation: fadeIn 0.5s ease;
        }

        .login-retry-btn {
          padding: 0.75rem 2rem;
          background: #000;
          color: #fff;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
        }

        .login-retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .login-footer {
          margin-top: 4rem;
          opacity: 0.6;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 3rem 1.5rem;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  );
}
