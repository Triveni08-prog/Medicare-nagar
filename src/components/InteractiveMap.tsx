import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  Calendar,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Clinic, EmergencyHospital, Language } from '../types';
import {
  calculateHaversineDistance,
  estimateDrivingMinutes,
  GeoCoordinates,
  getGoogleMapsDirectionsUrl,
  LOCALITY_COORDINATES,
} from '../services/geoService';
import { translations } from '../i18n/translations';

interface InteractiveMapProps {
  clinics: Clinic[];
  emergencyHospitals: EmergencyHospital[];
  userLocation: GeoCoordinates | null;
  selectedLocality: string;
  onLocalityChange: (locality: string) => void;
  onRequestUserLocation: () => void;
  locationLoading: boolean;
  locationError: string | null;
  language: Language;
  onSelectDoctorForBooking?: (clinicId: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  clinics,
  emergencyHospitals,
  userLocation,
  selectedLocality,
  onLocalityChange,
  onRequestUserLocation,
  locationLoading,
  locationError,
  language,
  onSelectDoctorForBooking,
  onOpenEmergencyModal,
}) => {
  const t = translations[language];
  const [selectedEntity, setSelectedEntity] = useState<
    | { type: 'clinic'; data: Clinic }
    | { type: 'hospital'; data: EmergencyHospital }
    | null
  >({ type: 'clinic', data: clinics[0] });

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState<boolean>(false);

  // Map bounding box around Nagpur
  // Latitude: ~21.00 (South - MIHAN/AIIMS) to ~21.22 (North - Koradi/Mankapur)
  // Longitude: ~78.98 (West) to ~79.18 (East)
  const mapBounds = {
    minLat: 21.02,
    maxLat: 21.21,
    minLng: 79.01,
    maxLng: 79.14,
  };

  const projectToMapPercent = (coord: GeoCoordinates) => {
    const latPercent =
      100 - ((coord.lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    const lngPercent =
      ((coord.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;

    // Clamping to stay visually inside SVG
    const clampedY = Math.max(8, Math.min(92, latPercent));
    const clampedX = Math.max(8, Math.min(92, lngPercent));
    return { x: clampedX, y: clampedY };
  };

  const activeUserPos = userLocation
    ? userLocation
    : selectedLocality !== 'All Localities' && LOCALITY_COORDINATES[selectedLocality]
    ? LOCALITY_COORDINATES[selectedLocality]
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 text-teal-700">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              {language === 'hi' ? 'नागपुर जीपीएस इंटरेक्टिव मैप' : 'Nagpur Interactive Healthcare Map'}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Coordinates
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi'
              ? 'क्लिनिक और ट्रॉमा सेंटरों पर क्लिक करके गूगल मैप्स पर दिशा-निर्देश प्राप्त करें।'
              : 'Click any medical pin for distance, driving ETA, and direct Google Maps navigation.'}
          </p>
        </div>

        {/* Location & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRequestUserLocation}
            disabled={locationLoading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              userLocation
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${locationLoading ? 'animate-spin' : ''}`} />
            {locationLoading
              ? language === 'hi' ? 'लोकेशन ले रहे हैं...' : 'Acquiring GPS...'
              : userLocation
              ? language === 'hi' ? '✓ लोकेशन सक्रिय' : '✓ GPS Active'
              : t.useCurrentLocation}
          </button>

          <button
            onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              showEmergencyOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            {language === 'hi' ? 'केवल 24x7 इमरजेंसी' : '24x7 Trauma Centers'}
          </button>
        </div>
      </div>

      {/* Locality Selector Pills */}
      <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap pl-1 pr-2">
          {language === 'hi' ? 'क्षेत्र चुनें:' : 'Quick Nagpur Area:'}
        </span>
        {['All Localities', 'Dharampeth', 'Dhantoli', 'Ramdaspeth', 'Sitabuldi', 'Sadar', 'Wardha Road', 'Medical Square', 'Mankapur'].map((loc) => (
          <button
            key={loc}
            onClick={() => onLocalityChange(loc)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
              selectedLocality === loc
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {locationError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Map Graphic Area */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-900 overflow-hidden select-none">
        {/* Nagpur City Vector Layout Background */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Subtle Grid / Roads simulation */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cityGrid)" />

            {/* Simulated Major Arterial Roads of Nagpur */}
            {/* Wardha Road (South to Central) */}
            <line x1="28%" y1="95%" x2="55%" y2="45%" stroke="#475569" strokeWidth="4" strokeDasharray="6,2" />
            <line x1="28%" y1="95%" x2="55%" y2="45%" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            {/* Amravati / WHC Road (West to Central) */}
            <line x1="8%" y1="42%" x2="55%" y2="45%" stroke="#475569" strokeWidth="3" />
            {/* Central Avenue (East-West) */}
            <line x1="55%" y1="45%" x2="94%" y2="48%" stroke="#475569" strokeWidth="3" />
            {/* Koradi Road (North) */}
            <line x1="55%" y1="45%" x2="52%" y2="5%" stroke="#475569" strokeWidth="3.5" />
            {/* Ring Road Loop */}
            <ellipse cx="50%" cy="50%" rx="38%" ry="36%" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="8,6" opacity="0.4" />
          </svg>

          {/* Area Labels on Map */}
          <div className="absolute top-[8%] left-[45%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Mankapur / Koradi Rd
          </div>
          <div className="absolute top-[28%] left-[44%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Sadar / Civil Lines
          </div>
          <div className="absolute top-[44%] left-[52%] text-[11px] font-bold tracking-widest text-teal-300/80 uppercase pointer-events-none">
            Sitabuldi (Zero Mile)
          </div>
          <div className="absolute top-[42%] left-[24%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Dharampeth / Shankar Nagar
          </div>
          <div className="absolute top-[52%] left-[42%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Ramdaspeth / Dhantoli
          </div>
          <div className="absolute top-[58%] left-[62%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Medical Sq (GMCH)
          </div>
          <div className="absolute top-[82%] left-[26%] text-[10px] font-semibold tracking-wider text-slate-400/80 uppercase pointer-events-none">
            Wardha Rd / MIHAN / AIIMS
          </div>

          {/* User Location Marker */}
          {activeUserPos && (
            (() => {
              const { x, y } = projectToMapPercent(activeUserPos);
              return (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute animate-ping h-8 w-8 rounded-full bg-sky-400 opacity-60"></span>
                    <span className="absolute h-5 w-5 rounded-full bg-sky-500 opacity-40"></span>
                    <div className="w-4 h-4 bg-sky-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-sky-950/90 text-sky-200 border border-sky-400/40 text-[10px] px-2 py-0.5 rounded-md font-semibold shadow">
                    {userLocation ? 'You are here' : `Simulated: ${selectedLocality}`}
                  </div>
                </div>
              );
            })()
          )}

          {/* Clinic Markers */}
          {!showEmergencyOnly &&
            clinics.map((clinic) => {
              const { x, y } = projectToMapPercent(clinic.coordinates);
              const isSelected =
                selectedEntity?.type === 'clinic' && selectedEntity.data.id === clinic.id;

              return (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedEntity({ type: 'clinic', data: clinic })}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform duration-200 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={clinic.name}
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-teal-500 border-white text-white ring-4 ring-teal-400/30'
                          : 'bg-teal-700/90 border-teal-300 text-teal-100 group-hover:bg-teal-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="mt-1 px-1.5 py-0.5 bg-slate-900/90 text-[9px] font-medium text-slate-200 rounded border border-slate-700 shadow whitespace-nowrap max-w-[110px] truncate">
                      {clinic.locality}
                    </span>
                  </div>
                </button>
              );
            })}

          {/* Emergency Hospital Markers */}
          {emergencyHospitals.map((hosp) => {
            const { x, y } = projectToMapPercent(hosp.coordinates);
            const isSelected =
              selectedEntity?.type === 'hospital' && selectedEntity.data.id === hosp.id;

            return (
              <button
                key={hosp.id}
                onClick={() => setSelectedEntity({ type: 'hospital', data: hosp })}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform duration-200 ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={hosp.name}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-rose-600 border-white text-white ring-4 ring-rose-400/40'
                        : 'bg-rose-700/95 border-rose-300 text-white group-hover:bg-rose-600'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 bg-rose-950/90 text-[9px] font-bold text-rose-200 rounded border border-rose-700 shadow whitespace-nowrap max-w-[120px] truncate">
                    {hosp.name.split('(')[0].trim()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map Float Controls: Zoom & Reset */}
        <div className="absolute right-3 top-3 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
            aria-label="Zoom in"
            className="w-8 h-8 rounded-lg bg-slate-800/90 text-white border border-slate-700 shadow flex items-center justify-center hover:bg-slate-700"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.2))}
            aria-label="Zoom out"
            className="w-8 h-8 rounded-lg bg-slate-800/90 text-white border border-slate-700 shadow flex items-center justify-center hover:bg-slate-700"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            aria-label="Reset zoom"
            className="w-8 h-8 rounded-lg bg-slate-800/90 text-white border border-slate-700 shadow flex items-center justify-center hover:bg-slate-700"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute left-3 bottom-3 z-30 bg-slate-900/90 backdrop-blur-xs border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span>Nagpur Clinics ({clinics.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>24x7 Trauma Centers ({emergencyHospitals.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-300/40"></span>
            <span>Your GPS / Locality</span>
          </div>
        </div>
      </div>

      {/* Selected Entity Card Details */}
      {selectedEntity && (
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    selectedEntity.type === 'hospital'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                  }`}
                >
                  {selectedEntity.type === 'hospital'
                    ? language === 'hi' ? '24x7 इमरजेंसी हॉस्पिटल' : '24x7 Emergency Hospital'
                    : language === 'hi' ? 'प्रमाणित क्लिनिक' : 'Nagpur Certified Clinic'}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedEntity.data.locality}, Nagpur
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'hi' ? selectedEntity.data.nameHi : selectedEntity.data.name}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {selectedEntity.data.address}
              </p>

              {/* Distance calculation */}
              {activeUserPos && (
                <div className="inline-flex items-center gap-2 mt-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {calculateHaversineDistance(activeUserPos, selectedEntity.data.coordinates)}{' '}
                    {t.distanceKm}
                  </span>
                  <span>•</span>
                  <span>
                    ~{estimateDrivingMinutes(calculateHaversineDistance(activeUserPos, selectedEntity.data.coordinates))}{' '}
                    {t.estTravelTime}
                  </span>
                </div>
              )}
            </div>

            {/* Actions for selected card */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              <a
                href={getGoogleMapsDirectionsUrl(
                  selectedEntity.data.coordinates,
                  selectedEntity.data.name,
                  activeUserPos
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.getDirections}
              </a>

              {selectedEntity.type === 'clinic' && onSelectDoctorForBooking && (
                <button
                  onClick={() => onSelectDoctorForBooking(selectedEntity.data.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'इस क्लिनिक में बुक करें' : 'Book at this Clinic'}
                </button>
              )}

              {selectedEntity.type === 'hospital' && (
                <a
                  href={`tel:${(selectedEntity.data as EmergencyHospital).emergencyPhone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'तुरंत कॉल करें' : 'Emergency Call'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
