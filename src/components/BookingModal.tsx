import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Printer,
  ShieldCheck,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment, Doctor, Language, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { translations } from '../i18n/translations';

interface BookingModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  language: Language;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  currentUser,
  language,
  onBookingSuccess,
}) => {
  if (!isOpen || !doctor) return null;

  const t = translations[language];

  // Generate next 14 available days
  const availableDates: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayStr = d.toISOString().split('T')[0];
    const displayStr = d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    availableDates.push({ label: displayStr, value: dayStr });
  }

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].value);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>(currentUser?.name || '');
  const [patientAge, setPatientAge] = useState<string>(currentUser?.age ? String(currentUser.age) : '30');
  const [patientPhone, setPatientPhone] = useState<string>(currentUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState<string>(currentUser?.email || '');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>(
    currentUser?.gender || 'male'
  );
  const [reasonForVisit, setReasonForVisit] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Status & Confirmation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check which slots on the selected date are already booked
  const bookedAppointments = StorageService.getAppointmentsForDoctorOnDate(doctor.id, selectedDate);
  const bookedSlotsSet = new Set(bookedAppointments.map((a) => a.timeSlot));

  const handleSlotSelect = (slot: string) => {
    if (bookedSlotsSet.has(slot)) return;
    setSelectedSlot(slot);
    setErrorMsg(null);
  };

  const validateForm = (): boolean => {
    if (!selectedSlot) {
      setErrorMsg(language === 'hi' ? 'कृपया उपलब्ध समय स्लॉट चुनें।' : 'Please select an available OPD time slot.');
      return false;
    }
    if (!patientName.trim() || patientName.trim().length < 2) {
      setErrorMsg(language === 'hi' ? 'कृपया मरीज का वैध नाम दर्ज करें।' : 'Please enter a valid patient full name.');
      return false;
    }
    const ageNum = parseInt(patientAge, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setErrorMsg(language === 'hi' ? 'कृपया वैध उम्र (1 से 120 वर्ष) दर्ज करें।' : 'Please enter a valid age (1-120 years).');
      return false;
    }
    const phoneClean = patientPhone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit Indian mobile number.');
      return false;
    }
    if (!patientEmail.includes('@') || !patientEmail.includes('.')) {
      setErrorMsg(language === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return false;
    }
    if (!reasonForVisit.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया परामर्श का कारण या लक्षण लिखें।' : 'Please describe your reason for visit or symptoms.');
      return false;
    }
    if (!termsAccepted) {
      setErrorMsg(language === 'hi' ? 'कृपया नियम व शर्तें स्वीकार करें।' : 'Please accept the consultation terms.');
      return false;
    }
    return true;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = StorageService.createAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        clinicId: doctor.clinicId,
        clinicName: doctor.clinicName,
        clinicAddress: doctor.clinicAddress,
        date: selectedDate,
        timeSlot: selectedSlot,
        patientName: patientName.trim(),
        patientAge: parseInt(patientAge, 10),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        patientGender,
        reasonForVisit: reasonForVisit.trim(),
        consultationFee: doctor.consultationFee,
        userId: currentUser?.id,
      });

      setIsSubmitting(false);

      if (!result.success || !result.appointment) {
        setErrorMsg(result.errorMessage || t.slotUnavailableError);
        return;
      }

      setConfirmedAppointment(result.appointment);
      onBookingSuccess(result.appointment);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#0284c7', '#10b981'],
        });
      } catch (err) {
        // silent fallback
      }
    }, 400);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleResetAndClose = () => {
    setConfirmedAppointment(null);
    setSelectedSlot('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-teal-200">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 border border-teal-300/30">
                {language === 'hi' ? doctor.specialty : doctor.specialty}
              </span>
              <h2 className="text-lg sm:text-xl font-bold mt-1">
                {language === 'hi' ? doctor.nameHi : doctor.name}
              </h2>
              <p className="text-xs text-teal-100/90 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {doctor.clinicName} • {doctor.locality}, Nagpur
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Summary Strip */}
        <div className="px-5 py-2.5 bg-teal-50 border-b border-teal-100 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-900">
          <div className="flex items-center gap-4">
            <span>
              <strong>{t.consultationFee}:</strong> ₹{doctor.consultationFee}
            </span>
            <span>•</span>
            <span>
              <strong>OPD Hours:</strong> {doctor.workingHours}
            </span>
          </div>
          <div className="text-[11px] font-semibold text-teal-700 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
            Pay at Clinic Reception
          </div>
        </div>

        {/* Modal Body: Either Confirmed Receipt OR Booking Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {confirmedAppointment ? (
            /* Confirmation Slip View */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.bookingSuccessTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'कृपया अपॉइंटमेंट के समय क्लिनिक रिसेप्शन पर यह डिजिटल टोकन दिखाएं।'
                    : 'Show this digital token slip at the clinic reception on arrival.'}
                </p>
              </div>

              {/* Printable Token Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-teal-300 text-left space-y-4 print:border-solid">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      MediCare Nagpur OPD Token
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {confirmedAppointment.id}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Doctor:</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedAppointment.doctorName}
                    </span>
                    <span className="text-[11px] text-teal-700 block">
                      {confirmedAppointment.doctorSpecialty}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Clinic:</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedAppointment.clinicName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {confirmedAppointment.clinicAddress}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Scheduled Date:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {confirmedAppointment.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Time Slot:</span>
                    <span className="font-bold text-teal-700 text-sm">
                      {confirmedAppointment.timeSlot}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <span className="font-semibold text-slate-800">
                      {confirmedAppointment.patientName} ({confirmedAppointment.patientAge}y, {confirmedAppointment.patientGender})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Consultation Fee:</span>
                    <span className="font-bold text-slate-900">
                      ₹{confirmedAppointment.consultationFee} (Pay at Clinic)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Contact: +91 {confirmedAppointment.patientPhone}</span>
                  <span>Nagpur, Maharashtra</span>
                </div>
              </div>

              {/* Action Buttons on Confirmation */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  {t.printSlip}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                >
                  {t.closeModal}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form View */
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Select Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {t.selectDate}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {availableDates.map((d) => (
                    <button
                      type="button"
                      key={d.value}
                      onClick={() => {
                        setSelectedDate(d.value);
                        setSelectedSlot('');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        selectedDate === d.value
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Slot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {t.selectSlot}
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {bookedSlotsSet.size > 0
                      ? `${bookedSlotsSet.size} ${language === 'hi' ? 'स्लॉट आरक्षित' : 'slot(s) booked'}`
                      : `${doctor.slots.length} ${language === 'hi' ? 'स्लॉट उपलब्ध' : 'slots open'}`}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {doctor.slots.map((slot) => {
                    const isBooked = bookedSlotsSet.has(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={isBooked}
                        onClick={() => handleSlotSelect(slot)}
                        className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center justify-center ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm scale-102 ring-2 ring-teal-400/40'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        <span>{slot}</span>
                        {isBooked && (
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-normal">
                            {t.slotBooked}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Patient Form */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  {t.step2Details}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t.patientFullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50/50"
                    />
                  </div>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t.patientAge} *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t.patientGender}
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      >
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                        <option value="other">{t.other}</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t.patientPhone} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9823012345"
                        className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t.patientEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Reason for visit */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t.reasonForVisit} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    placeholder={t.reasonPlaceholder}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50/50"
                  />
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 select-none">
                    {t.termsAgreement}
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isSubmitting ? t.loading : t.confirmBookingBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
