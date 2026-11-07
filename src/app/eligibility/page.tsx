'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { calculateMatchScore } from '@/lib/matchScore';
import { Badge } from '@/components/common/Badge';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  User,
  Check,
} from 'lucide-react';

export default function EligibilityCheckerPage() {
  const { allScholarships, profile } = useApp();
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>(
    allScholarships[0].id
  );
  const [filterTab, setFilterTab] = useState<'ALL' | 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE'>('ALL');

  const selectedScholarship =
    allScholarships.find((s) => s.id === selectedScholarshipId) || allScholarships[0];
  const activeReport = evaluateScholarshipEligibility(selectedScholarship, profile);

  // Evaluate across all scholarships
  const allEvaluations = allScholarships.map((s) => ({
    scholarship: s,
    report: evaluateScholarshipEligibility(s, profile),
    match: calculateMatchScore(s, profile),
  }));

  const eligibleCount = allEvaluations.filter((e) => e.report.status === 'ELIGIBLE').length;
  const potentialCount = allEvaluations.filter((e) => e.report.status === 'POTENTIALLY_ELIGIBLE').length;
  const notEligibleCount = allEvaluations.filter((e) => e.report.status === 'NOT_ELIGIBLE').length;

  const filteredList = allEvaluations.filter((e) => {
    if (filterTab === 'ALL') return true;
    return e.report.status === filterTab;
  });

  return (
    <DashboardLayout
      title="Smart Eligibility Checker"
      subtitle="Deterministic, rule-based verification evaluating student criteria against scheme guidelines."
    >
      <div className="space-y-8">
        {/* Profile Snapshot Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#171B2D]">
                  Evaluating for: {profile?.fullName || 'Demo Student'}
                </h3>
                <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                  Profile Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.educationLevel} • Score: {profile?.percentageOrCgpa}% • Family Income: ₹{profile?.annualFamilyIncome?.toLocaleString('en-IN')}/yr • Domicile: {profile?.state}
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#5B4BDB] transition-colors shrink-0"
          >
            Edit Profile Credentials
          </Link>
        </div>

        {/* 3 Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setFilterTab('ELIGIBLE')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === 'ELIGIBLE'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Fully Eligible
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">{eligibleCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">100% mandatory conditions satisfied</p>
          </button>

          <button
            onClick={() => setFilterTab('POTENTIALLY_ELIGIBLE')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === 'POTENTIALLY_ELIGIBLE'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Potentially Eligible
              </span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">{potentialCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Require missing detail verification</p>
          </button>

          <button
            onClick={() => setFilterTab('NOT_ELIGIBLE')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === 'NOT_ELIGIBLE'
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Not Eligible
              </span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700">{notEligibleCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Below thresholds or state restricted</p>
          </button>
        </div>

        {/* 2-Column Evaluation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Scholarship Selector List */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Opportunity ({filteredList.length})
              </h4>
              {filterTab !== 'ALL' && (
                <button
                  onClick={() => setFilterTab('ALL')}
                  className="text-xs font-bold text-[#5B4BDB] hover:underline"
                >
                  Show All
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredList.map(({ scholarship, report }) => {
                const isSelected = scholarship.id === selectedScholarshipId;
                return (
                  <div
                    key={scholarship.id}
                    onClick={() => setSelectedScholarshipId(scholarship.id)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EEEAFE] border-[#5B4BDB] shadow-xs'
                        : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-[#171B2D] line-clamp-1">
                        {scholarship.title}
                      </span>
                      {report.status === 'ELIGIBLE' && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      {report.status === 'POTENTIALLY_ELIGIBLE' && (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      {report.status === 'NOT_ELIGIBLE' && (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{scholarship.amountFormatted}</span>
                      <span className="font-semibold text-[#5B4BDB]">{scholarship.providerType}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Rule Evaluation Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#5B4BDB] bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
                  Detailed Verification Report
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#171B2D]">
                  {selectedScholarship.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedScholarship.provider}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {activeReport.status === 'ELIGIBLE' && (
                  <Badge variant="success" size="md" icon={<CheckCircle className="w-4 h-4" />}>
                    Eligible to Apply
                  </Badge>
                )}
                {activeReport.status === 'POTENTIALLY_ELIGIBLE' && (
                  <Badge variant="warning" size="md" icon={<AlertCircle className="w-4 h-4" />}>
                    Potentially Eligible
                  </Badge>
                )}
                {activeReport.status === 'NOT_ELIGIBLE' && (
                  <Badge variant="danger" size="md" icon={<XCircle className="w-4 h-4" />}>
                    Ineligible
                  </Badge>
                )}
              </div>
            </div>

            {/* Explanation box */}
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                activeReport.status === 'ELIGIBLE'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : activeReport.status === 'POTENTIALLY_ELIGIBLE'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <strong>Summary: </strong> {activeReport.explanation}
            </div>

            {/* Rule items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mandatory Condition Matrix
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {activeReport.rules.map((rule) => (
                  <div key={rule.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#171B2D] text-sm">{rule.name}</span>
                        {rule.isMandatory && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">{rule.description}</p>
                      <div className="text-slate-700 pt-1">
                        <span className="font-semibold text-slate-500">Requirement: </span>
                        {rule.requiredValue}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 space-y-1">
                      <div className="font-semibold text-slate-800">
                        Declared: {rule.studentValue}
                      </div>
                      <div>
                        {rule.status === 'satisfied' && (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <Check className="w-3.5 h-3.5" /> Condition Met
                          </span>
                        )}
                        {rule.status === 'missing_info' && (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Information Needed
                          </span>
                        )}
                        {rule.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Criterion Not Met
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            {activeReport.actionItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
                  Recommended Next Steps
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeReport.actionItems.map((action, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#5B4BDB] shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions Bottom Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/scholarships/${selectedScholarship.id}`}
                className="text-xs font-bold text-[#5B4BDB] hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Scheme Specification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {activeReport.status === 'ELIGIBLE' && (
                <Link
                  href={`/scholarships/${selectedScholarship.id}`}
                  className="px-5 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-md shadow-[#5B4BDB]/25"
                >
                  Start Application
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
