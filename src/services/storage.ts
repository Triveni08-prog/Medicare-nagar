import {
  Appointment,
  Clinic,
  Doctor,
  DoctorReview,
  UserProfile,
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CLINICS,
  INITIAL_DOCTORS,
  INITIAL_REVIEWS,
} from '../data/nagpurData';

const STORAGE_KEYS = {
  DOCTORS: 'medicare_nagpur_doctors',
  CLINICS: 'medicare_nagpur_clinics',
  APPOINTMENTS: 'medicare_nagpur_appointments',
  REVIEWS: 'medicare_nagpur_reviews',
  CURRENT_USER: 'medicare_nagpur_user',
  USERS_LIST: 'medicare_nagpur_registered_users',
  FEEDBACK: 'medicare_nagpur_feedback',
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-demo-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9823012345',
    age: 32,
    gender: 'male',
    bloodGroup: 'B+',
    address: 'Flat 302, Green Enclave, Dharampeth, Nagpur',
    emergencyContact: '9823098765 (Spouse)',
  },
  {
    id: 'user-demo-2',
    name: 'Pooja Patil',
    email: 'pooja.patil@example.com',
    phone: '9850198765',
    age: 29,
    gender: 'female',
    bloodGroup: 'O+',
    address: 'Plot 18, Central Bazar Road, Ramdaspeth, Nagpur',
    emergencyContact: '9850112233 (Father)',
  },
];

// Helper to load or seed localStorage
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Doctors
  getDoctors(): Doctor[] {
    return getStoredItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find((d) => d.id === id);
  },

  // Clinics
  getClinics(): Clinic[] {
    return getStoredItem<Clinic[]>(STORAGE_KEYS.CLINICS, INITIAL_CLINICS);
  },

  getClinicById(id: string): Clinic | undefined {
    return this.getClinics().find((c) => c.id === id);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getStoredItem<Appointment[]>(
      STORAGE_KEYS.APPOINTMENTS,
      INITIAL_APPOINTMENTS
    );
  },

  getAppointmentsByUserId(userId: string): Appointment[] {
    return this.getAppointments().filter((app) => app.userId === userId);
  },

  getAppointmentsForDoctorOnDate(doctorId: string, date: string): Appointment[] {
    return this.getAppointments().filter(
      (app) =>
        app.doctorId === doctorId &&
        app.date === date &&
        (app.status === 'confirmed' || app.status === 'rescheduled')
    );
  },

  isSlotBooked(doctorId: string, date: string, timeSlot: string): boolean {
    const apps = this.getAppointmentsForDoctorOnDate(doctorId, date);
    return apps.some((app) => app.timeSlot === timeSlot);
  },

  createAppointment(appointmentData: Omit<Appointment, 'id' | 'bookingTimestamp' | 'status'>): {
    success: boolean;
    appointment?: Appointment;
    errorMessage?: string;
  } {
    const appointments = this.getAppointments();

    // Check conflict for this doctor, date, and slot
    const slotTaken = appointments.some(
      (app) =>
        app.doctorId === appointmentData.doctorId &&
        app.date === appointmentData.date &&
        app.timeSlot === appointmentData.timeSlot &&
        (app.status === 'confirmed' || app.status === 'rescheduled')
    );

    if (slotTaken) {
      return {
        success: false,
        errorMessage: 'This time slot was just booked by another patient. Please choose another time slot.',
      };
    }

    // Check duplicate booking for same user on same slot
    if (appointmentData.userId) {
      const userDuplicate = appointments.some(
        (app) =>
          app.userId === appointmentData.userId &&
          app.date === appointmentData.date &&
          app.timeSlot === appointmentData.timeSlot &&
          (app.status === 'confirmed' || app.status === 'rescheduled')
      );
      if (userDuplicate) {
        return {
          success: false,
          errorMessage: 'You already have an appointment scheduled for this exact time slot.',
        };
      }
    }

    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `MCN-2026-${uniqueNumber}`,
      status: 'confirmed',
      bookingTimestamp: new Date().toISOString(),
    };

    appointments.unshift(newAppointment);
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    return {
      success: true,
      appointment: newAppointment,
    };
  },

  cancelAppointment(appointmentId: string, reason?: string): boolean {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) return false;

    appointments[index].status = 'cancelled';
    if (reason) {
      appointments[index].cancellationReason = reason;
    }
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    return true;
  },

  rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTimeSlot: string
  ): { success: boolean; errorMessage?: string } {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === appointmentId);
    if (index === -1) {
      return { success: false, errorMessage: 'Appointment record not found.' };
    }

    const app = appointments[index];

    // Check slot availability
    const slotTaken = appointments.some(
      (a) =>
        a.id !== appointmentId &&
        a.doctorId === app.doctorId &&
        a.date === newDate &&
        a.timeSlot === newTimeSlot &&
        (a.status === 'confirmed' || a.status === 'rescheduled')
    );

    if (slotTaken) {
      return {
        success: false,
        errorMessage: 'Selected time slot is already booked. Please choose a different slot.',
      };
    }

    appointments[index].date = newDate;
    appointments[index].timeSlot = newTimeSlot;
    appointments[index].status = 'rescheduled';
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    return { success: true };
  },

  // Reviews
  getReviewsForDoctor(doctorId: string): DoctorReview[] {
    const all = getStoredItem<DoctorReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return all.filter((r) => r.doctorId === doctorId);
  },

  addReview(doctorId: string, patientName: string, rating: number, comment: string): DoctorReview {
    const all = getStoredItem<DoctorReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview: DoctorReview = {
      id: `rev-${Date.now()}`,
      doctorId,
      patientName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPatient: true,
    };
    all.unshift(newReview);
    setStoredItem(STORAGE_KEYS.REVIEWS, all);

    // Update doctor's aggregate rating
    const doctors = this.getDoctors();
    const docIdx = doctors.findIndex((d) => d.id === doctorId);
    if (docIdx !== -1) {
      const docReviews = all.filter((r) => r.doctorId === doctorId);
      const avg = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
      doctors[docIdx].rating = Math.round(avg * 100) / 100;
      doctors[docIdx].totalReviews = docReviews.length;
      setStoredItem(STORAGE_KEYS.DOCTORS, doctors);
    }

    return newReview;
  },

  // Auth & Current User
  getCurrentUser(): UserProfile | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (item) return JSON.parse(item);
    } catch (e) {
      console.error(e);
    }
    // Default logged in with Rahul Sharma for seamless demonstration
    const defaultUser = DEMO_USERS[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  },

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  updateUserProfile(updatedProfile: UserProfile): void {
    this.setCurrentUser(updatedProfile);
    const users = getStoredItem<UserProfile[]>(STORAGE_KEYS.USERS_LIST, DEMO_USERS);
    const idx = users.findIndex((u) => u.id === updatedProfile.id);
    if (idx !== -1) {
      users[idx] = updatedProfile;
    } else {
      users.push(updatedProfile);
    }
    setStoredItem(STORAGE_KEYS.USERS_LIST, users);
  },

  // Feedback
  submitFeedback(feedback: { name: string; phone: string; email: string; message: string }): void {
    const list = getStoredItem<any[]>(STORAGE_KEYS.FEEDBACK, []);
    list.unshift({ ...feedback, timestamp: new Date().toISOString() });
    setStoredItem(STORAGE_KEYS.FEEDBACK, list);
  },
};
