'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Role } from '@petco/shared';
import { PawPrint, Heart, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'HELPER' ? Role.HELPER : Role.OWNER;

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await register({
      name,
      email,
      password,
      phone: phone || undefined,
      role,
      location,
      latitude: 37.7749,
      longitude: -122.4194,
    });

    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Join the PetCo Network</h2>
        <p className="text-xs text-slate-500">Sign up in seconds to start caring or getting neighborhood care</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setRole(Role.OWNER)}
          className={clsx(
            'flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all',
            role === Role.OWNER
              ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Heart className={clsx('w-4 h-4', role === Role.OWNER ? 'text-teal-600 fill-teal-600' : 'text-slate-400')} />
          I am a Pet Owner
        </button>
        <button
          type="button"
          onClick={() => setRole(Role.HELPER)}
          className={clsx(
            'flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all',
            role === Role.HELPER
              ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Briefcase className={clsx('w-4 h-4', role === Role.HELPER ? 'text-teal-600' : 'text-slate-400')} />
          I am a Pet Helper
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name *"
          required
          placeholder="Sarah Jenkins"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address *"
          type="email"
          required
          placeholder="sarah@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password *"
            type="password"
            required
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Input
          label="City / Neighborhood *"
          required
          placeholder="e.g. Mission District, San Francisco"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {role === Role.HELPER && (
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl text-xs text-teal-800 space-y-1">
            <p className="font-bold">✨ Helper Profile Setup</p>
            <p className="text-[11px] text-teal-700">
              You will be able to customize your hourly rates, services offered, and coverage radius from your dashboard.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Create {role === Role.OWNER ? 'Pet Owner' : 'Pet Helper'} Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-teal-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-slate-50 to-amber-50/30 flex items-center justify-center p-4">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
