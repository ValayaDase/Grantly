'use client';

import React from 'react';
import Link from 'next/link';
import { SearchX, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  actionText,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EEEAFE] flex items-center justify-center text-[#5B4BDB] mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#171B2D] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[#72788A] max-w-md mb-6">{description}</p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B4BDB] text-white text-xs sm:text-sm font-semibold hover:bg-[#4838C2] transition-colors shadow-sm shadow-[#5B4BDB]/20"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B4BDB] text-white text-xs sm:text-sm font-semibold hover:bg-[#4838C2] transition-colors shadow-sm shadow-[#5B4BDB]/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

