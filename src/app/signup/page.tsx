'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { EducationLevel } from '@/types';
import { Eye, EyeOff, Lock, Mail, User, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const educationOptions: EducationLevel[] = [
    'School (Class 9-10)',
    'Higher Secondary (Class 11-12)',
    'Undergraduate',
    'Postgraduate',
    'PhD / Research',
    'Diploma / Vocational',
  ];

  const handlePrefill = () => {
    setFullName('Priya Sharma');
    setEmail('priya.sharma@example.edu.in');
    setEducationLevel('Undergraduate');
    setPassword('Scholar@2026');
    setConfirmPassword('Scholar@2026');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
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

    // Initialize base profile and route to onboarding wizard
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F8F9FC]">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171B2D] tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-[#72788A]">
            Join thousands of Indian students discovering verified scholarships
          </p>
        </div>

        {/* Demo Quick Fill */}
        <div className="bg-[#EEEAFE] border border-[#5B4BDB]/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="text-xs text-[#171B2D] font-medium">
            Reviewing for competition evaluation?
          </div>
          <button
            type="button"
            onClick={handlePrefill}
            className="px-3 py-1.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#18B6A4]" />
            Prefill Sample Student
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                  required
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="priya.sharma@example.edu.in"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                  required
                />
              </div>
            </div>

            {/* Education Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                Current Education Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                >
                  {educationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#5B4BDB] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          By signing up, you acknowledge this is a frontend prototype demonstration for competition review.
        </p>
      </div>
    </div>
  );
}

