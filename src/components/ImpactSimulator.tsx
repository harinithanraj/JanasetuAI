import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  ArrowRight,
  Activity,
  Users,
  DollarSign
} from 'lucide-react';
import { INDIAN_DISTRICTS } from '../data/districtsData';
import { InfrastructureCategory } from '../types';

interface ImpactSimulatorProps {
  initialDistrict?: string;
}

export const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({ initialDistrict }) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState(
    initialDistrict || 'Dharmapuri'
  );

  const INTERVENTIONS = [
    {
      id: 'INT-HEALTH-01',
      title: 'Add 50-Bed Community Health Centre & 4 ALS Ambulances',
      category: 'Healthcare' as InfrastructureCategory,
      costCr: 18.5,
      reachMultiplier: 0.12,
      accessibilityBoost: 68,
      gapReduction: 42,
      roi: 9.2,
      benefits: [
        'Cuts average emergency obstetric transit time from 78 to 16 minutes',
        'Directly addresses 540+ citizen healthcare distress petitions',
        'Provides 24x7 maternal delivery and trauma stabilization units',
      ],
    },
    {
      id: 'INT-ROADS-01',
      title: 'Construct 42km PMGSY All-Weather Concrete Ghat Road',
      category: 'Roads' as InfrastructureCategory,
      costCr: 24.0,
      reachMultiplier: 0.09,
      accessibilityBoost: 82,
      gapReduction: 55,
      roi: 9.5,
      benefits: [
        'Eliminates manual doli carrying of patients across 74 tribal hamlets',
        'Ensures 100% all-season vehicular access for farm produce',
        'Directly resolves 390+ isolation and school severance complaints',
      ],
    },
    {
      id: 'INT-WATER-01',
      title: 'Install 35 MLD Multi-Village Surface Water Treatment Grid',
      category: 'Water' as InfrastructureCategory,
      costCr: 32.0,
      reachMultiplier: 0.16,
      accessibilityBoost: 74,
      gapReduction: 48,
      roi: 8.9,
      benefits: [
        'Supplies safe fluoride-free piped potable water to 84 villages',
        'Completely halts tanker reliance during summer drought spells',
        'Addresses 460+ citizen drinking water petitions',
      ],
    },
    {
      id: 'INT-FLOOD-01',
      title: 'Construct 16km Geo-Tube Flood Bund & High-Level Culverts',
      category: 'Flood management' as InfrastructureCategory,
      costCr: 28.0,
      reachMultiplier: 0.14,
      accessibilityBoost: 79,
      gapReduction: 50,
      roi: 9.1,
      benefits: [
        'Prevents annual monsoon inundation across 36 agrarian villages',
        'Keeps arterial highway open during peak river discharge',
        'Directly addresses 510+ flood marooning complaints',
      ],
    },
    {
      id: 'INT-CONNECT-01',
      title: 'Deploy 18 Solar 4G Telecom Towers & Aerial Optical Fiber',
      category: 'Internet/connectivity' as InfrastructureCategory,
      costCr: 12.0,
      reachMultiplier: 0.08,
      accessibilityBoost: 88,
      gapReduction: 62,
      roi: 8.6,
      benefits: [
        'Connects 52 remote tribal ashram schools to high-speed digital education',
        'Enables direct benefit transfers (DBT) and telemedicine consultations',
        'Addresses 180+ citizen telecom blackspot complaints',
      ],
    },
  ];

  const [selectedIntervention, setSelectedIntervention] = useState(INTERVENTIONS[0]);

  const currentDistrict =
    INDIAN_DISTRICTS.find((d) => d.name === selectedDistrictName) || INDIAN_DISTRICTS[0];

  const estimatedBenefitedCitizens = Math.round(
    currentDistrict.population * selectedIntervention.reachMultiplier
  );

  const relatedRequestsAddressed = Math.round(
    (currentDistrict.categoryRequests[selectedIntervention.category] || 300) * 0.85
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Policymaker Decision Support Simulation
            </span>
            <span className="text-xs text-slate-500">· Predictive Capex Model</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Infrastructure Impact Simulator
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Evaluate how proposed public infrastructure interventions reduce citizen demand backlogs, 
            bridge accessibility deficits, and generate social return on capital.
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Target District:
          </span>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded font-bold text-slate-900"
          >
            {INDIAN_DISTRICTS.map((d) => (
              <option key={d.districtId} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prominent Mandatory Disclaimer Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900">
          <span className="font-bold block">
            Scenario simulation based on synthetic/demo data. Not an official forecast.
          </span>
          <p className="mt-0.5 text-blue-800/90 leading-relaxed">
            Estimates model demographic accessibility curves and citizen request closure rates based on benchmark 
            capital intensity metrics.
          </p>
        </div>
      </div>

      {/* Main Grid: Interventions Selector & Dynamic Output Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interventions Options */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Select a Proposed Public Works Intervention:
          </span>

          {INTERVENTIONS.map((item) => {
            const isSelected = selectedIntervention.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedIntervention(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="font-mono text-purple-700 font-bold">
                    Est. Capex: ₹{item.costCr} Cr
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mt-2">
                  {item.title}
                </h4>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Accessibility Boost: +{item.accessibilityBoost}%</span>
                  <span>Gap Reduction: -{item.gapReduction}%</span>
                  <span className="font-bold text-emerald-700">ROI: {item.roi}/10</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Simulation Results Card */}
        <div className="lg:col-span-6 bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase">
                Simulated Outcome For:
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {currentDistrict.name} District ({currentDistrict.state})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded">
              {selectedIntervention.category} Intervention
            </span>
          </div>

          {/* Simulation Output Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                Citizens Directly Benefited:
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                ~{estimatedBenefitedCitizens.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {Math.round(selectedIntervention.reachMultiplier * 100)}% of district population
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                Citizen Requests Addressed:
              </span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                {relatedRequestsAddressed} Petitions
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                85% of active {selectedIntervention.category} demand
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                Accessibility Improvement:
              </span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">
                +{selectedIntervention.accessibilityBoost}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Benchmark transit gap reduction
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">
                District Deficit Gap Score:
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {Math.max(12, currentDistrict.calculatedGapScore - selectedIntervention.gapReduction)}
                </span>
                <span className="text-xs text-red-500 line-through">
                  from {currentDistrict.calculatedGapScore}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                -{selectedIntervention.gapReduction} deficit points
              </span>
            </div>
          </div>

          {/* Key Simulated Benefits */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Direct Community Outcomes:
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              {selectedIntervention.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social ROI & Cost Benefit */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-950 block">Social Return Score</span>
              <span className="text-[11px] text-emerald-800">
                Composite of mortality reduction, transit savings, and economic access
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">
                {selectedIntervention.roi} / 10
              </span>
              <span className="text-[10px] text-emerald-800 block">High Public Impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
