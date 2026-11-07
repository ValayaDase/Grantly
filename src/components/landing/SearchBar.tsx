'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  placeholder = 'Search scholarships by name, degree, or provider (e.g. Reliance, STEM, Merit)...',
  initialQuery = '',
  className = '',
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else {
      if (trimmed) {
        router.push(`/scholarships?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/scholarships');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <div className="relative w-full flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-[#171B2D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BDB]/25 focus:border-[#5B4BDB] shadow-sm transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

