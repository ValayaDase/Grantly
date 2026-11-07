
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { INDIAN_STATES } from '@/data/scholarships';
import {
  EducationLevel,
  Gender,
  IncomeCategory,
  SocialCategory,
} from '@/types';
import {
  User,
  GraduationCap,
  IndianRupee,
  Sliders,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Wallet,
  Heart,
  Check,
  Edit3,
  TrendingUp,
} from 'lucide-react';

type TabId = 'personal' | 'education' | 'financial' | 'preferences';

const tabs = [
  { id: 'personal', label: 'Personal Details', shortLabel: 'Personal', icon: User, step: '01' },
  { id: 'education', label: 'Education & Academics', shortLabel: 'Education', icon: GraduationCap, step: '02' },
  { id: 'financial', label: 'Financial Information', shortLabel: 'Financial', icon: IndianRupee, step: '03' },
  { id: 'preferences', label: 'Scholarship Preferences', shortLabel: 'Preferences', icon: Sliders, step: '04' },
] as const;

const inputClass =
  'w-full bg-[#F8F9FC] border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#171B2D] placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-[#B9B1F2] focus:border-[#5B4BDB] focus:ring-4 focus:ring-[#5B4BDB]/10';

const labelClass =
  'block text-xs font-bold text-[#34394B] mb-2';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      staggerChildren: 0.07,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function ProfilePage() {
  const { profile, saveProfile, stats } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [successMessage, setSuccessMessage] = useState('');

  // Personal fields
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [city, setCity] = useState(profile?.city || 'Pune');
  const [dob, setDob] = useState(profile?.dob || '2004-06-15');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'female');
  const [category, setCategory] = useState<SocialCategory>(
    profile?.category || 'OBC'
  );
  const [isDifferentlyAbled] = useState(
    profile?.isDifferentlyAbled || false
  );

  // Education fields
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    profile?.educationLevel || 'Undergraduate'
  );
  const [courseStream, setCourseStream] = useState(
    profile?.courseStream || ''
  );
  const [institutionName, setInstitutionName] = useState(
    profile?.institutionName || ''
  );
  const [currentAcademicYear, setCurrentAcademicYear] = useState(
    profile?.currentAcademicYear || '2nd Year'
  );
  const [percentageOrCgpa, setPercentageOrCgpa] = useState<number>(
    profile?.percentageOrCgpa || 0
  );

  // Financial fields
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(
    profile?.annualFamilyIncome || 0
  );
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>(
    profile?.incomeCategory || '₹1.5 Lakh - ₹3 Lakh'
  );

  // Preferences
  const [preferredScholarshipCategories, setPreferredScholarshipCategories] =
    useState<string[]>(profile?.preferredScholarshipCategories || []);

  const [scholarshipTypePreference, setScholarshipTypePreference] = useState<
    'All' | 'Government Only' | 'Private Only'
  >(profile?.scholarshipTypePreference || 'All');

  const availableCategories = [
    'Merit-Based',
    'Need-Based',
    'STEM & Tech',
    'Women Empowerment',
    'Minority Welfare',
    'Higher Education',
    'Research & Innovation',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    saveProfile({
      fullName,
      email,
      phone,
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
    });

    setSuccessMessage(
      'Profile saved successfully! AI Match scores have been recalculated.'
    );

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const toggleCategory = (cat: string) => {
    setPreferredScholarshipCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const goToTab = (tab: TabId) => {
    setActiveTab(tab);
  };

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const firstName = fullName.trim().split(' ')[0] || 'Student';

  return (
    <DashboardLayout
      title="Student Profile & Credentials"
      subtitle="Manage your personal, academic and financial information."
    >
      <div className="max-w-6xl mx-auto space-y-6 pb-10">

        {/* PROFILE HERO */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-[#17152F] p-6 sm:p-8 text-white shadow-xl"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(91,75,219,0.4),transparent_50%),radial-gradient(ellipse_at_90%_90%,rgba(24,182,164,0.22),transparent_45%)]" />

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-10 -top-20 w-64 h-64 rounded-full border border-white/[0.07]"
          />

          <div className="absolute right-10 bottom-[-100px] w-64 h-64 rounded-full bg-[#5B4BDB]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">

            {/* Student identity */}
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: 4 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] bg-gradient-to-br from-[#8D7EF5] to-[#18B6A4] flex items-center justify-center text-white text-3xl sm:text-4xl font-black uppercase shadow-xl shadow-black/20 shrink-0 border border-white/20"
              >
                {fullName.charAt(0) || 'P'}
              </motion.div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#65E0CF]">
                    STUDENT PROFILE
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#18B6A4]/15 border border-[#18B6A4]/20 text-[#65E0CF] text-[9px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#65E0CF]" />
                    ACTIVE
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {fullName || 'Your Name'}
                </h2>

                <p className="text-xs sm:text-sm text-white/55 mt-1 truncate">
                  {courseStream || 'Add your course'} 
                  {institutionName ? ` • ${institutionName}` : ''}
                </p>

                <div className="flex items-center gap-2 mt-3 text-[10px] sm:text-xs text-white/60">
                  <ShieldCheck className="w-4 h-4 text-[#65E0CF]" />
                  Scholarship eligibility profile
                </div>
              </div>
            </div>

            {/* Profile completion */}
            <div className="w-full xl:w-[310px] p-5 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-bold text-white/80">
                    Profile Strength
                  </p>
                  <p className="text-[10px] text-white/45 mt-1">
                    Keep your details up to date
                  </p>
                </div>

                <div className="text-3xl font-black text-[#65E0CF] tabular-nums">
                  {stats.profileCompletion}%
                </div>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.profileCompletion}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#8D7EF5] to-[#18B6A4]"
                />
              </div>

              <div className="flex justify-between mt-3 text-[10px] text-white/45">
                <span>Profile completion</span>
                <span>Improve your scholarship matches</span>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            {[
              { icon: User, label: 'Student', value: firstName },
              { icon: GraduationCap, label: 'Education', value: educationLevel },
              { icon: MapPin, label: 'Location', value: state },
              { icon: Award, label: 'Preferences', value: `${preferredScholarshipCategories.length} selected` },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="min-w-0">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <Icon className="w-3.5 h-3.5 text-[#65E0CF]" />
                    <span className="text-[10px]">{item.label}</span>
                  </div>
                  <p className="text-xs font-bold text-white/90 truncate">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* SECTION HEADING */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#5B4BDB] mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-[0.18em] uppercase">
                PROFILE MANAGEMENT
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#171B2D]">
              Your information
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Update your details to get more accurate scholarship recommendations.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Edit3 className="w-4 h-4" />
            Edit your profile
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => goToTab(tab.id)}
                  className={`relative flex items-center gap-3 p-3 sm:p-4 rounded-xl text-left transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#5B4BDB]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="profileActiveTab"
                      className="absolute inset-0 rounded-xl bg-[#5B4BDB] shadow-lg shadow-[#5B4BDB]/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center bg-black/5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="relative z-10 min-w-0">
                    <p className="text-[10px] font-bold opacity-60">
                      STEP {tab.step}
                    </p>
                    <p className="text-xs font-bold mt-0.5 truncate">
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    Changes saved successfully!
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {successMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN FORM */}
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-sm overflow-hidden">

            {/* Form header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-[#171B2D]">
                  {tabs[currentTabIndex].label}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Complete your details below
                </p>
              </div>

              <div className="text-[10px] font-bold text-[#5B4BDB] bg-[#EEEAFE] px-3 py-2 rounded-lg shrink-0">
                {currentTabIndex + 1} OF 4
              </div>
            </div>

            {/* Animated form sections */}
            <div className="p-6 sm:p-8 min-h-[350px]">
              <AnimatePresence mode="wait">

                {/* PERSONAL DETAILS */}
                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    variants={sectionVariants}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div variants={fieldVariants} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#EEEAFE] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#5B4BDB]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171B2D]">
                          Personal Identification
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Your basic identity and contact information
                        </p>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`${inputClass} pl-11`}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${inputClass} pl-11`}
                            placeholder="student@college.edu.in"
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as Gender)}
                          className={inputClass}
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Social Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as SocialCategory)}
                          className={inputClass}
                        >
                          <option value="General">General</option>
                          <option value="OBC">OBC (Other Backward Class)</option>
                          <option value="SC">SC (Scheduled Caste)</option>
                          <option value="ST">ST (Scheduled Tribe)</option>
                          <option value="EWS">EWS (Economically Weaker Section)</option>
                          <option value="Minority">Minority Community</option>
                        </select>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Home State / Domicile</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={`${inputClass} pl-11`}
                          >
                            {INDIAN_STATES.filter((s) => s !== 'All India').map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>City / District</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter your city"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* EDUCATION */}
                {activeTab === 'education' && (
                  <motion.div
                    key="education"
                    variants={sectionVariants}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div variants={fieldVariants} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#18B6A4]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171B2D]">
                          Academic Qualifications
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Your current education and academic performance
                        </p>
                      </div>
                    </motion.div>

                    <div className="space-y-5">
                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Current Education Stage</label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                            className={`${inputClass} pl-11`}
                          >
                            <option value="Undergraduate">Undergraduate Degree</option>
                            <option value="Higher Secondary (Class 11-12)">Higher Secondary (Class 11-12)</option>
                            <option value="Postgraduate">Postgraduate Degree</option>
                            <option value="Diploma / Vocational">Diploma / Vocational</option>
                            <option value="School (Class 9-10)">School (Class 9-10)</option>
                            <option value="PhD / Research">PhD / Research</option>
                          </select>
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Degree Course & Specialization</label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={courseStream}
                            onChange={(e) => setCourseStream(e.target.value)}
                            placeholder="e.g. B.Tech Computer Science & Engineering"
                            className={`${inputClass} pl-11`}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fieldVariants}>
                        <label className={labelClass}>Institution / College Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            placeholder="Enter your college name"
                            className={`${inputClass} pl-11`}
                            required
                          />
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <motion.div variants={fieldVariants}>
                          <label className={labelClass}>Current Academic Year</label>
                          <select
                            value={currentAcademicYear}
                            onChange={(e) => setCurrentAcademicYear(e.target.value)}
                            className={inputClass}
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="Final Year">Final Year</option>
                          </select>
                        </motion.div>

                        <motion.div variants={fieldVariants}>
                          <label className={labelClass}>Qualifying Score / Percentage (%)</label>
                          <div className="relative">
                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="number"
                              step="0.1"
                              min="35"
                              max="100"
                              value={percentageOrCgpa}
                              onChange={(e) => setPercentageOrCgpa(parseFloat(e.target.value) || 0)}
                              className={`${inputClass} pl-11`}
                              required
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FINANCIAL */}
                {activeTab === 'financial' && (
                  <motion.div
                    key="financial"
                    variants={sectionVariants}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div variants={fieldVariants} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171B2D]">
                          Household Financial Background
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Financial details help identify need-based scholarships
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={fieldVariants}
                      className="rounded-2xl bg-gradient-to-r from-[#EEEAFE] to-[#E8F8F5] p-5 border border-[#5B4BDB]/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <IndianRupee className="w-5 h-5 text-[#5B4BDB]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Annual Family Income
                          </p>
                          <p className="text-2xl font-black text-[#171B2D] mt-0.5">
                            ₹{annualFamilyIncome.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label className={labelClass}>
                        Annual Gross Family Income (in INR ₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          step="10000"
                          min="0"
                          value={annualFamilyIncome}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setAnnualFamilyIncome(val);

                            if (val <= 150000) setIncomeCategory('Below ₹1.5 Lakh');
                            else if (val <= 300000) setIncomeCategory('₹1.5 Lakh - ₹3 Lakh');
                            else if (val <= 600000) setIncomeCategory('₹3 Lakh - ₹6 Lakh');
                            else if (val <= 800000) setIncomeCategory('₹6 Lakh - ₹8 Lakh');
                            else setIncomeCategory('Above ₹8 Lakh');
                          }}
                          className={`${inputClass} pl-11`}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label className={labelClass}>Income Bracket Tier</label>
                      <select
                        value={incomeCategory}
                        onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                        className={inputClass}
                      >
                        <option value="Below ₹1.5 Lakh">Below ₹1.5 Lakh</option>
                        <option value="₹1.5 Lakh - ₹3 Lakh">₹1.5 Lakh - ₹3 Lakh</option>
                        <option value="₹3 Lakh - ₹6 Lakh">₹3 Lakh - ₹6 Lakh</option>
                        <option value="₹6 Lakh - ₹8 Lakh">₹6 Lakh - ₹8 Lakh</option>
                        <option value="Above ₹8 Lakh">Above ₹8 Lakh</option>
                      </select>
                    </motion.div>

                    <motion.div variants={fieldVariants} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-[#18B6A4] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Your financial information is used by the platform&apos;s
                        eligibility logic to help identify relevant scholarship
                        opportunities.
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* PREFERENCES */}
                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    variants={sectionVariants}
                    initial={shouldReduceMotion ? false : 'hidden'}
                    animate="visible"
                    exit="exit"
                    className="space-y-7"
                  >
                    <motion.div variants={fieldVariants} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#FCEFF5] flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171B2D]">
                          Scholarship Preferences
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Tell us what opportunities interest you
                        </p>
                      </div>
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <label className="text-xs font-bold text-[#34394B]">
                          Preferred Scholarship Categories
                        </label>
                        <span className="text-[10px] font-bold text-[#5B4BDB]">
                          {preferredScholarshipCategories.length} SELECTED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableCategories.map((cat, index) => {
                          const isSelected = preferredScholarshipCategories.includes(cat);

                          return (
                            <motion.button
                              key={cat}
                              type="button"
                              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                              onClick={() => toggleCategory(cat)}
                              className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                                isSelected
                                  ? 'bg-[#F0EDFF] border-[#5B4BDB] shadow-sm shadow-[#5B4BDB]/10'
                                  : 'bg-[#F8F9FC] border-slate-200 hover:border-[#B9B1F2]'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-[#5B4BDB] text-white'
                                    : 'bg-white text-slate-400'
                                }`}>
                                  {index === 0 ? <Award className="w-4 h-4" /> :
                                    index === 1 ? <Wallet className="w-4 h-4" /> :
                                    index === 2 ? <BookOpen className="w-4 h-4" /> :
                                    index === 3 ? <Heart className="w-4 h-4" /> :
                                    index === 4 ? <User className="w-4 h-4" /> :
                                    index === 5 ? <GraduationCap className="w-4 h-4" /> :
                                    <Sparkles className="w-4 h-4" />}
                                </span>

                                <span className={`text-xs font-bold ${
                                  isSelected ? 'text-[#5B4BDB]' : 'text-slate-600'
                                }`}>
                                  {cat}
                                </span>
                              </div>

                              <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#5B4BDB] border-[#5B4BDB] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label className="block text-xs font-bold text-[#34394B] mb-3">
                        Scholarship Provider Preference
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'All', label: 'All Providers', desc: 'Government + Private' },
                          { value: 'Government Only', label: 'Government', desc: 'Public scholarships' },
                          { value: 'Private Only', label: 'Private', desc: 'Private scholarships' },
                        ].map((pref) => {
                          const isSelected = scholarshipTypePreference === pref.value;

                          return (
                            <motion.button
                              key={pref.value}
                              type="button"
                              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                              onClick={() =>
                                setScholarshipTypePreference(
                                  pref.value as 'All' | 'Government Only' | 'Private Only'
                                )
                              }
                              className={`p-4 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-[#E8F8F5] border-[#18B6A4] shadow-sm'
                                  : 'bg-[#F8F9FC] border-slate-200 hover:border-[#18B6A4]/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-bold ${
                                  isSelected ? 'text-[#118C7F]' : 'text-slate-700'
                                }`}>
                                  {pref.label}
                                </span>

                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-[#18B6A4] bg-[#18B6A4]'
                                    : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                </span>
                              </div>

                              <p className="text-[10px] text-slate-400 mt-2">
                                {pref.desc}
                              </p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>

                    <motion.div variants={fieldVariants} className="rounded-2xl bg-gradient-to-r from-[#EEEAFE] to-[#E8F8F5] border border-[#5B4BDB]/10 p-4 flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-[#5B4BDB] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#171B2D]">
                          Better preferences, better matches
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Selecting relevant categories helps tailor scholarship
                          discovery to your interests.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* FORM FOOTER */}
            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-[#FCFCFE] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#18B6A4]" />
                Your profile information helps determine eligibility.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentTabIndex > 0 && (
                  <motion.button
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    type="button"
                    onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </motion.button>
                )}

                {currentTabIndex < tabs.length - 1 ? (
                  <motion.button
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    type="button"
                    onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold shadow-lg shadow-[#5B4BDB]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#5B4BDB] to-[#6B5CE7] hover:from-[#4838C2] hover:to-[#5B4BDB] text-white text-xs font-bold shadow-lg shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Profile Changes
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
