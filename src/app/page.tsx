'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ConnectedCardExperience from '@/components/landing/ConnectedCardExperience';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
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

      {/* Connected Scroll-Driven Experience: 4-Step Process into Featured Scholarships */}
      <ConnectedCardExperience />

      {/* Why GRANTLY / Features Section */}
      <FeaturesSection />

      {/* Final Call to Action Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
