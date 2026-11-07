'use client';

import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { ScholarshipFilters } from '@/components/scholarships/ScholarshipFilters';
import { EmptyState } from '@/components/common/EmptyState';
import { calculateMatchScore } from '@/lib/matchScore';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { EducationLevel, FilterState } from '@/types';
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react';

function ScholarshipsContent() {
  const searchParams = useSearchParams();
  const { allScholarships, filters, updateFilter, profile } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync initial query parameter from top search bar if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      updateFilter('searchQuery', q);
    }
  }, [searchParams, updateFilter]);

  // Combined Search, Multi-Filter & Sorting Engine
  const filteredScholarships = useMemo(() => {
    let result = [...allScholarships];

    // 1. Keyword search (title, provider, category, courses, description)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.provider.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.shortDescription.toLowerCase().includes(query) ||
          s.courses.some((c) => c.toLowerCase().includes(query)) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // 2. Education Level filter
    if (filters.educationLevel !== 'All') {
      result = result.filter((s) => s.educationLevels.includes(filters.educationLevel as EducationLevel));
    }

    // 3. Category filter
    if (filters.category !== 'All') {
      result = result.filter((s) => s.category === filters.category);
    }

    // 4. Provider Type filter
    if (filters.providerType !== 'All') {
      result = result.filter((s) => s.providerType === filters.providerType);
    }

    // 5. State Domicile filter
    if (filters.state !== 'All India') {
      result = result.filter(
        (s) =>
          !s.eligibilityCriteria.states ||
          s.eligibilityCriteria.states.includes('All India') ||
          s.eligibilityCriteria.states.includes(filters.state)
      );
    }

    // 6. Gender filter
    if (filters.gender !== 'All') {
      result = result.filter((s) => {
        if (!s.eligibilityCriteria.gender) return true;
        if (s.eligibilityCriteria.gender === 'Any') return true;
        return s.eligibilityCriteria.gender.toLowerCase() === filters.gender.toLowerCase();
      });
    }

    // 7. Min Amount filter
    if (filters.minAmount > 0) {
      result = result.filter((s) => s.amount >= filters.minAmount);
    }

    // 8. Family Income Limit filter
    if (filters.maxIncome && filters.maxIncome < 1500000) {
      result = result.filter(
        (s) =>
          !s.eligibilityCriteria.maxIncome ||
          s.eligibilityCriteria.maxIncome >= filters.maxIncome
      );
    }

    // 9. Only Eligible filter
    if (filters.onlyEligible) {
      result = result.filter((s) => {
        const rep = evaluateScholarshipEligibility(s, profile);
        return rep.status === 'ELIGIBLE';
      });
    }

    // 10. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'highest_amount') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'deadline_soon') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (filters.sortBy === 'recently_added') {
        return b.id.localeCompare(a.id);
      }
      // Default: 'recommended' by Match Score
      const matchA = calculateMatchScore(a, profile).totalScore;
      const matchB = calculateMatchScore(b, profile).totalScore;
      return matchB - matchA;
    });

    return result;
  }, [allScholarships, filters, profile]);

  const paginatedList = filteredScholarships.slice(0, visibleCount);
  const hasMore = visibleCount < filteredScholarships.length;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Search, View Mode, Sorting */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, provider, course or tag..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-9.5 pr-4 py-2 text-xs sm:text-sm text-[#171B2D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20"
          />
        </div>

        {/* Right actions: Sorting & View Mode */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-[#5B4BDB]" />
            Filters
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
              className="bg-[#F8F9FC] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#171B2D] font-bold focus:outline-none"
            >
              <option value="recommended">Sort: Best AI Match</option>
              <option value="deadline_soon">Sort: Deadline Soonest</option>
              <option value="highest_amount">Sort: Highest Value</option>
              <option value="recently_added">Sort: Recently Added</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-[#5B4BDB]' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-[#5B4BDB]' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar Filter + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ScholarshipFilters totalResults={filteredScholarships.length} />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <ScholarshipFilters totalResults={filteredScholarships.length} />
          </div>
        )}

        {/* Cards Area */}
        <div className="lg:col-span-3 space-y-6">
          {filteredScholarships.length === 0 ? (
            <EmptyState
              title="No scholarships match your filters"
              description="Try loosening your search query, selecting 'All' education levels, or resetting the income filter."
              actionText="Reset All Filters"
              onAction={() => {
                updateFilter('searchQuery', '');
                updateFilter('educationLevel', 'All');
                updateFilter('category', 'All');
                updateFilter('providerType', 'All');
                updateFilter('state', 'All India');
                updateFilter('gender', 'All');
                updateFilter('onlyEligible', false);
              }}
            />
          ) : (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                    : 'flex flex-col space-y-4'
                }
              >
                {paginatedList.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-[#171B2D] shadow-xs transition-colors"
                  >
                    Load More Scholarships ({filteredScholarships.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  const { allScholarships } = useApp();

  return (
    <DashboardLayout
      title="Scholarship Discovery"
      subtitle={`Explore ${allScholarships.length} verified Indian scholarships with personalized AI Match scores.`}
    >
      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading discovery catalog...</div>}>
        <ScholarshipsContent />
      </Suspense>
    </DashboardLayout>
  );
}
