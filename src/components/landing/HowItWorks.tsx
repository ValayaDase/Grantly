'use client';

import React from 'react';
import { UserCheck, Compass, CheckCircle, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description:
        'Add your education level, current marks/CGPA, family income bracket, and state domicile in under 2 minutes.',
      icon: UserCheck,
      color: 'bg-[#EEEAFE] text-[#5B4BDB]',
      borderHover: 'hover:border-[#5B4BDB]/40',
    },
    {
      step: '02',
      title: 'Discover Scholarships',
      description:
        'Explore curated opportunities with live filters for merit, financial need, girls\' education, and STEM courses.',
      icon: Compass,
      color: 'bg-teal-50 text-teal-600',
      borderHover: 'hover:border-teal-400',
    },
    {
      step: '03',
      title: 'Check Your Eligibility',
      description:
        'Our rule-based engine compares every mandatory requirement to verify if you are Eligible, Potentially Eligible, or Missing Info.',
      icon: CheckCircle,
      color: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-400',
    },
    {
      step: '04',
      title: 'Track Your Applications',
      description:
        'Monitor deadlines, link uploaded vault documents, maintain submission notes, and never miss an award date.',
      icon: BarChart3,
      color: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#5B4BDB] uppercase tracking-wider">
            Seamless 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#171B2D] tracking-tight">
            How GRANTLY Simplifies Your Scholarship Journey
          </h2>
          <p className="text-sm text-[#72788A]">
            We transformed an opaque, fragmented process into a structured, reliable student companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative transition-all duration-300 hover:shadow-md ${item.borderHover} group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.color} font-black text-base flex items-center justify-center`}
                  >
                    {item.step}
                  </div>
                  <Icon className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#171B2D] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

