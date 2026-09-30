import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  ChevronRight, 
  RotateCcw,
  ShieldAlert,
  Info
} from 'lucide-react';
import { AI_RECOMMENDATIONS } from '../data/requestsData';
import { AIRecommendation, PriorityFormulaWeights, DEFAULT_WEIGHTS } from '../types';

interface RecommendationsViewProps {
  onOpenSimulatorForDistrict?: (districtName: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenSimulatorForDistrict,
}) => {
  const [weights, setWeights] = useState<PriorityFormulaWeights>(DEFAULT_WEIGHTS);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [selectedRec, setSelectedRec] = useState<AIRecommendation>(AI_RECOMMENDATIONS[0]);
  const [generatingBriefing, setGeneratingBriefing] = useState(false);
  const [briefingText, setBriefingText] = useState<string | null>(null);

  // Recalculate priority index based on current formula weights
  const calculateDynamicIndex = (rec: AIRecommendation) => {
    const totalWeights =
      weights.citizenDemand +
      weights.infrastructureGap +
      weights.populationImpact +
      weights.urgency +
      weights.accessibilityGap +
      weights.requestGrowth;

    const normDemand = weights.citizenDemand / totalWeights;
    const normGap = weights.infrastructureGap / totalWeights;
    const normPop = weights.populationImpact / totalWeights;
    const normUrg = weights.urgency / totalWeights;
    const normAcc = weights.accessibilityGap / totalWeights;
    const normGro = weights.requestGrowth / totalWeights;

    // Component base scores (0-100)
    const baseDemand = Math.min(100, (rec.citizenDemandCount / 700) * 100);
    const baseGap = rec.infrastructureGapScore;
    const basePop = Math.min(100, (rec.estimatedPopulationAffected / 250000) * 100);
    const baseUrg = 92;
    const baseAcc = 88;
    const baseGro = 85;

    const computed =
      baseDemand * normDemand +
      baseGap * normGap +
      basePop * normPop +
      baseUrg * normUrg +
      baseAcc * normAcc +
      baseGro * normGro;

    return Math.round(computed);
  };

  const handleExportBriefing = async (rec: AIRecommendation) => {
    setGeneratingBriefing(true);
    try {
      const res = await fetch('/api/generate-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ districtId: 'TN-DHA' }),
      });
      const data = await res.json();
      setBriefingText(data.briefing);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingBriefing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Explainable AI Priority Engine
            </span>
            <span className="text-xs text-slate-500">· Transparent Weighted Formula</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            AI Development Recommendations
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Synthesizes citizen voice, demographic indicators, and capital expenditure pipelines to rank 
            high-impact public interventions with fully auditable evidence.
          </p>
        </div>

        {/* Formula Adjuster Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormulaEditor(!showFormulaEditor)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-300 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Configure Formula Weights</span>
          </button>
        </div>
      </div>

      {/* Mandatory Human Review Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <span className="font-bold block">
            AI-generated decision-support score — human review required.
          </span>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed">
            Scores are computed from transparent weighted mathematical formulas combining citizen demand volume, 
            infrastructure deficit indexes, and population impact using realistic synthetic demo data. Recommendations 
            inform public debate and do not constitute automatic government sanction.
          </p>
        </div>
      </div>

      {/* Analyst Configurable Formula Weights Panel */}
      {showFormulaEditor && (
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Analyst Formula Customizer (Transparent Weighted Model)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust criteria weights in real-time to simulate alternative public policy prioritization criteria.
              </p>
            </div>
            <button
              onClick={() => setWeights(DEFAULT_WEIGHTS)}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Standard</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Citizen Demand Volume:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.citizenDemand * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={weights.citizenDemand}
                onChange={(e) =>
                  setWeights({ ...weights, citizenDemand: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Infrastructure Deficit Gap:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.infrastructureGap * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={weights.infrastructureGap}
                onChange={(e) =>
                  setWeights({ ...weights, infrastructureGap: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Population Affected:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.populationImpact * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.populationImpact}
                onChange={(e) =>
                  setWeights({ ...weights, populationImpact: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Severity & Urgency:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.urgency * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.urgency}
                onChange={(e) =>
                  setWeights({ ...weights, urgency: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Transit Distance / Accessibility Gap:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.accessibilityGap * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={weights.accessibilityGap}
                onChange={(e) =>
                  setWeights({ ...weights, accessibilityGap: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Request Growth Velocity (MoM):</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(weights.requestGrowth * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={weights.requestGrowth}
                onChange={(e) =>
                  setWeights({ ...weights, requestGrowth: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recommendation Cards */}
        <div className="lg:col-span-8 space-y-5">
          {AI_RECOMMENDATIONS.map((rec) => {
            const dynamicIndex = calculateDynamicIndex(rec);
            const isSelected = selectedRec.id === rec.id;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`bg-white rounded-xl border p-6 transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {rec.infrastructureCategory}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {rec.location.district}, {rec.location.state}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-emerald-700 font-mono text-[10px]">
                        Confidence: {rec.confidenceScore}%
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {rec.projectTitle}
                    </h3>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">
                      Priority Index
                    </span>
                    <span className="text-3xl font-black text-red-600">
                      {dynamicIndex}/100
                    </span>
                  </div>
                </div>

                {/* Suggested Intervention & Expected Impact */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">Suggested Intervention:</span>
                    <p className="text-slate-700 leading-snug">{rec.suggestedIntervention}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200">
                    <span className="font-bold text-emerald-950 block mb-1">Expected Social Impact:</span>
                    <p className="text-emerald-900 leading-snug">{rec.expectedImpact}</p>
                  </div>
                </div>

                {/* Supporting Benchmark Indicators */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide block mb-2">
                    Evidence & Supporting Indicators:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {rec.supportingIndicators.map((ind, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block truncate">{ind.label}</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-bold text-red-600 text-sm">{ind.value}</span>
                          <span className="text-[10px] text-slate-400">Target: {ind.benchmark}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence bullets */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block text-[11px]">Why this is recommended:</span>
                  {rec.evidenceNarrative.map((ev, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Recommendation Actions & Briefing Preview */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Executive Action Panel
            </span>
            <span className="text-xs font-mono text-slate-400">{selectedRec.id}</span>
          </div>

          <div>
            <h4 className="font-bold text-base text-slate-900">
              {selectedRec.location.district} Policy Dossier
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Sector: {selectedRec.infrastructureCategory} · Priority: {calculateDynamicIndex(selectedRec)}/100
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1">
            <div className="flex justify-between font-semibold text-amber-950">
              <span>Sanctioned Capex Pipeline:</span>
              <span>₹{selectedRec.existingInvestmentCr} Cr</span>
            </div>
            <div className="flex justify-between text-amber-800 text-[11px]">
              <span>Coverage Assessment:</span>
              <span className="font-bold text-red-700">{selectedRec.investmentCoverageStatus}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleExportBriefing(selectedRec)}
              disabled={generatingBriefing}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {generatingBriefing ? 'Generating Briefing via Gemini...' : 'Generate 1-Page Advisory Briefing'}
              </span>
            </button>

            <button
              onClick={() => {
                if (onOpenSimulatorForDistrict) {
                  onOpenSimulatorForDistrict(selectedRec.location.district);
                }
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Simulate Investment in {selectedRec.location.district}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rendered Briefing Note Modal/Box */}
          {briefingText && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-300 text-xs space-y-2 max-h-72 overflow-y-auto font-mono text-slate-800 whitespace-pre-line">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-bold text-[10px] text-slate-500">EXECUTIVE BRIEFING NOTE</span>
                <button
                  onClick={() => setBriefingText(null)}
                  className="text-red-500 font-sans text-xs hover:underline"
                >
                  Close
                </button>
              </div>
              <p className="text-[11px] leading-relaxed font-sans">{briefingText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
