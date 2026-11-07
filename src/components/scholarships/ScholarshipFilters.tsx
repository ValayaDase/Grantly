'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { INDIAN_STATES } from '@/data/scholarships';
import { RotateCcw, X, SlidersHorizontal } from 'lucide-react';

interface ScholarshipFiltersProps {
  totalResults: number;
}

export function ScholarshipFilters({ totalResults }: ScholarshipFiltersProps) {
  const { filters, updateFilter, resetFilters } = useApp();

  const educationOptions = [
    'All',
    'Undergraduate',
    'Higher Secondary (Class 11-12)',
    'Postgraduate',
    'School (Class 9-10)',
    'Diploma / Vocational',
  ];

  const categoryOptions = [
    'All',
    'Merit-Based',
    'Need-Based',
    'STEM & Tech',
    'Women Empowerment',
    'Minority Welfare',
    'Higher Education',
    'Research & Innovation',
  ];

  const providerOptions = ['All', 'Government', 'Corporate CSR', 'Trust / NGO'];

  // Check if any non-default filters are active
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.educationLevel !== 'All' ||
    filters.category !== 'All' ||
    filters.providerType !== 'All' ||
    filters.state !== 'All India' ||
    filters.gender !== 'All' ||
    filters.onlyEligible;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#5B4BDB]" />
          <h3 className="text-sm font-bold text-[#171B2D]">Filter Opportunities</h3>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {totalResults} found
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#5B4BDB] hover:text-[#4838C2] font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pb-2">
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#EEEAFE] text-[#5B4BDB] px-2.5 py-1 rounded-full font-medium">
              Search: &quot;{filters.searchQuery}&quot;
              <button onClick={() => updateFilter('searchQuery', '')}>
                <X className="w-3 h-3 hover:text-slate-800" />
              </button>
            </span>
          )}
          {filters.educationLevel !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
              {filters.educationLevel}
              <button onClick={() => updateFilter('educationLevel', 'All')}>
                <X className="w-3 h-3 hover:text-indigo-900" />
              </button>
            </span>
          )}
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
              {filters.category}
              <button onClick={() => updateFilter('category', 'All')}>
                <X className="w-3 h-3 hover:text-teal-900" />
              </button>
            </span>
          )}
          {filters.providerType !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
              {filters.providerType}
              <button onClick={() => updateFilter('providerType', 'All')}>
                <X className="w-3 h-3 hover:text-amber-900" />
              </button>
            </span>
          )}
          {filters.state !== 'All India' && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
              State: {filters.state}
              <button onClick={() => updateFilter('state', 'All India')}>
                <X className="w-3 h-3 hover:text-slate-900" />
              </button>
            </span>
          )}
          {filters.onlyEligible && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
              Only Eligible
              <button onClick={() => updateFilter('onlyEligible', false)}>
                <X className="w-3 h-3 hover:text-emerald-900" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter 1: Education Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Education Level
        </label>
        <select
          value={filters.educationLevel}
          onChange={(e) => updateFilter('educationLevel', e.target.value)}
          className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D] font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20"
        >
          {educationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 2: Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Scholarship Focus
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D] font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20"
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 3: Provider Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Provider Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {providerOptions.map((p) => {
            const isSelected = filters.providerType === p;
            return (
              <button
                key={p}
                onClick={() => updateFilter('providerType', p)}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                  isSelected
                    ? 'bg-[#5B4BDB] text-white border-[#5B4BDB] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 4: State Domicile */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          State / Domicile
        </label>
        <select
          value={filters.state}
          onChange={(e) => updateFilter('state', e.target.value)}
          className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D] font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/20"
        >
          {INDIAN_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Filter 5: Gender */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Gender Eligibility
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['All', 'female', 'Any'].map((g) => {
            const isSelected = filters.gender === g;
            return (
              <button
                key={g}
                onClick={() => updateFilter('gender', g)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border capitalize transition-all ${
                  isSelected
                    ? 'bg-[#18B6A4] text-white border-[#18B6A4] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {g === 'female' ? 'Girls Only' : g === 'Any' ? 'Open' : 'All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 6: Only Eligible Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyEligible}
            onChange={(e) => updateFilter('onlyEligible', e.target.checked)}
            className="w-4 h-4 rounded text-[#5B4BDB] focus:ring-[#5B4BDB]"
          />
          <span className="text-xs font-bold text-[#171B2D]">
            Only show scholarships I am Eligible for
          </span>
        </label>
      </div>
    </div>
  );
}
