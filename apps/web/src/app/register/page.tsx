'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Role } from '@petco/shared';
import { PawPrint, Heart, Briefcase, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'HELPER' ? Role.HELPER : Role.OWNER;

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      role,
      location: location.trim(),
      latitude: 37.7749,
      longitude: -122.4194,
    });

    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 flex items-center justify-center text-white shadow-lg shadow-teal-900/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create your PawCo Account</h2>
        <p className="text-xs text-slate-500">Sign up in seconds to start caring or booking verified local pet care</p>
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
          <Heart className={clsx('w-4 h-4', role === Role.OWNER ? 'text-teal-700 fill-teal-700' : 'text-slate-400')} />
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
          <Briefcase className={clsx('w-4 h-4', role === Role.HELPER ? 'text-teal-700' : 'text-slate-400')} />
          I am a Pet Helper
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name *"
          required
          autoComplete="name"
          placeholder="Sarah Jenkins"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
        />

        <Input
          label="Email Address *"
          type="email"
          required
          autoComplete="email"
          placeholder="sarah@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <Input
            label="Phone Number (Optional)"
            type="tel"
            autoComplete="tel"
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
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl text-xs text-teal-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" /> Helper Verification & Profile
            </p>
            <p className="text-[11px] text-teal-700">
              Set your own hourly rates, choose services offered, and configure service radius directly from your helper workspace.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold" isLoading={isLoading}>
          Create {role === Role.OWNER ? 'Pet Owner' : 'Pet Helper'} Account
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-teal-800 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-teal-800 border-t-transparent rounded-full animate-spin" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
