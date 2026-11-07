
'use client';

import React, { useMemo, useState } from 'react';
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
  Search,
  Check,
  Inbox,
  CalendarDays,
  CircleDot,
  BellRing,
  Filter,
  X,
} from 'lucide-react';

type FilterType = 'all' | 'unread' | 'deadline' | 'status' | 'document' | 'recommendation';

export default function NotificationsPage() {
  const router = useRouter();

  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.length - unreadCount;

  const deadlineCount = notifications.filter(
    (n) => n.type === 'deadline'
  ).length;

  const filteredNotifs = useMemo(() => {
    return notifications.filter((n) => {
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'unread' && !n.read) ||
        n.type === filterType;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, filterType, searchQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5" />;
      case 'status_change':
        return <FileCheck2 className="w-5 h-5" />;
      case 'document':
        return <FolderLock className="w-5 h-5" />;
      case 'recommendation':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'status_change':
        return 'bg-indigo-50 text-[#5B4BDB] border-indigo-100';
      case 'document':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'recommendation':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'Deadline Alert';
      case 'status_change':
        return 'Application Update';
      case 'document':
        return 'Document';
      case 'recommendation':
        return 'Recommendation';
      default:
        return 'General Alert';
    }
  };

  const filterOptions: {
    label: string;
    value: FilterType;
    count?: number;
  }[] = [
    { label: 'All Alerts', value: 'all', count: notifications.length },
    { label: 'Unread', value: 'unread', count: unreadCount },
    { label: 'Deadlines', value: 'deadline', count: deadlineCount },
    { label: 'Status Updates', value: 'status' },
    { label: 'Documents', value: 'document' },
    { label: 'Recommendations', value: 'recommendation' },
  ];

  const handleNotificationClick = (notification: (typeof notifications)[number]) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay on top of scholarship deadlines, application updates and important alerts."
    >
      <div className="max-w-6xl space-y-7">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#29205F] via-[#5142B8] to-[#7162E8] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
          {/* Decorative shapes */}
          <div className="absolute -right-12 -top-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute right-32 -bottom-32 w-64 h-64 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-7">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-indigo-100">
                <BellRing className="w-3.5 h-3.5" />
                NOTIFICATION CENTER
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Never Miss an Opportunity.
                </h2>

                <p className="text-sm text-indigo-100/90 mt-2 leading-relaxed max-w-lg">
                  Your scholarship journey, deadlines and application
                  updates — all in one place. Stay informed and take
                  action at the right time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-indigo-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Notification system active
                </div>

                <span className="text-white/30">•</span>

                <span className="text-xs text-indigo-100">
                  {notifications.length} total notifications
                </span>
              </div>
            </div>

            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[30px] bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center">
                <Bell className="w-14 h-14 sm:w-16 sm:h-16 text-white" strokeWidth={1.3} />
                {unreadCount > 0 && (
                  <span className="absolute top-5 right-5 w-4 h-4 rounded-full bg-rose-400 border-[3px] border-[#5142B8] animate-pulse" />
                )}
              </div>

              {unreadCount > 0 && (
                <div className="absolute -bottom-3 -left-8 px-4 py-2 rounded-xl bg-white text-[#29205F] shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Needs attention
                  </p>
                  <p className="text-lg font-black leading-tight">
                    {unreadCount} unread
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Alerts
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5B4BDB] flex items-center justify-center">
                <Inbox className="w-5 h-5" />
              </div>
            </div>

            <p className="text-3xl font-black text-[#171B2D] mt-3">
              {notifications.length}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              All your notifications
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Unread Alerts
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <BellRing className="w-5 h-5" />
              </div>
            </div>

            <p className="text-3xl font-black text-[#171B2D] mt-3">
              {unreadCount}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Waiting for your attention
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Read Alerts
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCheck className="w-5 h-5" />
              </div>
            </div>

            <p className="text-3xl font-black text-[#171B2D] mt-3">
              {readCount}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Already reviewed
            </p>
          </div>
        </div>

        {/* Notification Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="p-5 sm:p-6 border-b border-slate-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#171B2D]">
                  Your Activity
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage and review all your recent alerts.
                </p>
              </div>

              <button
                onClick={markAllNotificationsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEEAFE] hover:bg-indigo-100 text-[#5B4BDB] text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-[#5B4BDB] focus:ring-4 focus:ring-[#5B4BDB]/10 transition-all"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />

              {filterOptions.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterType(tab.value)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                    filterType === tab.value
                      ? 'bg-[#5B4BDB] text-white shadow-md shadow-[#5B4BDB]/20'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}

                  {tab.count !== undefined && (
                    <span
                      className={`min-w-5 h-5 px-1 rounded-md flex items-center justify-center text-[10px] ${
                        filterType === tab.value
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="p-4 sm:p-6">
            {filteredNotifs.length === 0 ? (
              searchQuery ? (
                <div className="py-14 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>

                  <h4 className="text-sm font-bold text-[#171B2D] mt-4">
                    No matching notifications
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    Try another search term or change your filters.
                  </p>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="mt-4 text-xs font-bold text-[#5B4BDB] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <EmptyState
                  title="You're all caught up!"
                  description="No notifications in this category right now. New scholarship alerts and application updates will appear here."
                  icon={Bell}
                />
              )
            ) : (
              <div className="space-y-3">
                {filteredNotifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(n);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                      !n.read
                        ? 'bg-indigo-50/30 border-indigo-200/80 hover:border-[#5B4BDB]/50'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[#5B4BDB]" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${getIconStyle(
                          n.type
                        )}`}
                      >
                        {getIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-[#171B2D]">
                            {n.title}
                          </h4>

                          {!n.read && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-[#5B4BDB] text-[9px] font-extrabold uppercase tracking-wider">
                              <CircleDot className="w-2.5 h-2.5" />
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {n.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {n.timestamp}
                          </span>

                          <span className="text-slate-300">•</span>

                          <span className="text-[10px] font-bold text-slate-500">
                            {getTypeLabel(n.type)}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {n.link ? (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#5B4BDB] text-slate-400 group-hover:text-white flex items-center justify-center transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        ) : !n.read ? (
                          <div className="w-8 h-8 rounded-lg bg-white border border-indigo-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-[#5B4BDB]" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List Footer */}
            {filteredNotifs.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-[11px] text-slate-400">
                  Showing{' '}
                  <span className="font-bold text-slate-600">
                    {filteredNotifs.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-slate-600">
                    {notifications.length}
                  </span>{' '}
                  notifications
                </p>

                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-[#5B4BDB]" />
                  Stay updated with GRANTLY
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100/80">
          <div className="w-9 h-9 rounded-xl bg-white text-[#5B4BDB] shadow-sm flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#171B2D]">
              Stay one step ahead
            </h4>

            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Check your notifications regularly to stay informed about
              approaching deadlines, document requirements and changes
              to your scholarship applications.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
