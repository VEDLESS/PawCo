import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '@petco/shared';
import { mobileApi, setMobileTokens, clearMobileTokens } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    const res = await mobileApi.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      credentials
    );
    setIsLoading(false);

    if (res.success && res.data) {
      setMobileTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (data: any) => {
    setIsLoading(true);
    const res = await mobileApi.post<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register',
      data
    );
    setIsLoading(false);

    if (res.success && res.data) {
      setMobileTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
      setUser(res.data.user);
      return { success: true };
    }

    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    clearMobileTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
