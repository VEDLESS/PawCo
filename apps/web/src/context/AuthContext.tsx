'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Role } from '@petco/shared';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('petco_user');
      const token = localStorage.getItem('petco_access_token');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await api.get<User>('/users/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('petco_user', JSON.stringify(res.data));
          }
        } catch (e) {
          console.error('Failed to restore auth session:', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      credentials
    );

    if (res.success && res.data) {
      api.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
      localStorage.setItem('petco_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (data: any) => {
    const res = await api.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register',
      data
    );

    if (res.success && res.data) {
      api.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
      localStorage.setItem('petco_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('petco_refresh_token');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
    api.clearTokens();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updatedUser };
      setUser(merged as User);
      localStorage.setItem('petco_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
