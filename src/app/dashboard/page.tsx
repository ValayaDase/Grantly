'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { getRecommendedScholarships } from '@/lib/recommendation';
import { getDeadlineInfo } from '@/lib/deadline';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import {
  Sparkles,
  Bookmark,
  FileCheck2,
  Clock,
  ArrowRight,
  FolderLock,
  Compass,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, allScholarships, stats, applications, notifications } = useApp();

  const recommended = getRecommendedScholarships(allScholarships, profile, 4);

  // Urgent scholarships closing within 30 days
  const closingSoonList = allScholarships
    .map((s) => ({
      scholarship: s,
      deadlineInfo: getDeadlineInfo(s.deadline),
    }))
    .filter((item) => !item.deadlineInfo.isExpired && item.deadlineInfo.daysRemaining <= 30)
    .sort((a, b) => a.deadlineInfo.daysRemaining - b.deadlineInfo.daysRemaining)
    .slice(0, 4);

  return (
    <DashboardLayout
      title={`Good day, ${profile?.fullName?.split(' ')[0] || 'Student'}!`}
      subtitle="Here is your centralized scholarship pipeline, deadline tracker and match recommendations."
    >
      <div className="space-y-8">
        {/* Welcome & Profile Strength Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5B4BDB] via-[#6C5CE7] to-[#18B6A4] text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Recommendation Engine Active</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
                {profile?.courseStream || 'Undergraduate Degree'} • {profile?.institutionName || 'Targeting Grants'}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                We analyzed {allScholarships.length} active opportunities against your academic score ({profile?.percentageOrCgpa || 0}%) and income bracket. You have high eligibility potential.
              </p>
            </div>

            {/* Profile completion gauge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shrink-0 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#5B4BDB] flex flex-col items-center justify-center font-black text-lg shadow-sm">
                <span>{stats.profileCompletion}%</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase -mt-1">Strength</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold">Profile Completeness</div>
                <div className="text-[11px] text-indigo-100 max-w-[150px]">
                  {stats.profileCompletion >= 90
                    ? 'All essential fields ready for 1-click matching.'
                    : 'Add missing details for enhanced match accuracy.'}
                </div>
                <Link
                  href="/profile"
                  className="text-xs text-amber-300 hover:text-white font-bold inline-flex items-center gap-1 mt-1 transition-colors"
                >
                  Edit Profile
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Dynamic KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#72788A] uppercase tracking-wider">
                Recommended
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171B2D]">
                {allScholarships.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-[#18B6A4] font-bold">4 Top Matches</span> based on profile
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#72788A] uppercase tracking-wider">
                Saved Scholarships
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171B2D]">{stats.savedCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                <Link href="/saved" className="text-[#5B4BDB] font-bold hover:underline">
                  View bookmarked schemes
                </Link>
              </div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#72788A] uppercase tracking-wider">
                Tracked Applications
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171B2D]">
                {stats.applicationsCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                <span className="text-emerald-600 font-bold">{stats.submittedCount} Submitted</span> •{' '}
                {stats.underReviewCount} in review
              </div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#72788A] uppercase tracking-wider">
                Upcoming Deadlines
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171B2D]">
                {stats.upcomingDeadlinesCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 text-amber-600 font-semibold">
                Closing in next 30 days
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Actions
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              Explore All Scholarships
            </Link>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEEAFE] hover:bg-indigo-100 text-[#5B4BDB] text-xs font-bold transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Run Eligibility Checker
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-all"
            >
              <FolderLock className="w-3.5 h-3.5" />
              Manage Document Vault
            </Link>
          </div>
        </div>

        {/* Main Content Grid: Top Recommendations + Application Pipeline & Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Recommended For You */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#171B2D] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5B4BDB]" />
                  Personalized Scholarship Recommendations
                </h3>
                <p className="text-xs text-slate-500">
                  Prioritized by academic fit, financial limits, and state criteria
                </p>
              </div>
              <Link
                href="/scholarships"
                className="text-xs font-bold text-[#5B4BDB] hover:underline inline-flex items-center gap-1"
              >
                Browse All ({allScholarships.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map(({ scholarship, matchScore, recommendationReason, badge }) => (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between card-hover-effect space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#5B4BDB] bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                      <span className="text-xs font-extrabold text-[#18B6A4] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {matchScore}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#171B2D] line-clamp-2 hover:text-[#5B4BDB] transition-colors">
                      <Link href={`/scholarships/${scholarship.id}`}>{scholarship.title}</Link>
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">{scholarship.provider}</p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-snug">
                      <span className="font-semibold text-slate-800">Why matched: </span>
                      {recommendationReason}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Value</span>
                      <span className="text-sm font-black text-[#5B4BDB]">
                        {scholarship.amountFormatted}
                      </span>
                    </div>

                    <Link
                      href={`/scholarships/${scholarship.id}`}
                      className="px-3 py-1.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Pipeline & Pool Analytics */}
            <AnalyticsChart />

            {/* Application Pipeline Status Overview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider">
                    Application Tracker Overview
                  </h3>
                  <p className="text-xs text-slate-500">Live stages of your submitted applications</p>
                </div>
                <Link
                  href="/applications"
                  className="text-xs font-bold text-[#5B4BDB] hover:underline"
                >
                  Manage Pipeline ({applications.length})
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No active applications. Explore scholarships and click &quot;Apply / Track&quot; to begin.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-[#171B2D] truncate">
                          {app.scholarship.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.notes || `Deadline: ${app.submissionDeadline}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            app.status === 'Applied'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : app.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {app.status}
                        </span>
                        <Link
                          href="/applications"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Deadlines Widget + Recent Activity */}
          <div className="space-y-6">
            {/* Upcoming Deadlines Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-[#171B2D]">Closing This Month</h4>
                </div>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Urgent
                </span>
              </div>

              <div className="space-y-3">
                {closingSoonList.map(({ scholarship, deadlineInfo }) => (
                  <Link
                    key={scholarship.id}
                    href={`/scholarships/${scholarship.id}`}
                    className="block p-3 rounded-xl bg-slate-50 hover:bg-[#EEEAFE]/50 border border-slate-100 hover:border-[#5B4BDB]/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-[#171B2D] group-hover:text-[#5B4BDB] line-clamp-1">
                        {scholarship.title}
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          deadlineInfo.badgeType === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {deadlineInfo.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{scholarship.amountFormatted}</span>
                      <span className="text-slate-400">{deadlineInfo.formattedDeadline}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Notifications / Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-[#171B2D]">Recent Activity</h4>
                <Link
                  href="/notifications"
                  className="text-xs text-[#5B4BDB] font-bold hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="text-xs space-y-1 pb-2 border-b border-slate-50 last:border-none">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171B2D] line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
