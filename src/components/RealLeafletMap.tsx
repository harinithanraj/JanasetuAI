import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  MapPin, 
  LocateFixed, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { CitizenRequest, DistrictMetric } from '../types';

// Fix default Leaflet icon paths in bundler environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker generator
const createCategoryIcon = (category: string, isUser = false) => {
  if (isUser) {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }

  let color = '#f59e0b'; // default amber
  if (category === 'Healthcare') color = '#ef4444';
  if (category === 'Roads') color = '#f97316';
  if (category === 'Water') color = '#0284c7';
  if (category === 'Education') color = '#10b981';
  if (category === 'Electricity') color = '#eab308';
  if (category === 'Internet/connectivity') color = '#8b5cf6';
  if (category === 'Flood management') color = '#06b6d4';

  return L.divIcon({
    className: 'custom-issue-marker',
    html: `
      <div style="
        background: ${color}; 
        width: 28px; 
        height: 28px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        border: 2px solid white; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); width: 8px; height: 8px; border-radius: 50%; background: white;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface RealLeafletMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  requests?: CitizenRequest[];
  districts?: DistrictMetric[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
    pincode?: string;
    fullAddress?: string;
  }) => void;
  onRequestSelect?: (request: CitizenRequest) => void;
  allowClickToPin?: boolean;
  showHeatmapMode?: boolean;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  center = [20.5937, 78.9629], // Geographic center of India
  zoom = 5,
  height = '500px',
  requests = [],
  districts = [],
  selectedLocation = null,
  onLocationSelect,
  onRequestSelect,
  allowClickToPin = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const requestMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const districtMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'streets' | 'light' | 'topo'>('streets');
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    // Custom positioned zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Default tile layer: OpenStreetMap Standard
    const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroups = {
      requests: L.layerGroup().addTo(map),
      districts: L.layerGroup().addTo(map),
    };

    requestMarkersLayerRef.current = layerGroups.requests;
    districtMarkersLayerRef.current = layerGroups.districts;
    mapInstanceRef.current = map;

    // Handle map click for pinning location
    if (allowClickToPin) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        handlePinLocation(lat, lng);
      });
    }

    // Leaflet map container resize invalidate
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attr = '&copy; OpenStreetMap contributors';

    if (activeTileLayer === 'light') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attr = '&copy; OpenStreetMap &copy; CARTO';
    } else if (activeTileLayer === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenTopoMap contributors';
    }

    L.tileLayer(url, { maxZoom: 19, attribution: attr }).addTo(map);
  }, [activeTileLayer]);

  // Reverse geocode and pin a location
  const handlePinLocation = async (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Update or create pin marker
    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLatLng([lat, lng]);
    } else {
      pinMarkerRef.current = L.marker([lat, lng], {
        icon: createCategoryIcon('Selected', true),
        draggable: true,
      }).addTo(map);

      pinMarkerRef.current.on('dragend', (evt: any) => {
        const newPos = evt.target.getLatLng();
        handlePinLocation(newPos.lat, newPos.lng);
      });
    }

    try {
      // Reverse Geocoding with OpenStreetMap Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const state = address.state || '';
        const district = address.state_district || address.county || address.district || address.city || '';
        const villageOrCity = address.village || address.suburb || address.town || address.city || address.neighbourhood || '';
        const pincode = address.postcode || '';
        const full = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        setDetectedAddress(full);

        pinMarkerRef.current?.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <strong style="color: #0f172a; font-size: 13px;">Selected Real Location</strong><br/>
            <span>${villageOrCity ? `${villageOrCity}, ` : ''}${district ? `${district}, ` : ''}${state}</span><br/>
            <span style="color: #64748b; font-size: 10px;">${lat.toFixed(5)}, ${lng.toFixed(5)}</span>
          </div>
        `).openPopup();

        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            state,
            district,
            villageOrCity,
            pincode,
            fullAddress: full,
          });
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          fullAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        });
      }
    }
  };

  // Browser Geolocation Access: "Detect My Current Location"
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        map.flyTo([latitude, longitude], 14, { duration: 1.5 });

        // Add or update user GPS marker with accuracy circle
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: createCategoryIcon('User', true),
          }).addTo(map);

          L.circle([latitude, longitude], {
            radius: Math.min(500, accuracy || 100),
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.15,
            weight: 1.5,
          }).addTo(map);
        }

        handlePinLocation(latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to access your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Render Requests Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !requestMarkersLayerRef.current) return;
    const layer = requestMarkersLayerRef.current;
    layer.clearLayers();

    requests.forEach((req) => {
      if (!req.location || typeof req.location.lat !== 'number' || typeof req.location.lng !== 'number') {
        return;
      }

      const marker = L.marker([req.location.lat, req.location.lng], {
        icon: createCategoryIcon(req.category),
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; line-height: 1.4;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 13px;">${req.category}</span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #fee2e2; color: #b91c1c; font-weight: 600;">${req.severity}</span>
          </div>
          <p style="margin: 4px 0; color: #334155; font-size: 11px;">"${req.translatedTextEn || req.originalText}"</p>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b;">
            📍 ${req.location.talukOrVillage || ''}, ${req.location.district}, ${req.location.state}<br/>
            👥 Est. ~${req.estimatedPeopleAffected?.toLocaleString('en-IN') || '0'} citizens affected
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onRequestSelect) onRequestSelect(req);
      });

      marker.addTo(layer);
    });
  }, [requests]);

  // Center on selectedLocation if passed from outside
  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 13);
    handlePinLocation(selectedLocation.lat, selectedLocation.lng);
  }, [selectedLocation?.lat, selectedLocation?.lng]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
        {/* Geolocation Button */}
        <button
          onClick={handleDetectCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-md shadow-sm transition-all"
          title="Access browser location to find your real GPS coordinates"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Locating GPS...</span>
            </>
          ) : (
            <>
              <LocateFixed className="w-3.5 h-3.5 text-blue-200" />
              <span>Use My Location</span>
            </>
          )}
        </button>

        {/* Tile Layer Selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-[11px] font-medium border border-slate-200">
          <button
            onClick={() => setActiveTileLayer('streets')}
            className={`px-2 py-1 rounded ${
              activeTileLayer === 'streets'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => setActiveTileLayer('light')}
            className={`px-2 py-1 rounded ${
              activeTileLayer === 'light'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clean
          </button>
          <button
            onClick={() => setActiveTileLayer('topo')}
            className={`px-2 py-1 rounded ${
              activeTileLayer === 'topo'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terrain
          </button>
        </div>

        {allowClickToPin && (
          <span className="hidden md:inline-flex text-[11px] text-slate-500 items-center gap-1 pl-1">
            <Crosshair className="w-3 h-3 text-slate-400" />
            Click anywhere on map to pin real coordinates
          </span>
        )}
      </div>

      {/* Geolocation Error Alert if any */}
      {geoError && (
        <div className="absolute top-14 left-3 right-3 z-[1000] bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={() => setGeoError(null)}
            className="text-red-500 font-bold hover:text-red-800 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Selected Address Tag */}
      {detectedAddress && (
        <div className="absolute bottom-3 left-3 right-16 z-[1000] bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 truncate border border-slate-700 shadow-md">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong className="text-amber-400">Pinned Real Location:</strong> {detectedAddress}
          </span>
        </div>
      )}

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} className="z-0" />
    </div>
  );
};
