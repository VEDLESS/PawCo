'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@petco/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  PawPrint,
  X,
  Eye,
  EyeOff,
  Heart,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { clsx } from 'clsx';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regRole, setRegRole] = useState<Role>(Role.OWNER);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('San Francisco, CA');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status & error states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset errors and fields on mode change or open
  useEffect(() => {
    setError(null);
    setForgotSent(false);
  }, [authModalMode, isAuthModalOpen]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus first input
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isAuthModalOpen, authModalMode, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await login({ email: loginEmail.trim(), password: loginPassword });
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim() || undefined,
      role: regRole,
      location: regLocation.trim(),
      latitude: 37.7749,
      longitude: -122.4194,
    });
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    // Simulate secure password recovery dispatch
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setForgotSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-700 bg-white/80 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Branding & Pet Imagery (Desktop only) */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-teal-900 via-teal-800 to-forest-900 text-white p-8 flex-col justify-between relative overflow-hidden shrink-0">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-soft-sm">
                <PawPrint className="w-5 h-5 text-teal-200 fill-teal-200" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">PawCo</span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/30 text-[11px] font-bold text-teal-100">
                <Sparkles className="w-3 h-3 text-teal-300" /> Neighborhood Pet Care
              </span>
              <h3 className="text-2xl font-black leading-tight text-white">
                Trusted care for your best friend.
              </h3>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Connect with background-checked community helpers for walks, in-home sitting, and medical routines.
              </p>
            </div>
          </div>

          {/* Center Pet Image */}
          <div className="relative my-6 rounded-2xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=450&fit=crop"
              alt="Happy dog outdoors"
              className="w-full h-44 object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px] font-semibold text-white">
              <span>★ 4.96 Rating</span>
              <span className="text-teal-200 font-bold">1,200+ Bookings</span>
            </div>
          </div>

          {/* Value Props Checklist */}
          <div className="relative space-y-2 text-xs text-teal-100/90 font-medium pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% ID-verified pet caregivers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct chat & realtime photo updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>24/7 emergency dispatch support</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Forms */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-center">
          {/* LOGIN FORM */}
          {authModalMode === 'LOGIN' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <div className="flex items-center gap-2 md:hidden mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center text-white">
                    <PawPrint className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900">PawCo</span>
                </div>
                <h2 id="auth-modal-title" className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-stone-500">
                  Sign in to manage your pets, care requests, and verified bookings
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  ref={firstInputRef}
                  label="Email Address"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />

                <div>
                  <Input
                    label="Password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="text-stone-400 hover:text-stone-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('FORGOT_PASSWORD')}
                      className="text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-sm"
                  isLoading={isLoading}
                >
                  Sign In to PawCo
                </Button>
              </form>

              <div className="pt-3 border-t border-stone-200/80 text-center text-xs text-stone-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('REGISTER')}
                  className="font-bold text-teal-800 hover:underline"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* REGISTER FORM */}
          {authModalMode === 'REGISTER' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <div className="flex items-center gap-2 md:hidden mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center text-white">
                    <PawPrint className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900">PawCo</span>
                </div>
                <h2 id="auth-modal-title" className="text-2xl font-black text-slate-900 tracking-tight">
                  Join PawCo
                </h2>
                <p className="text-xs text-stone-500">
                  Select your account type to start booking or offering pet care
                </p>
              </div>

              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setRegRole(Role.OWNER)}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                    regRole === Role.OWNER
                      ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  <Heart className={clsx('w-3.5 h-3.5', regRole === Role.OWNER ? 'text-teal-700 fill-teal-700' : 'text-stone-400')} />
                  Pet Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole(Role.HELPER)}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                    regRole === Role.HELPER
                      ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  <Briefcase className={clsx('w-3.5 h-3.5', regRole === Role.HELPER ? 'text-teal-700' : 'text-stone-400')} />
                  Pet Helper
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <Input
                  ref={firstInputRef}
                  label="Full Name *"
                  required
                  autoComplete="name"
                  placeholder="Sarah Jenkins"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (error) setError(null);
                  }}
                />

                <Input
                  label="Email Address *"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="sarah@example.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Password *"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="text-stone-400 hover:text-stone-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>

                <Input
                  label="City / Neighborhood *"
                  required
                  placeholder="e.g. Mission District, San Francisco"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-sm"
                  isLoading={isLoading}
                >
                  Create {regRole === Role.OWNER ? 'Pet Owner' : 'Pet Helper'} Account
                </Button>
              </form>

              <div className="pt-2 border-t border-stone-200/80 text-center text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('LOGIN')}
                  className="font-bold text-teal-800 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalMode === 'FORGOT_PASSWORD' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('LOGIN')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
                <h2 id="auth-modal-title" className="text-2xl font-black text-slate-900 tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-stone-500">
                  Enter your account email to receive secure recovery instructions.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl"
                >
                  {error}
                </div>
              )}

              {forgotSent ? (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3 text-center">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-teal-950">Recovery Link Dispatched</h4>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    If an account matches <span className="font-bold">{forgotEmail}</span>, we have sent a secure password reset link to your inbox.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setAuthModalMode('LOGIN')}
                  >
                    Return to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <Input
                    ref={firstInputRef}
                    label="Registered Email Address"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (error) setError(null);
                    }}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold"
                    isLoading={isLoading}
                  >
                    Send Recovery Link
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
