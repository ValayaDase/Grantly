'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Logo({ className = '', size = 'md', href = '/' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B4BDB] to-[#7869E6] text-white shadow-md shadow-[#5B4BDB]/25 ${iconSizes[size]}`}>
        <GraduationCap className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4.5 h-4.5' : 'w-6 h-6'} />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18B6A4] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18B6A4]" />
        </span>
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-[#171B2D] flex items-center gap-1 ${sizeClasses[size]}`}>
          GRANTLY
          <Sparkles className="w-3.5 h-3.5 text-[#18B6A4]" />
        </span>
        {size === 'lg' && (
          <span className="text-[10px] font-semibold tracking-wider text-[#72788A] uppercase -mt-1">
            Scholarship Discovery & Vault
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block transition-transform hover:scale-[1.01]">{content}</Link>;
  }

  return content;
}

