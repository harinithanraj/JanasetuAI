import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Languages, 
  Layers, 
  MapPin, 
  FileText, 
  Sliders, 
  Bot, 
  TrendingUp, 
  Play 
} from 'lucide-react';

interface DemoStorylineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DemoStorylineModal: React.FC<DemoStorylineModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: 'Citizen Submits Tamil Development Complaint',
      tag: 'Citizen Voice',
      content:
        'A rural resident in Pennagaram, Dharmapuri submits a voice message in Tamil: "எங்கள் பகுதியில் அரசு ஆரம்ப சுகாதார நிலையம் தேவை. அவசர சிகிச்சைக்கு 25 கி.மீ தர்மபுரி செல்ல வேண்டியுள்ளது."',
      tab: 'citizen-portal',
      details: 'Preserves the original citizen voice without forcing English literacy.',
    },
    {
      step: 2,
      title: 'Gemini Detects Tamil & Extracts Structured Intent',
      tag: 'Multilingual AI',
      content:
        'Gemini 3.8 Flash automatically identifies the language as Tamil (ISO: ta), normalizes the text into English, and extracts location coordinates and entity markers.',
      tab: 'citizen-portal',
      details: 'Extracted: "Need a government hospital within emergency transit reach".',
    },
    {
      step: 3,
      title: 'AI Categorises under Healthcare & Critical Severity',
      tag: 'Classification',
      content:
        'The request is categorized under Healthcare (Primary Health Centre), severity marked Critical due to a 25 km transit barrier during maternal and trauma emergencies.',
      tab: 'citizen-portal',
      details: 'Estimated population affected: 14,500 rural citizens.',
    },
    {
      step: 4,
      title: 'System Identifies Similar Requests Nearby',
      tag: 'Deduplication',
      content:
        'JanSetu cross-references recent submissions in Dharmapuri and locates 679 other related complaints reporting ambulance delays and nocturnal medical voids.',
      tab: 'citizen-portal',
      details: 'Eliminates duplicate paperwork while aggregating real community volume.',
    },
    {
      step: 5,
      title: 'Requests Clustered into a Demand Hotspot',
      tag: 'Demand Hotspot',
      content:
        'The platform forms Cluster "CLUSTER-TN-HEALTH-01: Emergency Primary Healthcare Deficit Corridor", grouping 680 Tamil, English, and Kannada requests.',
      tab: 'demand-hotspots',
      details: 'Hotspot spans Pennagaram Taluk along the Hogenakkal border.',
    },
    {
      step: 6,
      title: 'Dashboard Detects Severe Infrastructure Gap',
      tag: 'GIS Intelligence',
      content:
        'The system compares citizen demand against official facility ratios: Dharmapuri has only 4.2 hospital beds per 10k population (state target: 12.0), triggering a red Gap alert.',
      tab: 'infrastructure-map',
      details: 'Healthcare infrastructure score is 28/100, ranking in bottom 5% nationally.',
    },
    {
      step: 7,
      title: 'AI Priority Engine Computes Weighted Decision Score',
      tag: 'Priority Scoring',
      content:
        'Using a transparent weighted mathematical formula (30% Demand, 20% Gap, 15% Population, 15% Urgency, 10% Transit, 10% Growth), Dharmapuri receives a score of 89/100.',
      tab: 'recommendations',
      details: 'Marked clearly: "AI-generated decision-support score — human review required."',
    },
    {
      step: 8,
      title: 'Policy Copilot Explains Why the Area Requires Attention',
      tag: 'Explainable AI',
      content:
        'A policymaker asks: "Why was Dharmapuri marked as high priority?" Gemini generates a grounded evidence brief citing the 31% monthly growth and ₹14.5 Cr funding gap.',
      tab: 'policy-copilot',
      details: 'Never fabricates data; cites verifiable synthetic census figures.',
    },
    {
      step: 9,
      title: 'Impact Simulator Models Proposed Public Works Intervention',
      tag: 'Simulation',
      content:
        'The planner simulates: "Add 50-bed Community Health Centre & 4 Ambulances". The simulation projects +68% accessibility boost, 540 requests addressed, and 9.2/10 social ROI.',
      tab: 'impact-simulator',
      details: 'Assists budget committees in calculating social return on public capital.',
    },
    {
      step: 10,
      title: 'Policymaker Exports 1-Page Development Briefing',
      tag: 'Decision Action',
      content:
        'With one click, an executive advisory brief is generated in markdown/PDF format, ready for inclusion in the state infrastructure sanction docket.',
      tab: 'recommendations',
      details: 'Closes the loop from citizen Tamil voice to sanctioned infrastructure action.',
    },
  ];

  const current = STEPS[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg text-slate-950 font-bold">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">
                Hackathon End-to-End Demo Walkthrough
              </span>
              <span className="text-[11px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Step {currentStep} of 10
              </span>
            </div>
            <p className="text-xs text-slate-400">
              10-step journey from citizen vernacular voice to national infrastructure action
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          ></div>
        </div>

        {/* Current Step Card */}
        <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wide">
              {current.tag}
            </span>
            <span className="text-slate-400 font-mono">Step #{current.step}</span>
          </div>

          <h3 className="text-lg font-bold text-white">{current.title}</h3>

          <p className="text-sm text-slate-300 leading-relaxed">{current.content}</p>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-xs text-emerald-400 font-medium">
            💡 {current.details}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              onNavigateTab(current.tab);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30"
          >
            <span>Jump to {current.tag} Screen</span>
          </button>

          {currentStep < 10 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(10, s + 1))}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
