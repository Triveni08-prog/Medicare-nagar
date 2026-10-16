import React, { useState } from 'react';
import {
  HeartPulse,
  MapPin,
  Globe,
  PhoneCall,
  User,
  Menu,
  X,
  ShieldAlert,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenInfoModal: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onOpenAuthModal,
  onOpenEmergencyModal,
  onOpenInfoModal,
  activeSection,
  onNavigateSection,
}) => {
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'doctors', label: t.navDoctors },
    { id: 'clinics', label: t.navClinics },
    { id: 'health-tips', label: t.navHealthTips },
    { id: 'faq', label: 'FAQ' },
    { id: 'dashboard', label: t.navDashboard },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top micro-bar with Nagpur City info & Language Switch */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-teal-400">
              <MapPin className="w-3 h-3" />
              <span>{t.nagpurMaharashtra}</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">
              Nagpur Healthcare Booking & Emergency Helpline
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Architecture Info Trigger */}
            <button
              onClick={onOpenInfoModal}
              className="text-[10px] text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
              title="View BCA Architecture & System details"
            >
              <Info className="w-3 h-3" />
              <span className="hidden xs:inline">Project Details</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-sky-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  MediCare
                </span>
                <span className="text-lg sm:text-xl font-black text-teal-600">
                  Nagpur
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-tight hidden sm:block">
                {language === 'hi' ? 'नागपुर क्लिनिक एवं डॉक्टर पोर्टल' : 'Doctor & Clinic Portal'}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeSection === item.id
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Emergency Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs hover:shadow-rose-600/20 transition-all animate-pulse"
              title="Emergency Medical Assistance"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{language === 'hi' ? 'इमरजेंसी 24x7' : 'Emergency 24x7'}</span>
            </button>

            {/* User Account Button */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-teal-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[90px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.navLogin}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenEmergencyModal}
              className="p-2 rounded-xl bg-rose-600 text-white shadow-xs"
              title="Emergency"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-5 bg-white border-b border-slate-200 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activeSection === item.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold text-left flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>
                  Portal: {currentUser.name} ({currentUser.email})
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold text-center"
              >
                {t.navLogin}
              </button>
            )}

            <button
              onClick={() => {
                onOpenEmergencyModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.emergencyButton}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
