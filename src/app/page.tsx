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

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Primary Animated Hero Section */}
        <HeroSection />

        {/* Implemented capabilities */}
        <section className="bg-white border-y border-slate-200/80 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#72788A] uppercase tracking-wider">
                A clearer scholarship journey
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-lg sm:text-xl font-black text-[#5B4BDB]">Discover</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Personalized scholarships</div>
                <div className="text-[11px] text-slate-400">Search by profile and preferences</div>
              </div>
              <div className="p-4">
                <div className="text-lg sm:text-xl font-black text-[#18B6A4]">Evaluate</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Profile-based eligibility</div>
                <div className="text-[11px] text-slate-400">Review each declared requirement</div>
              </div>
              <div className="p-4">
                <div className="text-lg sm:text-xl font-black text-[#171B2D]">Prepare</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Compare & check documents</div>
                <div className="text-[11px] text-slate-400">See requirements side by side</div>
              </div>
              <div className="p-4">
                <div className="text-lg sm:text-xl font-black text-emerald-600">Track</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Application progress</div>
                <div className="text-[11px] text-slate-400">Keep deadlines and notes together</div>
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
      </main>

      <Footer />
    </div>
  );
}
