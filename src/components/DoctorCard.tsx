import React from 'react';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Doctor, Language } from '../types';
import { translations } from '../i18n/translations';
import { getGoogleMapsDirectionsUrl, GeoCoordinates } from '../services/geoService';

interface DoctorCardProps {
  doctor: Doctor;
  language: Language;
  onBookAppointment: (doctor: Doctor) => void;
  onViewReviews: (doctor: Doctor) => void;
  userLocation: GeoCoordinates | null;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  language,
  onBookAppointment,
  onViewReviews,
  userLocation,
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Header Strip with Demo Council Tag */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-teal-600" />
            {t.demoVerifiedBadge}
          </span>
          <span className="text-slate-400 font-mono text-[10px]">
            {doctor.registrationNumber}
          </span>
        </div>

        {/* Doctor Info Section */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Doctor Photo */}
            <div className="relative shrink-0">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-102 transition-transform"
                loading="lazy"
              />
              <div className="absolute -bottom-2 -right-1.5 bg-white px-1.5 py-0.5 rounded-lg shadow-xs border border-slate-200 flex items-center gap-0.5 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
              </div>
            </div>

            {/* Doctor Basic Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {doctor.specialty}
                </span>
                <button
                  onClick={() => onViewReviews(doctor)}
                  className="text-[11px] text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span>({doctor.totalReviews})</span>
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {language === 'hi' ? doctor.nameHi : doctor.name}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                {doctor.qualifications}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  {doctor.experienceYears} {t.yearsExp}
                </span>
                <span>•</span>
                <span className="truncate">
                  {doctor.languagesSpoken.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Clinic & Location Details */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">
                  {language === 'hi' ? doctor.clinicNameHi : doctor.clinicName}
                </span>
              </div>
              <a
                href={getGoogleMapsDirectionsUrl(
                  { lat: 21.1458, lng: 79.0882 },
                  doctor.clinicName,
                  userLocation
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-0.5 shrink-0"
                title="View in Google Maps"
              >
                <span>Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 truncate">
              {doctor.clinicAddress}
            </p>

            <div className="flex items-center gap-1.5 text-slate-500 pl-5 text-[11px] pt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{doctor.workingHours}</span>
            </div>
          </div>

          {/* Quick Available Slots Preview */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
              <span>{t.nextAvailableSlot}:</span>
              <span className="text-teal-700 font-bold">{doctor.slots[0]} Today</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {doctor.slots.slice(0, 4).map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 whitespace-nowrap shadow-2xs"
                >
                  {slot}
                </span>
              ))}
              {doctor.slots.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium pl-1">
                  +{doctor.slots.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer with Fee & Book CTA */}
      <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 block">
            {t.consultationFee}
          </span>
          <span className="text-lg font-black text-slate-900">
            ₹{doctor.consultationFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewReviews(doctor)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/70 border border-slate-200 transition-colors"
            title="Read Reviews & Profile"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onBookAppointment(doctor)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs group-hover:bg-teal-700"
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.bookAppointment}
          </button>
        </div>
      </div>
    </div>
  );
};
