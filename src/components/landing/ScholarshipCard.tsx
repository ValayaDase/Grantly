'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface ScholarshipCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export default function ScholarshipCard({
  title,
  icon: Icon,
  color,
  onClick,
}: ScholarshipCardProps) {
  return (
    <div
      className="scholarship-card group cursor-pointer"
      onClick={onClick}
      role="button"
      aria-label={`Explore ${title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={`scholarship-icon ${color}`}>
        <Icon size={28} strokeWidth={2} />
      </div>

      <h3>{title}</h3>

      <span className="card-arrow" aria-hidden="true">
        <ArrowUpRight size={20} />
      </span>
    </div>
  );
}
