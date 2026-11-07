'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { calculateMatchScore } from '@/lib/matchScore';
import { getDeadlineInfo } from '@/lib/deadline';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import {
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

export function ComparisonDrawer() {
  const { comparisonIds, toggleComparison, clearComparison, allScholarships, profile, documents } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  if (comparisonIds.length === 0) return null;

  const comparedScholarships = allScholarships.filter((s) => comparisonIds.includes(s.id));
  const uploadedDocNames = new Set<string>(documents.map((d) => d.documentType));

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-[#171B2D] text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-[#5B4BDB] flex items-center justify-center shrink-0 text-white font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Scholarship Comparison</span>
                <span className="text-xs bg-[#5B4BDB]/40 text-[#EEEAFE] px-2 py-0.5 rounded-full font-semibold">
                  {comparedScholarships.length} of 3 selected
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Evaluate benefits, eligibility rules, and document requirements side by side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs">
              {comparedScholarships.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1 bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded-lg shrink-0"
                >
                  <span className="truncate max-w-[90px]">{s.title}</span>
                  <button
                    onClick={() => toggleComparison(s.id)}
                    className="hover:text-rose-400 text-slate-400 ml-1"
                    title="Remove"
                    aria-label={`Remove ${s.title} from comparison`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#18B6A4]" />
              Compare Now
            </button>

            <button
              onClick={clearComparison}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Clear comparison list"
              aria-label="Clear all compared scholarships"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Side-by-Side Scholarship Comparison"
        subtitle={`Analyzing ${comparedScholarships.length} opportunities against your profile`}
        maxWidth="4xl"
      >
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-3 font-semibold text-slate-400 uppercase text-[11px] w-1/4">
                  Feature / Criteria
                </th>
                {comparedScholarships.map((s) => (
                  <th key={s.id} className="py-3 px-4 font-bold text-[#171B2D] w-1/4 align-top">
                    <div className="space-y-1">
                      <div className="text-xs text-[#5B4BDB] font-semibold">{s.providerType}</div>
                      <div className="text-sm font-bold line-clamp-2">{s.title}</div>
                      <div className="text-xs text-slate-500 font-normal">{s.provider}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Award Amount */}
              <tr className="bg-slate-50/50">
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Award Value</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    <span className="text-base font-bold text-[#5B4BDB]">{s.amountFormatted}</span>
                    <div className="text-[11px] text-slate-500">{s.frequency} disbursement</div>
                  </td>
                ))}
              </tr>

              {/* Match Score */}
              <tr>
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Smart Match Score</td>
                {comparedScholarships.map((s) => {
                  const match = calculateMatchScore(s, profile);
                  return (
                    <td key={s.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#18B6A4]">
                          {profile?.onboardingCompleted ? `${match.totalScore}%` : 'Set up profile'}
                        </span>
                        {profile?.onboardingCompleted && (
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#18B6A4] rounded-full" style={{ width: `${match.totalScore}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Eligibility Status */}
              <tr className="bg-slate-50/50">
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Eligibility Status</td>
                {comparedScholarships.map((s) => {
                  const report = evaluateScholarshipEligibility(s, profile);
                  return (
                    <td key={s.id} className="py-3 px-4">
                      {report.status === 'ELIGIBLE' && (
                        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                          Eligible
                        </Badge>
                      )}
                      {report.status === 'POTENTIALLY_ELIGIBLE' && (
                        <Badge variant="warning" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                          Potentially Eligible
                        </Badge>
                      )}
                      {report.status === 'NOT_ELIGIBLE' && (
                        <Badge variant="danger" icon={<XCircle className="w-3.5 h-3.5" />}>
                          Not Eligible
                        </Badge>
                      )}
                      {report.status === 'PROFILE_INCOMPLETE' && (
                        <Badge variant="neutral">Profile Incomplete</Badge>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Education Stage */}
              <tr>
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Applicable Level</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-xs text-slate-700">
                    {s.educationLevels.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Min Percentage */}
              <tr className="bg-slate-50/50">
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Min. Academic Score</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-xs font-medium text-slate-800">
                    {s.eligibilityCriteria.minPercentage ? `${s.eligibilityCriteria.minPercentage}% marks` : 'No minimum threshold'}
                  </td>
                ))}
              </tr>

              {/* Income Ceiling */}
              <tr>
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Annual Income Limit</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-xs text-slate-700">
                    {s.eligibilityCriteria.maxIncome
                      ? `Up to ₹${s.eligibilityCriteria.maxIncome.toLocaleString('en-IN')}`
                      : 'No strict ceiling'}
                  </td>
                ))}
              </tr>

              {/* Deadline */}
              <tr className="bg-slate-50/50">
                <td className="py-3 px-3 font-semibold text-[#171B2D]">Application Deadline</td>
                {comparedScholarships.map((s) => {
                  const deadline = getDeadlineInfo(s.deadline);
                  return (
                    <td key={s.id} className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{deadline.formattedDeadline}</div>
                      <span
                        className={`text-[11px] font-medium ${
                          deadline.badgeType === 'critical'
                            ? 'text-rose-600'
                            : deadline.badgeType === 'warning'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {deadline.label}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Required Documents & Vault status */}
              <tr>
                <td className="py-3 px-3 font-semibold text-[#171B2D] align-top">Required Documents</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-3 px-4 align-top space-y-1">
                    {s.requiredDocuments.map((doc) => {
                      const inVault = uploadedDocNames.has(doc);
                      return (
                        <div key={doc} className="flex items-center gap-1.5 text-xs">
                          {inVault ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={inVault ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                            {doc}
                          </span>
                        </div>
                      );
                    })}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr className="bg-slate-50">
                <td className="py-4 px-3 font-semibold text-[#171B2D]">Actions</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="py-4 px-4 space-y-2">
                    <Link
                      href={`/scholarships/${s.id}`}
                      onClick={() => setModalOpen(false)}
                      className="block text-center w-full py-2 px-3 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
