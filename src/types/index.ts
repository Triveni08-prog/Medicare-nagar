export type Language = 'en' | 'hi';

export type Specialty =
  | 'General Physician'
  | 'Cardiologist'
  | 'Dentist'
  | 'Dermatologist'
  | 'Pediatrician'
  | 'Gynecologist'
  | 'Orthopedic'
  | 'Eye Specialist'
  | 'ENT';

export interface Doctor {
  id: string;
  name: string;
  nameHi: string;
  specialty: Specialty;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  clinicId: string;
  clinicName: string;
  clinicNameHi: string;
  clinicAddress: string;
  locality: string;
  gender: 'male' | 'female';
  rating: number;
  totalReviews: number;
  workingHours: string;
  availableDays: string[];
  slots: string[];
  languagesSpoken: string[];
  about: string;
  aboutHi: string;
  isDemoVerified: boolean;
  registrationNumber: string;
  imageUrl: string;
}

export interface Clinic {
  id: string;
  name: string;
  nameHi: string;
  address: string;
  locality: string;
  pincode: string;
  phone: string;
  specialties: Specialty[];
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  isEmergencyAvailable: boolean;
  isDemoVerified: boolean;
  imageUrl: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  clinicId: string;
  clinicName: string;
  clinicAddress: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  patientEmail: string;
  patientGender: 'male' | 'female' | 'other';
  reasonForVisit: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed';
  consultationFee: number;
  bookingTimestamp: string;
  cancellationReason?: string;
  userId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPatient: boolean;
}

export interface EmergencyHospital {
  id: string;
  name: string;
  nameHi: string;
  type: string;
  address: string;
  locality: string;
  emergencyPhone: string;
  ambulancePhone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hasTraumaCenter: boolean;
  hasBloodBank: boolean;
  googleMapsUrl: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  categoryHi: string;
  summary: string;
  summaryHi: string;
  readTime: string;
  content: string[];
  contentHi: string[];
  date: string;
  author: string;
  tag: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  category: string;
}
