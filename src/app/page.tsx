'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const featuredScholarships = SCHOLARSHIPS_DATA.filter((s) => s.featured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <Navbar />

      {/* Primary Animated Hero Section */}
      <HeroSection />

      {/* Illustrative Platform Statistics Section */}
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
              <div className="text-[11px] text-slate-400">Government & Corporate CSR funds</div>
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

      {/* 4-Step Process Section */}
      <HowItWorks />

      {/* Featured Scholarships Section */}
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

      {/* Why GRANTLY / Features Section */}
      <FeaturesSection />

      {/* Final Call to Action Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
