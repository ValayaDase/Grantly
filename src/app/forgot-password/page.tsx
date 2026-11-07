
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  LockKeyhole,
  GraduationCap,
  Send,
  CircleCheck,
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
    transition: { staggerChildren: 0.13 },
  },
};

export default function ForgotPasswordPage() {
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] flex">

      {/* LEFT: Animated Hero Section */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-[#17152F] text-white flex-col justify-between p-10 xl:p-14">

        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(91,75,219,0.38),transparent_50%),radial-gradient(ellipse_at_85%_80%,rgba(24,182,164,0.20),transparent_45%)]" />

        {/* Animated orbs */}
        <motion.div
          className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#5B4BDB]/30 blur-3xl"
          animate={
            shouldReduceMotion
              ? {}
              : { x: [0, 25, 0], y: [0, 20, 0] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute bottom-0 -right-28 w-80 h-80 rounded-full bg-[#18B6A4]/20 blur-3xl"
          animate={
            shouldReduceMotion
              ? {}
              : { x: [0, -20, 0], y: [0, -25, 0] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Decorative circles */}
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
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div
            variants={stagger}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="mt-24 max-w-xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#18B6A4]/25 bg-[#18B6A4]/10 text-[#65E0CF] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                YOUR ACCOUNT, YOUR SECURITY
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl xl:text-5xl font-black leading-[1.15] tracking-tight"
            >
              A fresh start is
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A99CFF] via-[#8B7CF6] to-[#4DD9C7]">
                just one step away.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm xl:text-base text-white/60 leading-7 max-w-md"
            >
              Forgot your password? No worries. Get back to discovering
              opportunities and managing your scholarship journey.
            </motion.p>
          </motion.div>
        </div>

        {/* Animated security illustration */}
        <div className="relative z-10 h-64 flex items-center justify-center">

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { y: [0, -12, 0], rotate: [0, 2, 0] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-64 h-64 rounded-[36px] border border-white/10 bg-white/[0.06] backdrop-blur-xl flex items-center justify-center shadow-2xl"
          >
            <div className="absolute inset-5 rounded-[28px] border border-dashed border-[#18B6A4]/20" />

            <div className="relative w-32 h-32 rounded-[30px] bg-gradient-to-br from-[#5B4BDB] to-[#7668E8] flex items-center justify-center shadow-2xl shadow-[#5B4BDB]/40">
              <LockKeyhole className="w-14 h-14 text-white" />

              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-[#18B6A4] flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-14 top-10 px-4 py-3 rounded-2xl bg-white/[0.10] border border-white/10 backdrop-blur-xl flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#65E0CF]" />
              <span className="text-[10px] font-bold">Secure Access</span>
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute -right-16 bottom-10 px-4 py-3 rounded-2xl bg-white/[0.10] border border-white/10 backdrop-blur-xl flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#A99CFF]" />
              <span className="text-[10px] font-bold">Email Recovery</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom benefits */}
        <div className="relative z-10 border-t border-white/10 pt-7 grid grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: 'Safe Process', desc: 'Account protection' },
            { icon: Mail, title: 'Email Based', desc: 'Simple recovery' },
            { icon: GraduationCap, title: 'Back to Learning', desc: 'Continue your journey' },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title}>
                <Icon className="w-5 h-5 text-[#65E0CF] mb-3" />
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-white/45 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5B4BDB] via-[#18B6A4] to-[#5B4BDB]" />
      </section>

      {/* RIGHT: Forgot Password Form */}
      <section className="flex-1 min-h-screen flex flex-col justify-center items-center px-5 py-10 sm:px-8 relative overflow-hidden">

        {/* Mobile background */}
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

          {/* Mobile Logo */}
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
            <p className="text-xs font-bold text-[#5B4BDB] uppercase tracking-[0.18em] mb-3">
              ACCOUNT RECOVERY
            </p>

            <h1 className="text-3xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
              {submitted ? (
                <>You&apos;re all <span className="text-[#18B6A4]">set.</span></>
              ) : (
                <>Reset your <span className="text-[#5B4BDB]">password.</span></>
              )}
            </h1>

            <p className="mt-3 text-sm text-[#72788A] leading-6">
              {submitted
                ? 'Your recovery request has been processed in this demo.'
                : 'Enter your registered student email to receive password reset instructions.'}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_20px_70px_-25px_rgba(23,27,45,0.18)]">

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="reset-form"
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6" />
                  </div>

                  <h2 className="text-base font-black text-[#171B2D]">
                    Forgot your password?
                  </h2>

                  <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
                    Don&apos;t worry! It happens. Enter your email address below
                    and we&apos;ll help you get back into your account.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                        Email Address
                      </label>

                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#5B4BDB]" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@college.edu.in"
                          className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#5B4BDB]/10 focus:border-[#5B4BDB] transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5B4BDB] to-[#6B5CE7] hover:from-[#4838C2] hover:to-[#5B4BDB] text-white text-sm font-bold shadow-lg shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2"
                    >
                      Send Reset Instructions
                      <Send className="w-4 h-4" />
                    </motion.button>

                    {/* Back to Login */}
                    <div className="text-center pt-2">
                      <Link
                        href="/login"
                        className="text-xs font-semibold text-slate-500 hover:text-[#5B4BDB] inline-flex items-center gap-2 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Return to Sign In
                      </Link>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-3"
                >
                  <motion.div
                    initial={shouldReduceMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 14,
                    }}
                    className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm"
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>

                  <h2 className="text-lg font-black text-[#171B2D] mt-6">
                    Reset Instructions Simulated!
                  </h2>

                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-3 leading-relaxed">
                    In this frontend demonstration, password recovery has been
                    simulated for:
                  </p>

                  <div className="mt-4 px-4 py-3 rounded-xl bg-[#F8F9FC] border border-slate-100 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-[#5B4BDB]" />
                    <span className="text-xs font-bold text-[#171B2D] break-all">
                      {email}
                    </span>
                  </div>

                  <div className="mt-5 flex items-start gap-2 text-left p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <CircleCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      This is a frontend demo. No actual reset email has been sent.
                      You can return to login and use the demo credentials.
                    </p>
                  </div>

                  <Link
                    href="/login"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#5B4BDB] text-white text-sm font-bold hover:bg-[#4838C2] transition-colors shadow-lg shadow-[#5B4BDB]/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            GRANTLY · Student Account Recovery
          </div>
        </motion.div>
      </section>
    </main>
  );
}
