/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DoctorDirectory } from './components/DoctorDirectory';
import { ClinicDirectory } from './components/ClinicDirectory';
import { PatientDashboard } from './components/PatientDashboard';
import { HealthArticles } from './components/HealthArticles';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { ReviewsModal } from './components/ReviewsModal';
import { ContactModal } from './components/ContactModal';
import { FirebaseInfoModal } from './components/FirebaseInfoModal';
import { Doctor, Language, Specialty, UserProfile, Appointment } from './types';
import { EMERGENCY_HOSPITALS } from './data/nagpurData';
import { StorageService } from './services/storage';
import { GeoCoordinates, getUserBrowserLocation } from './services/geoService';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    StorageService.getCurrentUser()
  );

  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    StorageService.getDoctors()
  );
  const [clinics, setClinics] = useState(() => StorageService.getClinics());

  // Geolocation states
  const [userLocation, setUserLocation] = useState<GeoCoordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<string>('All Localities');

  // Directory filter triggers
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modals state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const [reviewDoctor, setReviewDoctor] = useState<Doctor | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Request browser location
  const handleRequestUserLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const coords = await getUserBrowserLocation();
      setUserLocation(coords);
    } catch (err: any) {
      setLocationError(
        err.message ||
          'Location access requires permission. You can still select your Nagpur area manually.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchFromHero = (query: string) => {
    setActiveSection('doctors');
    const docElem = document.getElementById('doctors');
    if (docElem) {
      docElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSpecialtyFromHero = (specialty: Specialty | 'All') => {
    setSelectedSpecialtyFilter(specialty);
    setActiveSection('doctors');
    const docElem = document.getElementById('doctors');
    if (docElem) {
      docElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFindNearbyClinics = () => {
    handleRequestUserLocation();
    setActiveSection('clinics');
    const clinicElem = document.getElementById('clinics');
    if (clinicElem) {
      clinicElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookAppointmentClick = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleViewReviewsClick = (doctor: Doctor) => {
    setReviewDoctor(doctor);
    setIsReviewModalOpen(true);
  };

  const handleBookingSuccess = (newApp: Appointment) => {
    // refresh doctors / slots
    setDoctors(StorageService.getDoctors());
  };

  const handleReviewAdded = () => {
    setDoctors(StorageService.getDoctors());
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          language={language}
          onSearch={handleSearchFromHero}
          onSelectSpecialty={handleSelectSpecialtyFromHero}
          onFindNearbyClinics={handleFindNearbyClinics}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        />

        {/* Doctor Directory */}
        <DoctorDirectory
          doctors={doctors}
          language={language}
          onBookAppointment={handleBookAppointmentClick}
          onViewReviews={handleViewReviewsClick}
          userLocation={userLocation}
          selectedSpecialtyFilter={selectedSpecialtyFilter}
          onSelectSpecialtyFilter={setSelectedSpecialtyFilter}
        />

        {/* Clinic Directory & Interactive Map */}
        <ClinicDirectory
          clinics={clinics}
          emergencyHospitals={EMERGENCY_HOSPITALS}
          userLocation={userLocation}
          selectedLocality={selectedLocality}
          onLocalityChange={setSelectedLocality}
          onRequestUserLocation={handleRequestUserLocation}
          locationLoading={locationLoading}
          locationError={locationError}
          language={language}
          onSelectDoctorForClinic={(clinicId) => {
            const doc = doctors.find((d) => d.clinicId === clinicId);
            if (doc) {
              handleBookAppointmentClick(doc);
            } else {
              handleNavigateSection('doctors');
            }
          }}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        />

        {/* Health Guides & First Aid */}
        <HealthArticles language={language} />

        {/* Patient Dashboard */}
        <PatientDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          language={language}
          onOpenBookingForDoctor={(docId) => {
            const doc = doctors.find((d) => d.id === docId);
            if (doc) handleBookAppointmentClick(doc);
          }}
          doctors={doctors}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Frequently Asked Questions */}
        <FAQSection language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Modals & Dialogs */}
      <BookingModal
        doctor={bookingDoctor}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingDoctor(null);
        }}
        currentUser={currentUser}
        language={language}
        onBookingSuccess={handleBookingSuccess}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        hospitals={EMERGENCY_HOSPITALS}
        userLocation={userLocation}
        language={language}
      />

      <ReviewsModal
        doctor={reviewDoctor}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewDoctor(null);
        }}
        language={language}
        onReviewAdded={handleReviewAdded}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        language={language}
      />

      <FirebaseInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
