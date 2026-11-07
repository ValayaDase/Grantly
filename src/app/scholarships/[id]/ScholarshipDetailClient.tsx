
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { calculateMatchScore } from '@/lib/matchScore';
import { getDeadlineInfo } from '@/lib/deadline';
import { calculateApplicationReadiness } from '@/lib/readiness';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  Bookmark,
  FileCheck2,
  FolderLock,
  Layers,
  ShieldCheck,
  Info,
  ArrowUpRight,
  GraduationCap,
  Wallet,
  Clock3,
  ClipboardCheck,
  ChevronRight,
  LockKeyhole,
  Zap,
  Target,
  FileText,
  CalendarPlus,
  Share2,
  Download,
  Check,
} from 'lucide-react';

interface ScholarshipDetailClientProps {
  scholarshipId: string;
}

export function ScholarshipDetailClient({
  scholarshipId,
}: ScholarshipDetailClientProps) {
  const router = useRouter();

  const {
    allScholarships,
    profile,
    documents,
    isScholarshipSaved,
    toggleSaveScholarship,
    addOrUpdateApplication,
    isCompared,
    toggleComparison,
  } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [appNotes, setAppNotes] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  const scholarship = allScholarships.find(
    (s) => s.id === scholarshipId
  );

  if (!scholarship) {
    return (
      <DashboardLayout title="Scholarship Not Found">
        <div className="min-h-[65vh] flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-10 text-center shadow-xl shadow-slate-200/40">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
              <FileText className="w-9 h-9 text-[#5B4BDB]" />
            </div>

            <h2 className="text-xl font-black text-[#171B2D]">
              Scholarship Not Found
            </h2>

            <p className="text-sm text-slate-500 mt-2 mb-7 leading-relaxed">
              The scholarship opportunity you requested does not exist.
            </p>

            <Link
              href="/scholarships"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5B4BDB] text-white text-sm font-bold hover:bg-[#4838C2] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Scholarships
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isSaved = isScholarshipSaved(scholarship.id);
  const isComparedItem = isCompared(scholarship.id);

  const eligibility = evaluateScholarshipEligibility(
    scholarship,
    profile
  );

  const match = calculateMatchScore(scholarship, profile);

  const deadline = getDeadlineInfo(scholarship.deadline);

  const readiness = calculateApplicationReadiness(
    scholarship,
    profile,
    documents
  );

  const handleTrackApplication = (
    status: 'Planning to Apply' | 'Applied'
  ) => {
    addOrUpdateApplication({
      scholarshipId: scholarship.id,
      status,
      notes:
        appNotes ||
        (status === 'Applied'
          ? 'Application submitted on official portal.'
          : 'Saved to application pipeline.'),
      applicationRefNumber: refNumber || undefined,
    });

    setApplyModalOpen(false);
    router.push('/applications');
  };

  const handleAddToCalendar = () => {
    if (!scholarship) return;
    const title = scholarship.title;
    const description = `Deadline for ${scholarship.title} offered by ${scholarship.provider}. Award value: ${scholarship.amountFormatted}`;
    const cleanDate = scholarship.deadline.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GRANTLY//Scholarship Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title} Deadline`,
      `DESCRIPTION:${description}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${scholarship.id}-deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!scholarship) return;
    const shareData = {
      title: scholarship.title,
      text: `Check out ${scholarship.title} on GRANTLY! Value: ${scholarship.amountFormatted}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleExportBrief = () => {
    if (!scholarship) return;
    const brief = {
      title: scholarship.title,
      provider: scholarship.provider,
      providerType: scholarship.providerType,
      category: scholarship.category,
      amount: scholarship.amountFormatted,
      deadline: scholarship.deadline,
      eligibilityStatus: eligibility.status,
      matchScore: match.totalScore,
      rulesChecked: eligibility.rules,
      requiredDocuments: scholarship.requiredDocuments,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${scholarship.id}-dossier.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

const eligibilityConfig = {
  ELIGIBLE: {
    label: 'Eligible',
    color: 'text-emerald-600',
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  POTENTIALLY_ELIGIBLE: {
    label: 'Potentially Eligible',
    color: 'text-amber-600',
    background: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertCircle,
  },
  NOT_ELIGIBLE: {
    label: 'Not Eligible',
    color: 'text-rose-600',
    background: 'bg-rose-50',
    border: 'border-rose-200',
    icon: XCircle,
  },
  PROFILE_INCOMPLETE: {
    label: 'Complete Your Profile',
    color: 'text-blue-600',
    background: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
  },
} satisfies Record<
  import('@/types').EligibilityStatus,
  {
    label: string;
    color: string;
    background: string;
    border: string;
    icon: typeof CheckCircle2;
  }
>;

  const eligibilityStyle = eligibilityConfig[eligibility.status];
  const EligibilityIcon = eligibilityStyle.icon;

  return (
    <DashboardLayout
      title={scholarship.title}
      subtitle={`Offered by ${scholarship.provider} • ${scholarship.providerType}`}
    >
      <div className="space-y-7 pb-10">

        {/* Back navigation and actions */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#5B4BDB] transition-colors group"
          >
            <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-violet-50 group-hover:border-violet-200 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to all scholarships
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCalendar}
              title="Add deadline to Calendar (.ics)"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-600 transition-all shadow-xs"
            >
              <CalendarPlus className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Calendar</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              title="Share scholarship link"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-600 transition-all shadow-xs"
            >
              {shareSuccess ? (
                <Check className="w-4 h-4 text-teal-600" />
              ) : (
                <Share2 className="w-4 h-4 text-teal-500" />
              )}
              <span>{shareSuccess ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportBrief}
              title="Export scholarship checklist (JSON)"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:text-[#5B4BDB] transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-[#5B4BDB]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => toggleComparison(scholarship.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isComparedItem
                  ? 'bg-[#171B2D] text-white border-[#171B2D]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:text-[#5B4BDB]'
              }`}
            >
              <Layers className="w-4 h-4" />
              {isComparedItem ? 'Compared' : 'Compare'}
            </button>

            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-rose-200 hover:text-rose-600'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`}
              />
              {isSaved ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold shadow-lg shadow-violet-500/20 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              Apply / Track
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Premium scholarship hero */}

        <section className="relative overflow-hidden rounded-[30px] bg-[#171B2D] text-white shadow-2xl shadow-indigo-950/10">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-36 -right-20 w-[400px] h-[400px] rounded-full bg-[#5B4BDB]/35 blur-[90px]" />
            <div className="absolute -bottom-40 left-1/4 w-[350px] h-[350px] rounded-full bg-[#18B6A4]/20 blur-[90px]" />
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          <div className="relative z-10 p-6 sm:p-9 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-violet-200">
                <Sparkles className="w-3.5 h-3.5" />
                Scholarship Opportunity
              </span>

              <span className="px-3 py-1.5 rounded-full bg-teal-400/10 border border-teal-300/20 text-[11px] font-bold text-teal-300">
                {scholarship.providerType}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300">
                {scholarship.category}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-9 items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300 mb-3">
                  Offered by {scholarship.provider}
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight">
                  {scholarship.title}
                </h1>

                <p className="text-sm text-slate-300 mt-5 leading-relaxed">
                  {scholarship.coverage}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10">
                    <Building className="w-4 h-4 text-violet-300" />
                    <span className="text-xs font-semibold text-slate-200">
                      {scholarship.provider}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-slate-200">
                      {deadline.formattedDeadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scholarship value and match */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="rounded-2xl bg-white/[0.08] border border-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-300 text-[10px] uppercase tracking-widest font-bold">
                    <Wallet className="w-4 h-4 text-teal-300" />
                    Scholarship Value
                  </div>

                  <div className="text-3xl font-black mt-3 text-white">
                    {scholarship.amountFormatted}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {scholarship.frequency} payment
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#5B4BDB]/50 to-[#18B6A4]/20 border border-white/15 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-200 text-[10px] uppercase tracking-widest font-bold">
                    <Target className="w-4 h-4 text-teal-300" />
                    Your Match Score
                  </div>

                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-black text-white">
                      {profile?.onboardingCompleted ? `${match.totalScore}%` : '—'}
                    </span>
                    <span className="text-xs font-bold text-teal-300 mb-1.5">
                      {profile?.onboardingCompleted ? 'Profile match' : 'Complete profile to calculate'}
                    </span>
                  </div>

                  {profile?.onboardingCompleted && <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-300 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${match.totalScore}%` }}
                    />
                  </div>}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-amber-300" />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Application Deadline
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {deadline.formattedDeadline} · {deadline.label}
                  </p>
                </div>
              </div>

              <Badge
                variant={
                  deadline.badgeType === 'critical'
                    ? 'danger'
                    : deadline.badgeType === 'warning'
                    ? 'warning'
                    : 'neutral'
                }
                size="md"
                icon={<Calendar className="w-3.5 h-3.5" />}
              >
                {deadline.label}
              </Badge>
            </div>
          </div>
        </section>

        {/* Coverage information */}

        <section className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
          <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-violet-200/30 blur-2xl" />

          <div className="relative flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#5B4BDB]" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#5B4BDB]">
                Coverage & Financial Scope
              </h3>

              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {scholarship.coverage}
              </p>
            </div>
          </div>
        </section>

        {/* Main two-column layout */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">

          {/* Left column */}

          <div className="lg:col-span-2 space-y-6">

            {/* About scholarship */}

            <section className="bg-white rounded-[26px] border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#5B4BDB]" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Overview
                  </p>
                  <h2 className="text-lg font-black text-[#171B2D]">
                    About the Scholarship
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-7">
                {scholarship.fullDescription}
              </p>
            </section>

            {/* Academic and financial criteria */}

            <section className="bg-white rounded-[26px] border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-teal-600" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Requirements
                  </p>
                  <h2 className="text-lg font-black text-[#171B2D]">
                    Academic & Financial Criteria
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Academic Requirements
                  </h3>

                  <div className="space-y-2.5">
                    {scholarship.academicRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Income Requirement
                  </h3>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-100">
                    <Wallet className="w-5 h-5 text-amber-600 shrink-0" />

                    <p className="text-sm font-semibold text-slate-700">
                      {scholarship.incomeRequirements}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Target Degree Courses
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {scholarship.courses.map((course) => (
                      <span
                        key={course}
                        className="px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-xs font-bold text-violet-700 hover:bg-violet-100 transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Application procedure and timeline */}

            <section className="bg-white rounded-[26px] border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    How to apply
                  </p>
                  <h2 className="text-lg font-black text-[#171B2D]">
                    Application Procedure
                  </h2>
                </div>
              </div>

              <div className="relative space-y-5">
                <div className="absolute left-[17px] top-5 bottom-5 w-px bg-violet-100" />

                {scholarship.applicationProcedure.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="relative z-10 w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 text-[#5B4BDB] flex items-center justify-center text-xs font-black shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important dates */}

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#5B4BDB]" />

                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Key Milestones & Schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scholarship.importantDates.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                        item.isPassed
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-violet-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <Clock3 className="w-4 h-4 text-violet-500 shrink-0" />
                        )}

                        <span
                          className={`text-xs font-semibold ${
                            item.isPassed
                              ? 'text-slate-400'
                              : 'text-slate-700'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-black shrink-0 ${
                          item.isPassed
                            ? 'text-slate-400'
                            : 'text-[#5B4BDB]'
                        }`}
                      >
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right sidebar */}

          <aside className="space-y-6">

            {/* Eligibility report */}

            <section className="bg-white rounded-[26px] border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#5B4BDB]" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-[#171B2D]">
                    Smart Eligibility
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Profile-based evaluation
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3.5 rounded-2xl border ${eligibilityStyle.background} ${eligibilityStyle.border}`}
              >
                <EligibilityIcon
                  className={`w-5 h-5 ${eligibilityStyle.color}`}
                />

                <div>
                  <p className={`text-sm font-black ${eligibilityStyle.color}`}>
                    {eligibilityStyle.label}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Based on your profile
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-4">
                {eligibility.explanation}
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Rule Evaluation
                  </h3>

                  <span className="text-[10px] font-bold text-slate-400">
                    {eligibility.rules.length} checks
                  </span>
                </div>

                <div className="space-y-2">
                  {eligibility.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#171B2D]">
                          {rule.name}
                        </span>

                        {rule.status === 'satisfied' ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Passed
                          </span>
                        ) : rule.status === 'missing_info' ? (
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 shrink-0">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Missing Info
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        )}
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-slate-500">
                          <span className="font-bold text-slate-600">
                            Required:
                          </span>{' '}
                          {rule.requiredValue}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          <span className="font-bold text-slate-600">
                            Your profile:
                          </span>{' '}
                          {rule.studentValue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mt-5 pt-4 border-t border-slate-100">
                {eligibility.disclaimer}
              </p>
            </section>

            {/* Application readiness */}

            <section className="bg-white rounded-[26px] border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <FolderLock className="w-5 h-5 text-teal-600" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-[#171B2D]">
                    Application Readiness
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Document preparation
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">
                  Your progress
                </span>

                <span className="text-2xl font-black text-teal-600">
                  {readiness.score}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-[#18B6A4] transition-all duration-700"
                  style={{ width: `${readiness.score}%` }}
                />
              </div>

              <div className="mt-6 space-y-2.5">
                <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Required Documents
                </h3>

                {readiness.checklistItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}

                    <span
                      className={`text-xs leading-relaxed ${
                        item.completed
                          ? 'text-slate-700 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/documents"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-50 text-xs font-bold text-teal-700 transition-all"
              >
                <FolderLock className="w-4 h-4" />
                Open Document Vault
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </section>

            {/* Official application portal */}

            <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#171B2D] via-[#24234E] to-[#393078] p-6 text-white shadow-xl shadow-indigo-950/10">
              <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-400/10 blur-3xl" />

              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                  <LockKeyhole className="w-5 h-5 text-teal-300" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
                  Official Submission
                </p>

                <h3 className="text-lg font-black mt-2">
                  Ready for the next step?
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mt-3">
                  GRANTLY helps you evaluate your credentials and prepare your application. Submit through the official portal of the governing authority.
                </p>

                {scholarship.officialLink ? (
                  <a
                    href={scholarship.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 w-full py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#6D5DEB] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                  >
                    Launch Official Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="mt-6 p-3 rounded-xl bg-white/10 border border-white/10 text-[11px] text-slate-300 leading-relaxed">
                    Demo record: Official destination simulated for competition review.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom application CTA */}

        <section className="rounded-[26px] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-teal-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#5B4BDB]" />
            </div>

            <div>
              <h3 className="text-base font-black text-[#171B2D]">
                Keep your application on track
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Add this scholarship to your application tracker.
              </p>
            </div>
          </div>

          <button
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#171B2D] hover:bg-[#292D45] text-white text-xs font-bold transition-all shadow-lg"
          >
            <FileCheck2 className="w-4 h-4" />
            Add to Tracker
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </section>
      </div>

      {/* Application tracker modal */}

      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Add to Application Tracker"
        subtitle={`Track your progress for ${scholarship.title}`}
      >
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4 text-[#5B4BDB]" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Record this opportunity in your student dashboard to maintain your application status, personal notes, and reference number.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#171B2D] uppercase tracking-wider block">
              Application Reference Number
              <span className="text-slate-400 font-medium normal-case ml-1">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. NSP/2026/98214"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#5B4BDB] focus:ring-4 focus:ring-violet-100 rounded-xl p-3.5 text-sm text-[#171B2D] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#171B2D] uppercase tracking-wider block">
              Personal Notes / Checklist
            </label>

            <textarea
              rows={4}
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              placeholder="e.g. Need to get Bonafide certificate stamped by college office..."
              className="w-full resize-none bg-slate-50 border border-slate-200 focus:border-[#5B4BDB] focus:ring-4 focus:ring-violet-100 rounded-xl p-3.5 text-sm text-[#171B2D] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleTrackApplication('Planning to Apply')}
              className="py-3 px-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Mark as Planning
            </button>

            <button
              type="button"
              onClick={() => handleTrackApplication('Applied')}
              className="py-3 px-4 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Applied
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
