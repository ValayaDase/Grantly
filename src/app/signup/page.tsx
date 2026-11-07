
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { EducationLevel } from '@/types';

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  Star,
  Zap,
  Globe,
} from 'lucide-react';

const educationOptions: EducationLevel[] = [
  'School (Class 9-10)',
  'Higher Secondary (Class 11-12)',
  'Undergraduate',
  'Postgraduate',
  'PhD / Research',
  'Diploma / Vocational',
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const floating = {
  animate: {
    y: [0, -13, 0],
    rotate: [0, 1.5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

function AnimatedOrb({
  className,
  duration = 8,
}: {
  className: string;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.65, 0.3],
        x: [0, 25, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>('Undergraduate');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const transitionDuration = shouldReduceMotion ? 0 : 0.6;

  const handlePrefill = () => {
    setFullName('Priya Sharma');
    setEmail('priya.sharma@example.edu.in');
    setEducationLevel('Undergraduate');
    setPassword('Scholar@2026');
    setConfirmPassword('Scholar@2026');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    login({
      id: `student-${Date.now()}`,
      fullName,
      email,
      educationLevel,
      state: 'Maharashtra',
      city: 'Pune',
      gender: 'female',
      courseStream: 'B.Tech Engineering',
      institutionName: '',
      currentAcademicYear: '1st Year',
      percentageOrCgpa: 80,
      annualFamilyIncome: 300000,
      incomeCategory: '₹1.5 Lakh - ₹3 Lakh',
      category: 'General',
      isDifferentlyAbled: false,
      preferredScholarshipCategories: ['Merit-Based', 'STEM & Tech'],
      preferredStudyLevel: ['Undergraduate'],
      preferredLocation: 'All India',
      scholarshipTypePreference: 'All',
      onboardingCompleted: false,
      updatedAt: new Date().toISOString(),
    });

    router.push('/onboarding');
  };

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">

      {/* =====================================
          LEFT PANEL - ANIMATED EXPERIENCE
      ===================================== */}

      <section className="relative hidden min-h-screen overflow-hidden bg-[#17142F] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#20194B] via-[#29205C] to-[#12172F]" />

        <AnimatedOrb
          className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#725BFF]/40 blur-[110px]"
          duration={9}
        />

        <AnimatedOrb
          className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#18B6A4]/30 blur-[110px]"
          duration={11}
        />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '45px 45px',
          }}
        />

        {/* Decorative orbit */}
        <motion.div
          className="absolute left-[15%] top-[24%] h-[440px] w-[440px] rounded-full border border-white/[0.08]"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute left-1/2 top-0 h-3 w-3 rounded-full bg-[#8DDECE] shadow-[0_0_20px_#8DDECE]" />
        </motion.div>

        <motion.div
          className="absolute left-[21%] top-[30%] h-[330px] w-[330px] rounded-full border border-dashed border-white/10"
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        />

        {/* Brand */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: transitionDuration }}
          className="relative z-20"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-8"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 backdrop-blur-xl"
          >
            <Sparkles size={15} className="text-[#B7ACFF]" />
            <span className="text-xs font-semibold tracking-wide text-white/80">
              YOUR SCHOLARSHIP JOURNEY STARTS HERE
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-lg text-4xl font-black leading-[1.17] tracking-tight xl:text-5xl"
          >
            Unlock your
            <span className="block bg-gradient-to-r from-white via-[#C9C2FF] to-white bg-clip-text text-transparent">
              potential.
            </span>
            Discover your
            <span className="text-[#8DDECE]"> opportunities.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-sm leading-7 text-white/60"
          >
            Thousands of opportunities. One personalized destination.
            Let GRANTLY help you find scholarships that match your ambitions.
          </motion.p>

          {/* Illustration */}
          <motion.div
            variants={fadeUp}
            className="relative mx-auto mt-8 h-[340px] w-full max-w-[500px]"
            style={{ perspective: 1000 }}
          >
            {/* Central glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#725BFF]/30 blur-[80px]"
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Main logo card */}
            <motion.div
              variants={floating}
              animate="animate"
              whileHover={shouldReduceMotion ? {} : {
                rotateY: 10,
                rotateX: -8,
                scale: 1.04,
              }}
              className="absolute left-1/2 top-1/2 z-10 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[36px] border border-white/20 bg-gradient-to-br from-[#7866F3] to-[#4D3BB8] shadow-[0_25px_80px_rgba(91,75,219,.4)]"
            >
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="mb-3 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15"
              >
                <GraduationCap size={48} strokeWidth={1.5} />
              </motion.div>

              <span className="text-xl font-black tracking-widest">
                GRANTLY
              </span>

              <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-white/60">
                DREAM. DISCOVER. ACHIEVE.
              </span>
            </motion.div>

            {/* Scholarship card */}
            <motion.div
              variants={floating}
              animate="animate"
              whileHover={{ scale: 1.06, y: -5 }}
              className="absolute left-0 top-5 z-20 w-48 rounded-2xl border border-white/15 bg-white/[0.10] p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18B6A4]/20 text-[#6CE1CE]">
                  <Award size={19} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50">
                    OPPORTUNITY
                  </p>
                  <p className="text-xs font-bold">Merit Scholarship</p>
                </div>
              </div>

              <p className="mt-3 text-lg font-black text-[#8DDECE]">
                ₹50,000
              </p>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="h-full rounded-full bg-[#18B6A4]"
                />
              </div>

              <p className="mt-2 text-[9px] text-white/50">
                Opportunity matched
              </p>
            </motion.div>

            {/* Match card */}
            <motion.div
              variants={floating}
              animate="animate"
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.06 }}
              className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-white/15 bg-white/[0.10] p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-white/60">
                  PROFILE MATCH
                </p>
                <CheckCircle2 size={16} className="text-[#6CE1CE]" />
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-black">94</span>
                <span className="mb-1 text-sm font-bold text-[#8DDECE]">%</span>
              </div>

              <p className="mt-1 text-[10px] text-white/55">
                Excellent eligibility match
              </p>
            </motion.div>

            {/* Bottom card */}
            <motion.div
              variants={floating}
              animate="animate"
              transition={{ delay: 1.5 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="absolute bottom-1 left-8 z-20 w-48 rounded-2xl border border-white/15 bg-white/[0.10] p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7B955]/20 text-[#FFD58B]">
                  <BookOpen size={18} />
                </div>

                <div>
                  <p className="text-[10px] text-white/50">YOUR FUTURE</p>
                  <p className="text-xs font-bold">More possibilities</p>
                </div>
              </div>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star
                    key={item}
                    size={13}
                    className="fill-[#F7B955] text-[#F7B955]"
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating icon */}
            <motion.div
              animate={shouldReduceMotion ? {} : {
                y: [0, -12, 0],
                rotate: [0, 12, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-7 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#8DDECE] shadow-xl backdrop-blur-xl"
            >
              <Zap size={25} />
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={fadeUp}
            className="mt-4 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            <div>
              <ShieldCheck size={19} className="mb-2 text-[#8DDECE]" />
              <p className="text-xs font-bold">Smart Matching</p>
              <p className="mt-1 text-[10px] text-white/45">
                Personalized discovery
              </p>
            </div>

            <div>
              <Globe size={19} className="mb-2 text-[#B7ACFF]" />
              <p className="text-xs font-bold">One Platform</p>
              <p className="mt-1 text-[10px] text-white/45">
                Multiple opportunities
              </p>
            </div>

            <div>
              <BookOpen size={19} className="mb-2 text-[#FFD58B]" />
              <p className="text-xs font-bold">Stay Organized</p>
              <p className="mt-1 text-[10px] text-white/45">
                Track your journey
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/40">
          <span>© 2026 GRANTLY</span>
          <span>Empowering students through opportunities.</span>
        </div>
      </section>

      {/* =====================================
          RIGHT PANEL - SIGNUP FORM
      ===================================== */}

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white px-5 py-8 sm:px-10 lg:px-12 xl:px-20">

        {/* Mobile hero */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#29205C] to-[#5141CA] p-6 text-white lg:hidden">
          <AnimatedOrb className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#8DDECE]/30 blur-3xl" />

          <div className="relative z-10">
            <Logo size="md" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                <Sparkles size={14} />
                YOUR FUTURE STARTS HERE
              </div>

              <h1 className="mt-3 max-w-sm text-3xl font-black leading-tight">
                Dream bigger.
                <span className="block text-[#8DDECE]">
                  Find your opportunity.
                </span>
              </h1>

              <p className="mt-3 max-w-sm text-xs leading-6 text-white/65">
                Create your account and discover scholarship opportunities
                personalized for you.
              </p>
            </motion.div>

            <motion.div
              variants={floating}
              animate="animate"
              className="absolute bottom-2 right-3 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10"
            >
              <GraduationCap size={42} />
            </motion.div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[460px]"
        >
          {/* Desktop brand */}
          <div className="mb-10 hidden lg:block">
            <div className="mb-8 flex items-center justify-between">
              <Logo size="lg" />

              <span className="rounded-full bg-[#F2F0FF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5B4BDB]">
                Student registration
              </span>
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F2F0FF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5B4BDB]">
            <Sparkles size={13} />
            Create your free account
          </div>

          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-black tracking-tight text-[#171B2D] sm:text-4xl"
          >
            Get started
            <span className="text-[#5B4BDB]"> today.</span>
          </motion.h2>

          <p className="mt-3 text-sm leading-6 text-[#85899A]">
            Join GRANTLY and take the first step towards finding the right
            scholarship for your future.
          </p>

          {/* Demo autofill */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#DDD7FF] bg-[#F6F4FF] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5B4BDB] shadow-sm">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#272044]">
                  Exploring GRANTLY?
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Try the sample student profile.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handlePrefill}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0 rounded-xl bg-[#5B4BDB] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B4BDB]/15"
            >
              Try demo
            </motion.button>
          </motion.div>

          {/* Error animation */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                role="alert"
                className="mt-5 overflow-hidden rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form fields */}
          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 space-y-5"
          >
            {/* Name */}
            <motion.div variants={fadeUp}>
              <label className="mb-2 block text-xs font-bold text-[#25283A]">
                Full name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F9FAFC] py-3.5 pl-11 pr-4 text-sm text-[#171B2D] outline-none transition duration-300 focus:border-[#6554DF] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
              <label className="mb-2 block text-xs font-bold text-[#25283A]">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F9FAFC] py-3.5 pl-11 pr-4 text-sm text-[#171B2D] outline-none transition duration-300 focus:border-[#6554DF] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10"
                />
              </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={fadeUp}>
              <label className="mb-2 block text-xs font-bold text-[#25283A]">
                Current education level
              </label>

              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={educationLevel}
                  onChange={(e) =>
                    setEducationLevel(e.target.value as EducationLevel)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-[#F9FAFC] py-3.5 pl-11 pr-4 text-sm text-[#171B2D] outline-none transition duration-300 focus:border-[#6554DF] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10"
                >
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
              <label className="mb-2 block text-xs font-bold text-[#25283A]">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F9FAFC] py-3.5 pl-11 pr-12 text-sm text-[#171B2D] outline-none transition duration-300 focus:border-[#6554DF] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#5B4BDB]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm password */}
            <motion.div variants={fadeUp}>
              <label className="mb-2 block text-xs font-bold text-[#25283A]">
                Confirm password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F9FAFC] py-3.5 pl-11 pr-4 text-sm text-[#171B2D] outline-none transition duration-300 focus:border-[#6554DF] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10"
                />
              </div>
            </motion.div>

            {/* Security note */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-[11px] text-slate-400"
            >
              <ShieldCheck size={15} className="shrink-0 text-[#18B6A4]" />
              Your account details are used for this prototype&apos;s signup flow.
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={fadeUp}
              type="submit"
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.02,
                y: -3,
                boxShadow: '0px 15px 35px rgba(91,75,219,0.28)',
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#5B4BDB] to-[#7665E8] py-4 text-sm font-bold text-white shadow-lg shadow-[#5B4BDB]/20 transition"
            >
              <span>Continue to profile setup</span>

              <motion.span
                animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
          </motion.form>

          {/* Sign in */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-7 border-t border-slate-100 pt-6 text-center"
          >
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#5B4BDB] transition hover:text-[#18B6A4]"
              >
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <CheckCircle2 size={13} className="text-[#18B6A4]" />
            GRANTLY · Your scholarship discovery platform
          </div>
        </motion.div>
      </section>
    </main>
  );
}
