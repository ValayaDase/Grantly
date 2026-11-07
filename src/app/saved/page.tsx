'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bookmark } from 'lucide-react';

export default function SavedScholarshipsPage() {
  const { savedScholarshipIds, allScholarships } = useApp();
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'match'>('match');

  const savedList = allScholarships.filter((s) => savedScholarshipIds.includes(s.id));

  // Sorting
  const sortedList = [...savedList].sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    return b.amount - a.amount;
  });

  return (
    <DashboardLayout
      title="Saved Scholarships"
      subtitle={`You have bookmarked ${savedList.length} scholarship opportunities to review and apply.`}
    >
      <div className="space-y-6">
        {/* Top Header & Sort Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#5B4BDB]" />
            <h3 className="text-sm font-bold text-[#171B2D]">
              Bookmarked Schemes ({savedList.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline' | 'amount' | 'match')}
              className="bg-[#F8F9FC] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#171B2D] font-bold focus:outline-none"
            >
              <option value="match">Highest Value</option>
              <option value="deadline">Deadline Soonest</option>
              <option value="amount">Award Amount</option>
            </select>
          </div>
        </div>

        {/* Saved List or Empty State */}
        {savedList.length === 0 ? (
          <EmptyState
            title="No scholarships saved yet"
            description="Explore our curated catalog of Indian scholarships and click the bookmark icon to save opportunities here for later comparison."
            actionText="Discover Scholarships"
            actionHref="/scholarships"
            icon={Bookmark}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedList.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
