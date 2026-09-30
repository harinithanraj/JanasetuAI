import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Info, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  ExternalLink,
  ChevronRight,
  Maximize2,
  LocateFixed,
  Crosshair,
  Building2,
  RefreshCw
} from 'lucide-react';
import { DistrictMetric, InfrastructureCategory, ALL_CATEGORIES, CitizenRequest } from '../types';
import { INDIAN_DISTRICTS } from '../data/districtsData';
import { RealLeafletMap } from './RealLeafletMap';

interface InteractiveMapProps {
  requests?: CitizenRequest[];
  onSelectDistrict?: (district: DistrictMetric) => void;
  onOpenSimulatorForDistrict?: (districtName: string) => void;
  onNewRequestFromMap?: (location: { lat: number; lng: number; district?: string; state?: string }) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  requests = [],
  onSelectDistrict,
  onOpenSimulatorForDistrict,
  onNewRequestFromMap,
}) => {
  const [mapMode, setMapMode] = useState<'demand' | 'gap' | 'investment'>('demand');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDistrict, setActiveDistrict] = useState<DistrictMetric>(INDIAN_DISTRICTS[0]);
  const [selectedUserPin, setSelectedUserPin] = useState<{
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
    fullAddress?: string;
  } | null>(null);

  // States list
  const states = useMemo(() => {
    return ['All', ...Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state)))];
  }, []);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return INDIAN_DISTRICTS.filter((d) => {
      if (selectedState !== 'All' && d.state !== selectedState) return false;
      if (
        searchQuery &&
        !d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !d.state.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedState, searchQuery]);

  // Filtered requests based on category and state
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      if (selectedState !== 'All' && r.location?.state !== selectedState) return false;
      return true;
    });
  }, [requests, selectedCategory, selectedState]);

  // Actual requests count for currently active district
  const activeDistrictRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        r.location?.district?.toLowerCase() === activeDistrict.name.toLowerCase() ||
        (r.location?.state?.toLowerCase() === activeDistrict.state.toLowerCase() &&
          r.location?.district?.toLowerCase().includes(activeDistrict.name.toLowerCase()))
    );
  }, [requests, activeDistrict]);

  // Handle location pin click on real Leaflet map
  const handleLocationPinned = (loc: {
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
    pincode?: string;
    fullAddress?: string;
  }) => {
    setSelectedUserPin(loc);

    // If reverse geocoding identified a district, sync with it
    if (loc.district) {
      const match = INDIAN_DISTRICTS.find(
        (d) =>
          d.name.toLowerCase().includes(loc.district!.toLowerCase()) ||
          loc.district!.toLowerCase().includes(d.name.toLowerCase())
      );
      if (match) {
        setActiveDistrict(match);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Layer Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Live Real GIS Map Engine
            </span>
            <span className="text-xs text-slate-500">· OpenStreetMap & Browser GPS Geolocation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Real Interactive Infrastructure Map
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Explore live street and terrain maps across India. Click "Use My Location" to detect your real GPS position, 
            or click anywhere on the real map to drop a pin and inspect actual local infrastructure requests.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setMapMode('demand')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mapMode === 'demand'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            A. Demand Hotspots ({filteredRequests.length} real)
          </button>
          <button
            onClick={() => setMapMode('gap')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mapMode === 'gap'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            B. Infrastructure Gap Layer
          </button>
          <button
            onClick={() => setMapMode('investment')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mapMode === 'investment'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C. Capex Alignment
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* State Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Real Stats Count */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
            <span>Plotted:</span>
            <strong className="text-slate-900">{filteredRequests.length} real requests</strong>
          </div>
        </div>

        {/* Search District Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district (e.g. Dharmapuri, Chennai)..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Real Leaflet Map */}
        <div className="lg:col-span-8 space-y-3">
          <RealLeafletMap
            center={[activeDistrict.lat, activeDistrict.lng]}
            zoom={6}
            height="560px"
            requests={filteredRequests}
            districts={filteredDistricts}
            onLocationSelect={handleLocationPinned}
            onRequestSelect={(req) => {
              const matched = INDIAN_DISTRICTS.find(
                (d) => d.name.toLowerCase() === req.location.district.toLowerCase()
              );
              if (matched) setActiveDistrict(matched);
            }}
            allowClickToPin={true}
          />

          {/* Pinned Real Coordinate Quick Action Bar */}
          {selectedUserPin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <LocateFixed className="w-4 h-4 text-blue-600" />
                  Real Location Selected on Map:
                </span>
                <p className="text-blue-800 text-[11px] truncate max-w-lg">
                  {selectedUserPin.fullAddress || `${selectedUserPin.lat.toFixed(5)}, ${selectedUserPin.lng.toFixed(5)}`}
                </p>
              </div>

              {onNewRequestFromMap && (
                <button
                  onClick={() => onNewRequestFromMap(selectedUserPin)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md shadow-xs text-xs whitespace-nowrap"
                >
                  Report Need at This Location
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Selected District Intelligence Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-500 block">
                {activeDistrict.state}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeDistrict.name} District
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                GPS: {activeDistrict.lat.toFixed(4)}°N, {activeDistrict.lng.toFixed(4)}°E
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Real Requests</span>
              <span className="text-2xl font-black text-amber-600 font-mono">
                {activeDistrictRequests.length}
              </span>
            </div>
          </div>

          {/* Quick Real Demographics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Census Population:</span>
              <span className="font-bold text-slate-900">
                {activeDistrict.population.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {activeDistrict.ruralPercentage}% Rural
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Actual Need Submissions:</span>
              <span className="font-bold text-slate-900 font-mono">
                {activeDistrictRequests.length} Live
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                {activeDistrictRequests.length > 0 ? 'Recorded in database' : '0 recorded so far'}
              </span>
            </div>
          </div>

          {/* Category Requests Breakdown for Active District */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Actual Demand by Sector in {activeDistrict.name}
            </span>
            {activeDistrictRequests.length > 0 ? (
              <div className="space-y-1.5 text-xs">
                {Array.from(new Set(activeDistrictRequests.map((r) => r.category))).map((cat) => {
                  const count = activeDistrictRequests.filter((r) => r.category === cat).length;
                  return (
                    <div key={cat} className="flex justify-between items-center py-1 border-b border-slate-100 text-xs">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-mono font-bold text-amber-600">{count} request{count > 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-200 text-center text-xs text-slate-500">
                0 requests recorded for this district yet. Submissions made via the Citizen Portal will automatically show here!
              </div>
            )}
          </div>

          {/* Infrastructure Benchmark Scores */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block">
              Official Benchmark Availability Scores (0-100)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Healthcare</span>
                <span className="font-bold text-red-600 text-sm">
                  {activeDistrict.healthcareScore}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Roads</span>
                <span className="font-bold text-amber-600 text-sm">
                  {activeDistrict.roadsScore}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Water</span>
                <span className="font-bold text-blue-600 text-sm">
                  {activeDistrict.waterScore}
                </span>
              </div>
            </div>
          </div>

          {/* Action: Open in Impact Simulator */}
          <button
            onClick={() => {
              if (onOpenSimulatorForDistrict) onOpenSimulatorForDistrict(activeDistrict.name);
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Simulate Interventions for {activeDistrict.name}</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
