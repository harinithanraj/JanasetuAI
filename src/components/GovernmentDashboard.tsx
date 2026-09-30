import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  Check, 
  Printer, 
  Download, 
  RotateCcw, 
  PlusCircle, 
  Search, 
  Sparkles, 
  Sliders, 
  Eye, 
  Users, 
  BarChart3, 
  Clock, 
  ExternalLink,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CitizenRequest, InfrastructureCategory, ALL_CATEGORIES, RequestStatus } from '../types';
import { RealLeafletMap } from './RealLeafletMap';
import { INDIAN_DISTRICTS } from '../data/districtsData';

interface GovernmentDashboardProps {
  requests: CitizenRequest[];
  onUpdateRequestStatus: (id: string, newStatus: RequestStatus, note?: string) => void;
  onResetToZero: () => void;
  onLoadPilotRecords: () => void;
  onOpenSimulatorForDistrict: (districtName: string) => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  requests,
  onUpdateRequestStatus,
  onResetToZero,
  onLoadPilotRecords,
  onOpenSimulatorForDistrict,
}) => {
  const { currentUser, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchText = r.originalText.toLowerCase().includes(q) || (r.translatedTextEn && r.translatedTextEn.toLowerCase().includes(q));
        const matchLoc = r.location.district.toLowerCase().includes(q) || (r.location.talukOrVillage && r.location.talukOrVillage.toLowerCase().includes(q));
        if (!matchText && !matchLoc) return false;
      }
      return true;
    });
  }, [requests, selectedCategory, selectedStatus, searchQuery]);

  // Real Actual KPI counts (strictly 0 or exact records, no fabricated numbers!)
  const actualStats = useMemo(() => {
    const total = requests.length;
    const critical = requests.filter((r) => r.severity === 'Critical' || r.urgency.includes('Immediate')).length;
    const underReview = requests.filter((r) => r.status.includes('Review') || r.status.includes('Categorised')).length;
    const actionSanctioned = requests.filter((r) => r.status.includes('Action') || r.status.includes('Resolved')).length;
    
    // Distinct districts with verified requests
    const distinctDistricts = new Set(requests.map((r) => r.location.district.trim().toLowerCase())).size;

    // Estimated people impacted from real requests
    const peopleImpacted = requests.reduce((acc, r) => acc + (r.estimatedPeopleAffected || 0), 0);

    return {
      total,
      critical,
      underReview,
      actionSanctioned,
      distinctDistricts,
      peopleImpacted,
    };
  }, [requests]);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    onUpdateRequestStatus(id, newStatus, adminNote || undefined);
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
    setAdminNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Official Government Cadre Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/10 shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Government of India · Infrastructure Intelligence Portal
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Cadre Access
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {currentUser?.name || 'Dr. K. Vijayakumar, IAS'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2 mt-1">
                <span className="font-semibold text-amber-400">
                  {currentUser?.designation || 'District Magistrate & District Collector'}
                </span>
                <span>·</span>
                <span>{currentUser?.department || 'District Infrastructure Monitoring Cell'}</span>
                <span>·</span>
                <span className="font-mono text-slate-400">
                  ID: {currentUser?.employeeId || 'IAS-TN-2014-0412'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Export Official Brief</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Sign Out of Government Cadre Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            {requests.length > 0 ? (
              <button
                onClick={onResetToZero}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Reset all live counters to clean 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data to 0</span>
              </button>
            ) : (
              <button
                onClick={onLoadPilotRecords}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-medium flex items-center gap-1.5 border border-emerald-500/40 transition-colors"
                title="Load verified pilot records"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Load Verified Pilot Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Authenticity Notice */}
        <div className="mt-5 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">Data Authenticity Audit:</span>
            <span>All indicators are calculated from strictly verified citizen inputs. No fabricated numbers.</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Jurisdiction: {currentUser?.jurisdiction?.district || 'Dharmapuri'} ({currentUser?.jurisdiction?.level || 'District'} Level)
          </span>
        </div>
      </div>

      {/* Real Actual KPI Strip (Zero/Actual Values) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Real Citizen Grievances</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {actualStats.total}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {actualStats.total === 0 ? 'Zero records recorded' : 'Verified submissions'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Critical / Immediate</span>
          <div className="text-2xl font-bold text-red-600 mt-1 font-mono">
            {actualStats.critical}
          </div>
          <span className="text-[10px] text-red-500 block mt-0.5">
            Require 0-7 day triage
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Under Dept Review</span>
          <div className="text-2xl font-bold text-blue-600 mt-1 font-mono">
            {actualStats.underReview}
          </div>
          <span className="text-[10px] text-blue-500 block mt-0.5">
            Field inspections pending
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">DPR Sanctioned / Active</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            {actualStats.actionSanctioned}
          </div>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            Work order sanctioned
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Districts with Demand</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">
            {actualStats.distinctDistricts}
          </div>
          <span className="text-[10px] text-amber-600 block mt-0.5">
            Geotagged clusters
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Est. Population Impacted</span>
          <div className="text-2xl font-bold text-purple-600 mt-1 font-mono">
            {actualStats.peopleImpacted.toLocaleString()}
          </div>
          <span className="text-[10px] text-purple-600 block mt-0.5">
            Beneficiary outreach
          </span>
        </div>
      </div>

      {/* Interactive Real Map for Government Planners */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Real Infrastructure GIS Command Map</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live OpenStreetMap visualization of verified citizen requests with real geographic coordinates
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 text-slate-800 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600 outline-none"
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real Leaflet Map */}
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner h-[440px]">
          <RealLeafletMap
            center={[12.1211, 78.1582]}
            zoom={10}
            height="440px"
            requests={filteredRequests}
            onLocationSelect={(loc) => {
              // Location selected by official
            }}
          />
        </div>
      </div>

      {/* Grievance Action & Redressal Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Administrative Action & Sanction Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Triage citizen development requests, assign to line departments, and sanction DPRs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search request or location..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600 outline-none w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 text-slate-800 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="AI Categorised">AI Categorised</option>
              <option value="Verified / Under Review">Under Review</option>
              <option value="Action Planned">Action Planned</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No matching citizen records</h4>
            <p className="text-xs text-slate-500 mt-1">
              Either all requests are resolved, filtered out, or data is reset to 0. Click "Load Verified Pilot Data" to test.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-3">Tracking ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Citizen Feedback (Original & EN)</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {req.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        "{req.originalText}"
                      </p>
                      {req.originalLanguage !== 'en' && req.translatedTextEn && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                          En: {req.translatedTextEn}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{req.location.talukOrVillage || req.location.district}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{req.location.state}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.severity === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : req.severity === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {req.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-700">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
                      >
                        Action / Sanction
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Administrative Action Panel
                </span>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Grievance Ref: {selectedRequest.id}
              </h3>
              <p className="text-xs text-slate-300">
                {selectedRequest.location.talukOrVillage || selectedRequest.location.district}, {selectedRequest.location.state}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Citizen Input ({selectedRequest.originalLanguage})</span>
                <p className="font-bold text-slate-900 mt-1">"{selectedRequest.originalText}"</p>
                {selectedRequest.translatedTextEn && selectedRequest.originalLanguage !== 'en' && (
                  <p className="text-slate-600 italic text-[11px] mt-1">
                    Normalized: "{selectedRequest.translatedTextEn}"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add Official Administrative Note
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Field inspection order issued to Assistant Executive Engineer, PWD..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Update Administrative Stage:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'Verified / Under Review')}
                    className="py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200 text-center transition-colors"
                  >
                    Forward to Dept Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'Action Planned')}
                    className="py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 text-center transition-colors"
                  >
                    Sanction DPR & Budget
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'Resolved')}
                    className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 text-center transition-colors"
                  >
                    Mark Work as Completed
                  </button>
                  <button
                    onClick={() => {
                      onOpenSimulatorForDistrict(selectedRequest.location.district);
                      setSelectedRequest(null);
                    }}
                    className="py-2 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold border border-purple-200 text-center transition-colors"
                  >
                    Simulate Capex Impact
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Memorandum Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                  Official Document Preview
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  District Infrastructure Action Memorandum
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-slate-800 flex-1">
              <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                <span className="font-bold uppercase tracking-widest text-[11px] text-slate-500">
                  Government of India / State Administration
                </span>
                <h4 className="text-base font-extrabold text-slate-950">
                  DISTRICT INFRASTRUCTURE ACTION BRIEF
                </h4>
                <p className="text-[11px] text-slate-500">
                  Prepared by: {currentUser?.name || 'Dr. K. Vijayakumar, IAS'} ({currentUser?.designation})
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · Ref: DIB-2026-CONF-04
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">1. Executive Summary & Verified Metrics</h5>
                <p className="text-slate-600 leading-relaxed">
                  Based on citizen voice submissions captured across digital channels, a total of 
                  <strong> {actualStats.total} verified infrastructure grievances</strong> have been registered. 
                  Currently, {actualStats.critical} critical gaps require urgent intervention under PMGSY / Jal Jeevan Mission / NHM frameworks.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">2. Citizen Voice Evidence Table</h5>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 font-semibold text-slate-700">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Taluk / Village</th>
                        <th className="p-2">Citizen Need</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {requests.slice(0, 5).map((r) => (
                        <tr key={r.id}>
                          <td className="p-2 font-mono">{r.id}</td>
                          <td className="p-2 font-bold">{r.category}</td>
                          <td className="p-2">{r.location.talukOrVillage || r.location.district}</td>
                          <td className="p-2 italic">"{r.originalText.slice(0, 45)}..."</td>
                          <td className="p-2">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">3. Recommended Administrative Actions</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Sanction fast-track engineering estimates for road and health access gaps.</li>
                  <li>Issue administrative sanctions via District Collectorate infrastructure funds.</li>
                  <li>Coordinate with line departments for quarterly inspection benchmarks.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Memorandum</span>
              </button>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
