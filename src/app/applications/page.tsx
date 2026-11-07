
"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Application, ApplicationStatus } from "@/types";
import { getDeadlineInfo } from "@/lib/deadline";
import { Modal } from "@/components/common/Modal";

import {
  Search,
  Plus,
  Download,
  CalendarDays,
  Clock3,
  Trash2,
  Pencil,
  Building2,
  FileText,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  X,
  Sparkles,
  Wallet,
  CircleDashed,
  Save,
  SlidersHorizontal,
  Inbox,
  Award,
} from "lucide-react";

const STATUSES: ApplicationStatus[] = [
  "Saved",
  "Planning to Apply",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Approved",
  "Rejected",
];

type ExtraMeta = {
  notes: string;
  refNumber: string;
};

type MetaStore = Record<string, ExtraMeta>;

const STATUS_STYLES: Record<string, string> = {
  Saved: "bg-slate-100 text-slate-600 border-slate-200",
  "Planning to Apply": "bg-violet-50 text-violet-700 border-violet-200",
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Shortlisted: "bg-orange-50 text-orange-700 border-orange-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const inputStyle =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const META_KEY = "grantly-application-meta-v1";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        active
          ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
          : "border-slate-200/80 bg-white hover:border-violet-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-xl p-2.5 ${color}`}>
          <Icon size={19} />
        </span>
        <ArrowUpRight
          size={17}
          className="text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-500"
        />
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value.toString().padStart(2, "0")}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </button>
  );
}

