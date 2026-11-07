'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/common/Modal';
import {
  RotateCcw,
  LogOut,
  CheckCircle2,
  Database,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, resetToDemoData, logout } = useApp();

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  const handleReset = () => {
    resetToDemoData();
    setResetModalOpen(false);
    setFeedback('All application data, profile, and documents reset to standard demo state.');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <DashboardLayout
      title="Platform Settings & Preferences"
      subtitle="Manage notification frequencies, local storage persistence, and demo environment state."
    >
      <div className="space-y-6 max-w-4xl">
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Account Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider">
            Active Student Account
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#171B2D]">{profile?.fullName}</div>
              <div className="text-xs text-slate-500">{profile?.email}</div>
              <div className="text-[11px] text-[#5B4BDB] font-semibold">
                Education Level: {profile?.educationLevel}
              </div>
            </div>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-xs font-bold text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Notifications Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider">
            Notification Preferences
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#171B2D]">Deadline Approaching Warnings</div>
                <div className="text-slate-500">
                  Notify me 7 days and 48 hours before official scholarship portal locks.
                </div>
              </div>
              <input
                type="checkbox"
                checked={deadlineAlerts}
                onChange={(e) => setDeadlineAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B4BDB] focus:ring-[#5B4BDB]"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#171B2D]">Application Pipeline Status Updates</div>
                <div className="text-slate-500">
                  Record verification timestamps from nodal officers and institute checks.
                </div>
              </div>
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B4BDB] focus:ring-[#5B4BDB]"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#171B2D]">New Scheme Recommendations</div>
                <div className="text-slate-500">
                  Alert when a newly added grant matches over 90% of your student profile.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B4BDB] focus:ring-[#5B4BDB]"
              />
            </div>
          </div>
        </div>

        {/* Demo Persistence & Local Storage Control */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#5B4BDB]" />
            <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider">
              Data Management & Persistence
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            GRANTLY stores all your session data, saved bookmarks, uploaded document metadata, and application tracker records in browser <strong>LocalStorage</strong>. Refreshing or reopening this window preserves your progress.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <strong className="font-bold block">Reset to Competition Demo State</strong>
              <span className="text-[11px] text-amber-800">
                Restore the default demo student (Priya Sharma), initial saved schemes, sample applications, and verified documents.
              </span>
            </div>

            <button
              onClick={() => setResetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Confirm Reset Demo Data"
        subtitle="This will restore the original demo profile and records."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to restore the platform to its default demonstration baseline? Any custom scholarships you tracked or documents you added will be reverted to sample state.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Sign Out of GRANTLY"
        subtitle="End current demo session"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to sign out? Your saved data remains stored in your browser session and can be accessed when signing back in.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
