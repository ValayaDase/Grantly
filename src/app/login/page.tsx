
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function FloatingOrb({
  className,
  delay = 0,
  reduceMotion,
}: {
  className: string;
  delay?: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={
        reduceMotion
          ? {}
          : {
              y: [0, -22, 0],
              x: [0, 12, 0],
              scale: [1, 1.08, 1],
            }
      }
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const shouldReduceMotion = useReducedMotion();

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
    setError('');
    login(DEMO_STUDENT_PROFILE);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] flex">
      {/* LEFT: Animated Hero Section */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-[#17152F] text-white flex-col justify-between p-10 xl:p-14">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(91,75,219,0.35),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(24,182,164,0.18),transparent_45%)]" />

        <FloatingOrb
          className="w-72 h-72 bg-[#5B4BDB]/35 -top-24 -left-20"
          reduceMotion={!!shouldReduceMotion}
        />
        <FloatingOrb
          className="w-80 h-80 bg-[#18B6A4]/20 bottom-10 -right-32"
          delay={2}
          reduceMotion={!!shouldReduceMotion}
        />

        {/* Decorative rings */}
        <motion.div
          className="absolute top-[22%] right-[12%] w-64 h-64 rounded-full border border-white/[0.08]"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[27%] right-[17%] w-44 h-44 rounded-full border border-dashed border-[#18B6A4]/25"
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        />

        {/* Hero content */}
        <div className="relative z-10">
          <motion.div
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-3"
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div
            variants={stagger}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="mt-20 max-w-xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18B6A4]/25 bg-[#18B6A4]/10 text-[#65E0CF] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                YOUR FUTURE STARTS HERE
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl xl:text-5xl font-black leading-[1.15] tracking-tight"
            >
              Your dreams deserve
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A99CFF] via-[#8B7CF6] to-[#4DD9C7]">
                every opportunity.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm xl:text-base text-white/60 leading-7 max-w-md"
            >
              Discover scholarships, track applications, and manage your
              academic journey — all from one place.
            </motion.p>
          </motion.div>
        </div>

        {/* Floating scholarship cards */}
        <div className="relative z-10 h-56 mt-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -35, y: 15 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute left-0 top-3 w-64 p-4 rounded-2xl bg-white/[0.09] border border-white/15 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#5B4BDB] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#65E0CF] bg-[#18B6A4]/10 px-2 py-1 rounded-full">
                MATCH FOUND
              </span>
            </div>
            <p className="mt-4 text-sm font-bold">Merit Scholarship</p>
            <p className="text-[11px] text-white/50 mt-1">
              A new opportunity is waiting for you
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-black text-[#A99CFF]">₹50,000</span>
              <ArrowUpRight className="w-4 h-4 text-[#65E0CF]" />
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 35, y: 20 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 1, x: 0, y: 0, rotate: 5 }
            }
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute right-0 top-14 w-60 p-4 rounded-2xl bg-[#29264C]/90 border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#18B6A4]/15 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-[#65E0CF]" />
              </div>
              <div>
                <p className="text-xs font-bold">Application Progress</p>
                <p className="text-[10px] text-white/50">Your journey, organized</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.2, delay: 1.1 }}
                className="h-full rounded-full bg-gradient-to-r from-[#5B4BDB] to-[#18B6A4]"
              />
            </div>
            <p className="text-[10px] text-white/50 mt-2">Stay on top of every step</p>
          </motion.div>
        </div>

        {/* Bottom benefits */}
        <motion.div
          variants={stagger}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-7"
        >
          {[
            { icon: ShieldCheck, title: 'Smart Discovery', desc: 'Find relevant aid' },
            { icon: Wallet, title: 'Track Funding', desc: 'Manage opportunities' },
            { icon: CheckCircle2, title: 'Stay Organized', desc: 'Never miss a step' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div variants={fadeUp} key={item.title}>
                <Icon className="w-5 h-5 text-[#65E0CF] mb-3" />
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-white/45 mt-1">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5B4BDB] via-[#18B6A4] to-[#5B4BDB]" />
      </section>

      {/* RIGHT: Login Form */}
      <section className="flex-1 min-h-screen flex flex-col justify-center items-center px-5 py-10 sm:px-8 relative overflow-hidden">
        {/* Mobile background decoration */}
        <div className="absolute inset-0 pointer-events-none lg:hidden overflow-hidden">
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-[#5B4BDB]/10 blur-3xl" />
          <div className="absolute bottom-0 -left-28 w-72 h-72 rounded-full bg-[#18B6A4]/10 blur-3xl" />
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-9">
            <div className="inline-block mb-5">
              <Logo size="lg" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B4BDB]/10 text-[#5B4BDB] text-[10px] font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              YOUR FUTURE STARTS HERE
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xs font-bold text-[#5B4BDB] uppercase tracking-[0.18em] mb-3"
            >
              STUDENT PORTAL
            </motion.p>

            <h1 className="text-3xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
              Welcome <span className="text-[#5B4BDB]">back.</span>
            </h1>

            <p className="mt-3 text-sm text-[#72788A] leading-6">
              Sign in to access your scholarships, applications and document vault.
            </p>
          </div>

          {/* Demo Login */}
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -3 }}
            className="mb-6 p-4 rounded-2xl border border-[#5B4BDB]/15 bg-gradient-to-r from-[#EEEAFE] to-[#E9F8F6] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#5B4BDB] flex items-center justify-center shrink-0 shadow-lg shadow-[#5B4BDB]/20">
                <Sparkles className="w-5 h-5 text-[#65E0CF]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#171B2D]">
                  Competition Demo
                </p>
                <p className="text-[10px] text-[#72788A] mt-1">
                  Explore with sample student data
                </p>
              </div>
            </div>

            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={handleDemoLogin}
              type="button"
              className="shrink-0 px-3.5 py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-[11px] font-bold shadow-md shadow-[#5B4BDB]/20 transition-colors"
            >
              Try Demo <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </motion.button>
          </motion.div>

          {/* Login Card */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_20px_70px_-25px_rgba(23,27,45,0.18)]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <label className="block text-[11px] font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                  Email Address
                </label>

                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#5B4BDB]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu.in"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#5B4BDB]/10 focus:border-[#5B4BDB] transition-all"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#171B2D] uppercase tracking-wider">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#5B4BDB] hover:text-[#18B6A4] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#5B4BDB]" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#5B4BDB]/10 focus:border-[#5B4BDB] transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5B4BDB] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.label
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2.5 cursor-pointer w-fit"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-[#5B4BDB] focus:ring-[#5B4BDB]"
                />
                <span className="text-xs text-slate-600">
                  Keep me signed in on this device
                </span>
              </motion.label>

              {/* Submit */}
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5B4BDB] to-[#6B5CE7] hover:from-[#4838C2] hover:to-[#5B4BDB] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={shouldReduceMotion ? {} : { rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Signup redirect */}
            <div className="text-center mt-7 pt-6 border-t border-slate-100 text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-[#5B4BDB] hover:text-[#18B6A4] transition-colors"
              >
                Create student account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Frontend Evaluation Demo · Sample credentials are pre-filled
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
