'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  FolderLock,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const { isLoggedIn } = useApp();
  const featuredScholarships = SCHOLARSHIPS_DATA.filter((s) => s.featured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#5B4BDB]/10 via-[#18B6A4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFE] border border-[#5B4BDB]/20 text-[#5B4BDB] text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-[#18B6A4]" />
              <span>Unified Scholarship Discovery for Indian Students</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#171B2D] tracking-tight leading-[1.15]">
              Your Future Deserves{' '}
              <span className="bg-gradient-to-r from-[#5B4BDB] via-[#7869E6] to-[#18B6A4] bg-clip-text text-transparent">
                Every Opportunity.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#72788A] leading-relaxed max-w-2xl mx-auto">
              Discover scholarships that match your ambitions. Find the right opportunities, check
              your eligibility and manage every application in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/scholarships"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#5B4BDB]/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Explore Scholarships
              </Link>
              <Link
                href={isLoggedIn ? '/dashboard' : '/onboarding'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#171B2D] border border-slate-200 font-bold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4 text-[#5B4BDB]" />
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Rule-Based Eligibility Check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No Commission or Hidden Fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Central & State Schemes
              </span>
            </div>
          </div>

          {/* Interactive Product Preview Dashboard Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-4 sm:p-6 lg:p-8 overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 ml-2">GRANTLY SaaS Workspace</span>
              </div>
              <div className="text-xs font-bold text-[#5B4BDB] bg-[#EEEAFE] px-3 py-1 rounded-full">
                Live Interactive Preview
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Match Score */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5B4BDB]/5 to-[#5B4BDB]/10 border border-[#5B4BDB]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B4BDB] uppercase tracking-wider">
                    Smart Match Score
                  </span>
                  <Sparkles className="w-4 h-4 text-[#18B6A4]" />
                </div>
                <div className="text-3xl font-black text-[#171B2D]">96%</div>
                <p className="text-xs text-slate-600">
                  Calculated against your B.Tech 2nd Year, Maharashtra domicile, and income tier.
                </p>
              </div>

              {/* Card 2: Applications Tracker */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Application Status
                  </span>
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-[#171B2D]">3 Active</div>
                <p className="text-xs text-slate-600">
                  1 Under Review • 1 Planning • 1 Submitted to National Scholarship Portal.
                </p>
              </div>

              {/* Card 3: Document Vault */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Document Readiness
                  </span>
                  <FolderLock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-[#171B2D]">5 Verified</div>
                <p className="text-xs text-slate-600">
                  Aadhaar, Tahsildar Income Cert, Marksheet, and Bonafide ready to attach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative Statistics Section */}
      <section className="bg-white border-y border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold text-[#72788A] uppercase tracking-wider">
              Platform Metrics (Illustrative Competition Demonstration)
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-2xl sm:text-4xl font-black text-[#5B4BDB]">₹18.5 Cr+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Total Scholarship Pool
              </div>
              <div className="text-[11px] text-slate-400">Aggregated funding volume</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-4xl font-black text-[#18B6A4]">45,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Students Guided
              </div>
              <div className="text-[11px] text-slate-400">Across 28 states & UTs</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-4xl font-black text-[#171B2D]">200+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Verified Schemes
              </div>
              <div className="text-[11px] text-slate-400">Government & CSR CSR funds</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-4xl font-black text-emerald-600">94%</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                Eligibility Accuracy
              </div>
              <div className="text-[11px] text-slate-400">Multi-condition rule engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#5B4BDB] uppercase tracking-wider">
              Seamless 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
              How GRANTLY Simplifies Your Scholarship Journey
            </h2>
            <p className="text-sm text-[#72788A]">
              We transformed an opaque, fragmented process into a structured, reliable student companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] font-black text-base flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#171B2D] mb-2">Create Your Profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add your education level, current marks/CGPA, family income bracket, and state domicile in under 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 font-black text-base flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#171B2D] mb-2">Discover Scholarships</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore curated opportunities with live filters for merit, financial need, girls&apos; education, and STEM courses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-black text-base flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#171B2D] mb-2">Check Your Eligibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our rule-based engine compares every mandatory requirement to verify if you are Eligible, Potentially Eligible, or Missing Info.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black text-base flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-[#171B2D] mb-2">Track Your Applications</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitor deadlines, link uploaded vault documents, maintain submission notes, and never miss an award date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#5B4BDB] uppercase tracking-wider">
                Curated Opportunities
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#171B2D] tracking-tight mt-1">
                Featured Indian Scholarships
              </h2>
              <p className="text-xs sm:text-sm text-[#72788A] mt-1">
                Verified high-value programs currently accepting applications for the 2026-27 cycle.
              </p>
            </div>

            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B4BDB] hover:text-[#4838C2] group"
            >
              <span>View all {SCHOLARSHIPS_DATA.length} scholarships</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} viewMode="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* Why GRANTLY */}
      <section id="about" className="py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#18B6A4] uppercase tracking-wider">
              Product Innovation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
              Why Indian Students Choose GRANTLY
            </h2>
            <p className="text-sm text-[#72788A]">
              Designed to solve real friction points in Indian higher education grant applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Smart Match Score</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transparent 0-100% calculation factoring academic grades, financial tiers, and target diversity parameters so you focus only where you have high win-probabilities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Deadline Intelligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dynamic countdowns distinguish &quot;Closing This Week&quot; from &quot;Due This Month&quot; so you prioritize high-urgency schemes before submission gates close.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Side-by-Side Comparison</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select up to 3 opportunities and contrast award values, eligibility criteria, and required certificates side-by-side in a single synchronized view.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FolderLock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Document Vault & Readiness</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep your Aadhaar, Tahsildar Income slips, and marksheets indexed locally. The readiness index immediately shows which scholarships you have 100% documents ready for.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Explainable Rule Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No opaque black-box AI scores. Every check breaks down exactly which condition passed, which failed, and what missing detail you need to verify.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#171B2D]">Application Pipeline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Move scholarships seamlessly across 7 stages from Planning to Applied and Approved with custom submission notes and portal references.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-[#171B2D] via-[#211E4E] to-[#171B2D] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free For All Indian Students
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Discover Scholarships You Are Actually Eligible For?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create your profile in 2 minutes, get your personalized match score, and take command of your academic funding today.
          </p>

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

      <Footer />
    </div>
  );
}
