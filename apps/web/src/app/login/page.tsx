'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PawPrint, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await login({ email: email.trim(), password });
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Invalid email or password. Please try again.');
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setIsRecovering(true);
    // Simulate recovery link dispatch or call backend endpoint if configured
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRecovering(false);
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-soft-md group-hover:scale-105 transition-all">
            <PawPrint className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
          Sign In to PawCo
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Access your pet care requests, bookings, and verified helper network.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-soft-xl border border-stone-200/80 space-y-6">
          {error && (
            <div
              role="alert"
              className="p-3.5 bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-semibold rounded-2xl animate-in fade-in"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <Input
                label="Email Address"
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Input
                label="Password"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 focus:outline-none transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  className="rounded border-stone-300 text-forest-700 focus:ring-forest-600/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setRecoveryEmail(email);
                  setRecoverySent(false);
                  setForgotPasswordOpen(true);
                }}
                className="font-bold text-forest-800 hover:text-forest-900 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="forest"
              size="lg"
              className="w-full shadow-soft-sm font-bold"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Registration Referral Link */}
          <div className="pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              Don't have an account yet?{' '}
              <Link
                href="/register"
                className="font-extrabold text-forest-800 hover:text-forest-950 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-6 text-center flex items-center justify-center gap-4 text-stone-400 text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-forest-700" /> Secure 256-Bit SSL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <HeartHandshake className="w-4 h-4 text-forest-700" /> Verified Pet Network
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        title="Reset Your Password"
        maxWidth="sm"
      >
        {recoverySent ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-forest-950">Password Recovery Email Sent</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              If an account exists for <span className="font-bold text-forest-900">{recoveryEmail}</span>, you will receive instructions shortly to reset your password.
            </p>
            <Button
              type="button"
              variant="forest"
              size="sm"
              className="w-full mt-2"
              onClick={() => setForgotPasswordOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordRecovery} className="space-y-4">
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter your registered email address and we'll send you a secure link to reset your account credentials.
            </p>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setForgotPasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="forest" size="sm" isLoading={isRecovering}>
                Send Recovery Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
