import React from 'react';
import {
  X,
  Database,
  MapPin,
  ShieldCheck,
  Code,
  CheckCircle2,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                BCA Final Year Technical Architecture
              </span>
              <h3 className="text-lg font-bold text-white">
                MediCare Nagpur: System & Integration Architecture
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Current Active Mode */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-teal-950 text-sm">
                Active Execution Mode: Standalone Persistent Demo Engine
              </h4>
              <p className="text-teal-900">
                The application is running in a fully functional, zero-latency demo mode with browser persistence (localStorage), realistic Nagpur medical datasets, slot collision protection, and geolocation calculations.
              </p>
            </div>
          </div>

          {/* Database & Firestore Configuration */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              1. Cloud Firestore Schema (Ready for Production)
            </h4>
            <p className="text-slate-600">
              The project is architected with a decoupled data layer (`StorageService`) that mirrors Firebase Firestore document collections:
            </p>
            <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-[11px] overflow-x-auto">
              <div>// Collection: 'appointments'</div>
              <div>{'{'}</div>
              <div className="pl-4">id: "MCN-2026-8491",</div>
              <div className="pl-4">doctorId: "doc-1",</div>
              <div className="pl-4">date: "2026-10-20",</div>
              <div className="pl-4">timeSlot: "11:00 AM",</div>
              <div className="pl-4">patientName: "Rahul Sharma",</div>
              <div className="pl-4">status: "confirmed" | "cancelled" | "rescheduled"</div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Google Maps & Geolocation Architecture */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              2. Real GPS & Haversine Distance Engine
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Browser Geolocation API:</strong> Requests GPS permission ONLY when user clicks "Find Nearby Clinics" or "Use Current Location".
              </li>
              <li>
                <strong>Haversine Formula:</strong> Calculates straight-line and road-approximated driving distance from user coordinates to Nagpur clinics (Dharampeth, Dhantoli, Ramdaspeth, etc.).
              </li>
              <li>
                <strong>Fallback Architecture:</strong> If GPS is denied or unavailable, users can select any Nagpur locality from the dropdown to estimate distances instantly.
              </li>
              <li>
                <strong>Google Maps Deep Link:</strong> Generates dynamic route parameters to open Google Maps turn-by-turn navigation directly.
              </li>
            </ul>
          </div>

          {/* Testing Guide for Viva / Demo */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Key Demonstration Flows for Evaluators
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 text-[11px]">
              <li>
                <strong>Duplicate Slot Prevention:</strong> Book Dr. Anand Deshmukh at 10:00 AM. Try booking the same slot again to see the real-time collision block.
              </li>
              <li>
                <strong>Reschedule & Cancellation:</strong> Visit "Patient Portal", click "Reschedule" or "Cancel Appointment" to watch the slot get unlocked instantly.
              </li>
              <li>
                <strong>Language Toggle:</strong> Click "हिन्दी" in the navigation bar to observe instant dual-language switching across all components.
              </li>
              <li>
                <strong>Emergency Helpline:</strong> Click the red "Emergency 24x7" button to see one-tap calling for 108/112 and GMCH / AIIMS Nagpur routes.
              </li>
            </ol>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
