'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Application, ApplicationStatus } from '@/types';
import { getDeadlineInfo } from '@/lib/deadline';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Search,
  Plus,
  Building,
  AlertTriangle,
  FileText,
  Download,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus, deleteApplication } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Edit / Details Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Applied');
  const [editRefNum, setEditRefNum] = useState('');

  // Delete Confirm Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<Application | null>(null);

  const statuses: ApplicationStatus[] = [
    'Saved',
    'Planning to Apply',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Approved',
    'Rejected',
  ];

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicationRefNumber && app.applicationRefNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (app: Application) => {
    setSelectedApp(app);
    setEditNotes(app.notes || '');
    setEditStatus(app.status);
    setEditRefNum(app.applicationRefNumber || '');
  };

  const handleSaveEdit = () => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, editStatus);
    setSelectedApp(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteCandidate) return;
    deleteApplication(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;
    const headers = [
      'Scholarship Title',
      'Provider',
      'Amount (INR)',
      'Status',
      'Deadline',
      'Ref Number',
      'Applied Date',
      'Notes',
    ];
    const rows = applications.map((app) => [
      `"${app.scholarship.title.replace(/"/g, '""')}"`,
      `"${app.scholarship.provider.replace(/"/g, '""')}"`,
      app.scholarship.amount,
      `"${app.status}"`,
      `"${app.submissionDeadline}"`,
      `"${app.applicationRefNumber || 'N/A'}"`,
      `"${app.appliedDate || 'N/A'}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GRANTLY_Applications_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shortlisted':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Planning to Apply':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout
      title="My Applications Tracker"
      subtitle="Manage and track your scholarship submissions across each phase from planning to approval."
    >
      <div className="space-y-6">
        {/* Pipeline Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {statuses.map((st) => {
            const count = applications.filter((a) => a.status === st).length;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(isSelected ? 'All' : st)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#5B4BDB] text-white border-[#5B4BDB] shadow-md shadow-[#5B4BDB]/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {st}
                </div>
                <div className="text-xl font-black mt-0.5">{count}</div>
              </button>
            );
          })}
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, provider or ref #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-9.5 pr-4 py-2 text-xs sm:text-sm text-[#171B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-bold text-slate-500 hidden md:inline">
              Showing {filteredApps.length} of {applications.length}
            </span>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              title="Download Applications CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Scholarship
            </Link>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <EmptyState
            title="No applications in this category"
            description="You haven't added any scholarships to this application stage yet. Browse opportunities to get started."
            actionText="Explore Scholarships"
            actionHref="/scholarships"
          />
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const deadline = getDeadlineInfo(app.scholarship.deadline);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                        <span className="text-xs text-[#5B4BDB] font-semibold bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
                          {app.scholarship.providerType}
                        </span>
                        <Badge
                          variant={
                            deadline.badgeType === 'critical'
                              ? 'danger'
                              : deadline.badgeType === 'warning'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                          icon={<Clock className="w-3 h-3" />}
                        >
                          Deadline: {deadline.formattedDeadline} ({deadline.label})
                        </Badge>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#171B2D]">
                        <Link
                          href={`/scholarships/${app.scholarshipId}`}
                          className="hover:text-[#5B4BDB] transition-colors"
                        >
                          {app.scholarship.title}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.scholarship.provider}
                        </span>
                        {app.appliedDate && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Submitted on {app.appliedDate}
                          </span>
                        )}
                        {app.applicationRefNumber && (
                          <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Ref: {app.applicationRefNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Value & Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left lg:text-right">
                          Grant Value
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#5B4BDB]">
                          {app.scholarship.amountFormatted}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status quick changer */}
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="bg-[#F8F9FC] border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-[#171B2D] font-bold focus:outline-none"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#5B4BDB] hover:bg-slate-100 transition-colors"
                          title="Edit application details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(app)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete from tracker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Checklist Preview */}
                  {app.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Application Notes: </strong>
                        {app.notes}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Application Modal */}
      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title="Edit Application Status & Notes"
        subtitle={selectedApp?.scholarship.title}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Application Stage
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D] font-semibold"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Application Reference Number
            </label>
            <input
              type="text"
              value={editRefNum}
              onChange={(e) => setEditRefNum(e.target.value)}
              placeholder="e.g. NSP/2026/89421"
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Notes & Next Actions
            </label>
            <textarea
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Write follow-ups or checklist notes..."
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-5 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Application Removal"
        subtitle="This action will remove this scholarship from your tracker."
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              Are you sure you want to remove{' '}
              <strong>{deleteCandidate?.scholarship.title}</strong> from your tracker? Stored notes
              and dates will be deleted.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteCandidate(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Confirm Removal
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
