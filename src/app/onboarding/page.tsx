
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  User,
  Wallet,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Heart,
  Building2,
} from 'lucide-react';

import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { INDIAN_STATES } from '@/data/scholarships';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import {
  EducationLevel,
  Gender,
  IncomeCategory,
  SocialCategory,
} from '@/types';

const categories = [
  'Merit-Based',
  'Need-Based',
  'STEM & Tech',
  'Women Empowerment',
  'Minority Welfare',
  'Higher Education',
  'Research & Innovation',
];

const providerOptions = ['All', 'Government Only', 'Private Only'] as const;

const steps = [
  { title: 'Personal', subtitle: 'Basic information', icon: User },
  { title: 'Education', subtitle: 'Academic details', icon: GraduationCap },
  { title: 'Financial', subtitle: 'Family income', icon: Wallet },
  { title: 'Preferences', subtitle: 'Scholarship interests', icon: Heart },
];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#171B2D] outline-none transition focus:border-[#5B4BDB] focus:bg-white focus:ring-4 focus:ring-[#5B4BDB]/10';

const labelClass =
  'mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, saveProfile } = useApp();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Personal information
  const [fullName, setFullName] = useState(
    profile?.fullName || 'Priya Sharma'
  );
  const [state, setState] = useState(
    profile?.state || 'Maharashtra'
  );
  const [city, setCity] = useState(profile?.city || 'Pune');
  const [dob, setDob] = useState(
    profile?.dob || '2004-06-15'
  );
  const [gender, setGender] = useState<Gender>(
    profile?.gender || 'female'
  );
  const [category, setCategory] = useState<SocialCategory>(
    profile?.category || 'OBC'
  );
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState(
    profile?.isDifferentlyAbled || false
  );

  // Education information
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    profile?.educationLevel || 'Undergraduate'
  );
  const [courseStream, setCourseStream] = useState(
    profile?.courseStream || 'B.Tech Computer Science & Engineering'
  );
  const [institutionName, setInstitutionName] = useState(
    profile?.institutionName ||
      'Pune Institute of Computer Technology (PICT)'
  );
  const [currentAcademicYear, setCurrentAcademicYear] = useState(
    profile?.currentAcademicYear || '2nd Year'
  );
  const [percentageOrCgpa, setPercentageOrCgpa] = useState<number>(
    profile?.percentageOrCgpa || 84.5
  );

  // Financial information
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(
    profile?.annualFamilyIncome || 240000
  );
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>(
    profile?.incomeCategory || '₹1.5 Lakh - ₹3 Lakh'
  );

  // Scholarship preferences
  const [preferredScholarshipCategories, setPreferredScholarshipCategories] =
    useState<string[]>(
      profile?.preferredScholarshipCategories || [
        'STEM & Tech',
        'Women Empowerment',
        'Merit-Based',
      ]
    );

  const [scholarshipTypePreference, setScholarshipTypePreference] =
    useState<'All' | 'Government Only' | 'Private Only'>(
      profile?.scholarshipTypePreference || 'All'
    );

  const progress = (step / 4) * 100;

  const handleAutofill = () => {
    const demo = DEMO_STUDENT_PROFILE;

    setFullName(demo.fullName);
    setState(demo.state);
    setCity(demo.city);
    setDob(demo.dob || '2004-06-15');
    setGender(demo.gender);
    setCategory(demo.category);
    setIsDifferentlyAbled(demo.isDifferentlyAbled);
    setEducationLevel(demo.educationLevel);
    setCourseStream(demo.courseStream);
    setInstitutionName(demo.institutionName);
    setCurrentAcademicYear(demo.currentAcademicYear);
    setPercentageOrCgpa(demo.percentageOrCgpa);
    setAnnualFamilyIncome(demo.annualFamilyIncome);
    setIncomeCategory(demo.incomeCategory);
    setPreferredScholarshipCategories(
      demo.preferredScholarshipCategories
    );
    setScholarshipTypePreference(demo.scholarshipTypePreference);
    setError('');
  };

  const updateIncomeCategory = (income: number) => {
    if (income <= 150000) {
      setIncomeCategory('Below ₹1.5 Lakh');
    } else if (income <= 300000) {
      setIncomeCategory('₹1.5 Lakh - ₹3 Lakh');
    } else if (income <= 600000) {
      setIncomeCategory('₹3 Lakh - ₹6 Lakh');
    } else if (income <= 800000) {
      setIncomeCategory('₹6 Lakh - ₹8 Lakh');
    } else {
      setIncomeCategory('Above ₹8 Lakh');
    }
  };

  const toggleCategory = (item: string) => {
    setPreferredScholarshipCategories((previous) =>
      previous.includes(item)
        ? previous.filter((categoryItem) => categoryItem !== item)
        : [...previous, item]
    );
  };

  const validateStep = () => {
    setError('');

    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }

      if (!state) {
        setError('Please select your state.');
        return false;
      }

      if (!city.trim()) {
        setError('Please enter your city.');
        return false;
      }

      if (dob && new Date(dob).getTime() > Date.now()) {
        setError('Date of birth cannot be in the future.');
        return false;
      }
    }

    if (step === 2) {
      if (!courseStream.trim()) {
        setError('Please enter your course or stream.');
        return false;
      }

      if (!institutionName.trim()) {
        setError('Please enter your institution name.');
        return false;
      }

      if (
        !Number.isFinite(percentageOrCgpa) ||
        percentageOrCgpa <= 0 ||
        percentageOrCgpa > 100
      ) {
        setError('Please enter valid marks between 1 and 100.');
        return false;
      }
    }

    if (step === 3) {
      if (
        !Number.isFinite(annualFamilyIncome) ||
        annualFamilyIncome < 0
      ) {
        setError('Please enter a valid annual family income.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep((previous) => previous + 1);
      return;
    }

    try {
      saveProfile({
        fullName,
        state,
        city,
        dob,
        gender,
        category,
        isDifferentlyAbled,
        educationLevel,
        courseStream,
        institutionName,
        currentAcademicYear,
        percentageOrCgpa,
        annualFamilyIncome,
        incomeCategory,
        preferredScholarshipCategories,
        scholarshipTypePreference,
        onboardingCompleted: true,
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Profile save failed:', err);
      setError('Unable to save your profile. Please try again.');
    }
  };

  const handlePrevious = () => {
    setError('');
    setStep((previous) => Math.max(1, previous - 1));
  };

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-[#171B2D]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Logo size="md" href="/" />

          <button
            type="button"
            onClick={handleAutofill}
            className="inline-flex items-center gap-2 rounded-xl bg-[#EEEAFE] px-4 py-2.5 text-xs font-bold text-[#5B4BDB] transition hover:bg-[#5B4BDB] hover:text-white"
          >
            <Sparkles size={15} />
            Autofill Demo
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[320px_1fr] lg:py-12">

        {/* Left panel */}
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#5141CA] via-[#6554DF] to-[#8979F0] p-7 text-white shadow-xl shadow-[#5B4BDB]/15">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <GraduationCap size={26} />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Welcome to GRANTLY
            </p>

            <h1 className="text-3xl font-extrabold leading-tight">
              Your future deserves an opportunity.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/75">
              Complete your profile to discover scholarships that match
              your education, eligibility and interests.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/20 pt-6">
              <div className="flex items-center gap-3 text-sm text-white/90">
                <ShieldCheck size={18} />
                Personalized scholarship matching
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <BookOpen size={18} />
                Academic eligibility insights
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <Wallet size={18} />
                Financial eligibility insights
              </div>
            </div>
          </div>

          {/* Step navigation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile setup
            </p>

            <div className="space-y-5">
              {steps.map((item, index) => {
                const currentStep = index + 1;
                const Icon = item.icon;
                const isActive = step === currentStep;
                const isCompleted = step > currentStep;

                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        isActive
                          ? 'bg-[#5B4BDB] text-white shadow-lg shadow-[#5B4BDB]/20'
                          : isCompleted
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                    </div>

                    <div>
                      <p
                        className={`text-sm font-bold ${
                          isActive ? 'text-[#5B4BDB]' : 'text-slate-700'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main form */}
        <section className="min-w-0">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-9">

            {/* Progress */}
            <div className="mb-9">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5B4BDB]">
                    Step {step} of 4
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                    {steps[step - 1].title} information
                  </h2>
                </div>

                <span className="rounded-xl bg-[#EEEAFE] px-3 py-2 text-xs font-bold text-[#5B4BDB]">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5B4BDB] to-[#18B6A4] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              >
                {error}
              </div>
            )}

            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Personal details</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Tell us a little about yourself.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Full name</label>
                  <input
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Home state</label>
                    <select
                      className={inputClass}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {INDIAN_STATES.filter(
                        (item) => item !== 'All India'
                      ).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>City / District</label>
                    <input
                      className={inputClass}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Date of birth</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={dob}
                      max="2026-12-31"
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      className={inputClass}
                      value={gender}
                      onChange={(e) =>
                        setGender(e.target.value as Gender)
                      }
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Social category</label>
                  <select
                    className={inputClass}
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as SocialCategory)
                    }
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                    <option value="Minority">Minority</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-[#5B4BDB]/40 hover:bg-[#F8F7FF]">
                  <input
                    type="checkbox"
                    checked={isDifferentlyAbled}
                    onChange={(e) =>
                      setIsDifferentlyAbled(e.target.checked)
                    }
                    className="h-4 w-4 accent-[#5B4BDB]"
                  />
                  <span>
                    <span className="block text-sm font-bold">
                      Person with disability
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Select if applicable to you.
                    </span>
                  </span>
                </label>
              </div>
            )}

            {/* STEP 2: EDUCATION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">
                    Education & academic details
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Help us identify scholarships relevant to your studies.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Education level</label>
                  <select
                    className={inputClass}
                    value={educationLevel}
                    onChange={(e) =>
                      setEducationLevel(e.target.value as EducationLevel)
                    }
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Higher Secondary (Class 11-12)">
                      Higher Secondary (Class 11-12)
                    </option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma / Vocational">
                      Diploma / Vocational
                    </option>
                    <option value="School (Class 9-10)">
                      School (Class 9-10)
                    </option>
                    <option value="PhD / Research">PhD / Research</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Course / specialization</label>
                  <input
                    className={inputClass}
                    value={courseStream}
                    onChange={(e) => setCourseStream(e.target.value)}
                    placeholder="e.g. B.Tech Computer Engineering"
                  />
                </div>

                <div>
                  <label className={labelClass}>Institution name</label>
                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-11`}
                      value={institutionName}
                      onChange={(e) =>
                        setInstitutionName(e.target.value)
                      }
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Academic year</label>
                    <select
                      className={inputClass}
                      value={currentAcademicYear}
                      onChange={(e) =>
                        setCurrentAcademicYear(e.target.value)
                      }
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Previous marks (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="0.1"
                      className={inputClass}
                      value={percentageOrCgpa}
                      onChange={(e) =>
                        setPercentageOrCgpa(
                          Number(e.target.value) || 0
                        )
                      }
                      placeholder="84.5"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F2F0FF] p-4">
                  <div className="flex items-center gap-2 text-[#5B4BDB]">
                    <GraduationCap size={19} />
                    <p className="text-sm font-bold">Academic information</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Your academic details help compare your profile with
                    scholarship education and minimum marks requirements.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: FINANCIAL */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">
                    Financial background
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    This information helps identify income-based
                    scholarship opportunities.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Annual family income (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      className={`${inputClass} pl-10`}
                      value={annualFamilyIncome}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setAnnualFamilyIncome(value);
                        updateIncomeCategory(value);
                      }}
                      placeholder="240000"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#F1EFFF] to-[#EAFBF8] p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your annual family income
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-[#5B4BDB]">
                    ₹{annualFamilyIncome.toLocaleString('en-IN')}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <Check size={16} />
                    Income information updated
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Income category</label>
                  <select
                    className={inputClass}
                    value={incomeCategory}
                    onChange={(e) =>
                      setIncomeCategory(e.target.value as IncomeCategory)
                    }
                  >
                    <option value="Below ₹1.5 Lakh">
                      Below ₹1.5 Lakh
                    </option>
                    <option value="₹1.5 Lakh - ₹3 Lakh">
                      ₹1.5 Lakh - ₹3 Lakh
                    </option>
                    <option value="₹3 Lakh - ₹6 Lakh">
                      ₹3 Lakh - ₹6 Lakh
                    </option>
                    <option value="₹6 Lakh - ₹8 Lakh">
                      ₹6 Lakh - ₹8 Lakh
                    </option>
                    <option value="Above ₹8 Lakh">
                      Above ₹8 Lakh
                    </option>
                  </select>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs leading-5 text-amber-800">
                    Make sure the information matches your actual family
                    income and supporting income certificate.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: PREFERENCES */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">
                    Scholarship preferences
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select the opportunities you want GRANTLY to prioritize.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Preferred scholarship categories
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {categories.map((item) => {
                      const selected =
                        preferredScholarshipCategories.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleCategory(item)}
                          aria-pressed={selected}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition ${
                            selected
                              ? 'border-[#5B4BDB] bg-[#F3F1FF] text-[#5B4BDB]'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-[#5B4BDB]/40'
                          }`}
                        >
                          <span>{item}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              selected
                                ? 'bg-[#5B4BDB] text-white'
                                : 'border border-slate-300'
                            }`}
                          >
                            {selected && <Check size={13} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Scholarship provider preference
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {providerOptions.map((option) => {
                      const selected =
                        scholarshipTypePreference === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setScholarshipTypePreference(option)
                          }
                          className={`rounded-xl border px-2 py-3 text-xs font-bold transition sm:text-sm ${
                            selected
                              ? 'border-[#18B6A4] bg-[#E9FAF7] text-[#119786]'
                              : 'border-slate-200 text-slate-500 hover:border-[#18B6A4]/50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F3F1FF] p-5">
                  <div className="flex items-center gap-2 text-[#5B4BDB]">
                    <Sparkles size={19} />
                    <p className="text-sm font-bold">
                      Almost there!
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Your profile information will be used to personalize
                    scholarship discovery and eligibility matching.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={17} />
                  Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B4BDB] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B4BDB]/20 transition hover:-translate-y-0.5 hover:bg-[#4939C4]"
              >
                {step === 4 ? 'Complete Profile' : 'Continue'}
                {step === 4 ? <Check size={17} /> : <ArrowRight size={17} />}
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            GRANTLY · Unified Scholarship Discovery & Management Platform
          </p>
        </section>
      </div>
    </main>
  );
}
