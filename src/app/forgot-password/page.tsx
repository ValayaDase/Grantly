'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F8F9FC]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171B2D] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#72788A]">
            Enter your student registered email to receive password reset instructions
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Reset Instructions Simulated</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                In this frontend demonstration, password recovery has been simulated for{' '}
                <strong>{email}</strong>. You can return to login and use any demo credentials.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B4BDB] text-white text-xs font-bold hover:bg-[#4838C2] transition-colors mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="student@college.edu.in"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BDB]/25 transition-all"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
