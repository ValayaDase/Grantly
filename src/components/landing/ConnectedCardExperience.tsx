'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  UserRound,
  Compass,
  ShieldCheck,
  ChartNoAxesCombined,
  GraduationCap,
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ConnectedCardExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Section Headers
  const howItWorksHeaderRef = useRef<HTMLDivElement>(null);
  const featuredHeaderRef = useRef<HTMLDivElement>(null);

  // How It Works Cards (01, 02, 03)
  const hiwCard1Ref = useRef<HTMLDivElement>(null);
  const hiwCard2Ref = useRef<HTMLDivElement>(null);
  const hiwCard3Ref = useRef<HTMLDivElement>(null);

  // Persistent Dropping Card (Card 04 -> Curated Opportunities Base Card)
  const handoffCardRef = useRef<HTMLDivElement>(null);
  const card4HiwContentRef = useRef<HTMLDivElement>(null);
  const card4CuratedContentRef = useRef<HTMLDivElement>(null);

  // Clean 2-Column Scholarship Cards
  const schCard1Ref = useRef<HTMLDivElement>(null); // Top-Left
  const schCard2Ref = useRef<HTMLDivElement>(null); // Top-Right
  const schCard3Ref = useRef<HTMLDivElement>(null); // Bottom-Left
  const schCard4Ref = useRef<HTMLDivElement>(null); // Bottom-Right

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion || !containerRef.current) return;

      const mm = gsap.matchMedia();

      // ========================================================
      // DESKTOP EXPERIENCE (>= 1024px)
      // ========================================================
      mm.add('(min-width: 1024px)', () => {
        // Initial setup for How It Works cards (760px wide, 350px high)
        gsap.set(hiwCard1Ref.current, {
          x: 0,
          y: -25,
          scale: 0.96,
          opacity: 1,
          zIndex: 10,
        });

        // Card 02 starts on LEFT
        gsap.set(hiwCard2Ref.current, {
          x: -850,
          y: -25,
          scale: 1,
          opacity: 0,
          zIndex: 20,
        });

        // Card 03 starts on RIGHT
        gsap.set(hiwCard3Ref.current, {
          x: 850,
          y: -25,
          scale: 1,
          opacity: 0,
          zIndex: 30,
        });

        // Card 04 starts at BOTTOM
        gsap.set(handoffCardRef.current, {
          x: 0,
          y: 500,
          scale: 1,
          rotation: 0,
          opacity: 0,
          zIndex: 50,
        });

        // Content layers of the dropping card
        gsap.set(card4HiwContentRef.current, { opacity: 1 });
        gsap.set(card4CuratedContentRef.current, { opacity: 0 });

        // Scholarship cards start tucked BEHIND the Curated card (zIndex: 41-44 < 50)
        gsap.set(
          [schCard1Ref.current, schCard2Ref.current, schCard3Ref.current, schCard4Ref.current],
          {
            x: 0,
            y: 45,
            scale: 0.98,
            rotation: 0,
            opacity: 0,
          }
        );
        gsap.set(schCard1Ref.current, { zIndex: 44 });
        gsap.set(schCard2Ref.current, { zIndex: 43 });
        gsap.set(schCard3Ref.current, { zIndex: 42 });
        gsap.set(schCard4Ref.current, { zIndex: 41 });

        // Headers
        gsap.set(howItWorksHeaderRef.current, { y: 0, opacity: 1 });
        gsap.set(featuredHeaderRef.current, { y: 35, opacity: 0, pointerEvents: 'none' });

        // MASTER TIMELINE
        const tl = gsap.timeline({
          defaults: { ease: 'power1.inOut' },
        });

        // ========================================================
        // 1. HOW IT WORKS CARD STACKING
        // ========================================================
        tl.to(hiwCard1Ref.current, { scale: 1.0, duration: 0.5 }, 'start');

        // Card 02 enters from LEFT
        tl.to(
          hiwCard1Ref.current,
          { y: -50, scale: 0.94, opacity: 0.85, duration: 0.9 },
          'hiw2'
        ).to(
          hiwCard2Ref.current,
          { x: 0, opacity: 1, scale: 1, duration: 0.9 },
          'hiw2'
        );

        tl.to({}, { duration: 0.2 });

        // Card 03 enters from RIGHT
        tl.to(
          hiwCard1Ref.current,
          { y: -72, scale: 0.88, opacity: 0.7, duration: 0.9 },
          'hiw3'
        )
          .to(
            hiwCard2Ref.current,
            { y: -50, scale: 0.94, opacity: 0.85, duration: 0.9 },
            'hiw3'
          )
          .to(
            hiwCard3Ref.current,
            { x: 0, opacity: 1, scale: 1, duration: 0.9 },
            'hiw3'
          );

        tl.to({}, { duration: 0.2 });

        // Card 04 enters from BOTTOM to complete the stack
        tl.to(
          hiwCard1Ref.current,
          { y: -94, scale: 0.82, opacity: 0.5, duration: 0.9 },
          'hiw4'
        )
          .to(
            hiwCard2Ref.current,
            { y: -72, scale: 0.88, opacity: 0.7, duration: 0.9 },
            'hiw4'
          )
          .to(
            hiwCard3Ref.current,
            { y: -50, scale: 0.94, opacity: 0.85, duration: 0.9 },
            'hiw4'
          )
          .to(
            handoffCardRef.current,
            { y: -25, opacity: 1, scale: 1, duration: 0.9 },
            'hiw4'
          );

        tl.to({}, { duration: 0.35 });

        // ========================================================
        // 2. PHYSICAL CARD DROP FROM ABOVE NEXT SECTION TITLE
        // ========================================================
        // Underlying How It Works cards and header slide up & fade out
        tl.to(
          [hiwCard1Ref.current, hiwCard2Ref.current, hiwCard3Ref.current],
          { y: -130, opacity: 0, duration: 0.65 },
          'hiw_exit'
        )
          .to(
            howItWorksHeaderRef.current,
            { y: -55, opacity: 0, pointerEvents: 'none', duration: 0.65 },
            'hiw_exit'
          )
          .to(
            handoffCardRef.current,
            { y: -280, opacity: 0, rotation: -6, duration: 0.5 },
            'hiw_exit'
          );

        // Featured Indian Scholarships header reveals at the top
        tl.to(
          featuredHeaderRef.current,
          { y: 0, opacity: 1, pointerEvents: 'auto', duration: 0.65 },
          'featured_enter'
        );

        // Mid-air card face change to "Curated Opportunities"
        tl.set(card4HiwContentRef.current, { opacity: 0 }, 'featured_enter')
          .set(card4CuratedContentRef.current, { opacity: 1 }, 'featured_enter');

        // Set card starting position HIGH ABOVE the section title (y: -520px)
        // Scaled to 0.755 so its visual dimensions exactly match the 570px scholarship cards!
        tl.set(
          handoffCardRef.current,
          {
            x: 0,
            y: -520,
            rotation: -7,
            scale: 0.755,
            opacity: 1,
            zIndex: 50,
          },
          'drop_start'
        );

        // Card falls from above the title down into the section with gravity acceleration
        tl.to(
          handoffCardRef.current,
          {
            y: 70,
            rotation: 4,
            duration: 1.4,
            ease: 'power2.in',
          },
          'dropping'
        );

        // Impact bounce & settle
        tl.to(
          handoffCardRef.current,
          {
            y: 28,
            rotation: -1.5,
            duration: 0.25,
            ease: 'power2.out',
          },
          'bounce'
        ).to(
          handoffCardRef.current,
          {
            y: 45,
            rotation: 0,
            scale: 0.755,
            duration: 0.25,
            ease: 'power1.out',
          },
          'settle'
        );

        // Scholarship cards are positioned directly BEHIND the settled Curated card
        tl.set(
          [schCard1Ref.current, schCard2Ref.current, schCard3Ref.current, schCard4Ref.current],
          {
            x: 0,
            y: 45,
            opacity: 1,
            scale: 1,
            rotation: 0,
          },
          'settle'
        );

        // Rest window so the user clearly sees the settled Curated Opportunities card
        tl.to({}, { duration: 0.7 });

        // ========================================================
        // 3. ALL 4 CARDS SCATTER SIMULTANEOUSLY (EXPANSIVE 2-COLUMN GRID)
        // ========================================================
        tl.to(
          schCard1Ref.current,
          {
            x: -295,
            y: -90,
            rotation: 0,
            scale: 1,
            duration: 1.05,
            ease: 'power2.out',
          },
          'scatter'
        )
          .to(
            schCard2Ref.current,
            {
              x: 295,
              y: -90,
              rotation: 0,
              scale: 1,
              duration: 1.05,
              ease: 'power2.out',
            },
            'scatter'
          )
          .to(
            schCard3Ref.current,
            {
              x: -295,
              y: 185,
              rotation: 0,
              scale: 1,
              duration: 1.05,
              ease: 'power2.out',
            },
            'scatter+=0.04'
          )
          .to(
            schCard4Ref.current,
            {
              x: 295,
              y: 185,
              rotation: 0,
              scale: 1,
              duration: 1.05,
              ease: 'power2.out',
            },
            'scatter+=0.04'
          )
          // Center Curated Opportunities card fades out as cards occupy their 4 grid corners
          .to(
            handoffCardRef.current,
            {
              opacity: 0,
              scale: 0.70,
              duration: 0.8,
            },
            'scatter'
          );

        // ========================================================
        // 4. CLEAN 2-COLUMN GRID VIEWING PAUSE
        // ========================================================
        tl.to({}, { duration: 1.6 });

        // ========================================================
        // 5. SCROLL EXIT ANIMATION (CARDS SNAP BACK BEHIND BASE CARD)
        // ========================================================
        // Restore Curated Opportunities base card
        tl.to(handoffCardRef.current, { opacity: 1, scale: 0.755, duration: 0.75 }, 'exit');

        // All 4 cards pull back together into the center behind the Curated card
        tl.to(
          [schCard1Ref.current, schCard2Ref.current, schCard3Ref.current, schCard4Ref.current],
          {
            x: 0,
            y: 45,
            rotation: 0,
            scale: 0.98,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          'exit'
        );

        // Once gathered behind, fade scholarship cards
        tl.to(
          [schCard1Ref.current, schCard2Ref.current, schCard3Ref.current, schCard4Ref.current],
          { opacity: 0, duration: 0.4 },
          'exit+=0.6'
        );

        tl.to({}, { duration: 0.4 });

        // Pin entire experience
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=4800',
          pin: portalRef.current,
          pinSpacing: true,
          scrub: 1,
          animation: tl,
          anticipatePin: 1,
        });
      });

      // ========================================================
      // RESPONSIVE CLEANUP (< 1024px)
      // On mobile & tablets, GSAP properties are cleared and the
      // clean responsive stacked-grid view renders natively.
      // ========================================================
      mm.add('(max-width: 1023px)', () => {
        const allCards = [
          hiwCard1Ref.current,
          hiwCard2Ref.current,
          hiwCard3Ref.current,
          handoffCardRef.current,
          schCard1Ref.current,
          schCard2Ref.current,
          schCard3Ref.current,
          schCard4Ref.current,
        ];
        allCards.forEach((c) => {
          if (c) gsap.set(c, { clearProps: 'all' });
        });
        if (howItWorksHeaderRef.current) gsap.set(howItWorksHeaderRef.current, { clearProps: 'all' });
        if (featuredHeaderRef.current) gsap.set(featuredHeaderRef.current, { clearProps: 'all' });
        if (card4HiwContentRef.current) gsap.set(card4HiwContentRef.current, { clearProps: 'all' });
        if (card4CuratedContentRef.current) gsap.set(card4CuratedContentRef.current, { clearProps: 'all' });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="connected-experience"
      ref={containerRef}
      className="relative bg-[#F8F9FC] overflow-clip"
    >
      {/* DESKTOP PINNED PORTAL (>= 1024px) */}
      <div
        ref={portalRef}
        className="hidden lg:flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* SECTION A HEADER — HOW IT WORKS */}
        <div
          ref={howItWorksHeaderRef}
          className="absolute top-6 sm:top-9 text-center max-w-3xl mx-auto space-y-2 z-10 will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFE] text-[#5B4BDB] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Seamless 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-[44px] font-bold text-[#171B2D] tracking-tight leading-tight">
            How GRANTLY Simplifies Your Scholarship Journey
          </h2>
          <p className="text-sm sm:text-base text-[#72788A] max-w-xl mx-auto font-normal leading-relaxed">
            Your scholarship journey, simplified into four effortless steps.
          </p>
        </div>

        {/* SECTION B HEADER — FEATURED SCHOLARSHIPS */}
        <div
          ref={featuredHeaderRef}
          className="absolute top-6 sm:top-9 text-center max-w-3xl mx-auto space-y-2 z-10 will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Opportunities
          </div>
          <h2 className="text-3xl sm:text-[46px] font-bold text-[#171B2D] tracking-tight leading-tight">
            Featured Indian Scholarships
          </h2>
          <p className="text-sm sm:text-base text-[#72788A] max-w-xl mx-auto font-normal leading-relaxed">
            Discover verified opportunities curated for your academic journey.
          </p>
        </div>

        {/* CENTRAL STAGE */}
        <div className="relative w-full max-w-[1260px] h-[640px] mt-16 sm:mt-20 flex items-center justify-center">
          {/* ==================================================== */}
          {/* HOW IT WORKS CARD 01 — CREATE YOUR PROFILE (PROPORTIONAL 760px) */}
          {/* ==================================================== */}
          <div
            ref={hiwCard1Ref}
            className="absolute w-[92vw] sm:w-[680px] lg:w-[760px] max-w-[760px] h-[330px] sm:h-[350px] bg-white rounded-[24px] border border-slate-200/80 shadow-lg shadow-slate-200/50 p-8 sm:p-9 flex flex-col justify-between transform-gpu will-change-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center shadow-xs">
                  <UserRound className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Step 01 of 04
                  </span>
                  <span className="text-sm font-bold text-[#5B4BDB]">
                    Profile Setup
                  </span>
                </div>
              </div>
              <div className="text-4xl font-bold text-[#5B4BDB] font-mono opacity-70">
                01
              </div>
            </div>

            <div className="space-y-2 py-1">
              <h3 className="text-2xl sm:text-[26px] font-bold text-[#171B2D] tracking-tight">
                Create Your Profile
              </h3>
              <p className="text-sm sm:text-base text-[#72788A] leading-relaxed max-w-2xl font-normal">
                Add your education level, academic marks, family income and location to build your student profile in minutes.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fast 2-Min Setup
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Private & Local
                </span>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1 px-2.5 rounded-lg hover:bg-[#EEEAFE]/60 transition-colors"
              >
                <span>Start Setup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* HOW IT WORKS CARD 02 — DISCOVER SCHOLARSHIPS (LEFT) */}
          {/* ==================================================== */}
          <div
            ref={hiwCard2Ref}
            className="absolute w-[92vw] sm:w-[680px] lg:w-[760px] max-w-[760px] h-[330px] sm:h-[350px] bg-white rounded-[24px] border border-slate-200/80 shadow-lg shadow-slate-200/50 p-8 sm:p-9 flex flex-col justify-between transform-gpu will-change-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Step 02 of 04
                  </span>
                  <span className="text-sm font-bold text-teal-700">
                    Smart Search
                  </span>
                </div>
              </div>
              <div className="text-4xl font-bold text-teal-600 font-mono opacity-70">
                02
              </div>
            </div>

            <div className="space-y-2 py-1">
              <h3 className="text-2xl sm:text-[26px] font-bold text-[#171B2D] tracking-tight">
                Discover Scholarships
              </h3>
              <p className="text-sm sm:text-base text-[#72788A] leading-relaxed max-w-2xl font-normal">
                Explore curated opportunities with live filters for merit, financial need, education level and scholarship categories.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-Filter Support
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Government & CSR
                </span>
              </div>
              <Link
                href="/scholarships"
                className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-800 group py-1 px-2.5 rounded-lg hover:bg-teal-50 transition-colors"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* HOW IT WORKS CARD 03 — CHECK ELIGIBILITY (RIGHT) */}
          {/* ==================================================== */}
          <div
            ref={hiwCard3Ref}
            className="absolute w-[92vw] sm:w-[680px] lg:w-[760px] max-w-[760px] h-[330px] sm:h-[350px] bg-white rounded-[24px] border border-slate-200/80 shadow-lg shadow-slate-200/50 p-8 sm:p-9 flex flex-col justify-between transform-gpu will-change-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Step 03 of 04
                  </span>
                  <span className="text-sm font-bold text-purple-700">
                    Eligibility Checker
                  </span>
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-600 font-mono opacity-70">
                03
              </div>
            </div>

            <div className="space-y-2 py-1">
              <h3 className="text-2xl sm:text-[26px] font-bold text-[#171B2D] tracking-tight">
                Check Your Eligibility
              </h3>
              <p className="text-sm sm:text-base text-[#72788A] leading-relaxed max-w-2xl font-normal">
                Understand your eligibility clearly by comparing your student profile against scholarship criteria.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Explainable Criteria
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Match Score 0-100%
                </span>
              </div>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-purple-800 group py-1 px-2.5 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span>Check Match</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* HANDOFF CARD (CARD 04 -> FALLING CURATED BASE CARD) */}
          {/* 760px wide in How It Works, scales to 574px in Featured */}
          {/* ==================================================== */}
          <div
            ref={handoffCardRef}
            className="absolute w-[92vw] sm:w-[680px] lg:w-[760px] max-w-[760px] h-[330px] sm:h-[350px] bg-white rounded-[24px] border border-slate-200/80 shadow-xl shadow-indigo-500/10 p-8 sm:p-9 flex flex-col justify-between transform-gpu will-change-transform overflow-hidden"
          >
            {/* CONTENT A: How It Works Step 04 — Track Your Applications */}
            <div
              ref={card4HiwContentRef}
              className="absolute inset-0 p-8 sm:p-9 flex flex-col justify-between bg-white z-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                    <ChartNoAxesCombined className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Step 04 of 04
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      Application Tracker
                    </span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-emerald-600 font-mono opacity-70">
                  04
                </div>
              </div>

              <div className="space-y-2 py-1">
                <h3 className="text-2xl sm:text-[26px] font-bold text-[#171B2D] tracking-tight">
                  Track Your Applications
                </h3>
                <p className="text-sm sm:text-base text-[#72788A] leading-relaxed max-w-2xl font-normal">
                  Monitor deadlines, manage documents and track every application with clear status stages in one place.
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-4 text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 7-Stage Pipeline
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deadline Alerts
                  </span>
                </div>
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 group py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <span>Open Pipeline</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* CONTENT B: Featured Section Dropped Base Card — "Curated Opportunities" */}
            <div
              ref={card4CuratedContentRef}
              className="absolute inset-0 p-8 sm:p-9 flex flex-col justify-between bg-gradient-to-br from-[#EEEAFE]/50 via-white to-white z-20"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B4BDB]/10 text-[#5B4BDB] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Base Selection Hub
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Featured 2026-27
                </span>
              </div>

              <div className="space-y-2 py-2 text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#5B4BDB] text-white flex items-center justify-center shadow-lg shadow-[#5B4BDB]/25">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#171B2D] tracking-tight">
                  Curated Opportunities
                </h3>
                <p className="text-sm text-[#72788A] leading-relaxed max-w-xl font-normal">
                  4 verified high-value scholarship schemes curated for your academic journey.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">
                  Scroll down to scatter cards across screen
                </span>
                <Link
                  href="/scholarships"
                  className="inline-flex items-center gap-1.5 font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1 px-2.5 rounded-lg hover:bg-[#EEEAFE]/60 transition-colors"
                >
                  <span>View All 18 Schemes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* SCHOLARSHIP 01 — TOP-LEFT (EXPANSIVE 570px CARD) */}
          {/* ==================================================== */}
          <div
            ref={schCard1Ref}
            className="absolute w-[500px] sm:w-[540px] lg:w-[570px] h-[255px] sm:h-[265px] bg-white rounded-[22px] border border-slate-200/80 shadow-sm hover:shadow-md p-6 sm:p-7 flex flex-col justify-between transform-gpu will-change-transform transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Reliance Foundation
                  </span>
                  <h3 className="text-xl sm:text-[22px] font-bold text-[#171B2D] leading-snug line-clamp-1">
                    Reliance Foundation UG Scholarship
                  </h3>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#5B4BDB] bg-[#EEEAFE] px-3 py-1 rounded-full">
                  Merit-cum-Means
                </span>
              </div>

              <p className="text-sm font-normal text-[#72788A] line-clamp-2 leading-relaxed mt-2.5">
                Merit-cum-means financial grant with holistic mentorship for ambitious first-year undergraduate students.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="text-lg sm:text-xl font-bold text-[#5B4BDB]">Up to ₹2,00,000</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Deadline</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    25 Nov 2026
                  </span>
                </div>
              </div>

              <Link
                href="/scholarships/reliance-foundation-ug-2026"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1.5 px-3 rounded-xl hover:bg-[#EEEAFE]/60 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* SCHOLARSHIP 02 — TOP-RIGHT (EXPANSIVE 570px CARD) */}
          {/* ==================================================== */}
          <div
            ref={schCard2Ref}
            className="absolute w-[500px] sm:w-[540px] lg:w-[570px] h-[255px] sm:h-[265px] bg-white rounded-[22px] border border-slate-200/80 shadow-sm hover:shadow-md p-6 sm:p-7 flex flex-col justify-between transform-gpu will-change-transform transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    AICTE • Ministry of Education
                  </span>
                  <h3 className="text-xl sm:text-[22px] font-bold text-[#171B2D] leading-snug line-clamp-1">
                    AICTE Pragati Scholarship for Girls
                  </h3>
                </div>
                <span className="shrink-0 text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
                  Women Empowerment
                </span>
              </div>

              <p className="text-sm font-normal text-[#72788A] line-clamp-2 leading-relaxed mt-2.5">
                Government scholarship supporting meritorious girl students pursuing recognized technical degree or diploma courses.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="text-lg sm:text-xl font-bold text-[#5B4BDB]">₹50,000 / yr</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Deadline</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    10 Dec 2026
                  </span>
                </div>
              </div>

              <Link
                href="/scholarships/aicte-pragati-girls-2026"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1.5 px-3 rounded-xl hover:bg-[#EEEAFE]/60 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* SCHOLARSHIP 03 — BOTTOM-LEFT (EXPANSIVE 570px CARD) */}
          {/* ==================================================== */}
          <div
            ref={schCard3Ref}
            className="absolute w-[500px] sm:w-[540px] lg:w-[570px] h-[255px] sm:h-[265px] bg-white rounded-[22px] border border-slate-200/80 shadow-sm hover:shadow-md p-6 sm:p-7 flex flex-col justify-between transform-gpu will-change-transform transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    HDFC Bank Parivartan
                  </span>
                  <h3 className="text-xl sm:text-[22px] font-bold text-[#171B2D] leading-snug line-clamp-1">
                    HDFC Badhte Kadam Scholarship
                  </h3>
                </div>
                <span className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Need-Based
                </span>
              </div>

              <p className="text-sm font-normal text-[#72788A] line-clamp-2 leading-relaxed mt-2.5">
                Financial assistance for high-performing students from underprivileged backgrounds pursuing higher education.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="text-lg sm:text-xl font-bold text-[#5B4BDB]">Up to ₹1,00,000</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Deadline</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    15 Dec 2026
                  </span>
                </div>
              </div>

              <Link
                href="/scholarships/hdfc-badhte-kadam-2026"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1.5 px-3 rounded-xl hover:bg-[#EEEAFE]/60 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ==================================================== */}
          {/* SCHOLARSHIP 04 — BOTTOM-RIGHT (EXPANSIVE 570px CARD) */}
          {/* ==================================================== */}
          <div
            ref={schCard4Ref}
            className="absolute w-[500px] sm:w-[540px] lg:w-[570px] h-[255px] sm:h-[265px] bg-white rounded-[22px] border border-slate-200/80 shadow-sm hover:shadow-md p-6 sm:p-7 flex flex-col justify-between transform-gpu will-change-transform transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Infosys Foundation
                  </span>
                  <h3 className="text-xl sm:text-[22px] font-bold text-[#171B2D] leading-snug line-clamp-1">
                    Infosys STEM Stars Scholarship
                  </h3>
                </div>
                <span className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  STEM Excellence
                </span>
              </div>

              <p className="text-sm font-normal text-[#72788A] line-clamp-2 leading-relaxed mt-2.5">
                Annual financial aid and industry mentorship for female students admitted to premier STEM and engineering institutes.
              </p>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="text-lg sm:text-xl font-bold text-[#5B4BDB]">₹1,00,000 / yr</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Deadline</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    31 Dec 2026
                  </span>
                </div>
              </div>

              <Link
                href="/scholarships/infosys-stem-stars-2026"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#5B4BDB] hover:text-[#4838C2] group py-1.5 px-3 rounded-xl hover:bg-[#EEEAFE]/60 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RESPONSIVE MOBILE & TABLET VIEW (< 1024px) */}
      <div className="lg:hidden px-4 sm:px-6 py-14 sm:py-20 max-w-5xl mx-auto space-y-16">
        {/* Section 1: How It Works */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFE] text-[#5B4BDB] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Seamless 4-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171B2D] tracking-tight">
              How GRANTLY Simplifies Your Scholarship Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#72788A] max-w-lg mx-auto">
              Your scholarship journey, simplified into four effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
                  <UserRound className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-[#5B4BDB] bg-[#EEEAFE] px-2.5 py-1 rounded-lg">
                  01
                </span>
              </div>
              <h3 className="font-bold text-[#171B2D] text-base sm:text-lg">Create Your Profile</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Add your education level, academic marks, family income and location to build your student profile in minutes.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                  02
                </span>
              </div>
              <h3 className="font-bold text-[#171B2D] text-base sm:text-lg">Discover Scholarships</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Explore curated opportunities with live filters for merit, financial need, education level and scholarship categories.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                  03
                </span>
              </div>
              <h3 className="font-bold text-[#171B2D] text-base sm:text-lg">Check Your Eligibility</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Understand your eligibility clearly by comparing your student profile against scholarship requirements.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ChartNoAxesCombined className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  04
                </span>
              </div>
              <h3 className="font-bold text-[#171B2D] text-base sm:text-lg">Track Your Applications</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Monitor deadlines, manage documents and track every application in one place with a 7-stage pipeline.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Featured Scholarships */}
        <div className="space-y-8 pt-6 border-t border-slate-200">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171B2D] tracking-tight">
              Featured Indian Scholarships
            </h2>
            <p className="text-xs sm:text-sm text-[#72788A] max-w-lg mx-auto">
              Discover verified opportunities curated for your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Reliance Foundation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#171B2D] leading-snug">
                  Reliance Foundation UG Scholarship
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                  Merit-cum-means financial grant with holistic mentorship for ambitious first-year undergraduate students.
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="font-bold text-[#5B4BDB] text-sm sm:text-base">Up to ₹2,00,000</span>
                </div>
                <Link
                  href="/scholarships/reliance-foundation-ug-2026"
                  className="font-bold text-[#5B4BDB] inline-flex items-center gap-1 hover:text-[#4838C2]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  AICTE • Ministry of Education
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#171B2D] leading-snug">
                  AICTE Pragati Scholarship for Girls
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                  Government scholarship supporting meritorious girl students pursuing recognized technical degree courses.
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="font-bold text-[#5B4BDB] text-sm sm:text-base">₹50,000 / yr</span>
                </div>
                <Link
                  href="/scholarships/aicte-pragati-girls-2026"
                  className="font-bold text-[#5B4BDB] inline-flex items-center gap-1 hover:text-[#4838C2]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  HDFC Bank Parivartan
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#171B2D] leading-snug">
                  HDFC Badhte Kadam Scholarship
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                  Financial assistance for high-performing students from underprivileged backgrounds pursuing higher education.
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="font-bold text-[#5B4BDB] text-sm sm:text-base">Up to ₹1,00,000</span>
                </div>
                <Link
                  href="/scholarships/hdfc-badhte-kadam-2026"
                  className="font-bold text-[#5B4BDB] inline-flex items-center gap-1 hover:text-[#4838C2]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Infosys Foundation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#171B2D] leading-snug">
                  Infosys STEM Stars Scholarship
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                  Annual financial aid and industry mentorship for female students admitted to premier STEM institutes.
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Award</span>
                  <span className="font-bold text-[#5B4BDB] text-sm sm:text-base">₹1,00,000 / yr</span>
                </div>
                <Link
                  href="/scholarships/infosys-stem-stars-2026"
                  className="font-bold text-[#5B4BDB] inline-flex items-center gap-1 hover:text-[#4838C2]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5B4BDB] text-white text-sm font-bold shadow-lg shadow-[#5B4BDB]/25 hover:bg-[#4838C2] transition"
            >
              <span>Explore All 18+ Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
