'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Bell,
  Clock,
  FileCheck2,
  FolderLock,
  Sparkles,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'deadline') return n.type === 'deadline';
    if (filterType === 'status') return n.type === 'status_change';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-500" />;
      case 'status_change':
        return <FileCheck2 className="w-4 h-4 text-[#5B4BDB]" />;
      case 'document':
        return <FolderLock className="w-4 h-4 text-teal-500" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Notifications & Deadline Alerts"
      subtitle="Dynamic alerts generated from upcoming scholarship submission gates and application updates."
    >
      <div className="space-y-6 max-w-4xl">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['all', 'unread', 'deadline', 'status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterType === tab
                    ? 'bg-[#5B4BDB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'all'
                  ? 'All Alerts'
                  : tab === 'unread'
                  ? 'Unread'
                  : tab === 'deadline'
                  ? 'Deadlines'
                  : 'Status Changes'}
              </button>
            ))}
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B4BDB] hover:text-[#4838C2] transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifs.length === 0 ? (
          <EmptyState
            title="No notifications found"
            description="You are completely caught up! New alerts will trigger automatically when application deadlines approach or profile changes occur."
            icon={Bell}
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.link) router.push(n.link);
                }}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !n.read
                    ? 'border-[#5B4BDB]/40 bg-indigo-50/20 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#171B2D]">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#5B4BDB] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <div className="text-[11px] text-slate-400 font-medium">{n.timestamp}</div>
                  </div>
                </div>

                {n.link && (
                  <div className="p-2 text-slate-400 hover:text-[#5B4BDB] shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
