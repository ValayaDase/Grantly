'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

export function AnalyticsChart() {
  const { applications, allScholarships, savedScholarshipIds } = useApp();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'categories'>('pipeline');

  // Pipeline Data: counts per application stage
  const pipelineStages = [
    { name: 'Saved', key: 'Saved', color: '#818CF8' },
    { name: 'Planning', key: 'Planning to Apply', color: '#A78BFA' },
    { name: 'Applied', key: 'Applied', color: '#3B82F6' },
    { name: 'In Review', key: 'Under Review', color: '#F59E0B' },
    { name: 'Shortlisted', key: 'Shortlisted', color: '#10B981' },
    { name: 'Approved', key: 'Approved', color: '#059669' },
  ];

  const pipelineData = pipelineStages.map((stage) => {
    const count =
      stage.name === 'Saved'
        ? savedScholarshipIds.length
        : applications.filter((a) => a.status === stage.key).length;
    return {
      stage: stage.name,
      count,
      color: stage.color,
    };
  });

  // Category Distribution Data
  const categoryCounts: Record<string, { count: number; totalAmount: number }> = {};
  allScholarships.forEach((s) => {
    if (!categoryCounts[s.category]) {
      categoryCounts[s.category] = { count: 0, totalAmount: 0 };
    }
    categoryCounts[s.category].count += 1;
    categoryCounts[s.category].totalAmount += s.amount;
  });

  const categoryColors = ['#5B4BDB', '#18B6A4', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6', '#10B981'];

  const categoryData = Object.entries(categoryCounts).map(([cat, val], idx) => ({
    name: cat,
    value: val.count,
    amount: val.totalAmount,
    color: categoryColors[idx % categoryColors.length],
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#171B2D]">Application Pipeline & Pool Analytics</h3>
          <p className="text-xs text-slate-500">Visual progress of tracked applications and available grant categories</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-white text-[#5B4BDB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stages</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-white text-[#5B4BDB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        {activeTab === 'pipeline' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fill: '#72788A', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#72788A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-[#171B2D] text-white text-xs rounded-xl shadow-xl border border-slate-700">
                        <div className="font-bold">{data.stage} Phase</div>
                        <div className="text-indigo-300 font-extrabold text-sm mt-0.5">
                          {data.count} {data.count === 1 ? 'Scholarship' : 'Scholarships'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-full">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#171B2D] text-white text-xs rounded-xl shadow-xl border border-slate-700">
                            <div className="font-bold">{data.name}</div>
                            <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                              {data.value} Opportunities
                            </div>
                            <div className="text-slate-300 text-[10px]">
                              Total Pool: ₹{data.amount.toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-xs text-xs">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                  <span className="font-bold text-slate-800">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

