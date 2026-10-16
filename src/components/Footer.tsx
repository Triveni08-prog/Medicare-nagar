import React from 'react';
import {
  HeartPulse,
  MapPin,
  Phone,
  ShieldAlert,
  Info,
  ExternalLink,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: Language;
  onOpenEmergencyModal: () => void;
  onOpenInfoModal: () => void;
  onOpenContactModal: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenEmergencyModal,
  onOpenInfoModal,
  onOpenContactModal,
  onNavigateSection,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      {/* Emergency Strip */}
      <div className="bg-rose-950/70 border-b border-rose-900/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-rose-200 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {language === 'hi'
                ? 'नागपुर आपातकालीन सहायता: 108 (एम्बुलेंस) | 112 (राष्ट्रीय आपातकाल) | मेडिकल कॉलेज 0712-2744400'
                : 'Nagpur 24x7 Emergency: Dial 108 (Ambulance) | 112 (National Helpline) | GMCH 0712-2744400'}
            </span>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shrink-0 shadow-xs"
          >
            {language === 'hi' ? 'आपातकालीन नंबर देखें' : 'View Helplines'}
          </button>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-white">
                MediCare Nagpur
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'hi'
                ? 'नागपुर, महाराष्ट्र में मरीजों के लिए प्रमाणित डॉक्टर अपॉइंटमेंट बुकिंग, क्लिनिक दूरी गणना और 24x7 आपातकालीन सहायता मंच।'
                : 'Doctor appointment scheduling, verified clinic locator, GPS distances, and 24x7 emergency medical contacts for Nagpur, Maharashtra.'}
            </p>
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nagpur, Maharashtra 440001</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigateSection('home')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('doctors')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.navDoctors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('clinics')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.navClinics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('health-tips')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.navHealthTips}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('dashboard')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.navDashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Nagpur Localities Served */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Nagpur Service Areas
            </h4>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {[
                'Dharampeth',
                'Dhantoli',
                'Ramdaspeth',
                'Sitabuldi',
                'Sadar',
                'Wardha Road',
                'Medical Square',
                'Mankapur',
                'Laxmi Nagar',
              ].map((area) => (
                <span
                  key={area}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Project Details & Feedback */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic & Support
            </h4>
            <p className="text-[11px] text-slate-400">
              Bachelor of Computer Applications (BCA) Final Year Project Demonstration.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenInfoModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 hover:text-teal-300 text-xs font-semibold"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Architecture & Firestore Guide</span>
              </button>
              <button
                onClick={onOpenContactModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact / Feedback</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Medical Disclaimers */}
        <div className="pt-8 border-t border-slate-900 space-y-3 text-[11px] text-slate-500">
          <p className="leading-relaxed">
            <strong>Medical Disclaimer:</strong> MediCare Nagpur is an online informational facilitation portal and booking scheduler. It does NOT provide direct medical care, diagnosis, or triage. For life-threatening symptoms, chest pain, stroke, or major physical trauma, call 108 or 112 immediately or rush to the nearest casualty department (Government Medical College & Hospital or AIIMS Nagpur).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[10px] text-slate-600">
            <span>© 2026 MediCare Nagpur • BCA Final Year Project. All rights reserved.</span>
            <span>Nagpur, Maharashtra, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
