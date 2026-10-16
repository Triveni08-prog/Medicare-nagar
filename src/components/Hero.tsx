import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  ShieldAlert,
  Stethoscope,
  Heart,
  Smile,
  Sparkles,
  Baby,
  Users,
  Bone,
  Eye,
  Ear,
  Building2,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { Language, Specialty } from '../types';
import { translations } from '../i18n/translations';

interface HeroProps {
  language: Language;
  onSearch: (query: string) => void;
  onSelectSpecialty: (specialty: Specialty | 'All') => void;
  onFindNearbyClinics: () => void;
  onOpenEmergencyModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onSearch,
  onSelectSpecialty,
  onFindNearbyClinics,
  onOpenEmergencyModal,
}) => {
  const t = translations[language];
  const [searchInput, setSearchInput] = useState('');

  const specialties: { name: Specialty; icon: React.ReactNode; color: string }[] = [
    {
      name: 'General Physician',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
    },
    {
      name: 'Cardiologist',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
    },
    {
      name: 'Dentist',
      icon: <Smile className="w-5 h-5" />,
      color: 'bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-teal-600 group-hover:text-white',
    },
    {
      name: 'Dermatologist',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
    },
    {
      name: 'Pediatrician',
      icon: <Baby className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
    },
    {
      name: 'Gynecologist',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-pink-50 text-pink-700 border-pink-200 group-hover:bg-pink-600 group-hover:text-white',
    },
    {
      name: 'Orthopedic',
      icon: <Bone className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
    },
    {
      name: 'Eye Specialist',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white',
    },
    {
      name: 'ENT',
      icon: <Ear className="w-5 h-5" />,
      color: 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Badges & Service City Indicator */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 shadow-2xs text-xs font-bold text-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.heroBadge} • Nagpur, Maharashtra</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            <span>{t.heroTitlePart1} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
              {t.heroTitlePart2}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Main Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-2 max-w-2xl mx-auto"
          >
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-3xl shadow-lg border border-slate-200/90 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-teal-600 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-3 pr-2 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-bold text-xs sm:text-sm hover:bg-teal-700 transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t.searchButton}</span>
              </button>
            </div>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onFindNearbyClinics}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.findNearbyClinicsBtn}</span>
            </button>

            <button
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.emergencyButton}</span>
            </button>
          </div>

          {/* City Stats Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.quickStatsDoctors}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.quickStatsClinics}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.quickStatsLocalities}</span>
            </div>
          </div>
        </div>

        {/* Quick Specialties Grid */}
        <div className="pt-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
              {t.specialtiesHeading}
            </h2>
            <p className="text-xs text-slate-500">
              {t.specialtiesSubheading}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {specialties.map((spec) => (
              <button
                key={spec.name}
                onClick={() => onSelectSpecialty(spec.name)}
                className="group p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${spec.color}`}
                >
                  {spec.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-700 leading-tight">
                  {spec.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
