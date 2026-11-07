
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { getRecommendedScholarships } from "@/lib/recommendation";
import { getDeadlineInfo } from "@/lib/deadline";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

import {
  Sparkles,
  Bookmark,
  FileCheck2,
  Clock,
  ArrowRight,
  Compass,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Search,
  CalendarDays,
  Building2,
  ArrowUpRight,
  Bell,
  FolderLock,
  UserRound,
  Target,
  Zap,
  CircleCheck,
  X,
  ChartNoAxesCombined,
} from "lucide-react";

// ---------------- STATUS STYLES ----------------

const statusStyles: Record<string, string> = {
  Saved: "bg-slate-100 text-slate-600",
  "Planning to Apply": "bg-violet-50 text-violet-700",
  Applied: "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  Shortlisted: "bg-orange-50 text-orange-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
};

// ---------------- PROFILE RING ----------------

function ProfileRing({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="8"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-2xl font-bold text-white">
          {safeValue}%
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
          Complete
        </p>
      </div>
    </div>
  );
}

// ---------------- KPI CARD ----------------

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/40"
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={21} />
        </span>

        <ArrowUpRight
          size={18}
          className="text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-600"
        />
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}

// ---------------- QUICK ACTION ----------------

function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-violet-600"
      />
    </Link>
  );
}

// ---------------- MAIN DASHBOARD ----------------

