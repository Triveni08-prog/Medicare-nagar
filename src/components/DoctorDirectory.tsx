import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import { Doctor, Language, Specialty, UserProfile } from '../types';
import { DoctorCard } from './DoctorCard';
import { translations } from '../i18n/translations';
import { NAGPUR_LOCALITIES } from '../data/nagpurData';
import { GeoCoordinates } from '../services/geoService';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  language: Language;
  onBookAppointment: (doctor: Doctor) => void;
  onViewReviews: (doctor: Doctor) => void;
  userLocation: GeoCoordinates | null;
  selectedSpecialtyFilter?: string;
  onSelectSpecialtyFilter?: (specialty: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  language,
  onBookAppointment,
  onViewReviews,
  userLocation,
  selectedSpecialtyFilter = 'All',
  onSelectSpecialtyFilter,
}) => {
  const t = translations[language];

  // Local state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    selectedSpecialtyFilter === 'All' ? 'All' : selectedSpecialtyFilter
  );
  const [selectedLocality, setSelectedLocality] = useState<string>('All Localities');
  const [maxFee, setMaxFee] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'feeLow' | 'feeHigh'>('rating');

  // Sync if prop changed
  React.useEffect(() => {
    if (selectedSpecialtyFilter) {
      setSelectedSpecialty(selectedSpecialtyFilter);
    }
  }, [selectedSpecialtyFilter]);

  const handleSpecialtyChange = (spec: string) => {
    setSelectedSpecialty(spec);
    if (onSelectSpecialtyFilter) onSelectSpecialtyFilter(spec);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedLocality('All Localities');
    setMaxFee(1000);
    setSortBy('rating');
    if (onSelectSpecialtyFilter) onSelectSpecialtyFilter('All');
  };

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Search term query
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          doc.name.toLowerCase().includes(term) ||
          doc.nameHi.toLowerCase().includes(term) ||
          doc.specialty.toLowerCase().includes(term) ||
          doc.clinicName.toLowerCase().includes(term) ||
          doc.locality.toLowerCase().includes(term);

        // Specialty filter
        const matchesSpecialty =
          selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

        // Locality filter
        const matchesLocality =
          selectedLocality === 'All Localities' || doc.locality === selectedLocality;

        // Fee filter
        const matchesFee = doc.consultationFee <= maxFee;

        return matchesSearch && matchesSpecialty && matchesLocality && matchesFee;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'feeLow') return a.consultationFee - b.consultationFee;
        if (sortBy === 'feeHigh') return b.consultationFee - a.consultationFee;
        return 0;
      });
  }, [doctors, searchTerm, selectedSpecialty, selectedLocality, maxFee, sortBy]);

  const specialtiesList: Specialty[] = [
    'General Physician',
    'Cardiologist',
    'Dentist',
    'Dermatologist',
    'Pediatrician',
    'Gynecologist',
    'Orthopedic',
    'Eye Specialist',
    'ENT',
  ];

  return (
    <section id="doctors" className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Nagpur Medical Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.doctorDirectoryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t.doctorDirectorySubtitle}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start md:self-end">
            <span className="font-bold text-teal-700">{filteredDoctors.length}</span>{' '}
            {t.doctorsFound}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          {/* Search Input Row */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Specialty Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => handleSpecialtyChange('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedSpecialty === 'All'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.allSpecialties}
            </button>
            {specialtiesList.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecialtyChange(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedSpecialty === spec
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Secondary Filter Dropdowns & Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 items-center">
            {/* Locality Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t.filterByLocality}
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
              >
                {NAGPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t.sortBy}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
              >
                <option value="rating">{t.sortRating}</option>
                <option value="experience">{t.sortExperience}</option>
                <option value="feeLow">{t.sortFeeLowHigh}</option>
                <option value="feeHigh">{t.sortFeeHighLow}</option>
              </select>
            </div>

            {/* Fee Filter */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>{t.consultationFee}</span>
                <span className="text-teal-700 font-extrabold text-xs">
                  ≤ ₹{maxFee}
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1000"
                step="50"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end h-full pt-1">
              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.clearFilters}
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {t.noDoctorsFound}
            </h3>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                language={language}
                onBookAppointment={onBookAppointment}
                onViewReviews={onViewReviews}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
