import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Filter, 
  Download, 
  Layers, 
  MapPin, 
  Activity, 
  Users, 
  Globe 
} from 'lucide-react';
import { INDIAN_DISTRICTS } from '../data/districtsData';
import { ALL_CATEGORIES, InfrastructureCategory } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'rural' | 'urban'>('all');

  const states = useMemo(() => {
    return ['All', ...Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state)))];
  }, []);

  const filteredDistricts = useMemo(() => {
    return INDIAN_DISTRICTS.filter((d) => {
      if (selectedState !== 'All' && d.state !== selectedState) return false;
      if (selectedDemographic === 'rural' && d.ruralPercentage < 70) return false;
      if (selectedDemographic === 'urban' && d.urbanPercentage < 50) return false;
      return true;
    });
  }, [selectedState, selectedDemographic]);

  // Aggregate category counts across filtered districts
  const categoryTotals: Record<string, number> = {};
  filteredDistricts.forEach((d) => {
    Object.entries(d.categoryRequests).forEach(([cat, count]) => {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + count;
    });
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCatCount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  // Language distribution demo data
  const languageData = [
    { lang: 'Tamil', share: 28, count: '6,990', color: 'bg-amber-500' },
    { lang: 'Hindi', share: 24, count: '5,995', color: 'bg-orange-500' },
    { lang: 'Telugu', share: 16, count: '3,997', color: 'bg-blue-500' },
    { lang: 'Kannada', share: 14, count: '3,497', color: 'bg-emerald-500' },
    { lang: 'Bengali', share: 8, count: '1,998', color: 'bg-indigo-500' },
    { lang: 'Marathi', share: 6, count: '1,498', color: 'bg-purple-500' },
    { lang: 'English / Other', share: 4, count: '1,007', color: 'bg-slate-400' },
  ];

  // Monthly timeline trend
  const timelineData = [
    { month: 'Oct 2025', count: 2400 },
    { month: 'Nov 2025', count: 3100 },
    { month: 'Dec 2025', count: 3800 },
    { month: 'Jan 2026', count: 4400 },
    { month: 'Feb 2026', count: 5100 },
    { month: 'Mar 2026', count: 5840 },
  ];

  const maxTimeline = 6000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              National Infrastructure Analytics
            </span>
            <span className="text-xs text-slate-500">· Comprehensive Sectoral Breakdown</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Analytics & Evidence Explorer
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Filter citizen request velocity, linguistic distributions, urban-rural divides, 
            and infrastructure deficit correlations across all 112 monitored districts.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold block">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold block">Demographic:</span>
            <select
              value={selectedDemographic}
              onChange={(e) => setSelectedDemographic(e.target.value as any)}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
            >
              <option value="all">All Demographics</option>
              <option value="rural">Predominantly Rural (&gt;70%)</option>
              <option value="urban">Predominantly Urban (&gt;50%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Requests by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Citizen Demand by Infrastructure Sector
              </h3>
              <p className="text-xs text-slate-500">Total volume across selected districts</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {filteredDistricts.length} Districts
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {sortedCategories.map(([cat, count]) => {
              const widthPct = Math.round((count / maxCatCount) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-600 font-bold">
                      {count.toLocaleString('en-IN')} requests
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Requests Over Time (Growth Velocity) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Citizen Voice Ingestion Velocity (MoM)
              </h3>
              <p className="text-xs text-slate-500">Monthly progression of verified citizen requests</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +143% 6-Month Surge
            </span>
          </div>

          <div className="pt-6 flex items-end justify-between h-48 gap-3 border-b border-slate-200 pb-2">
            {timelineData.map((d, i) => {
              const heightPct = Math.round((d.count / maxTimeline) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-600 font-bold">
                    {d.count.toLocaleString('en-IN')}
                  </span>
                  <div
                    className="w-full max-w-[40px] bg-slate-900 hover:bg-amber-500 rounded-t transition-all"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[10px] text-slate-500 text-center truncate w-full">
                    {d.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Language Diversity Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Multilingual Ingestion Breakdown
              </h3>
              <p className="text-xs text-slate-500">Citizen input across 8+ Indian official languages</p>
            </div>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3 pt-2">
            {languageData.map((l) => (
              <div key={l.lang} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-800">{l.lang}</span>
                  <span className="font-mono text-slate-600">
                    {l.count} ({l.share}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${l.color} h-full rounded-full`}
                    style={{ width: `${l.share * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Capital Alignment Scatter & Ranking */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Top Priority Districts by Deficit Mismatch
              </h3>
              <p className="text-xs text-slate-500">High citizen demand vs lowest public Capex coverage</p>
            </div>
            <span className="text-xs font-mono text-red-600 font-bold">Top 5 Action Targets</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {INDIAN_DISTRICTS.slice(0, 5).map((dist, idx) => (
              <div
                key={dist.districtId}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{dist.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {dist.state} · Primary Gap: {dist.topGaps[0]}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-red-600 text-sm block">
                    {dist.priorityIndex}/100
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ₹{dist.currentAnnualCapexCr}Cr Capex
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
