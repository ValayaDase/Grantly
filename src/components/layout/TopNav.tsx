'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface TopNavProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export function TopNav({ onOpenMobileMenu, title, subtitle }: TopNavProps) {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead, stats, profile } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/scholarships?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <div>
            <h1 className="text-base sm:text-xl font-bold text-[#171B2D] tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-[#72788A] hidden sm:block">{subtitle}</p>}
          </div>
        ) : (
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider">
              Student Workspace
            </span>
            <div className="text-sm font-bold text-[#171B2D]">
              Welcome back, {profile?.fullName?.split(' ')[0] || 'Scholar'}
            </div>
          </div>
        )}
      </div>

      {/* Center / Right: Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholarships, grants..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-9.5 pr-4 py-2 text-xs sm:text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20 focus:border-[#5B4BDB] transition-all"
          />
        </form>

        {/* Quick Explore Action */}
        <Link
          href="/scholarships"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEEAFE] text-[#5B4BDB] text-xs font-bold hover:bg-[#5B4BDB] hover:text-white transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover</span>
        </Link>

        {/* Notifications Popover Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {stats.unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#171B2D]">Notifications</h4>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-bold bg-[#EEEAFE] text-[#5B4BDB] px-2 py-0.5 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-[#5B4BDB] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) router.push(n.link);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#F8F9FC]/80 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-[#171B2D] text-xs line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-xs text-[#5B4BDB] hover:underline font-bold inline-flex items-center gap-1"
                >
                  View All Notifications
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/60"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5B4BDB] to-[#18B6A4] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {profile?.fullName?.charAt(0) || 'P'}
          </div>
          <span className="text-xs font-bold text-[#171B2D] hidden md:inline">
            {profile?.fullName?.split(' ')[0] || 'Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
}
