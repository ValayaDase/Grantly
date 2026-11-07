'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { Badge } from '@/components/common/Badge';

import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  User,
  Check,
  Search,
  ShieldCheck,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  Info,
} from 'lucide-react';

type FilterTab =
  | 'ALL'
  | 'ELIGIBLE'
  | 'POTENTIALLY_ELIGIBLE'
  | 'NOT_ELIGIBLE';

export default function EligibilityCheckerPage() {
  const { allScholarships, profile } = useApp();

  const [selectedScholarshipId, setSelectedScholarshipId] =
    useState<string>(() => allScholarships[0]?.id || '');

  const [filterTab, setFilterTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Effective selected scholarship ID guaranteed to match an existing item
  const activeScholarshipId =
    selectedScholarshipId && allScholarships.some((s) => s.id === selectedScholarshipId)
      ? selectedScholarshipId
      : (allScholarships[0]?.id || '');

  // Evaluate eligibility for all scholarships.
  const allEvaluations = useMemo(() => {
    return allScholarships.map((scholarship) => ({
      scholarship,
      report: evaluateScholarshipEligibility(scholarship, profile),
    }));
  }, [allScholarships, profile]);

  // Find the currently selected scholarship.
  const selectedEvaluation = allEvaluations.find(
    (evaluation) =>
      evaluation.scholarship.id === activeScholarshipId
  );

  const selectedScholarship = selectedEvaluation?.scholarship;
  const activeReport = selectedEvaluation?.report;

  // Summary counts.
  const eligibleCount = allEvaluations.filter(
    (evaluation) => evaluation.report.status === 'ELIGIBLE'
  ).length;

  const potentialCount = allEvaluations.filter(
    (evaluation) =>
      evaluation.report.status === 'POTENTIALLY_ELIGIBLE'
  ).length;

  const notEligibleCount = allEvaluations.filter(
    (evaluation) => evaluation.report.status === 'NOT_ELIGIBLE'
  ).length;

  // Search and filter scholarships.
  const filteredList = allEvaluations.filter(
    ({ scholarship, report }) => {
      const matchesFilter =
        filterTab === 'ALL' || report.status === filterTab;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        scholarship.title.toLowerCase().includes(query) ||
        scholarship.provider.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    }
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'Eligible';
      case 'POTENTIALLY_ELIGIBLE':
        return 'Potentially Eligible';
      case 'NOT_ELIGIBLE':
        return 'Not Eligible';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'POTENTIALLY_ELIGIBLE':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'NOT_ELIGIBLE':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Empty state when there are no scholarships.
  if (allScholarships.length === 0) {
    return (
      <DashboardLayout
        title="Smart Eligibility Checker"
        subtitle="Evaluate your profile against scholarship eligibility criteria."
      >
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-[#171B2D]">
            No scholarships available
          </h3>

          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Add scholarship opportunities to your platform to start
            checking your eligibility.
          </p>

          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-[#5B4BDB] text-white text-sm font-bold hover:bg-[#4838C2] transition-colors"
          >
            Explore Scholarships
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Smart Eligibility Checker"
      subtitle="Rule-based verification evaluating your student profile against scholarship eligibility criteria."
    >
      <div className="space-y-8">

        {/* Profile Snapshot */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#171B2D]">
                  Evaluating for: {profile?.fullName || 'Demo Student'}
                </h3>

                <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                  Profile Active
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {profile?.educationLevel || 'Education not specified'}
                {' • '}
                Score: {profile?.percentageOrCgpa ?? 'N/A'}%
                {' • '}
                Family Income: ₹
                {profile?.annualFamilyIncome?.toLocaleString('en-IN') || 'N/A'}
                /yr
                {' • '}
                Domicile: {profile?.state || 'Not specified'}
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#5B4BDB] transition-colors shrink-0 text-center"
          >
            Edit Profile Credentials
          </Link>
        </div>

        {/* Page Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#171B2D]">
              Your Eligibility Overview
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Review how your profile satisfies each scholarship&apos;s
              eligibility requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#5B4BDB]" />
            Rule-based evaluation
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Eligible */}
          <button
            onClick={() => setFilterTab('ELIGIBLE')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              filterTab === 'ELIGIBLE'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Fully Eligible
              </span>

              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="text-3xl font-black text-emerald-700">
              {eligibleCount}
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              All mandatory conditions satisfied
            </p>
          </button>

          {/* Potentially Eligible */}
          <button
            onClick={() => setFilterTab('POTENTIALLY_ELIGIBLE')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              filterTab === 'POTENTIALLY_ELIGIBLE'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 hover:bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Potentially Eligible
              </span>

              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <div className="text-3xl font-black text-amber-700">
              {potentialCount}
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              Additional information may be required
            </p>
          </button>

          {/* Not Eligible */}
          <button
            onClick={() => setFilterTab('NOT_ELIGIBLE')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              filterTab === 'NOT_ELIGIBLE'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200/80 hover:bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Not Eligible
              </span>

              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>

            <div className="text-3xl font-black text-rose-700">
              {notEligibleCount}
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              One or more eligibility criteria not satisfied
            </p>
          </button>
        </div>

        {/* Evaluation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Scholarship Selector */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#171B2D]">
                  Scholarship Opportunities
                </h4>

                <p className="text-[11px] text-slate-500 mt-1">
                  {filteredList.length} opportunities found
                </p>
              </div>

              <ClipboardCheck className="w-5 h-5 text-[#5B4BDB]" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarships..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(
                [
                  'ALL',
                  'ELIGIBLE',
                  'POTENTIALLY_ELIGIBLE',
                  'NOT_ELIGIBLE',
                ] as FilterTab[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    filterTab === tab
                      ? 'bg-[#5B4BDB] text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'ALL'
                    ? 'All'
                    : tab === 'ELIGIBLE'
                    ? 'Eligible'
                    : tab === 'POTENTIALLY_ELIGIBLE'
                    ? 'Potential'
                    : 'Not Eligible'}
                </button>
              ))}
            </div>

            {/* Scholarship List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">

              {filteredList.length === 0 ? (
                <div className="py-10 text-center">
                  <Search className="w-7 h-7 text-slate-300 mx-auto" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">
                    No scholarships found
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Try changing your search or filter.
                  </p>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterTab('ALL');
                    }}
                    className="text-xs font-bold text-[#5B4BDB] mt-3 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredList.map(({ scholarship, report }) => {
                  const isSelected =
                    scholarship.id === activeScholarshipId;

                  return (
                    <button
                      key={scholarship.id}
                      onClick={() =>
                        setSelectedScholarshipId(scholarship.id)
                      }
                      className={`w-full text-left p-4 rounded-2xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-[#EEEAFE] border-[#5B4BDB] shadow-sm'
                          : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-[#171B2D] leading-relaxed">
                          {scholarship.title}
                        </span>

                        {report.status === 'ELIGIBLE' && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}

                        {report.status === 'POTENTIALLY_ELIGIBLE' && (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}

                        {report.status === 'NOT_ELIGIBLE' && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mb-3">
                        {scholarship.provider}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#5B4BDB]">
                          {scholarship.amountFormatted}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed Eligibility Report */}
          <div className="lg:col-span-2">

            {selectedScholarship && activeReport ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">

                {/* Report Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#5B4BDB] bg-[#EEEAFE] px-3 py-1 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Detailed Verification Report
                    </span>

                    <h3 className="text-lg sm:text-xl font-black text-[#171B2D]">
                      {selectedScholarship.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {selectedScholarship.provider}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {activeReport.status === 'ELIGIBLE' && (
                      <Badge
                        variant="success"
                        size="md"
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Eligible to Apply
                      </Badge>
                    )}

                    {activeReport.status === 'POTENTIALLY_ELIGIBLE' && (
                      <Badge
                        variant="warning"
                        size="md"
                        icon={<AlertCircle className="w-4 h-4" />}
                      >
                        Potentially Eligible
                      </Badge>
                    )}

                    {activeReport.status === 'NOT_ELIGIBLE' && (
                      <Badge
                        variant="danger"
                        size="md"
                        icon={<XCircle className="w-4 h-4" />}
                      >
                        Ineligible
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Eligibility Summary */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    activeReport.status === 'ELIGIBLE'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : activeReport.status === 'POTENTIALLY_ELIGIBLE'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {activeReport.status === 'ELIGIBLE' && (
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}

                    {activeReport.status === 'POTENTIALLY_ELIGIBLE' && (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}

                    {activeReport.status === 'NOT_ELIGIBLE' && (
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}

                    <div>
                      <strong>Eligibility Summary</strong>

                      <p className="mt-1">
                        {activeReport.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Condition Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#171B2D]">
                        Eligibility Condition Matrix
                      </h4>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Your declared information compared with scheme requirements.
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {activeReport.rules.length} Conditions
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">

                    {activeReport.rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Condition Details */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#171B2D] text-sm">
                              {rule.name}
                            </span>

                            {rule.isMandatory && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                                Mandatory
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {rule.description}
                          </p>

                          <div className="text-xs text-slate-700 pt-1">
                            <span className="font-semibold text-slate-500">
                              Requirement:{' '}
                            </span>

                            {rule.requiredValue}
                          </div>
                        </div>

                        {/* Student Value and Status */}
                        <div className="sm:text-right shrink-0 space-y-2">
                          <div className="text-xs font-semibold text-slate-700">
                            <span className="text-slate-400 font-medium">
                              Declared:{' '}
                            </span>

                            {rule.studentValue}
                          </div>

                          <div>
                            {rule.status === 'satisfied' && (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                Condition Met
                              </span>
                            )}

                            {rule.status === 'missing_info' && (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Information Needed
                              </span>
                            )}

                            {rule.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full text-[11px]">
                                <XCircle className="w-3.5 h-3.5" />
                                Criterion Not Met
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeReport.rules.length === 0 && (
                      <div className="p-8 text-center">
                        <Info className="w-7 h-7 text-slate-300 mx-auto" />

                        <p className="text-sm font-semibold text-slate-600 mt-2">
                          No eligibility conditions available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Next Steps */}
                {activeReport.actionItems.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
                        <ClipboardCheck className="w-4 h-4" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#171B2D]">
                          Recommended Next Steps
                        </h4>

                        <p className="text-[11px] text-slate-500">
                          Actions that may help you complete your eligibility profile.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {activeReport.actionItems.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-slate-600"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-[#5B4BDB] shrink-0 mt-0.5" />

                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Link
                    href={`/scholarships/${selectedScholarship.id}`}
                    className="text-xs font-bold text-[#5B4BDB] hover:underline inline-flex items-center gap-1"
                  >
                    View Full Scheme Specification
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {activeReport.status === 'ELIGIBLE' && (
                    <Link
                      href={`/scholarships/${selectedScholarship.id}`}
                      className="px-5 py-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-md shadow-[#5B4BDB]/20 inline-flex items-center justify-center gap-2"
                    >
                      Start Application
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                <RefreshCw className="w-8 h-8 text-slate-300 mx-auto" />

                <p className="text-sm font-semibold text-slate-600 mt-3">
                  Select a scholarship to view its eligibility report.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Important:</strong> This eligibility checker provides
            an indicative assessment based on the information in your
            profile and the scholarship rules available in the platform.
            Final eligibility and application approval are determined by
            the official scholarship provider.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}