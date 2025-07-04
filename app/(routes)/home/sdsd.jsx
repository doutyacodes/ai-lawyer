'use client';

import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';

import { LoadingButton, LoadingOverlay } from '@/components/ui/Loading';
import { formStorage, isAuthenticated } from '@/lib/auth-client';

const PersonalInfoGrid = ({ formData, handleInputChange, errors, countries }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
      {/* Nationality */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Nationality *
        </label>
        <div className="relative">
          <select
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
              errors.nationality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Your nationality"
          >
            <option value="">Select country</option>
            {countries.map((nationality) => (
              <option key={nationality.isoCode} value={nationality.isoCode}>
                {nationality.name}
              </option>
            ))}
          </select>
        </div>
        {errors.nationality && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.nationality}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Age *
        </label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
            errors.age ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
          }`}
          placeholder="Your age"
          min="1"
          max="150"
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.age}
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Gender *
        </label>
        <div className="relative">
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
              errors.gender ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.gender}
          </p>
        )}
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Religion (if relevant to your case)
        </label>
        <input
          type="text"
          value={formData.religion}
          onChange={(e) => handleInputChange('religion', e.target.value)}
          className="w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-gray-200 hover:border-gray-300"
          placeholder="Your religion (optional)"
        />
      </div>
    </div>
  );
};

const LocationInfoGrid = ({ formData, handleInputChange, errors, countries, states }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
      {/* Country */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Country *
        </label>
        <div className="relative">
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
              errors.country ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.country}
          </p>
        )}
      </div>

      {/* State */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          State/Province *
        </label>
        <div className="relative">
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            disabled={!formData.country}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
              !formData.country ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            } ${
              errors.state ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Select State/Province</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        {errors.state && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.state}
          </p>
        )}
      </div>

      {/* Locality */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          City/Locality *
        </label>
        <input
          type="text"
          value={formData.locality}
          onChange={(e) => handleInputChange('locality', e.target.value)}
          className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
            errors.locality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
          }`}
          placeholder="City or locality"
        />
        {errors.locality && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.locality}
          </p>
        )}
      </div>

      {/* Incident Place */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
          Specific Location (Optional)
        </label>
        <input
          type="text"
          value={formData.incident_place}
          onChange={(e) => handleInputChange('incident_place', e.target.value)}
          className="w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-gray-200 hover:border-gray-300"
          placeholder="e.g., apartment, workplace, college, neighborhood, etc."
        />
      </div>
    </div>
  );
};

const EmergencyFields = ({ formData, handleInputChange, errors }) => (
  <>
    {/* Injury/Threat Status */}
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
          <span className="text-white text-lg lg:text-xl">🩹</span>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Safety Status</h2>
          <p className="text-sm lg:text-base text-gray-600">Are you injured or currently threatened?</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleInputChange('isInjuredOrThreatened', true)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            formData.isInjuredOrThreatened === true
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🚨</div>
            <div className="font-semibold">Yes - Injured/Threatened</div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => handleInputChange('isInjuredOrThreatened', false)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            formData.isInjuredOrThreatened === false
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold">No - Currently Safe</div>
          </div>
        </button>
      </div>
      {errors.isInjuredOrThreatened && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <span className="mr-1">⚠️</span>
          {errors.isInjuredOrThreatened}
        </p>
      )}
    </div>

    {/* Vehicle Involvement */}
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
          <span className="text-white text-lg lg:text-xl">🚗</span>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Vehicle Involvement</h2>
          <p className="text-sm lg:text-base text-gray-600">Is a vehicle involved in this incident?</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleInputChange('isVehicleInvolved', true)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            formData.isVehicleInvolved === true
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🚗</div>
            <div className="font-semibold">Yes - Vehicle Involved</div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => {
            handleInputChange('isVehicleInvolved', false);
            handleInputChange('vehicleDetails', '');
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            formData.isVehicleInvolved === false
              ? 'border-gray-500 bg-gray-50 text-gray-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">❌</div>
            <div className="font-semibold">No Vehicle Involved</div>
          </div>
        </button>
      </div>
      
      {formData.isVehicleInvolved && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
            Vehicle Details (Type, License Plate, etc.)
          </label>
          <input
            type="text"
            value={formData.vehicleDetails}
            onChange={(e) => handleInputChange('vehicleDetails', e.target.value)}
            className="w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-gray-200 hover:border-gray-300"
            placeholder="e.g., Red Toyota Camry, License: ABC-123"
          />
        </div>
      )}
      
      {errors.isVehicleInvolved && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <span className="mr-1">⚠️</span>
          {errors.isVehicleInvolved}
        </p>
      )}
    </div>
  </>
);

