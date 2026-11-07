
'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Bookmark,
  Sparkles,
  CalendarClock,
  IndianRupee,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Heart,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
} from 'lucide-react';

type SortOption = 'deadline' | 'amount' | 'match';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export default function SavedScholarshipsPage() {
  const { savedScholarshipIds, allScholarships } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [searchQuery, setSearchQuery] = useState('');

  const savedList = useMemo(
    () => allScholarships.filter((s) => savedScholarshipIds.includes(s.id)),
    [allScholarships, savedScholarshipIds]
  );

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = savedList.filter((scholarship) => {
      if (!query) return true;

      return (
        scholarship.title?.toLowerCase().includes(query) ||
        scholarship.provider?.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }

      if (sortBy === 'deadline') {
        return (
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      // The original implementation used award amount for this option.
      // Keep that behavior until a real match-score field is available.
      return b.amount - a.amount;
    });
  }, [savedList, sortBy, searchQuery]);

  const totalAwardValue = savedList.reduce(
    (total, scholarship) => total + (scholarship.amount || 0),
    0
  );

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: typeof TrendingUp;
  }[] = [
    { value: 'match', label: 'Highest Value', icon: TrendingUp },
    { value: 'deadline', label: 'Deadline Soonest', icon: CalendarClock },
    { value: 'amount', label: 'Award Amount', icon: IndianRupee },
  ];

  return (
    <DashboardLayout
      title="Saved Scholarships"
      subtitle={`You have bookmarked ${savedList.length} scholarship opportunities to review and apply.`}
    >
      <div className="max-w-7xl mx-auto space-y-7 pb-10">

        {/* HERO SECTION */}
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[28px] bg-[#17152F] text-white p-6 sm:p-8 lg:p-10 shadow-xl"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(91,75,219,0.4),transparent_50%),radial-gradient(ellipse_at_90%_90%,rgba(24,182,164,0.2),transparent_45%)]" />

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { y: [0, -15, 0], x: [0, 10, 0] }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -right-16 -top-24 w-80 h-80 rounded-full border border-white/[0.07]"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { rotate: [0, 360] }
            }
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute right-24 bottom-[-130px] w-72 h-72 rounded-full border border-dashed border-[#18B6A4]/20"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18B6A4]/10 border border-[#18B6A4]/20 text-[#65E0CF] text-[10px] font-bold tracking-[0.16em]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                YOUR PERSONAL COLLECTION
              </motion.div>

              <motion.h2
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight"
              >
                Opportunities
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A99CFF] to-[#4DD9C7]">
                  worth keeping.
                </span>
              </motion.h2>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-sm text-white/55 leading-7 max-w-lg"
              >
                Keep track of scholarships that caught your attention.
                Compare opportunities, check deadlines and plan your next move.
              </motion.p>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
                  <BookmarkCheck className="w-4 h-4 text-[#65E0CF]" />
                  Your saved collection
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30 self-center" />
                <div className="flex items-center gap-2 text-xs font-semibold text-white/75">
                  <Heart className="w-4 h-4 text-pink-300" />
                  Opportunities you like
                </div>
              </motion.div>
            </div>

            {/* Hero illustration */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="hidden sm:flex shrink-0 items-center justify-center relative w-44 h-44 lg:w-52 lg:h-52"
            >
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-5 rounded-full border border-dashed border-[#18B6A4]/30" />

              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : { y: [0, -9, 0] }
                }
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-28 lg:w-32 lg:h-32 rounded-[32px] bg-gradient-to-br from-[#6D5CE7] to-[#18B6A4] flex items-center justify-center shadow-2xl shadow-[#5B4BDB]/40 border border-white/20"
              >
                <Bookmark className="w-14 h-14 text-white" fill="rgba(255,255,255,0.18)" />
              </motion.div>

              <div className="absolute top-2 right-0 w-10 h-10 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#65E0CF]" />
              </div>

              <div className="absolute bottom-3 left-0 w-10 h-10 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#A99CFF]" />
              </div>
            </motion.div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5B4BDB] via-[#18B6A4] to-[#5B4BDB]" />
        </motion.section>

        {/* STATS */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              label: 'Saved Opportunities',
              value: savedList.length.toString(),
              icon: Bookmark,
              color: 'purple',
              description: 'Your bookmarked scholarships',
            },
            {
              label: 'Total Award Value',
              value: `₹${totalAwardValue.toLocaleString('en-IN')}`,
              icon: IndianRupee,
              color: 'teal',
              description: 'Combined listed award amounts',
            },
            {
              label: 'Available to Review',
              value: filteredList.length.toString(),
              icon: GraduationCap,
              color: 'blue',
              description: 'Matching your current search',
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-[#171B2D] mt-2 break-all">
                      {stat.value}
                    </p>
                  </div>

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    stat.color === 'purple'
                      ? 'bg-[#EEEAFE] text-[#5B4BDB]'
                      : stat.color === 'teal'
                        ? 'bg-[#E8F8F5] text-[#18B6A4]'
                        : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-3">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* TOOLBAR */}
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm"
        >
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] flex items-center justify-center">
                <BookmarkCheck className="w-5 h-5 text-[#5B4BDB]" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#171B2D]">
                  Bookmarked Schemes
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {savedList.length} scholarships in your collection
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved scholarships..."
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#171B2D] outline-none focus:border-[#5B4BDB] focus:ring-4 focus:ring-[#5B4BDB]/10 transition-all"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#F8F9FC] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#171B2D] font-bold outline-none focus:border-[#5B4BDB] transition-all cursor-pointer"
                >
                  <option value="match">Highest Value</option>
                  <option value="deadline">Deadline Soonest</option>
                  <option value="amount">Award Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sort pills */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 mr-1">
              QUICK SORT
            </span>

            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                    isActive
                      ? 'bg-[#5B4BDB] text-white shadow-md shadow-[#5B4BDB]/20'
                      : 'bg-slate-50 text-slate-500 hover:bg-[#EEEAFE] hover:text-[#5B4BDB]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* SCHOLARSHIP LIST */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-black text-[#171B2D]">
                Your Collection
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {filteredList.length} {filteredList.length === 1 ? 'opportunity' : 'opportunities'} found
              </p>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-bold text-[#5B4BDB] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {savedList.length === 0 ? (
              <motion.div
                key="empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-8"
              >
                <EmptyState
                  title="No scholarships saved yet"
                  description="Explore our curated catalog of Indian scholarships and click the bookmark icon to save opportunities here for later comparison."
                  actionText="Discover Scholarships"
                  actionHref="/scholarships"
                  icon={Bookmark}
                />
              </motion.div>
            ) : filteredList.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EEEAFE] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-[#5B4BDB]" />
                </div>

                <h3 className="text-sm font-bold text-[#171B2D]">
                  No matching scholarships
                </h3>

                <p className="text-xs text-slate-400 mt-2">
                  Try a different scholarship name or provider.
                </p>

                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-5 text-xs font-bold text-[#5B4BDB] hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${sortBy}-${searchQuery}`}
                variants={containerVariants}
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filteredList.map((scholarship) => (
                  <motion.div
                    key={scholarship.id}
                    layout={!shouldReduceMotion}
                    variants={cardVariants}
                    whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                    className="h-full"
                  >
                    <ScholarshipCard
                      scholarship={scholarship}
                      viewMode="grid"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM DISCOVERY CTA */}
        {savedList.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-[#5B4BDB]/10 bg-gradient-to-r from-[#EEEAFE] via-white to-[#E8F8F5] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#5B4BDB]" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#171B2D]">
                  Still looking for the right opportunity?
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Explore more scholarships and add them to your collection.
                </p>
              </div>
            </div>

            <motion.a
              href="/scholarships"
              whileHover={shouldReduceMotion ? undefined : { x: 3 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5B4BDB] text-white text-xs font-bold shadow-lg shadow-[#5B4BDB]/20 hover:bg-[#4838C2] transition-colors shrink-0"
            >
              Explore Scholarships
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
