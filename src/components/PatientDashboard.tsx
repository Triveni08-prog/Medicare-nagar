import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Printer,
  Shield,
  LogOut,
  AlertCircle,
  Edit2,
  Save,
} from 'lucide-react';
import { Appointment, Doctor, Language, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { translations } from '../i18n/translations';

interface PatientDashboardProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
  language: Language;
  onOpenBookingForDoctor: (doctorId: string) => void;
  doctors: Doctor[];
  onOpenAuthModal: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  onLogout,
  language,
  doctors,
  onOpenAuthModal,
}) => {
  const t = translations[language];

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (!currentUser) return [];
    return StorageService.getAppointmentsByUserId(currentUser.id);
  });

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<UserProfile>(
    currentUser || {
      id: '',
      name: '',
      email: '',
      phone: '',
      age: 25,
      gender: 'male',
      bloodGroup: 'B+',
      address: '',
      emergencyContact: '',
    }
  );

  // Cancellation modal state
  const [cancellingAppId, setCancellingAppId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Rescheduling modal state
  const [reschedulingApp, setReschedulingApp] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Active view slip modal
  const [slipAppointment, setSlipAppointment] = useState<Appointment | null>(null);

  if (!currentUser) {
    return (
      <section id="dashboard" className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'मरीज पोर्टल में प्रवेश करें' : 'Sign in to Patient Portal'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'अपने आगामी अपॉइंटमेंट्स, पर्ची और स्वास्थ्य प्रोफ़ाइल देखने के लिए लॉग इन करें।'
              : 'Log in to manage your appointments, print OPD tokens, and update profile.'}
          </p>
          <button
            onClick={onOpenAuthModal}
            className="w-full py-3 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
          >
            {t.navLogin}
          </button>
        </div>
      </section>
    );
  }

  const upcomingList = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'rescheduled'
  );
  const historyList = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateUserProfile(profileData);
    setIsEditingProfile(false);
  };

  const handleConfirmCancel = () => {
    if (!cancellingAppId) return;
    StorageService.cancelAppointment(cancellingAppId, cancelReason);
    setAppointments(StorageService.getAppointmentsByUserId(currentUser.id));
    setCancellingAppId(null);
    setCancelReason('');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApp || !newRescheduleDate || !newRescheduleSlot) return;

    const res = StorageService.rescheduleAppointment(
      reschedulingApp.id,
      newRescheduleDate,
      newRescheduleSlot
    );

    if (!res.success) {
      setRescheduleError(res.errorMessage || 'Slot unavailable.');
      return;
    }

    setAppointments(StorageService.getAppointmentsByUserId(currentUser.id));
    setReschedulingApp(null);
    setNewRescheduleDate('');
    setNewRescheduleSlot('');
    setRescheduleError(null);
  };

  // Generate 7 days for reschedule
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const targetDoc = reschedulingApp
    ? doctors.find((d) => d.id === reschedulingApp.doctorId)
    : null;

  return (
    <section id="dashboard" className="py-10 sm:py-14 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  {currentUser.name}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Nagpur Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.phone} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-teal-600" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.navLogout}</span>
            </button>
          </div>
        </div>

        {/* Profile Details Edit Card */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="p-6 rounded-3xl bg-white border border-teal-200 shadow-sm space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Update Patient Health Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Blood Group</label>
                <select
                  value={profileData.bloodGroup}
                  onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={(e) =>
                    setProfileData({ ...profileData, emergencyContact: e.target.value })
                  }
                  placeholder="e.g. 9823098765 (Spouse)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Home Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="e.g. Dharampeth, Nagpur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Section 1: Upcoming Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>{t.upcomingAppointments}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                {upcomingList.length}
              </span>
            </h3>
          </div>

          {upcomingList.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">{t.noUpcoming}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingList.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {app.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {app.doctorName}
                      </h4>
                      <p className="text-xs text-teal-700 font-medium">
                        {app.doctorSpecialty}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'rescheduled'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {app.status === 'rescheduled' ? 'Rescheduled' : 'Confirmed'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {app.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-teal-700">
                        <Clock className="w-3.5 h-3.5" />
                        {app.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-500 pt-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{app.clinicName} • {app.clinicAddress}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    Reason: "{app.reasonForVisit}"
                  </p>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSlipAppointment(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.viewSlip}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReschedulingApp(app);
                          setNewRescheduleDate(app.date);
                          setNewRescheduleSlot('');
                          setRescheduleError(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => setCancellingAppId(app.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Past / Cancelled Appointments */}
        {historyList.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-700">
              {t.pastAppointments} ({historyList.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80">
              {historyList.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {app.doctorName} ({app.doctorSpecialty})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Date: {app.date} at {app.timeSlot} • {app.clinicName}
                  </p>
                  {app.cancellationReason && (
                    <p className="text-rose-600 text-[11px]">
                      Reason: {app.cancellationReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      {cancellingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 text-base">
                {t.confirmCancelPrompt}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Your booked time slot will be immediately freed up for other Nagpur patients.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t.cancellationReasonPrompt}
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule clash, feel better..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingAppId(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t.keepBooking}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
              >
                {t.yesCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApp && targetDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-900 text-base">
                {t.rescheduleTitle}
              </h4>
              <button
                onClick={() => setReschedulingApp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {rescheduleError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs">
                {rescheduleError}
              </div>
            )}

            {/* Pick Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select New Date
              </label>
              <select
                value={newRescheduleDate}
                onChange={(e) => {
                  setNewRescheduleDate(e.target.value);
                  setNewRescheduleSlot('');
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              >
                {nextDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Pick Slot */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Available Slot
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {targetDoc.slots.map((slot) => {
                  const isTaken = StorageService.isSlotBooked(
                    targetDoc.id,
                    newRescheduleDate,
                    slot
                  );
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isTaken}
                      onClick={() => setNewRescheduleSlot(slot)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                        isTaken
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                          : newRescheduleSlot === slot
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReschedulingApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newRescheduleDate || !newRescheduleSlot}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 text-xs font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slip Modal View */}
      {slipAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  MediCare Nagpur Token Receipt
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  {slipAppointment.id}
                </h4>
              </div>
              <button
                onClick={() => setSlipAppointment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p>
                <strong>Doctor:</strong> {slipAppointment.doctorName} (
                {slipAppointment.doctorSpecialty})
              </p>
              <p>
                <strong>Clinic:</strong> {slipAppointment.clinicName},{' '}
                {slipAppointment.clinicAddress}
              </p>
              <p>
                <strong>Date & Time:</strong> {slipAppointment.date} at{' '}
                {slipAppointment.timeSlot}
              </p>
              <p>
                <strong>Patient:</strong> {slipAppointment.patientName} (
                {slipAppointment.patientAge}y, {slipAppointment.patientGender})
              </p>
              <p>
                <strong>Consultation Fee:</strong> ₹
                {slipAppointment.consultationFee} (Pay at Clinic Reception)
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Print Slip
              </button>
              <button
                onClick={() => setSlipAppointment(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
