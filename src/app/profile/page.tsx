'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { INDIAN_STATES } from '@/data/scholarships';
import { EducationLevel, Gender, IncomeCategory, SocialCategory } from '@/types';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  User,
  GraduationCap,
  IndianRupee,
  Sliders,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, saveProfile, stats } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'financial' | 'preferences'>('personal');
  const [successMessage, setSuccessMessage] = useState('');

  // Personal fields
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [city, setCity] = useState(profile?.city || 'Pune');
  const [dob, setDob] = useState(profile?.dob || '2004-06-15');
  const [gender, setGender] = useState<Gender>(profile?.gender || 'female');
  const [category, setCategory] = useState<SocialCategory>(profile?.category || 'OBC');
  const [isDifferentlyAbled] = useState(profile?.isDifferentlyAbled || false);

  // Education fields
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    profile?.educationLevel || 'Undergraduate'
  );
  const [courseStream, setCourseStream] = useState(profile?.courseStream || '');
  const [institutionName, setInstitutionName] = useState(profile?.institutionName || '');
  const [currentAcademicYear, setCurrentAcademicYear] = useState(profile?.currentAcademicYear || '2nd Year');
  const [percentageOrCgpa, setPercentageOrCgpa] = useState<number>(profile?.percentageOrCgpa || 0);

  // Financial fields
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(profile?.annualFamilyIncome || 0);
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>(
    profile?.incomeCategory || '₹1.5 Lakh - ₹3 Lakh'
  );

  // Preferences fields
  const [preferredScholarshipCategories, setPreferredScholarshipCategories] = useState<string[]>(
    profile?.preferredScholarshipCategories || []
  );
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

    setSuccessMessage('Profile saved successfully! AI Match scores have been recalculated.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const toggleCategory = (cat: string) => {
    setPreferredScholarshipCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <DashboardLayout
      title="Student Profile & Credentials"
      subtitle="Keep your academic and financial records accurate to ensure real-time eligibility evaluation."
    >
      <div className="space-y-6 max-w-5xl">
        {/* Profile Strength Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5B4BDB] to-[#18B6A4] text-white flex items-center justify-center font-black text-2xl uppercase shadow-md shadow-[#5B4BDB]/20 shrink-0">
              {profile?.fullName?.charAt(0) || 'P'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#171B2D]">{profile?.fullName}</h2>
              <p className="text-xs text-slate-500">
                {profile?.courseStream} • {profile?.institutionName}
              </p>
              <div className="text-[11px] text-[#5B4BDB] font-semibold">
                Student Profile Active • Ready for DBT Central/State Schemes
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 shrink-0">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#72788A]">Profile Strength</span>
              <span className="text-[#5B4BDB]">{stats.profileCompletion}%</span>
            </div>
            <ProgressBar value={stats.profileCompletion} color="primary" showPercentage={false} />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'personal', label: 'Personal Details', icon: User },
            { id: 'education', label: 'Education & Academics', icon: GraduationCap },
            { id: 'financial', label: 'Financial Information', icon: IndianRupee },
            { id: 'preferences', label: 'Scholarship Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'personal' | 'education' | 'financial' | 'preferences')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#5B4BDB] text-white shadow-md shadow-[#5B4BDB]/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Tab 1: Personal */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                Personal Identification & Domicile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Social Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SocialCategory)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Community</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Home State / Domicile</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  >
                    {INDIAN_STATES.filter((s) => s !== 'All India').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Education */}
          {activeTab === 'education' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                Academic Qualifications & Standing
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Education Stage</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="Undergraduate">Undergraduate Degree</option>
                    <option value="Higher Secondary (Class 11-12)">Higher Secondary (Class 11-12)</option>
                    <option value="Postgraduate">Postgraduate Degree</option>
                    <option value="Diploma / Vocational">Diploma / Vocational</option>
                    <option value="School (Class 9-10)">School (Class 9-10)</option>
                    <option value="PhD / Research">PhD / Research</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Degree Course & Specialization</label>
                  <input
                    type="text"
                    value={courseStream}
                    onChange={(e) => setCourseStream(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Institution / College Name</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. Pune Institute of Computer Technology (PICT)"
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Current Academic Year</label>
                    <select
                      value={currentAcademicYear}
                      onChange={(e) => setCurrentAcademicYear(e.target.value)}
                      className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Qualifying Score / Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      value={percentageOrCgpa}
                      onChange={(e) => setPercentageOrCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Financial */}
          {activeTab === 'financial' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                Household Financial Background
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Annual Gross Family Income (in INR ₹)
                  </label>
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
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Income Bracket Tier</label>
                  <select
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                    className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D]"
                  >
                    <option value="Below ₹1.5 Lakh">Below ₹1.5 Lakh</option>
                    <option value="₹1.5 Lakh - ₹3 Lakh">₹1.5 Lakh - ₹3 Lakh</option>
                    <option value="₹3 Lakh - ₹6 Lakh">₹3 Lakh - ₹6 Lakh</option>
                    <option value="₹6 Lakh - ₹8 Lakh">₹6 Lakh - ₹8 Lakh</option>
                    <option value="Above ₹8 Lakh">Above ₹8 Lakh</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider mb-2">
                Scholarship Category Focus
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preferred Opportunities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((cat) => {
                      const isSelected = preferredScholarshipCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
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

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
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

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#5B4BDB]/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
