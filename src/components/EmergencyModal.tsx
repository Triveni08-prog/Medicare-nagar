import React from 'react';
import {
  X,
  Phone,
  AlertTriangle,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { EmergencyHospital, Language } from '../types';
import { translations } from '../i18n/translations';
import { GeoCoordinates, getGoogleMapsDirectionsUrl } from '../services/geoService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: EmergencyHospital[];
  userLocation: GeoCoordinates | null;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  hospitals,
  userLocation,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Urgent Emergency Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white text-rose-700">
                24x7 Critical Medical Helpline
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {t.emergencyTitle}
              </h2>
              <p className="text-xs text-rose-100/90 mt-0.5">
                {t.emergencySubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Disclaimer Notice */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              {language === 'hi'
                ? 'जरूरी चेतावनी: आपातकाल में ऑनलाइन बुकिंग या रजिस्ट्रेशन का इंतजार न करें!'
                : 'CRITICAL NOTICE: Do not delay emergency care for app registration!'}
            </p>
            <p className="text-[11px] text-amber-900">
              {t.emergencyDisclaimer}
            </p>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick National Helplines (Big Tap-to-Call Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 108 Ambulance */}
            <a
              href="tel:108"
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:border-rose-400 hover:bg-rose-100/80 transition-all text-center flex flex-col items-center justify-center group shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-rose-700">108</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">
                {t.ambulanceService}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                {language === 'hi' ? 'तुरंत डायल करें' : 'Tap to Call'}
              </span>
            </a>

            {/* 112 National Helpline */}
            <a
              href="tel:112"
              className="p-4 rounded-2xl bg-sky-50 border border-sky-200 hover:border-sky-400 hover:bg-sky-100/80 transition-all text-center flex flex-col items-center justify-center group shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-sky-800">112</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">
                {t.nationalEmergency}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-full border border-sky-200">
                {language === 'hi' ? 'ऑल-इन-वन सेवा' : 'Police / Fire / Med'}
              </span>
            </a>

            {/* 102 Maternity Ambulance */}
            <a
              href="tel:102"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/80 transition-all text-center flex flex-col items-center justify-center group shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-emerald-800">102</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">
                {t.pregnancyAmbulance}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {language === 'hi' ? 'मातृ एवं शिशु सेवा' : 'Maternity Care'}
              </span>
            </a>
          </div>

          {/* Nagpur Emergency Trauma Hospitals List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" />
                {t.majorTraumaCenters}
              </h3>
              <span className="text-[11px] text-slate-500">Nagpur, Maharashtra</span>
            </div>

            <div className="space-y-3">
              {hospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {hosp.type}
                      </span>
                      {hosp.hasBloodBank && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          Blood Bank
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {language === 'hi' ? hosp.nameHi : hosp.name}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {hosp.address}
                    </p>
                  </div>

                  {/* Actions for this hospital */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    <a
                      href={`tel:${hosp.emergencyPhone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {hosp.emergencyPhone}
                    </a>
                    <a
                      href={getGoogleMapsDirectionsUrl(hosp.coordinates, hosp.name, userLocation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                      title="Navigate with Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t.getDirections}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
          {t.emergencyBedWarning}
        </div>
      </div>
    </div>
  );
};
