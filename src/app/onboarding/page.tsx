'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useApp } from '@/context/AppContext';
import { INDIAN_STATES } from '@/data/scholarships';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import { EducationLevel, Gender, IncomeCategory, SocialCategory } from '@/types';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, saveProfile } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState(profile?.fullName || 'Priya Sharma');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [city, setCity] = useState(profile?.city || 'Pune');
  const [dob, setDob] = useState(profile?.dob || '2004-06-15');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'female');
  const [category, setCategory] = useState<SocialCategory>(profile?.category || 'OBC');
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState(profile?.isDifferentlyAbled || false);

  // Step 2: Education Info
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    profile?.educationLevel || 'Undergraduate'
  );
  const [courseStream, setCourseStream] = useState(
    profile?.courseStream || 'B.Tech Computer Science & Engineering'
  );
  const [institutionName, setInstitutionName] = useState(
    profile?.institutionName || 'Pune Institute of Computer Technology (PICT)'
  );
  const [currentAcademicYear, setCurrentAcademicYear] = useState(
    profile?.currentAcademicYear || '2nd Year'
  );
  const [percentageOrCgpa, setPercentageOrCgpa] = useState<number>(profile?.percentageOrCgpa || 84.5);

  // Step 3: Financial Info
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(
    profile?.annualFamilyIncome || 240000
  );
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>(
    profile?.incomeCategory || '₹1.5 Lakh - ₹3 Lakh'
  );

  // Step 4: Preferences
  const [preferredScholarshipCategories, setPreferredScholarshipCategories] = useState<string[]>(
    profile?.preferredScholarshipCategories || ['STEM & Tech', 'Women Empowerment', 'Merit-Based']
  );
  const [scholarshipTypePreference, setScholarshipTypePreference] = useState<
    'All' | 'Government Only' | 'Private Only'
  >(profile?.scholarshipTypePreference || 'All');

  const [error, setError] = useState('');

  const availableCategories = [
    'Merit-Based',
    'Need-Based',
    'STEM & Tech',
    'Women Empowerment',
    'Minority Welfare',
    'Higher Education',
    'Research & Innovation',
  ];

  const handleAutofill = () => {
    setFullName(DEMO_STUDENT_PROFILE.fullName);
    setState(DEMO_STUDENT_PROFILE.state);
    setCity(DEMO_STUDENT_PROFILE.city);
    setDob(DEMO_STUDENT_PROFILE.dob || '2004-06-15');
    setGender(DEMO_STUDENT_PROFILE.gender);
    setCategory(DEMO_STUDENT_PROFILE.category);
    setIsDifferentlyAbled(DEMO_STUDENT_PROFILE.isDifferentlyAbled);
    setEducationLevel(DEMO_STUDENT_PROFILE.educationLevel);
    setCourseStream(DEMO_STUDENT_PROFILE.courseStream);
    setInstitutionName(DEMO_STUDENT_PROFILE.institutionName);
    setCurrentAcademicYear(DEMO_STUDENT_PROFILE.currentAcademicYear);
    setPercentageOrCgpa(DEMO_STUDENT_PROFILE.percentageOrCgpa);
    setAnnualFamilyIncome(DEMO_STUDENT_PROFILE.annualFamilyIncome);
    setIncomeCategory(DEMO_STUDENT_PROFILE.incomeCategory);
    setPreferredScholarshipCategories(DEMO_STUDENT_PROFILE.preferredScholarshipCategories);
    setScholarshipTypePreference(DEMO_STUDENT_PROFILE.scholarshipTypePreference);
    setError('');
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!fullName.trim()) return setError('Please enter your full name.');
      if (!state) return setError('Please select your state.');
      if (!city.trim()) return setError('Please enter your city.');
    } else if (step === 2) {
      if (!courseStream.trim()) return setError('Please enter your course or stream.');
      if (!institutionName.trim()) return setError('Please enter your institution name.');
      if (percentageOrCgpa <= 0 || percentageOrCgpa > 100) {
        return setError('Please enter a valid percentage between 1 and 100.');
      }
    } else if (step === 3) {
      if (annualFamilyIncome < 0) return setError('Please enter a valid family income.');
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save and finish
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

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      router.push('/dashboard');
    }
  };

  const toggleCategoryPreference = (cat: string) => {
    setPreferredScholarshipCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Logo size="md" href="/" />
        <button
          onClick={handleAutofill}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] text-xs font-bold hover:bg-[#5B4BDB] hover:text-white transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#18B6A4]" />
          <span>Autofill Priya Sharma</span>
        </button>
      </div>

      {/* Main Stepper Card */}
      <div className="max-w-2xl mx-auto w-full my-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl space-y-8">
        {/* Stepper Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#72788A]">
            <span className="text-[#5B4BDB] uppercase tracking-wider">
              Step {step} of 4: {step === 1 && 'Personal Information'}
              {step === 2 && 'Academic Record'}
              {step === 3 && 'Financial Background'}
              {step === 4 && 'Scholarship Preferences'}
            </span>
            <span>{step * 25}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5B4BDB] to-[#18B6A4] transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
            {error}
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#171B2D]">Personal & Demographic Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These criteria are used to determine state domicile and affirmative action eligibility.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D] focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    Home State / Domicile
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  >
                    {INDIAN_STATES.filter((s) => s !== 'All India').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    Social Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SocialCategory)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Community</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education Info */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#171B2D]">Education & Academic Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Scholarships filter strictly by education stages and minimum passing percentiles.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  Current Education Stage
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                >
                  <option value="Undergraduate">Undergraduate Degree (B.Tech, B.Sc, MBBS, etc.)</option>
                  <option value="Higher Secondary (Class 11-12)">Higher Secondary (Class 11-12)</option>
                  <option value="Postgraduate">Postgraduate Degree (M.Tech, M.Sc, MBA, etc.)</option>
                  <option value="Diploma / Vocational">Diploma / Vocational</option>
                  <option value="School (Class 9-10)">School (Class 9-10)</option>
                  <option value="PhD / Research">PhD / Research</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  Course / Specialization
                </label>
                <input
                  type="text"
                  value={courseStream}
                  onChange={(e) => setCourseStream(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Pune Institute of Computer Technology (PICT)"
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    Academic Year
                  </label>
                  <select
                    value={currentAcademicYear}
                    onChange={(e) => setCurrentAcademicYear(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                    Qualifying Marks / Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    value={percentageOrCgpa}
                    onChange={(e) => setPercentageOrCgpa(parseFloat(e.target.value) || 0)}
                    placeholder="84.5"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial Information */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#171B2D]">Household Financial Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Most government and CSR scholarships have income thresholds (e.g. &lt; ₹2.5L or &lt; ₹8L).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  Annual Gross Family Income (in INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
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
                    placeholder="240000"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estimated based on Tahsildar / Revenue Authority income certificate.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-1">
                  Income Category Tier
                </label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-[#171B2D]"
                >
                  <option value="Below ₹1.5 Lakh">Below ₹1.5 Lakh (Highest Need Tier)</option>
                  <option value="₹1.5 Lakh - ₹3 Lakh">₹1.5 Lakh - ₹3 Lakh (Standard Welfare Bracket)</option>
                  <option value="₹3 Lakh - ₹6 Lakh">₹3 Lakh - ₹6 Lakh</option>
                  <option value="₹6 Lakh - ₹8 Lakh">₹6 Lakh - ₹8 Lakh (EWS / OBC Creamy Layer Limit)</option>
                  <option value="Above ₹8 Lakh">Above ₹8 Lakh</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#171B2D]">Scholarship Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize your discovery engine to prioritize relevant opportunities.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-2">
                  Preferred Scholarship Themes (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => {
                    const isSelected = preferredScholarshipCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategoryPreference(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#5B4BDB] text-white border-[#5B4BDB] shadow-xs'
                            : 'bg-[#F8F9FC] text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block mb-2">
                  Provider Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['All', 'Government Only', 'Private Only'].map((pref) => {
                    const isSelected = scholarshipTypePreference === pref;
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setScholarshipTypePreference(pref as 'All' | 'Government Only' | 'Private Only')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                          isSelected
                            ? 'bg-[#18B6A4] text-white border-[#18B6A4] shadow-xs'
                            : 'bg-[#F8F9FC] text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center gap-2"
          >
            <span>{step === 4 ? 'Complete Profile & Open Dashboard' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        GRANTLY • Unified Scholarship Discovery & Management Platform
      </div>
    </div>
  );
}