export default function DashboardPage() {
  const router = useRouter();
  const {
    profile,
    allScholarships,
    stats,
    applications,
    notifications,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [deadlineRange, setDeadlineRange] = useState(30);
  const [showAllRecommendations, setShowAllRecommendations] =
    useState(false);

  const recommended = useMemo(
    () => getRecommendedScholarships(allScholarships, profile, 4),
    [allScholarships, profile]
  );

  // Search recommendations
  const filteredRecommendations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return recommended;

    return recommended.filter(
      ({ scholarship }) =>
        scholarship.title.toLowerCase().includes(query) ||
        scholarship.provider.toLowerCase().includes(query)
    );
  }, [recommended, searchQuery]);

  // Closing soon scholarships
  const closingSoonList = useMemo(() => {
    return allScholarships
      .map((scholarship) => ({
        scholarship,
        deadlineInfo: getDeadlineInfo(scholarship.deadline),
      }))
      .filter(
        (item) =>
          !item.deadlineInfo.isExpired &&
          item.deadlineInfo.daysRemaining <= deadlineRange
      )
      .sort(
        (a, b) =>
          a.deadlineInfo.daysRemaining -
          b.deadlineInfo.daysRemaining
      )
      .slice(0, 5);
  }, [allScholarships, deadlineRange]);

  const firstName =
    profile?.fullName?.split(" ")[0] || "Student";

  const profileCompletion = stats.profileCompletion;

  const pendingApplications = applications.filter((app) =>
    ["Applied", "Under Review", "Shortlisted"].includes(
      app.status
    )
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}!`}
      subtitle="Your personalized scholarship command center."
    >
      <div className="space-y-7 pb-10">

        {/* =====================================
            1. WELCOME HERO
        ===================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#332477] via-[#5B4BDB] to-[#8170EB] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8">

          {/* Decorative elements */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[40%] h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div className="max-w-xl space-y-4">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles size={14} className="text-amber-300" />
                Your GRANTLY workspace
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  Find opportunities.
                  <br />
                  <span className="text-violet-200">
                    Shape your future.
                  </span>
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-indigo-100">
                  Your scholarship journey starts here. Explore
                  opportunities selected according to your
                  academic profile and eligibility.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/scholarships"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <Compass size={17} />
                  Explore Scholarships
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <UserRound size={16} />
                  My Profile
                </Link>
              </div>
            </div>

            {/* Profile Completion */}

            <div className="flex items-center gap-5 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl sm:gap-6 lg:min-w-[280px]">
              <ProfileRing value={profileCompletion} />

              <div className="flex-1">
                <p className="text-sm font-bold">
                  Profile Strength
                </p>

                <p className="mt-2 text-xs leading-5 text-indigo-100">
                  {profileCompletion >= 90
                    ? "Your profile is almost fully complete."
                    : "Complete your profile to improve scholarship matching."}
                </p>

                <Link
                  href="/profile"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-200 transition hover:text-white"
                >
                  Improve Profile
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            2. KPI STATISTICS
        ===================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          <MetricCard
            label="Scholarships"
            value={allScholarships.length}
            description="Available opportunities"
            icon={GraduationCap}
            color="bg-violet-100 text-violet-600"
            href="/scholarships"
          />

          <MetricCard
            label="Saved Scholarships"
            value={stats.savedCount}
            description="Your bookmarked opportunities"
            icon={Bookmark}
            color="bg-blue-100 text-blue-600"
            href="/saved"
          />

          <MetricCard
            label="Applications"
            value={stats.applicationsCount}
            description={`${approvedApplications} approved so far`}
            icon={FileCheck2}
            color="bg-emerald-100 text-emerald-600"
            href="/applications"
          />

          <MetricCard
            label="Upcoming Deadlines"
            value={stats.upcomingDeadlinesCount}
            description="Closing within 30 days"
            icon={Clock}
            color="bg-amber-100 text-amber-600"
            href="/scholarships"
          />

        </section>

        {/* =====================================
            3. QUICK ACTIONS
        ===================================== */}

        <section className="space-y-4">

          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Quick Actions
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Everything you need, just one click away.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <QuickAction
              title="Find Scholarships"
              description="Discover opportunities"
              icon={Compass}
              href="/scholarships"
              color="bg-violet-100 text-violet-600"
            />

            <QuickAction
              title="Check Eligibility"
              description="Verify your eligibility"
              icon={CheckCircle2}
              href="/eligibility"
              color="bg-emerald-100 text-emerald-600"
            />

            <QuickAction
              title="My Applications"
              description="Track your progress"
              icon={FileCheck2}
              href="/applications"
              color="bg-blue-100 text-blue-600"
            />

            <QuickAction
              title="Document Vault"
              description="Manage important files"
              icon={FolderLock}
              href="/documents"
              color="bg-amber-100 text-amber-600"
            />

          </div>
        </section>

        {/* =====================================
            4. MAIN CONTENT GRID
        ===================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* LEFT CONTENT */}

          <div className="space-y-6 xl:col-span-2">

            {/* RECOMMENDATIONS */}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
                      <Sparkles size={18} />
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Recommended For You
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Opportunities matched to your profile.
                  </p>
                </div>

                <Link
                  href="/scholarships"
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 transition hover:gap-2"
                >
                  Explore All
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Search */}

              <div className="relative mt-5">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  aria-label="Search recommended scholarships"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recommended scholarships..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Scholarship Cards */}

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {filteredRecommendations
                  .slice(
                    0,
                    showAllRecommendations ? undefined : 4
                  )
                  .map(
                    ({
                      scholarship,
                      matchScore,
                      recommendationReason,
                      badge,
                    }) => (
                      <article
                        key={scholarship.id}
                        role="article"
                        tabIndex={0}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("a, button")) return;
                          router.push(`/scholarships/${scholarship.id}`);
                        }}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/scholarships/${scholarship.id}`);
                          }
                        }}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >

                        <div className="space-y-4">

                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-700">
                              {badge}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                              <Sparkles size={12} />
                              {profile?.onboardingCompleted ? `${matchScore}% Match` : 'Complete profile to personalize'}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
                              <GraduationCap size={22} />
                            </div>

                            <div className="min-w-0">
                              <Link
                                href={`/scholarships/${scholarship.id}`}
                                className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition hover:text-violet-700"
                              >
                                {scholarship.title}
                              </Link>

                              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                <Building2 size={12} />
                                {scholarship.provider}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Why this matches
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-600 line-clamp-3">
                              {recommendationReason}
                            </p>
                          </div>

                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Award Value
                            </p>
                            <p className="mt-1 text-base font-bold text-violet-700">
                              {scholarship.amountFormatted}
                            </p>
                          </div>

                          <Link
                            href={`/scholarships/${scholarship.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
                          >
                            View Details
                            <ArrowRight size={14} />
                          </Link>
                        </div>

                      </article>
                    )
                  )}

              </div>

              {filteredRecommendations.length === 0 && (
                <div className="py-10 text-center">
                  <Search
                    size={30}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No matching recommendations
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try another scholarship name or provider.
                  </p>
                </div>
              )}

              {filteredRecommendations.length > 4 && (
                <button
                  onClick={() =>
                    setShowAllRecommendations(
                      !showAllRecommendations
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  {showAllRecommendations
                    ? "Show Less"
                    : "Show More Recommendations"}
                  <ChevronRight
                    size={15}
                    className={`transition-transform ${
                      showAllRecommendations ? "rotate-90" : ""
                    }`}
                  />
                </button>
              )}

            </section>

            {/* ANALYTICS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ChartNoAxesCombined
                      size={19}
                      className="text-violet-600"
                    />
                    <h3 className="text-base font-bold text-slate-900">
                      Scholarship Analytics
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Overview of your scholarship activity.
                  </p>
                </div>

                <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-600">
                  Overview
                </span>
              </div>

              <AnalyticsChart />

            </section>

            {/* APPLICATION PIPELINE */}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Application Progress
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Track your ongoing applications.
                  </p>
                </div>

                <Link
                  href="/applications"
                  className="shrink-0 text-xs font-bold text-violet-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              {/* Pipeline progress */}

              <div className="mt-5 grid grid-cols-3 gap-2">

                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xl font-bold text-blue-700">
                    {pendingApplications}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-blue-600">
                    In Progress
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-xl font-bold text-emerald-700">
                    {approvedApplications}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                    Approved
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 p-3">
                  <p className="text-xl font-bold text-violet-700">
                    {stats.applicationsCount}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-violet-600">
                    Total
                  </p>
                </div>

              </div>

              <div className="mt-5 divide-y divide-slate-100">

                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/scholarships/${app.scholarshipId}`}
                        className="block truncate text-xs font-bold text-slate-800 hover:text-violet-700"
                      >
                        {app.scholarship.title}
                      </Link>

                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {app.scholarship.provider}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          statusStyles[app.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {app.status}
                      </span>

                      <Link
                        href="/applications"
                        aria-label="View application"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}

                {applications.length === 0 && (
                  <div className="py-8 text-center">
                    <FileCheck2
                      size={28}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      No applications yet
                    </p>
                    <Link
                      href="/scholarships"
                      className="mt-2 inline-block text-xs font-bold text-violet-600 hover:underline"
                    >
                      Discover opportunities
                    </Link>
                  </div>
                )}

              </div>

            </section>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-6">

            {/* DEADLINE TRACKER */}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <Clock size={17} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    Deadline Tracker
                  </h3>
                </div>

                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
                  {closingSoonList.length} Urgent
                </span>
              </div>

              {/* Deadline filters */}

              <div className="mt-5 flex rounded-xl bg-slate-100 p-1">
                {[7, 15, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDeadlineRange(days)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      deadlineRange === days
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">

                {closingSoonList.map(
                  ({ scholarship, deadlineInfo }) => (
                    <Link
                      key={scholarship.id}
                      href={`/scholarships/${scholarship.id}`}
                      className="group block rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all hover:border-violet-200 hover:bg-violet-50/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-xs font-bold leading-5 text-slate-800 transition group-hover:text-violet-700">
                          {scholarship.title}
                        </p>

                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-slate-300 group-hover:text-violet-600"
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-violet-700">
                          {scholarship.amountFormatted}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                            deadlineInfo.badgeType === "critical"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {deadlineInfo.label}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <CalendarDays size={12} />
                        {deadlineInfo.formattedDeadline}
                      </div>
                    </Link>
                  )
                )}

                {closingSoonList.length === 0 && (
                  <div className="py-8 text-center">
                    <CircleCheck
                      size={28}
                      className="mx-auto text-emerald-500"
                    />
                    <p className="mt-3 text-xs font-bold text-slate-700">
                      All clear!
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      No scholarships closing in this period.
                    </p>
                  </div>
                )}

              </div>

              <Link
                href="/scholarships"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                Browse All Opportunities
                <ArrowRight size={14} />
              </Link>

            </section>

            {/* RECENT ACTIVITY */}

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                    <Bell size={17} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>

                <Link
                  href="/notifications"
                  className="text-[11px] font-bold text-violet-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="mt-5 space-y-4">

                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Zap size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800">
                          {notification.title}
                        </p>
                      </div>

                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-7 text-center">
                    <Bell
                      size={27}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      No new activity
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Updates will appear here.
                    </p>
                  </div>
                )}

              </div>

            </section>

            {/* PROFILE COMPLETION CTA */}

            <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">

              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-200/40 blur-2xl" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                  <Target size={20} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  Boost Your Eligibility
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Keep your academic and financial details updated
                  to get more accurate scholarship recommendations.
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, profileCompletion)
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[10px] font-semibold">
                  <span className="text-slate-500">
                    Profile completion
                  </span>
                  <span className="text-violet-700">
                    {profileCompletion}%
                  </span>
                </div>

                <Link
                  href="/profile"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  Complete My Profile
                  <ArrowUpRight size={14} />
                </Link>
              </div>

            </section>

          </aside>
        </div>

      </div>
    </DashboardLayout>
  );
}
