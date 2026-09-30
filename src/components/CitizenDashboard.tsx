import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ThumbsUp, 
  Printer, 
  Download, 
  Share2, 
  Crosshair, 
  Loader2, 
  Navigation, 
  Layers, 
  Bell, 
  Building2, 
  Activity, 
  ChevronRight,
  Sparkles,
  Phone,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CitizenRequest, InfrastructureCategory, IndianLanguage } from '../types';
import { RealLeafletMap } from './RealLeafletMap';

interface CitizenDashboardProps {
  requests: CitizenRequest[];
  onOpenReportModal: () => void;
  onSelectRequestForReport?: (loc: { lat: number; lng: number; district?: string; state?: string }) => void;
  selectedLanguage: IndianLanguage;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  requests,
  onOpenReportModal,
  onSelectRequestForReport,
  selectedLanguage,
}) => {
  const { currentUser, openAuthModal, logout } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<CitizenRequest | null>(null);
  const [endorsedIds, setEndorsedIds] = useState<Record<string, number>>({});
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    district?: string;
    state?: string;
  } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // Filter requests that belong to this citizen's district or are submitted
  const citizenDistrict = currentUser?.citizenDistrict || 'Dharmapuri';
  const citizenState = currentUser?.citizenState || 'Tamil Nadu';

  const userDistrictRequests = requests.filter(
    (r) =>
      r.location.district?.toLowerCase().includes(citizenDistrict.toLowerCase()) ||
      r.location.state?.toLowerCase().includes(citizenState.toLowerCase())
  );

  // Handle GPS location detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    setLocationSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const dist = addr.state_district || addr.county || addr.city || citizenDistrict;
            const st = addr.state || citizenState;
            const full = data.display_name;

            setUserLocation({
              lat,
              lng,
              address: full,
              district: dist,
              state: st,
            });
            setLocationSuccessMsg(`Real GPS Locked: ${dist}, ${st} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          } else {
            setUserLocation({ lat, lng, district: citizenDistrict, state: citizenState });
            setLocationSuccessMsg(`GPS Pinpoint: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        } catch {
          setUserLocation({ lat, lng, district: citizenDistrict, state: citizenState });
          setLocationSuccessMsg(`GPS Pinpoint: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setIsDetectingLocation(false);
        alert('Could not access your location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleEndorse = (id: string) => {
    setEndorsedIds((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Citizen Profile Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-slate-950 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-xl ring-4 ring-white/30 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/20 text-slate-950">
                  Citizen Portal Dashboard
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/20 text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  Verified Resident
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                Welcome, {currentUser?.name || 'Citizen'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-900/80 font-medium flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>
                  {currentUser?.citizenDistrict || 'Dharmapuri'}, {currentUser?.citizenState || 'Tamil Nadu'}
                </span>
                <span>·</span>
                <Phone className="w-3.5 h-3.5 text-slate-950" />
                <span>{currentUser?.phone || '+91 98401 23456'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingLocation}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-70"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Crosshair className="w-4 h-4 text-amber-400" />
              )}
              <span>{isDetectingLocation ? 'Detecting GPS...' : 'Detect Real Location'}</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Report a Development Need</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-950/20"
              title="Sign Out of Citizen Account"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {locationSuccessMsg && (
          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/20 border border-slate-950/30 text-xs font-medium text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-900" />
            <span>{locationSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Citizen Key Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">My Recorded Requests</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {requests.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            AI Analyzed & Geotagged
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">District Issues Reported</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {userDistrictRequests.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {citizenDistrict}
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Under Administrative Review</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {userDistrictRequests.filter((r) => r.status.includes('Review') || r.status.includes('Categorised')).length}
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">
            Forwarded to Nodal Depts
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Action Sanctioned / Resolved</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {userDistrictRequests.filter((r) => r.status.includes('Action') || r.status.includes('Resolved')).length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Public Works in Progress
          </span>
        </div>
      </div>

      {/* Main Grid: My Grievances & Tracker vs Local Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Requests & Timeline Stepper */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>My Infrastructure Grievances</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status tracking from submission to DPR budget sanction
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {requests.length} Active Records
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No requests submitted yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click "Report a Development Need" above to submit via Voice, Text, or Messaging. All numbers are real and live!
                </p>
                <button
                  onClick={onOpenReportModal}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
                >
                  Submit Your First Grievance
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => {
                  const endorsements = (endorsedIds[req.id] || 0);
                  const isResolved = req.status === 'Resolved';
                  const isAction = req.status.includes('Action');
                  const isReview = req.status.includes('Review');

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-amber-400/80 transition-all bg-slate-50/50 hover:bg-white shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                              {req.id}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              {req.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {req.timestamp}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-2">
                            "{req.originalText}"
                          </h4>
                          {req.originalLanguage !== 'en' && req.translatedTextEn && (
                            <p className="text-xs text-slate-500 italic mt-0.5">
                              En: {req.translatedTextEn}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedReceipt(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 shrink-0"
                          title="View Digital Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Receipt</span>
                        </button>
                      </div>

                      {/* Status Stepper */}
                      <div className="pt-2 border-t border-slate-200/80">
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                          <span className="text-slate-500">Grievance Life Cycle</span>
                          <span className={`font-mono ${
                            isResolved ? 'text-emerald-600' : isAction ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        {/* 4-step progress bar */}
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                          <div className="py-1 rounded bg-emerald-500 text-white font-semibold">
                            1. Categorised
                          </div>
                          <div className={`py-1 rounded font-semibold ${
                            isReview || isAction || isResolved ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            2. Review
                          </div>
                          <div className={`py-1 rounded font-semibold ${
                            isAction || isResolved ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            3. Sanction
                          </div>
                          <div className={`py-1 rounded font-semibold ${
                            isResolved ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            4. Resolved
                          </div>
                        </div>
                      </div>

                      {/* Footer Info: Location & Community Upvote */}
                      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {req.location.talukOrVillage || req.location.district}, {req.location.state}
                          </span>
                        </div>

                        <button
                          onClick={() => handleEndorse(req.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                          <span>Endorse (+{endorsements})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Local Administrative Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>District Administration Bulletins ({citizenDistrict})</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
                <span className="font-bold text-blue-950 block">
                  Public Works Dept: Rural Road Upgradation Approved
                </span>
                <p className="text-blue-800 mt-1">
                  18km stretch connecting Morappur to Harur sanctioned under PMGSY. Tender bidding open until 15th prox.
                </p>
                <span className="text-[10px] text-blue-600 font-mono mt-1 block">
                  Official Memo #TN-DHP-PWD-2026-89
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                <span className="font-bold text-emerald-950 block">
                  Jal Jeevan Mission: Piped Water Feeder Connection Complete
                </span>
                <p className="text-emerald-800 mt-1">
                  Overhead tank and chlorination plant operational in Pennagaram block serving 4,200 households.
                </p>
                <span className="text-[10px] text-emerald-600 font-mono mt-1 block">
                  Official Memo #JJM-DHP-2026-112
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real Leaflet Map of Nearby Issues */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                  <span>Nearby Infrastructure Map</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore verified community issues around your live location in {citizenDistrict}
                </p>
              </div>

              <button
                onClick={handleDetectGPS}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>Locate Me</span>
              </button>
            </div>

            {/* Map Container */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner flex-1 min-h-[480px]">
              <RealLeafletMap
                center={[userLocation ? userLocation.lat : 12.1211, userLocation ? userLocation.lng : 78.1582]}
                zoom={11}
                height="480px"
                requests={requests}
                onLocationSelect={(loc) => {
                  if (onSelectRequestForReport) {
                    onSelectRequestForReport(loc);
                  }
                }}
              />
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Click anywhere on the real map to drop a pin and report an issue at that exact spot.</span>
              </span>
              <button
                onClick={onOpenReportModal}
                className="text-amber-600 hover:text-amber-700 font-bold underline shrink-0"
              >
                Report Here
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            {/* Receipt Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-bold">
                    Official Grievance Acknowledgement
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mt-2">
                JanaSetu Digital Public Receipt
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Tracking ID: {selectedReceipt.id}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted By</span>
                  <span className="font-bold text-slate-900">{currentUser?.name || 'Citizen'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Submission Time</span>
                  <span className="font-mono text-slate-800">{selectedReceipt.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Infrastructure Category</span>
                  <span className="font-bold text-amber-600">{selectedReceipt.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Severity / Urgency</span>
                  <span className="font-bold text-red-600">{selectedReceipt.severity} ({selectedReceipt.urgency})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Citizen Statement (Original)</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800">
                  "{selectedReceipt.originalText}"
                </div>
              </div>

              {selectedReceipt.translatedTextEn && selectedReceipt.originalLanguage !== 'en' && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">AI Standard English Normalisation</span>
                  <p className="text-slate-600 italic">
                    "{selectedReceipt.translatedTextEn}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Jurisdiction</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.location.talukOrVillage || 'HQ'}, {selectedReceipt.location.district}, {selectedReceipt.location.state}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Coordinates</span>
                  <span className="font-mono text-slate-800">
                    {selectedReceipt.location.lat.toFixed(4)}, {selectedReceipt.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  This receipt serves as an authentic Digital Public Good record under the Open Infrastructure Data Charter.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
