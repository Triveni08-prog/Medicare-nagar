import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Layers,
  Map,
  Filter,
} from 'lucide-react';
import { Clinic, EmergencyHospital, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  calculateHaversineDistance,
  estimateDrivingMinutes,
  GeoCoordinates,
  getGoogleMapsDirectionsUrl,
  LOCALITY_COORDINATES,
} from '../services/geoService';
import { InteractiveMap } from './InteractiveMap';

interface ClinicDirectoryProps {
  clinics: Clinic[];
  emergencyHospitals: EmergencyHospital[];
  userLocation: GeoCoordinates | null;
  selectedLocality: string;
  onLocalityChange: (locality: string) => void;
  onRequestUserLocation: () => void;
  locationLoading: boolean;
  locationError: string | null;
  language: Language;
  onSelectDoctorForClinic: (clinicId: string) => void;
  onOpenEmergencyModal: () => void;
}

export const ClinicDirectory: React.FC<ClinicDirectoryProps> = ({
  clinics,
  emergencyHospitals,
  userLocation,
  selectedLocality,
  onLocalityChange,
  onRequestUserLocation,
  locationLoading,
  locationError,
  language,
  onSelectDoctorForClinic,
  onOpenEmergencyModal,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFacility, setSelectedFacility] = useState<string>('All');

  const activeUserPos = userLocation
    ? userLocation
    : selectedLocality !== 'All Localities' && LOCALITY_COORDINATES[selectedLocality]
    ? LOCALITY_COORDINATES[selectedLocality]
    : null;

  const facilitiesList = [
    'All',
    'In-house Pharmacy',
    'Digital ECG',
    'Digital X-Ray',
    'Pathology Lab',
    'Wheelchair Access',
  ];

  const filteredClinics = clinics.filter((c) => {
    const matchesLocality =
      selectedLocality === 'All Localities' || c.locality === selectedLocality;
    const matchesFacility =
      selectedFacility === 'All' || c.facilities.some((f) => f.includes(selectedFacility));
    return matchesLocality && matchesFacility;
  });

  return (
    <section id="clinics" className="py-10 sm:py-14 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Nagpur Polyclinics & Centers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.clinicDirectoryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t.clinicDirectorySubtitle}
            </p>
          </div>

          {/* Toggle Map / List View */}
          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-2xs self-start md:self-end">
            <button
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards View ({filteredClinics.length})</span>
            </button>
          </div>
        </div>

        {/* View Mode: Map or Cards */}
        {viewMode === 'map' ? (
          <InteractiveMap
            clinics={filteredClinics}
            emergencyHospitals={emergencyHospitals}
            userLocation={userLocation}
            selectedLocality={selectedLocality}
            onLocalityChange={onLocalityChange}
            onRequestUserLocation={onRequestUserLocation}
            locationLoading={locationLoading}
            locationError={locationError}
            language={language}
            onSelectDoctorForBooking={onSelectDoctorForClinic}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        ) : (
          <div className="space-y-6">
            {/* Filter bar for List */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Facility:
                </span>
                {facilitiesList.map((fac) => (
                  <button
                    key={fac}
                    onClick={() => setSelectedFacility(fac)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all border whitespace-nowrap ${
                      selectedFacility === fac
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fac}
                  </button>
                ))}
              </div>

              <div className="text-slate-500 text-xs">
                Showing <strong>{filteredClinics.length}</strong> clinics in Nagpur
              </div>
            </div>

            {/* Clinic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinics.map((clinic) => {
                const distance = activeUserPos
                  ? calculateHaversineDistance(activeUserPos, clinic.coordinates)
                  : null;
                const eta = distance ? estimateDrivingMinutes(distance) : null;

                return (
                  <div
                    key={clinic.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={clinic.imageUrl}
                          alt={clinic.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-800 shadow-sm border border-slate-200">
                          {clinic.locality}, Nagpur
                        </div>

                        {distance !== null && (
                          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                            <Navigation className="w-3.5 h-3.5 text-teal-400" />
                            <span>{distance} km (~{eta} min)</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {language === 'hi' ? clinic.nameHi : clinic.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{clinic.address}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{clinic.workingHours}</span>
                        </div>

                        {/* Specialties Chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {clinic.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Facilities */}
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                          <span className="font-semibold text-slate-700 block">
                            Facilities & Diagnostic:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {clinic.facilities.map((fac) => (
                              <span
                                key={fac}
                                className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <a
                        href={getGoogleMapsDirectionsUrl(
                          clinic.coordinates,
                          clinic.name,
                          activeUserPos
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </a>

                      <button
                        onClick={() => onSelectDoctorForClinic(clinic.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
                      >
                        <span>Doctors</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
