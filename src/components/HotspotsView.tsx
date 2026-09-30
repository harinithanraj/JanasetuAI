import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Languages, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DEMAND_CLUSTERS } from '../data/requestsData';
import { DemandCluster } from '../types';

interface HotspotsViewProps {
  onOpenSimulatorForDistrict?: (districtName: string) => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({ onOpenSimulatorForDistrict }) => {
  const [selectedCluster, setSelectedCluster] = useState<DemandCluster>(DEMAND_CLUSTERS[0]);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({
    'CLUSTER-TN-HEALTH-01': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Semantic Demand Clustering Engine
            </span>
            <span className="text-xs text-slate-500">· Gemini Semantic Similarity</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Demand Hotspots & Issue Clusters
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Multiple citizen complaints across languages (Tamil, Kannada, Telugu, Hindi) are automatically 
            clustered when describing the same underlying infrastructure gap, avoiding duplicate processing 
            and revealing real hotspot scale.
          </p>
        </div>
      </div>

      {/* Clusters List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Clusters Cards */}
        <div className="lg:col-span-8 space-y-4">
          {DEMAND_CLUSTERS.map((cluster) => {
            const isSelected = selectedCluster.id === cluster.id;
            const isExpanded = expandedQuotes[cluster.id] || false;

            return (
              <div
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster)}
                className={`bg-white rounded-xl border p-6 transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {cluster.category}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {cluster.district}, {cluster.state}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                        {cluster.trend}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {cluster.title}
                    </h3>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                    <span className="text-xs text-slate-500 font-semibold">Priority Index</span>
                    <span className="text-2xl font-black text-red-600">
                      {cluster.priorityScore}/100
                    </span>
                  </div>
                </div>

                {/* Common Issue Summary */}
                <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong className="text-slate-800">Synthesized Issue:</strong> {cluster.commonIssue}
                </p>

                {/* Metric Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Aggregated Requests:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {cluster.requestCount} complaints
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Population Affected:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ~{cluster.estimatedPopulationAffected.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Languages Represented:</span>
                    <span className="font-medium text-blue-700 flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" />
                      {cluster.languagesRepresented.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Representative Multilingual Quotes Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(cluster.id);
                    }}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-amber-600"
                  >
                    <span>Inspect Raw Multilingual Citizen Voices ({cluster.representativeQuotes.length})</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2">
                      {cluster.representativeQuotes.map((q, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                            <span>Citizen Voice #{idx + 1} ({q.language})</span>
                            <span className="text-emerald-700">Clustered by AI</span>
                          </div>
                          <p className="text-slate-900 italic font-serif">"{q.original}"</p>
                          <p className="text-slate-600 text-[11px]">En: {q.english}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Suggested Public Works Intervention */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Suggested Intervention
            </span>
            <span className="text-xs font-bold font-mono text-slate-500">
              {selectedCluster.id}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-base text-slate-900">
              {selectedCluster.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Target: {selectedCluster.district}, {selectedCluster.state}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <span className="font-bold text-emerald-950 block">Action Plan:</span>
            <p className="text-emerald-900 leading-relaxed">
              {selectedCluster.suggestedIntervention}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Unmet Demand:</span>
              <span className="font-bold text-slate-900">{selectedCluster.requestCount} verified requests</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Estimated Reach:</span>
              <span className="font-bold text-slate-900">~{selectedCluster.estimatedPopulationAffected.toLocaleString('en-IN')} citizens</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Severity Assessment:</span>
              <span className="font-bold text-red-600">{selectedCluster.severity}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenSimulatorForDistrict) {
                onOpenSimulatorForDistrict(selectedCluster.district);
              }
            }}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Simulate Capex Intervention in {selectedCluster.district}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
