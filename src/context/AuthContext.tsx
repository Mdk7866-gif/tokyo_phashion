'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface User {
  userId: string;
  email?: string;
  mobile_no?: string;
  username?: string;
  cartitems?: any[];
  wishlistitems?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        if (res.status === 401) {
          const data = await res.json();
          // Token expired — try to silently refresh
          if (data.expired) {
            const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
            if (refreshRes.ok) {
              // Retry me after refresh
              const retryRes = await fetch('/api/auth/me');
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                setUser(retryData.user ?? null);
                return;
              }
            }
          }
        }
        
        // If 404, user document is missing but token is valid (database wipe case)
        if (res.status === 404) {
          await logout();
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
    
    const handleUpdate = () => fetchUser();
    window.addEventListener('cart-updated', handleUpdate);
    window.addEventListener('wishlist-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleUpdate);
      window.removeEventListener('wishlist-updated', handleUpdate);
    };
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