export default function LegalAssistantPage() {
  // Form states
  const [formData, setFormData] = useState({
    // Emergency detection
    isEmergency: null, // null = not selected, true = emergency, false = not emergency
    
    // Emergency-specific fields
    dateTime: new Date().toISOString().slice(0, 16), // Current date-time in YYYY-MM-DDTHH:MM format
    isInjuredOrThreatened: null,
    isVehicleInvolved: null,
    vehicleDetails: '',
    
    // Existing fields...
    nationality: '',
    age: '',
    gender: '',
    religion: '',
    country: '',
    state: '',
    locality: '',
    incident_place: '',
    problem: ''
  });

  // UI states
  const [currentStep, setCurrentStep] = useState('emergency-check'); // 'emergency-check' or 'form' or 'results'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
console.log("currentStep", currentStep)
  // Load form data and results from storage on mount
  useEffect(() => {
    // Load saved results first (priority over form data)
    const savedResults = formStorage.load('results_data');
    if (savedResults) {
      setResults(savedResults);
      setCurrentStep('results');
    }
    
    // Load form data
    const savedData = formStorage.load('form_data');
    if (savedData) {
      setFormData(savedData);
    }
    
    // Load countries
    setCountries(Country.getAllCountries());
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal Information
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Incident Location
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    
    // Problem description
    if (!formData.problem.trim()) {
      newErrors.problem = 'Please describe your legal problem';
    } else if (formData.problem.trim().length < 10) {
      newErrors.problem = 'Please provide more details about your problem';
    }
    
    // Emergency-specific validations
    if (formData.isEmergency) {
      if (!formData.dateTime) newErrors.dateTime = 'Date and time are required for emergency cases';
      if (formData.isInjuredOrThreatened === null) {
        newErrors.isInjuredOrThreatened = 'Please indicate if you are injured or threatened';
      }
      if (formData.isVehicleInvolved === null) {
        newErrors.isVehicleInvolved = 'Please indicate if a vehicle is involved';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearForm = () => {
    setFormData({
      isEmergency: null,
      dateTime: new Date().toISOString().slice(0, 16),
      isInjuredOrThreatened: null,
      isVehicleInvolved: null,
      vehicleDetails: '',
      nationality: '',
      age: '',
      gender: '',
      religion: '',
      country: '',
      state: '',
      locality: '',
      incident_place: '',
      problem: ''
    });
    formStorage.clear('form_data');
    formStorage.clear('results_data');
    setErrors({});
    setResults(null);
    setCurrentStep('form');
  };

  const DateTImeInfo = () => {
    return (
      <>
      <div className="flex items-center mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
          <span className="text-white text-lg lg:text-xl">⏰</span>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">When did this happen?</h2>
          <p className="text-sm lg:text-base text-gray-600">Date and time of the incident</p>
        </div>
      </div>
      <div className="mb-8 lg:mb-12">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
            Date and Time *
          </label>
          <input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => handleInputChange('dateTime', e.target.value)}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 ${
              errors.dateTime ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {errors.dateTime && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.dateTime}
            </p>
          )}
        </div>
      </div>
      </>
    );
  };

 // Emergency Detection Step - Always show first (unless we have results to display)
  if (currentStep === 'emergency-check' && currentStep !== 'results') {
    /* removed for now */
  }

  // Results page
  if (currentStep === 'results' && results) {
    /* Remvoed for now */
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-cyan-400/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
            {/* Removed for now */}

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-4 lg:p-12">
              {/* Emergency Alert Banner */}
              {formData.isEmergency && (
                <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <span className="text-3xl">🚨</span>
                    </div>
                    <div>
                      <p className="font-bold text-red-800 mb-1">Emergency Mode Activated</p>
                      <p className="text-red-700 text-sm">
                        We&apos;re prioritizing your emergency. If you&apos;re in immediate danger, please contact emergency services first.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Form Rendering Based on Emergency Status */}
              {formData.isEmergency ? (
                <>
                  {/* Emergency Order: Problem First */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">📋</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">What&apos;s the Emergency?</h2>
                        <p className="text-sm lg:text-base text-gray-600">Describe your urgent legal issue</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                        Describe your emergency legal problem *
                      </label>
                      <textarea
                        value={formData.problem}
                        onChange={(e) => handleInputChange('problem', e.target.value)}
                        className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none ${
                          errors.problem ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        rows={5}
                        placeholder="Please describe your emergency situation in detail. Include what happened, when, and what immediate help you need."
                      />
                      {errors.problem && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.problem}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Personal Information</h2>
                        <p className="text-sm lg:text-base text-gray-600">Tell us about yourself</p>
                      </div>
                    </div>
                    <PersonalInfoGrid 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      countries={countries}
                    />
                  </div>

                  <div className="mb-8 lg:mb-12">
                      <DateTImeInfo />
                  </div>

                  {/* Incident Location */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">📍</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Incident Location</h2>
                        <p className="text-sm lg:text-base text-gray-600">Where did this emergency occur?</p>
                      </div>
                    </div>
                     <LocationInfoGrid 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      countries={countries}
                      states={states}
                    />
                  </div>

                  {/* Emergency-specific fields */}
                  <EmergencyFields 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                </>
              ) : (
                <>
                  {/* Non-Emergency Order: Personal Info First, Problem Last */}
                  {/* Personal Information */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Personal Information</h2>
                        <p className="text-sm lg:text-base text-gray-600">Tell us about yourself</p>
                      </div>
                    </div>
                    
                    <PersonalInfoGrid 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      countries={countries}
                    />
                  </div>

                  <div className="mb-8 lg:mb-12">
                      <DateTImeInfo />
                  </div>

                  {/* Incident Location */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">📍</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Incident Location</h2>
                        <p className="text-sm lg:text-base text-gray-600">Where did the incident occur?</p>
                      </div>
                    </div>
                    <LocationInfoGrid 
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      countries={countries}
                      states={states}
                    />
                  </div>

                  {/* Legal Problem - Last for non-emergency */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center mb-6 lg:mb-8">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <span className="text-white text-lg lg:text-xl">📋</span>
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Legal Issue</h2>
                        <p className="text-sm lg:text-base text-gray-600">Describe your legal problem in detail</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                        Describe your legal problem in detail *
                      </label>
                      <textarea
                        value={formData.problem}
                        onChange={(e) => handleInputChange('problem', e.target.value)}
                        className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none ${
                          errors.problem ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        rows={5}
                        placeholder="Please provide as much detail as possible about your legal issue. Include relevant dates, people involved, documents, and what outcome you're seeking."
                      />
                      {errors.problem && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.problem}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <span className="mr-1">💬</span>
                        {formData.problem.length} characters. More details help us provide better advice.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {/* removed for now */}
             </form>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay message="Analyzing your legal issue..." />}
    </div>
  );
}