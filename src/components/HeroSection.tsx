import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Layers, 
  Play, 
  Users, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Cpu, 
  Mic, 
  Languages,
  RotateCcw,
  PlusCircle,
  LocateFixed,
  KeyRound,
  LogIn
} from 'lucide-react';
import { NATIONAL_TOTALS } from '../data/districtsData';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenDemoTour: () => void;
  liveStats?: {
    totalCitizenRequests: number;
    activeDevelopmentNeeds: number;
    highPriorityHotspots: number;
    districtsAnalysed: number;
    requestsThisMonth: number;
    aiRecommendations: number;
    estimatedCitizensImpacted: number;
  };
  onResetToZero?: () => void;
  onLoadPilotRecords?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onNavigate, 
  onOpenDemoTour,
  liveStats = NATIONAL_TOTALS,
  onResetToZero,
  onLoadPilotRecords,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
        {/* Top Tagline Pill */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>National Infrastructure Priority Engine for India</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real Data Verification: Live Counts Only</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span>Real OpenStreetMap & Browser GPS Geolocation</span>
          </div>
        </div>

        {/* Hero Title & Subheading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Turn Citizen Voice into <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400">
                Infrastructure Intelligence.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              JanSetu AI brings multilingual citizen development needs, infrastructure indicators, 
              and public capital investment data together to help decision-makers identify demand hotspots 
              and deploy high-impact public works where communities need them most.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('citizen-dashboard')}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Users className="w-4 h-4" />
                <span>Citizen Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('government-dashboard')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                <Cpu className="w-4 h-4" />
                <span>Government Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('infrastructure-map')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 flex items-center gap-2 transition-all hover:border-slate-600"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Real GIS Map</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all hover:border-amber-500/40"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Login Auth</span>
              </button>

              <button
                onClick={onOpenDemoTour}
                className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-semibold text-sm border border-amber-500/30 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current text-amber-400" />
                <span>10-Step Tour</span>
              </button>
            </div>
          </div>

          {/* Quick Problem vs Solution Architecture Box */}
          <div className="lg:col-span-4 bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/60 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
              <span className="text-slate-400 uppercase tracking-wider font-semibold">DPG Real Data Assurance</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-1">Live Actual Numbers:</span>
                <p className="text-slate-300 leading-snug">
                  All counters below reflect genuine stored and user-submitted requests. No fabricated figures or inflated totals.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {onResetToZero && (
                  <button
                    onClick={onResetToZero}
                    className="flex-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Set all counts to clean 0"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Clear to 0</span>
                  </button>
                )}
                {onLoadPilotRecords && (
                  <button
                    onClick={onLoadPilotRecords}
                    className="flex-1 px-2.5 py-1.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                    title="Load verified field records"
                  >
                    <PlusCircle className="w-3 h-3 text-blue-400" />
                    <span>Load Pilot Records</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live KPI Metric Strip - Actual Real Counts */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Actual Live Metrics (Real Ingestion Count)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              {liveStats.totalCitizenRequests === 0 ? 'Blank live slate: 0 requests recorded' : `Live count: ${liveStats.totalCitizenRequests} recorded`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Total Citizen Requests</span>
              <span className="text-xl sm:text-2xl font-bold text-white mt-1 block font-mono">
                {liveStats.totalCitizenRequests.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Real Recorded
              </span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Active Needs</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 block font-mono">
                {liveStats.activeDevelopmentNeeds.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Pending Review</span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Priority Hotspots</span>
              <span className="text-xl sm:text-2xl font-bold text-red-400 mt-1 block font-mono">
                {liveStats.highPriorityHotspots}
              </span>
              <span className="text-[10px] text-red-300/80 mt-0.5 block">Active clusters</span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Districts Analysed</span>
              <span className="text-xl sm:text-2xl font-bold text-white mt-1 block font-mono">
                {liveStats.districtsAnalysed}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">With citizen demand</span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Requests This Month</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-400 mt-1 block font-mono">
                {liveStats.requestsThisMonth.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-300/80 mt-0.5 block">Voice & text submissions</span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">AI Recommendations</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 block font-mono">
                {liveStats.aiRecommendations}
              </span>
              <span className="text-[10px] text-emerald-300/80 mt-0.5 block">Evidence-backed</span>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 col-span-2 sm:col-span-4 lg:col-span-1 hover:border-slate-700 transition-colors">
              <span className="text-[11px] text-slate-400 block font-medium">Citizens Impacted</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-300 mt-1 block font-mono">
                {liveStats.estimatedCitizensImpacted > 0 ? liveStats.estimatedCitizensImpacted.toLocaleString('en-IN') : '0'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct reach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