export default function ApplicationsPage() {
  const {
    applications,
    updateApplicationStatus,
    deleteApplication,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedApp, setSelectedApp] =
    useState<Application | null>(null);

  const [deleteCandidate, setDeleteCandidate] =
    useState<Application | null>(null);

  const [editStatus, setEditStatus] =
    useState<ApplicationStatus>("Applied");

  const [editNotes, setEditNotes] = useState("");
  const [editRefNum, setEditRefNum] = useState("");

  const [extraMeta, setExtraMeta] = useState<MetaStore>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(META_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        console.error("Unable to load application metadata.");
      }
    }
    return {};
  });

  const [showFilters, setShowFilters] = useState(false);

  const saveExtraMeta = (
    id: string,
    data: ExtraMeta
  ) => {
    setExtraMeta((previous) => {
      const next = {
        ...previous,
        [id]: data,
      };

      localStorage.setItem(META_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getMeta = useCallback(
    (app: Application): ExtraMeta => ({
      notes: extraMeta[app.id]?.notes ?? app.notes ?? "",
      refNumber:
        extraMeta[app.id]?.refNumber ??
        app.applicationRefNumber ??
        "",
    }),
    [extraMeta]
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter(
        (a) => a.status === "Approved"
      ).length,
      progress: applications.filter((a) =>
        ["Applied", "Under Review", "Shortlisted"].includes(
          a.status
        )
      ).length,
      saved: applications.filter((a) =>
        ["Saved", "Planning to Apply"].includes(a.status)
      ).length,
    };
  }, [applications]);

  // Search and filters
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const query = searchQuery.toLowerCase().trim();

      const meta = getMeta(app);

      const matchesSearch =
        app.scholarship.title.toLowerCase().includes(query) ||
        app.scholarship.provider.toLowerCase().includes(query) ||
        meta.refNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter, getMeta]);

  // Open edit form
  const handleOpenEdit = (app: Application) => {
    const meta = getMeta(app);

    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(meta.notes);
    setEditRefNum(meta.refNumber);
  };

  // Save changes
  const handleSaveEdit = () => {
    if (!selectedApp) return;

    updateApplicationStatus(selectedApp.id, editStatus);

    saveExtraMeta(selectedApp.id, {
      notes: editNotes,
      refNumber: editRefNum,
    });

    setSelectedApp(null);
  };

  // Delete application
  const handleDelete = () => {
    if (!deleteCandidate) return;

    deleteApplication(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  // Export CSV
  const exportToCSV = () => {
    if (!applications.length) return;

    const headers = [
      "Scholarship",
      "Provider",
      "Amount",
      "Status",
      "Deadline",
      "Reference Number",
      "Applied Date",
      "Notes",
    ];

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = applications.map((app) => {
      const meta = getMeta(app);

      return [
        app.scholarship.title,
        app.scholarship.provider,
        app.scholarship.amount,
        app.status,
        app.scholarship.deadline,
        meta.refNumber,
        app.appliedDate,
        meta.notes,
      ]
        .map(escapeCSV)
        .join(",");
    });

    const csv = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `GRANTLY_Applications_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      title="My Applications"
      subtitle="Your scholarship journey, organized in one place."
    >
      <div className="space-y-7 pb-10">

        {/* WELCOME HEADER */}

        <section className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700">
                <Sparkles size={14} />
                Your Scholarship Workspace
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Keep your goals{" "}
                <span className="text-violet-600">
                  moving forward.
                </span>
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Track applications, stay ahead of deadlines and
                celebrate every milestone.
              </p>
            </div>

            <Link
              href="/scholarships"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-700 hover:shadow-xl"
            >
              <Plus size={17} />
              Explore Scholarships
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </section>

        {/* STATISTICS */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={stats.total}
            icon={Wallet}
            color="bg-violet-100 text-violet-600"
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />

          <StatCard
            label="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            color="bg-emerald-100 text-emerald-600"
            active={statusFilter === "Approved"}
            onClick={() => setStatusFilter("Approved")}
          />

          <StatCard
            label="In Progress"
            value={stats.progress}
            icon={TrendingUp}
            color="bg-amber-100 text-amber-600"
            active={["Applied", "Under Review", "Shortlisted"].includes(statusFilter)}
            onClick={() => setStatusFilter("Applied")}
          />

          <StatCard
            label="Saved Opportunities"
            value={stats.saved}
            icon={Bookmark}
            color="bg-blue-100 text-blue-600"
            active={statusFilter === "Saved"}
            onClick={() => setStatusFilter("Saved")}
          />
        </section>

        {/* PIPELINE FILTERS */}

        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Application Pipeline
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Filter applications by their current stage.
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
            >
              <SlidersHorizontal size={15} />
              {showFilters ? "Hide filters" : "Filters"}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", ...STATUSES].map((status) => {
              const count =
                status === "All"
                  ? applications.length
                  : applications.filter(
                      (a) => a.status === status
                    ).length;

              const active = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {status}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {showFilters && (
            <div className="mt-4 rounded-xl bg-violet-50/60 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="mb-2 text-xs font-semibold text-slate-600">
                Quick filter by status
              </p>

              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 ${
                      STATUS_STYLES[status]
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SEARCH AND ACTIONS */}

        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarship, provider or reference..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              disabled={applications.length === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              <Download size={16} />
              Export CSV
            </button>

            <Link
              href="/scholarships"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-violet-700 sm:flex-none"
            >
              <Plus size={16} />
              Add New
            </Link>
          </div>
        </section>

        {/* APPLICATION LIST */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                Your Applications
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredApps.length} of {applications.length} applications
              </p>
            </div>

            <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
              <CircleDashed size={15} />
              Live overview
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <Inbox size={30} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {applications.length === 0
                  ? "Your journey starts here"
                  : "No matching applications"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {applications.length === 0
                  ? "Explore scholarships and add opportunities to start tracking your progress."
                  : "Try changing your search or status filter to find your applications."}
              </p>

              <div className="mt-6">
                {applications.length === 0 ? (
                  <Link
                    href="/scholarships"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Explore Scholarships
                    <ArrowUpRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApps.map((app, index) => {
                const deadline = getDeadlineInfo(
                  app.scholarship.deadline
                );

                const meta = getMeta(app);

                return (
                  <article
                    key={app.id}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 sm:p-6 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* Scholarship information */}

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                              STATUS_STYLES[app.status]
                            }`}
                          >
                            {app.status}
                          </span>

                          <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700">
                            {app.scholarship.providerType}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110">
                            <GraduationCap size={23} />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700 sm:text-lg">
                              {app.scholarship.title}
                            </h4>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <Building2 size={14} />
                              {app.scholarship.provider}
                            </p>
                          </div>
                        </div>

                        {/* Deadline and additional details */}

                        <div className="mt-5 flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            <CalendarDays size={15} className="text-violet-500" />
                            <span>{deadline.formattedDeadline}</span>
                          </div>

                          {app.appliedDate && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                              <Clock3 size={15} className="text-blue-500" />
                              <span>Applied {app.appliedDate}</span>
                            </div>
                          )}

                          {meta.refNumber && (
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                              <FileText size={15} />
                              <span className="font-mono">{meta.refNumber}</span>
                            </div>
                          )}
                        </div>

                        {meta.notes && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs leading-5 text-slate-600">
                            <FileText size={15} className="mt-0.5 shrink-0 text-violet-500" />
                            <span>{meta.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Value and actions */}

                      <div className="flex shrink-0 flex-col gap-4 border-t border-slate-100 pt-4 lg:w-48 lg:items-end lg:border-t-0 lg:pt-0">
                        <div className="lg:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Scholarship Value
                          </p>
                          <p className="mt-1 text-xl font-bold tracking-tight text-violet-700">
                            {app.scholarship.amountFormatted}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <Link
                            href={`/scholarships/${app.scholarshipId}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700"
                          >
                            Details
                            <ExternalLink size={13} />
                          </Link>

                          <button
                            onClick={() => setDeleteCandidate(app)}
                            aria-label="Delete application"
                            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Quick status change */}

                        <div className="w-full">
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Update stage
                          </label>

                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateApplicationStatus(
                                app.id,
                                e.target.value as ApplicationStatus
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* EDIT APPLICATION MODAL */}

      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title="Update Application"
        subtitle={selectedApp?.scholarship.title}
      >
        {selectedApp && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
            className="space-y-5"
          >
            <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 text-violet-600 shadow-sm">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-violet-600">
                    Scholarship
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedApp.scholarship.provider}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <TrendingUp size={15} className="text-violet-500" />
                Application Status
              </label>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as ApplicationStatus)
                }
                className={inputStyle}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileText size={15} className="text-violet-500" />
                Application Reference Number
              </label>

              <input
                value={editRefNum}
                onChange={(e) => setEditRefNum(e.target.value)}
                placeholder="e.g. NSP/2026/89421"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Pencil size={15} className="text-violet-500" />
                Notes & Next Actions
              </label>

              <textarea
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add reminders, follow-ups or important details..."
                className={`${inputStyle} resize-none`}
              />

              <p className="text-right text-[10px] text-slate-400">
                {editNotes.length} characters
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}

      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Remove Application?"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <div className="rounded-xl bg-white p-2.5 text-rose-600 shadow-sm">
              <AlertTriangle size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-rose-800">
                Confirm removal
              </p>
              <p className="mt-1 text-xs leading-5 text-rose-700">
                Are you sure you want to remove{" "}
                <strong>
                  {deleteCandidate?.scholarship.title}
                </strong>{" "}
                from your application tracker?
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => setDeleteCandidate(null)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Keep Application
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-rose-700"
            >
              <Trash2 size={16} />
              Remove Application
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
