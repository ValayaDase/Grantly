'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState('priya.sharma@example.edu.in');
  const [password, setPassword] = useState('Scholar@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login();
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    login(DEMO_STUDENT_PROFILE);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F8F9FC]">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#5B4BDB]/10 via-[#18B6A4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171B2D] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#72788A]">
            Sign in to access your scholarship applications and document vault
          </p>
        </div>

        {/* Quick Demo Pill */}
        <div className="bg-[#EEEAFE] border border-[#5B4BDB]/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4BDB] text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#18B6A4]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#171B2D]">Quick Competition Review</div>
              <div className="text-[11px] text-[#72788A]">Pre-populated with Priya Sharma demo data</div>
            </div>
          </div>
          <button
            onClick={handleDemoLogin}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            One-Click Demo
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu.in"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#5B4BDB] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#5B4BDB] focus:ring-[#5B4BDB]"
                />
                <span className="text-xs text-slate-600">Keep me signed in on this device</span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Redirect */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-[#5B4BDB] hover:underline">
              Create student account
            </Link>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <p className="text-center text-[11px] text-slate-400">
          Frontend Evaluation Demo: Credentials are authenticated locally in your browser session.
        </p>
      </div>
    </div>
  );
}
