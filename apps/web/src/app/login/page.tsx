'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PawPrint, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login({ email, password });
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setIsLoading(true);
    setError(null);

    const res = await login({ email: demoEmail, password: 'Password123!' });
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-slate-50 to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6 fill-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back to PetCo</h2>
          <p className="text-xs text-slate-500">Sign in to manage your pets, bookings, and messages</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Sign In to PetCo
          </Button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Demo Sign-In
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('sarah@petco.com')}
              className="px-2.5 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-center transition-colors text-xs font-bold text-slate-700 hover:text-teal-700"
            >
              🐕 Owner<br />
              <span className="text-[10px] font-normal text-slate-400">Sarah</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('alex@petco.com')}
              className="px-2.5 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-center transition-colors text-xs font-bold text-slate-700 hover:text-teal-700"
            >
              🐾 Helper<br />
              <span className="text-[10px] font-normal text-slate-400">Alex</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@petco.com')}
              className="px-2.5 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-center transition-colors text-xs font-bold text-slate-700 hover:text-teal-700"
            >
              🛡️ Admin<br />
              <span className="text-[10px] font-normal text-slate-400">Admin</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-2">
          Do not have an account?{' '}
          <Link href="/register" className="font-bold text-teal-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
