'use client';

import React from 'react';
import {
  Sparkles,
  Clock,
  Layers,
  FolderLock,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Match Score',
      description:
        'See how recorded education, marks, income, category, gender, and domicile criteria compare with your profile.',
      iconBg: 'bg-[#EEEAFE] text-[#5B4BDB]',
      tag: 'Algorithmic Ranking',
    },
    {
      icon: Clock,
      title: 'Deadline Intelligence',
      description:
        'Dynamic countdowns distinguish "Closing This Week" from "Due This Month" so you prioritize high-urgency schemes before submission gates close.',
      iconBg: 'bg-teal-50 text-teal-600',
      tag: 'Urgency Classification',
    },
    {
      icon: Layers,
      title: 'Side-by-Side Comparison',
      description:
        'Select up to 3 opportunities and contrast award values, eligibility criteria, and required certificates side-by-side in a single synchronized view.',
      iconBg: 'bg-purple-50 text-purple-600',
      tag: 'Decision Matrix',
    },
    {
      icon: FolderLock,
      title: 'Document Vault & Readiness',
      description:
        'Keep document records in your browser and see which required document types are still missing. Files themselves are not stored by this demo.',
      iconBg: 'bg-emerald-50 text-emerald-600',
      tag: 'Privacy Preserved',
    },
    {
      icon: ShieldCheck,
      title: 'Explainable Rule Engine',
      description:
        'Review which recorded criteria match, fail, or need profile details. Confirm current rules with each scholarship provider.',
      iconBg: 'bg-amber-50 text-amber-600',
      tag: 'Deterministic Logic',
    },
    {
      icon: FileCheck2,
      title: 'Application Pipeline',
      description:
        'Move scholarships seamlessly across 7 stages from Planning to Applied and Approved with custom submission notes and portal references.',
      iconBg: 'bg-indigo-50 text-indigo-600',
      tag: 'Complete Lifecycle',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#18B6A4] uppercase tracking-wider">
            Product Innovation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
            Why Indian Students Choose GRANTLY
          </h2>
          <p className="text-sm text-[#72788A]">
            Designed to solve real friction points in Indian higher education grant applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#171B2D]">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

