import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  CheckCircle,
  User,
  Send,
  Calendar,
} from 'lucide-react';
import { Doctor, DoctorReview, Language } from '../types';
import { StorageService } from '../services/storage';

interface ReviewsModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onReviewAdded: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  doctor,
  isOpen,
  onClose,
  language,
  onReviewAdded,
}) => {
  if (!isOpen || !doctor) return null;

  const [reviews, setReviews] = useState<DoctorReview[]>(() =>
    StorageService.getReviewsForDoctor(doctor.id)
  );
  const [newRating, setNewRating] = useState<number>(5);
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newComment.trim()) return;

    const created = StorageService.addReview(
      doctor.id,
      newPatientName.trim(),
      newRating,
      newComment.trim()
    );

    setReviews([created, ...reviews]);
    setNewPatientName('');
    setNewComment('');
    setSubmittedMessage(
      language === 'hi'
        ? 'आपकी समीक्षा सफलतापूर्वक प्रकाशित हो गई है।'
        : 'Thank you! Your verified patient review has been published.'
    );
    onReviewAdded();

    setTimeout(() => {
      setSubmittedMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs text-teal-400 font-bold uppercase tracking-wider">
                <span>{doctor.specialty}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {doctor.rating} ({doctor.totalReviews} reviews)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'hi' ? doctor.nameHi : doctor.name}
              </h3>
              <p className="text-xs text-slate-400">{doctor.clinicName}, Nagpur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Doctor Bio */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-950 space-y-1">
            <span className="font-bold uppercase tracking-wider text-teal-800 text-[10px]">
              About Doctor
            </span>
            <p className="leading-relaxed">
              {language === 'hi' ? doctor.aboutHi : doctor.about}
            </p>
          </div>

          {/* Existing Reviews List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              Verified Patient Reviews ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No reviews yet. Be the first to review this doctor!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {rev.patientName}
                        </span>
                        {rev.verifiedPatient && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Verified Visit
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 ml-1">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="pt-4 border-t border-slate-200 space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'अपनी समीक्षा लिखें' : 'Write a Patient Review'}
            </h4>

            {submittedMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {submittedMessage}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 hover:scale-115 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Ramesh K."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Feedback & Experience at Clinic
              </label>
              <textarea
                rows={2}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience regarding treatment, waiting time, or doctor bedside manner..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              {language === 'hi' ? 'समीक्षा जमा करें' : 'Post Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
