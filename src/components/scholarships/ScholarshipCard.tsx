'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scholarship } from '@/types';
import { useApp } from '@/context/AppContext';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { calculateMatchScore } from '@/lib/matchScore';
import { getDeadlineInfo } from '@/lib/deadline';
import { Badge } from '@/components/common/Badge';
import {
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  viewMode?: 'grid' | 'list';
}

export function ScholarshipCard({ scholarship, viewMode = 'grid' }: ScholarshipCardProps) {
  const router = useRouter();
  const {
    profile,
    isScholarshipSaved,
    toggleSaveScholarship,
    isCompared,
    toggleComparison,
  } = useApp();

  const isSaved = isScholarshipSaved(scholarship.id);
  const isSelectedForCompare = isCompared(scholarship.id);

  const eligibility = evaluateScholarshipEligibility(scholarship, profile);
  const match = calculateMatchScore(scholarship, profile);
  const deadline = getDeadlineInfo(scholarship.deadline);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card navigation when clicking interactive buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/scholarships/${scholarship.id}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/scholarships/${scholarship.id}`);
    }
  };

  // Status badge styling
  const renderEligibilityBadge = () => {
    switch (eligibility.status) {
      case 'ELIGIBLE':
        return (
          <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Eligible
          </Badge>
        );
      case 'POTENTIALLY_ELIGIBLE':
        return (
          <Badge variant="warning" size="sm" icon={<AlertCircle className="w-3.5 h-3.5" />}>
            Potentially Eligible
          </Badge>
        );
      case 'NOT_ELIGIBLE':
        return (
          <Badge variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>
            Not Eligible
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            Check Profile
          </Badge>
        );
    }
  };

  const renderDeadlineBadge = () => {
    let variant: 'danger' | 'warning' | 'neutral' = 'neutral';
    if (deadline.badgeType === 'critical') variant = 'danger';
    else if (deadline.badgeType === 'warning') variant = 'warning';

    return (
      <Badge variant={variant} size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
        {deadline.label}
      </Badge>
    );
  };

  if (viewMode === 'list') {
    return (
      <div
        role="article"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all hover:border-[#5B4BDB]/40 card-hover-effect cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#5B4BDB] bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
                {scholarship.providerType}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {scholarship.category}
              </span>
              {renderEligibilityBadge()}
              {renderDeadlineBadge()}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#171B2D] hover:text-[#5B4BDB] transition-colors">
              <Link href={`/scholarships/${scholarship.id}`}>{scholarship.title}</Link>
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">
              {scholarship.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[200px]">{scholarship.provider}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{scholarship.educationLevels.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-xs text-slate-400 block font-medium">Award Value</span>
              <span className="text-lg font-extrabold text-[#5B4BDB]">
                {scholarship.amountFormatted}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComparison(scholarship.id);
                }}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelectedForCompare
                    ? 'bg-[#171B2D] text-white border-[#171B2D]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title={isSelectedForCompare ? 'Selected for comparison' : 'Compare scholarship'}
                aria-label={isSelectedForCompare ? 'Selected for comparison' : 'Compare scholarship'}
              >
                <Layers className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveScholarship(scholarship.id);
                }}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <Link
                href={`/scholarships/${scholarship.id}`}
                className="px-4 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all hover:border-[#5B4BDB]/40 flex flex-col justify-between card-hover-effect group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/30"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#5B4BDB] bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
              {scholarship.providerType}
            </span>
            {renderDeadlineBadge()}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleComparison(scholarship.id);
              }}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isSelectedForCompare
                  ? 'bg-[#171B2D] text-white'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isSelectedForCompare ? 'Selected for comparison' : 'Add to compare'}
              aria-label={isSelectedForCompare ? 'Selected for comparison' : 'Add to compare'}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveScholarship(scholarship.id);
              }}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isSaved
                  ? 'text-rose-500 hover:bg-rose-50'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save scholarship'}
              aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Provider */}
        <h3 className="text-base font-bold text-[#171B2D] group-hover:text-[#5B4BDB] transition-colors line-clamp-2 mb-1.5 leading-snug">
          <Link href={`/scholarships/${scholarship.id}`}>{scholarship.title}</Link>
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {scholarship.shortDescription}
        </p>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Level
            </span>
            <span className="font-semibold text-slate-800 line-clamp-1">
              {scholarship.educationLevels[0]}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Min. Marks
            </span>
            <span className="font-semibold text-slate-800">
              {scholarship.eligibilityCriteria.minPercentage
                ? `${scholarship.eligibilityCriteria.minPercentage}%`
                : 'Not restricted'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Details & Match Score */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Amount
            </span>
            <span className="text-sm font-extrabold text-[#5B4BDB]">
              {scholarship.amountFormatted}
            </span>
          </div>

          {/* Smart Match Pill */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Profile match
            </span>
            <span className="text-xs font-black text-[#18B6A4] flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3 text-[#18B6A4]" />
              {profile?.onboardingCompleted ? `${match.totalScore}%` : 'Set up profile'}
            </span>
          </div>
        </div>

        {/* Eligibility Indicator & CTA Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {renderEligibilityBadge()}

          <Link
            href={`/scholarships/${scholarship.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#5B4BDB] hover:text-[#4838C2] group-hover:translate-x-0.5 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
