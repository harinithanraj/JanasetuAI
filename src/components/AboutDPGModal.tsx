import React from 'react';
import { X, ShieldCheck, Lock, Database, Cpu, Eye, Flag, CheckCircle2 } from 'lucide-react';

interface AboutDPGModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDPGModal: React.FC<AboutDPGModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Digital Public Good (DPG) & Privacy Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Responsible AI framework for Indian Digital Public Infrastructure
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
            <span className="font-bold block text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Non-PII by Design
            </span>
            <p className="text-xs text-emerald-900">
              JanaSetu AI collects zero sensitive personally identifiable information (Aadhaar, phone numbers, biometric data). 
              Only geographical village coordinates, development categories, and verbal need descriptions are stored.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
            <span className="font-bold block text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-700" />
              2. Explicit Voice & Speech Consent
            </span>
            <p className="text-xs text-slate-600">
              Microphone inputs are transcribed strictly for text extraction and converted to anonymised text tokens. 
              Raw biometric voiceprints are not retained or used for biometric profiling.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
            <span className="font-bold block text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-700" />
              3. Transparent Explainability & Human-in-the-Loop
            </span>
            <p className="text-xs text-slate-600">
              No AI recommendation functions as an automatic financial sanction. Every priority index includes 
              a mathematical breakdown and audit trail. Citizens and district administrators can flag incorrect 
              classifications with one click.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
            <span className="font-bold block text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-700" />
              4. Open Government Data Integration Ready
            </span>
            <p className="text-xs text-slate-600">
              Built to cleanly ingest open datasets from data.gov.in, National Health Mission (NHM), 
              Pradhan Mantri Gram Sadak Yojana (PMGSY), Jal Jeevan Mission, and Census demographic tables.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
