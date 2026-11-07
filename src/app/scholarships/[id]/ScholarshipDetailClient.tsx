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
} from 'lucide-react';

interface ScholarshipDetailClientProps {
  scholarshipId: string;
}

export function ScholarshipDetailClient({ scholarshipId }: ScholarshipDetailClientProps) {
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

  const scholarship = allScholarships.find((s) => s.id === scholarshipId);
  if (!scholarship) {
    return (
      <DashboardLayout title="Scholarship Not Found">
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
          <h2 className="text-lg font-bold text-[#171B2D]">Scholarship Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">The opportunity you requested does not exist.</p>
          <Link href="/scholarships" className="px-4 py-2 rounded-xl bg-[#5B4BDB] text-white text-xs font-bold">
            Back to Scholarships
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isSaved = isScholarshipSaved(scholarship.id);
  const isComparedItem = isCompared(scholarship.id);
  const eligibility = evaluateScholarshipEligibility(scholarship, profile);
  const match = calculateMatchScore(scholarship, profile);
  const deadline = getDeadlineInfo(scholarship.deadline);
  const readiness = calculateApplicationReadiness(scholarship, profile, documents);

  const handleTrackApplication = (status: 'Planning to Apply' | 'Applied') => {
    addOrUpdateApplication({
      scholarshipId: scholarship.id,
      status,
      notes: appNotes || (status === 'Applied' ? 'Application submitted on official portal.' : 'Saved to application pipeline.'),
      applicationRefNumber: refNumber || undefined,
    });
    setApplyModalOpen(false);
    router.push('/applications');
  };

  return (
    <DashboardLayout
      title={scholarship.title}
      subtitle={`Offered by ${scholarship.provider} • Verified ${scholarship.providerType}`}
    >
      <div className="space-y-8">
        {/* Top Back Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#5B4BDB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Scholarships
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleComparison(scholarship.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isComparedItem
                  ? 'bg-[#171B2D] text-white border-[#171B2D]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              {isComparedItem ? 'Compared' : 'Add to Compare'}
            </button>

            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isSaved ? 'Bookmarked' : 'Save'}
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              Apply / Track
            </button>
          </div>
        </div>

        {/* Hero Banner: Amount, Provider, Deadline & Match Score */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5B4BDB] bg-[#EEEAFE] px-3 py-1 rounded-full">
                  {scholarship.providerType}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {scholarship.category}
                </span>
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
                  Deadline: {deadline.formattedDeadline} ({deadline.label})
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#171B2D] tracking-tight">
                {scholarship.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{scholarship.provider}</span>
              </div>
            </div>

            {/* Value & AI Match Gauges */}
            <div className="flex items-center gap-4 bg-[#F8F9FC] border border-slate-200/60 p-4 rounded-2xl shrink-0">
              <div className="pr-4 border-r border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Scholarship Value
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#5B4BDB]">
                  {scholarship.amountFormatted}
                </div>
                <span className="text-[11px] text-slate-500">{scholarship.frequency} payment</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  AI Match Score
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#18B6A4] flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-[#18B6A4]" />
                  {match.totalScore}%
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">High Compatibility</span>
              </div>
            </div>
          </div>

          {/* Quick Coverage Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
            <Info className="w-5 h-5 text-[#5B4BDB] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#5B4BDB]">Coverage & Financial Scope: </strong>
              {scholarship.coverage}
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Details Left, Eligibility & Readiness Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#171B2D]">About the Scholarship</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {scholarship.fullDescription}
              </p>
            </div>

            {/* 2. Academic & Income Requirements */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-[#171B2D]">Academic & Financial Criteria</h3>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Academic Requirements
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {scholarship.academicRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Income Requirement
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {scholarship.incomeRequirements}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Degree Courses
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {scholarship.courses.map((course) => (
                    <span
                      key={course}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Application Procedure & Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-[#171B2D]">Application Procedure</h3>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
                {scholarship.applicationProcedure.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#EEEAFE] text-[#5B4BDB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>

              {/* Timeline */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Key Milestones & Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scholarship.importantDates.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        item.isPassed
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-[#F8F9FC] border-slate-200 text-[#171B2D] font-medium'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-bold">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Rule-Based Eligibility Report & Document Readiness */}
          <div className="space-y-6">
            {/* Eligibility Report Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5B4BDB]" />
                  <h3 className="text-sm font-bold text-[#171B2D]">Smart Eligibility Report</h3>
                </div>
                {eligibility.status === 'ELIGIBLE' && (
                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                    Eligible
                  </Badge>
                )}
                {eligibility.status === 'POTENTIALLY_ELIGIBLE' && (
                  <Badge variant="warning" size="sm" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                    Potential
                  </Badge>
                )}
                {eligibility.status === 'NOT_ELIGIBLE' && (
                  <Badge variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>
                    Not Eligible
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {eligibility.explanation}
              </p>

              {/* Individual Rules Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rule Evaluation Breakdown
                </span>
                {eligibility.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171B2D]">{rule.name}</span>
                      {rule.status === 'satisfied' ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Passed
                        </span>
                      ) : rule.status === 'missing_info' ? (
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Missing Info
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Required: {rule.requiredValue}
                    </div>
                    <div className="text-[11px] font-medium text-slate-700">
                      Your profile: {rule.studentValue}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 leading-normal pt-2 border-t border-slate-100">
                {eligibility.disclaimer}
              </p>
            </div>

            {/* Application Readiness & Document Vault Matching */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-5 h-5 text-teal-600" />
                  <h3 className="text-sm font-bold text-[#171B2D]">Application Readiness</h3>
                </div>
                <span className="text-xs font-black text-teal-600">{readiness.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-[#18B6A4] rounded-full transition-all duration-300"
                  style={{ width: `${readiness.score}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Required Documents Checklist
                </span>
                {readiness.checklistItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-[#F8F9FC]"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span className={item.completed ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/documents"
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#5B4BDB] transition-colors"
              >
                Open Document Vault
              </Link>
            </div>

            {/* Official Link Card */}
            <div className="bg-gradient-to-br from-[#171B2D] to-[#252250] text-white rounded-3xl p-6 shadow-xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Official Submission Destination
              </span>
              <h4 className="text-sm font-bold">Apply via Official Nodal Desk</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                GRANTLY guides and evaluates your credentials. External submissions are processed securely through the governing authority&apos;s verified portal.
              </p>

              {scholarship.officialLink ? (
                <a
                  href={scholarship.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Launch Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-slate-800 text-[11px] text-slate-400">
                  Demo record: Official destination simulated for competition review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply / Track Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Add to Application Tracker"
        subtitle={`Track your progress for ${scholarship.title}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Record this opportunity in your student dashboard to maintain deadline alerts, document readiness, and submission status.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Application Reference Number (Optional)
            </label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. NSP/2026/98214"
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Personal Notes / Checklist
            </label>
            <textarea
              rows={3}
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              placeholder="e.g. Need to get Bonafide certificate stamped by college office tomorrow..."
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => handleTrackApplication('Planning to Apply')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              Mark as &quot;Planning&quot;
            </button>
            <button
              onClick={() => handleTrackApplication('Applied')}
              className="py-2.5 px-4 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Mark as &quot;Applied&quot;
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
