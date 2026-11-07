'use client';

import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    primary: 'bg-gradient-to-r from-[#5B4BDB] to-[#7869E6]',
    accent: 'bg-gradient-to-r from-[#18B6A4] to-[#109485]',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-500',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-medium text-[#72788A]">{label}</span>}
          {showPercentage && <span className="font-bold text-[#171B2D]">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${heightStyles[size]} rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

