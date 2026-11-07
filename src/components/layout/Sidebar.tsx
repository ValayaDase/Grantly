'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/common/Logo';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  BookmarkCheck,
  CheckCircle,
  FolderLock,
  Bell,
  UserCheck,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { profile, stats } = useApp();

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Discover Scholarships',
      href: '/scholarships',
      icon: Compass,
    },
    {
      label: 'My Applications',
      href: '/applications',
      icon: FileCheck2,
      badge: stats.applicationsCount > 0 ? stats.applicationsCount : undefined,
      badgeColor: 'bg-[#5B4BDB] text-white',
    },
    {
      label: 'Saved Scholarships',
      href: '/saved',
      icon: BookmarkCheck,
      badge: stats.savedCount > 0 ? stats.savedCount : undefined,
      badgeColor: 'bg-indigo-100 text-[#5B4BDB]',
    },
    {
      label: 'Eligibility Checker',
      href: '/eligibility',
      icon: CheckCircle,
    },
    {
      label: 'Document Vault',
      href: '/documents',
      icon: FolderLock,
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: stats.unreadNotificationsCount > 0 ? stats.unreadNotificationsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'My Profile',
      href: '/profile',
      icon: UserCheck,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 sm:w-72 h-screen flex flex-col justify-between bg-white border-r border-slate-200/80 shrink-0 select-none z-30">
      {/* Top Header */}
      <div>
        <div className="h-16 sm:h-20 flex items-center px-6 border-b border-slate-100">
          <Logo size="md" href="/dashboard" />
        </div>

        {/* Navigation items */}
        <div className="py-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5B4BDB] text-white shadow-md shadow-[#5B4BDB]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5B4BDB] to-[#18B6A4] flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm shrink-0">
              {profile?.fullName?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#171B2D] truncate">
                {profile?.fullName || 'Student'}
              </div>
              <div className="text-[11px] text-[#72788A] truncate">
                {profile?.educationLevel || 'Undergraduate'}
              </div>
            </div>
          </div>
          <Link
            href="/settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Profile Completion indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#72788A]">Profile Strength</span>
            <span className="font-bold text-[#5B4BDB]">{stats.profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#5B4BDB] h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.profileCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
