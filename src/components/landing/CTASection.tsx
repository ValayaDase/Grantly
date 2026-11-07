'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CTASection() {
  const { isLoggedIn } = useApp();

  return (
    <section className="py-20 bg-gradient-to-tr from-[#171B2D] via-[#211E4E] to-[#171B2D] text-white text-center relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5B4BDB]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-400 text-xs font-bold border border-emerald-400/20 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          100% Free For All Indian Students
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Ready to Discover Scholarships You Are Actually Eligible For?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Create your profile in 2 minutes, get your personalized match score, and take command of your academic funding today.
        </p>

        {/* Value pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Hidden Application Charges
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> 100% Local Browser Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400" /> Instant Match Scoring
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={isLoggedIn ? '/dashboard' : '/signup'}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#5B4BDB]/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/scholarships"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
          >
            Browse All Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

