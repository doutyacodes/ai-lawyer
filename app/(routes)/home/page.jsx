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
            className={`w-full mt-2 px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
              errors.nationality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Your nationality"
          >
            <option value="">Select country</option>
            {countries.map((nationality) => (
              <option key={nationality.isoCode} value={nationality.name}>
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
            className={`w-full mt-2 px-4 py-3 lg:px-6 lg:py-4 pr-10 lg:pr-12 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
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

const DateTimeInfo = ({ formData, handleInputChange, errors }) => {
  const timeOptions = [
    { value: 'just_now', label: 'Just now', selected: true },
    { value: 'within_hour', label: 'Within the last hour' },
    { value: 'within_24_hours', label: 'Within the last 24 hours' },
    { value: 'earlier_week', label: 'Earlier this week' },
    { value: 'other', label: 'Other (specify date)' }
  ];

  const handleTimeOptionChange = (value) => {
    const now = new Date();
    let dateTime = '';
    
    switch(value) {
      case 'just_now':
        dateTime = now.toISOString();
        break;
      case 'within_hour':
        dateTime = new Date(now.getTime() - 30 * 60000).toISOString(); // 30 mins ago
        break;
      case 'within_24_hours':
        dateTime = new Date(now.getTime() - 12 * 3600000).toISOString(); // 12 hours ago
        break;
      case 'earlier_week':
        dateTime = new Date(now.getTime() - 3 * 24 * 3600000).toISOString(); // 3 days ago
        break;
      case 'other':
        dateTime = 'custom';
        break;
      default:
        dateTime = now.toISOString();
    }
    
    handleInputChange('timeOption', value);
    if (value !== 'other') {
      handleInputChange('dateTime', dateTime);
    }
  };

  return (
    <>
      <div className="flex items-center mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
          <span className="text-white text-lg lg:text-xl">⏰</span>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">When did this happen?</h2>
          <p className="text-sm lg:text-base text-gray-600">Time of the incident</p>
        </div>
      </div>
      
      <div className="mb-8 lg:mb-12">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
            When did this occur? *
          </label>
          
          {/* Time Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.timeOption === option.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="timeOption"
                  value={option.value}
                  checked={formData.timeOption === option.value}
                  onChange={(e) => handleTimeOptionChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  formData.timeOption === option.value
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-300'
                }`}>
                  {formData.timeOption === option.value && (
                    <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm lg:text-base font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Date Picker - Show only when "Other" is selected */}
          {formData.timeOption === 'other' && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={formData.customDate || ''}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  handleInputChange('customDate', e.target.value);
                  handleInputChange('dateTime', selectedDate.toISOString());
                }}
                className={`w-full max-w-md px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 ${
                  errors.dateTime ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>
          )}
          
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

const LocationInfoGrid = ({ formData, handleInputChange, handleCountryChange, handleStateChange, errors, countries, states }) => {
  // Check if person is not in their home country
  const isNotInHomeCountry = formData.nationality && formData.country.name && 
    formData.nationality !== formData.country.name;

  const statusOptions = [
    { value: 'tourist', label: 'Tourist' },
    { value: 'expat', label: 'Expatriate' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Country */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
            Country *
          </label>
          <div className="relative">
            <select
              value={formData.country.isoCode}
              onChange={handleCountryChange}
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
              value={formData.state.isoCode}
              onChange={handleStateChange}
              disabled={!formData.country.isoCode}
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

        {/* Locality - NOW OPTIONAL */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
            City/Locality
          </label>
          <input
            type="text"
            value={formData.locality}
            onChange={(e) => handleInputChange('locality', e.target.value)}
            className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
              errors.locality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="City or locality (optional)"
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

      {/* Status in Country - Show only if not in home country */}
      {isNotInHomeCountry && (
        <div className="mt-6 p-4 lg:p-6 bg-blue-50 rounded-xl lg:rounded-2xl border border-blue-200">
          <h3>
            {formData.reportingFor === 'someone_else'
              ? `Their reason for being in ${formData.country.name}`
              : `Your reason for being in ${formData.country.name}`}
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            {formData.reportingFor === 'someone_else'
              ? "They are currently in a different country. Let us know their purpose of stay (e.g. tourist, work, study)."
              : "You're currently in a different country. Let us know your purpose of stay (e.g. tourist, work, study)."}
          </p>  

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  formData.statusInCountry === option.value
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-blue-200 hover:border-blue-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="statusInCountry"
                  value={option.value}
                  checked={formData.statusInCountry === option.value}
                  onChange={(e) => handleInputChange('statusInCountry', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                  formData.statusInCountry === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-blue-300'
                }`}>
                  {formData.statusInCountry === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>

          {formData.statusInCountry.startsWith('other') && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.statusInCountry.startsWith('other:') ? formData.statusInCountry.slice(6) : ''}
                onChange={(e) => handleInputChange('statusInCountry', `other:${e.target.value.slice(0, 20)}`)}
                className="w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-blue-200 hover:border-blue-300"
                placeholder="Please specify (max 20 characters)"
                maxLength={20}
              />
              <p className="text-xs text-blue-600 mt-1">
                {(formData.statusInCountry.startsWith('other:') ? formData.statusInCountry.slice(6).length : 0)}/20 characters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportingForComponent = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center mb-6 lg:mb-8">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3 lg:mr-4">
          <span className="text-white text-lg lg:text-xl">👤</span>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Who is this report for?</h2>
          <p className="text-sm lg:text-base text-gray-600">Please specify who this legal issue concerns</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`flex items-center p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
            formData.reportingFor === 'myself'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <input
              type="radio"
              name="reportingFor"
              value="myself"
              checked={formData.reportingFor === 'myself'}
              onChange={(e) => handleInputChange('reportingFor', e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 mr-3 lg:mr-4 flex items-center justify-center ${
              formData.reportingFor === 'myself'
                ? 'border-purple-500 bg-purple-500'
                : 'border-gray-300'
            }`}>
              {formData.reportingFor === 'myself' && (
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-white rounded-full"></div>
              )}
            </div>
            <div>
              <span className="text-base lg:text-lg font-semibold">For Myself</span>
              <p className="text-sm text-gray-600 mt-1">This legal issue concerns me personally</p>
            </div>
          </label>
          
          <label className={`flex items-center p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
            formData.reportingFor === 'someone_else'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <input
              type="radio"
              name="reportingFor"
              value="someone_else"
              checked={formData.reportingFor === 'someone_else'}
              onChange={(e) => handleInputChange('reportingFor', e.target.value)}
              className="sr-only"
            />
            <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 mr-3 lg:mr-4 flex items-center justify-center ${
              formData.reportingFor === 'someone_else'
                ? 'border-purple-500 bg-purple-500'
                : 'border-gray-300'
            }`}>
              {formData.reportingFor === 'someone_else' && (
                <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-white rounded-full"></div>
              )}
            </div>
            <div>
              <span className="text-base lg:text-lg font-semibold">For Someone Else</span>
              <p className="text-sm text-gray-600 mt-1">This is about another person&apos;s legal issue</p>
            </div>
          </label>
        </div>
        
        {formData.reportingFor === 'someone_else' && (
          <div className="mt-4 p-4 lg:p-6 bg-amber-50 rounded-xl lg:rounded-2xl border border-amber-200">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm">⚠️</span>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                <p className="text-sm text-amber-700">
                  Since you&apos;re reporting for someone else, please ensure that:
                </p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• All personal details you provide should be about <strong>that person</strong>, not yourself</li>
                  <li>• All information relates to <strong>their situation</strong> only</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {errors.reportingFor && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.reportingFor}
          </p>
        )}
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
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
            {formData.reportingFor === 'someone_else' ? 'Their Safety Status' : 'Your Safety Status'}
          </h2>
          <p className="text-sm lg:text-base text-gray-600">
            {formData.reportingFor === 'someone_else'
              ? 'Are they injured or currently threatened?'
              : 'Are you injured or currently threatened?'}
          </p>
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
              ? 'border-red-500 bg-red-50 text-red-700'
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
    country: {
      isoCode: '',
      name: '',
    },
    state: {
      isoCode: '',
      name: '',
    },
    locality: '',
    incident_place: '',
    problem: '',

    reportingFor: '', // 'myself' or 'someone_else'
    timeOption: 'just_now', // Default to 'just_now'
    customDate: '', // For when 'other' is selected
    statusInCountry: '', // 'tourist', 'expat', 'student', or 'other:custom_text'
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
    // const savedData = formStorage.load('form_data');
    // if (savedData) {
    //   setFormData(savedData);
    // }
    
    // Load countries
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country.isoCode) {
      const countryStates = State.getStatesOfCountry(formData.country.isoCode);
      setStates(countryStates);
    } else {
      setStates([]);
    }
  }, [formData.country.isoCode]);

  // Save form data to storage whenever it changes (only if not showing intro)
  // useEffect(() => {
  //     formStorage.save('form_data', formData);
  // }, [formData]);

  const handleEmergencySelection = (value) => {
    handleInputChange('isEmergency', value);
    setCurrentStep('form');
  };

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
    
    // Special handling for country change - reset state when country changes
    if (field === 'country') {
      setFormData(prev => ({
        ...prev,
        state: ''
      }));
    }
  };

  const handleCountryChange = (e) => {
    const selectedIso = e.target.value;
    const selectedCountry = countries.find(c => c.isoCode === selectedIso);

    setFormData(prev => ({
      ...prev,
      country: {
        isoCode: selectedIso,
        name: selectedCountry?.name || '',
      },
      state: { isoCode: '', name: '' } // Reset state on country change
    }));
  };

  const handleStateChange = (e) => {
    const selectedIso = e.target.value;
    const selectedState = states.find(s => s.isoCode === selectedIso);

    setFormData(prev => ({
      ...prev,
      state: {
        isoCode: selectedIso,
        name: selectedState?.name || '',
      },
    }));
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

    if (!formData.reportingFor) newErrors.reportingFor = 'Please specify who this report is for';
    
    // Problem description
    if (!formData.problem.trim()) {
      newErrors.problem = 'Please describe your legal problem';
    } else if (formData.problem.trim().length < 10) {
      newErrors.problem = 'Please provide more details about your problem';
    }
    
    // Emergency-specific validations
    if (formData.isEmergency) {
      if (!formData.dateTime || (formData.timeOption === 'other' && !formData.customDate)) {
        newErrors.dateTime = 'Please specify when the incident occurred';
      }
      // if (!formData.dateTime) newErrors.dateTime = 'Date and time are required for emergency cases';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/legal-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get legal guide');
      }

      setResults(result.data);
      setCurrentStep('results');
      
      // Save results to storage
      formStorage.save('results_data', result.data);
    } catch (error) {
      console.error('API Error:', error);
      alert('Something went wrong while fetching legal guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResults = async () => {
    const res = await fetch("/api/auth/auth-check", {
      credentials: "include", // Send cookies
    });

    const data = await res.json();

    if (!data.success) {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/save-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          response_json: results
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear all stored data after successful save
        formStorage.clear('form_data');
        formStorage.clear('results_data');
        
        // Redirect to saved results page
        window.location.href = '/saved-results';
      } else if (data.requiresAuth) {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setResults(null);
    // Clear results from storage when going back to form
    formStorage.clear('results_data');
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
      country: {
        isoCode: '',
        name: '',
      },
      state: {
        isoCode: '',
        name: '',
      },
      locality: '',
      incident_place: '',
      problem: '',
       // Add these to your existing formData state
      reportingFor: '', // 'myself' or 'someone_else'
      timeOption: 'just_now', // Default to 'just_now'
      customDate: '', // For when 'other' is selected
      statusInCountry: '', // 'tourist', 'expat', 'student', 'other'
      statusInCountryOther: '', // Custom status if 'other' is selected
      countryCode: '', // Store country ISO code separately
      stateCode: '', // Store state ISO code separately
    });
    formStorage.clear('form_data');
    formStorage.clear('results_data');
    setErrors({});
    setResults(null);
    setCurrentStep('form');
  };

  if (currentStep === 'emergency-check' && currentStep !== 'results') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl w-full text-center">
            <div className="mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🚨</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Emergency Assessment
              </h1>
              <p className="text-gray-200 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8 px-2">
                Before we proceed, we need to understand the urgency of your situation to provide the most appropriate guidance.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={() => handleEmergencySelection(true)}
                className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-400 hover:to-red-500 transform hover:scale-105 transition-all duration-300 shadow-lg border-2 border-red-400/50"
              >
                <span className="flex items-center justify-center px-4">
                  <span className="mr-3 text-xl sm:text-2xl">🚨</span>
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">YES - This is an Emergency</div>
                    <div className="text-xs sm:text-sm text-red-100 mt-1">
                      Immediate danger, injury, or time-sensitive legal issue
                    </div>
                  </div>
                </span>
              </button>
              
              <button
                onClick={() => handleEmergencySelection(false)}
                className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg border-2 border-cyan-400/50"
              >
                <span className="flex items-center justify-center px-4">
                  <span className="mr-3 text-xl sm:text-2xl">📋</span>
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">NO - General Legal Consultation</div>
                    <div className="text-xs sm:text-sm text-cyan-100 mt-1">
                      Non-urgent legal matter or general guidance needed
                    </div>
                  </div>
                </span>
              </button>
            </div>
            
            <p className="text-yellow-100 text-xs sm:text-sm mt-6 sm:mt-8">
              <span className="font-semibold">⚠️ If you&apos;re in immediate physical danger:</span><br/>
              Please contact emergency services (911, 112, or your local emergency number) first.
            </p>
            
            <p className="text-xs text-gray-400 mt-4 sm:mt-6 px-2">
              Provides general legal information. Consult an attorney for complex matters.
            </p>
          </div>
        </div>
      );
    }
  // Results page
  if (currentStep === 'results' && results) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
                <button
                    onClick={handleBackToForm}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Form
                </button>
                <LoadingButton
                    loading={loading}
                    onClick={handleSaveResults}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                    Save Legal Steps
                </LoadingButton>
                </div>
                {/* Results */}
                <div className="space-y-4 sm:space-y-6">
                  {/* AI Intro */}
                  {results.ai_intro && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100 shadow-sm">
                        <div className="flex items-start gap-3 sm:gap-4">
                            {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div> */}
                            <div>
                            {/* <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Legal Guidance</h3> */}
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{results.ai_intro}</p>
                            </div>
                        </div>
                      </div>
                  )}

                  {/* Case Summary */}
                  {results.summary && (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          </div>
                          <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Case Summary</h3>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{results.summary}</p>
                          </div>
                      </div>
                      </div>
                  )}

                  {/* Next Steps */}
                  {Array.isArray(results.next_steps) && results.next_steps.length > 0 && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-emerald-100 shadow-sm">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Immediate Next Steps</h3>
                      </div>
                      <div className="space-y-3 sm:space-y-4 ml-11 sm:ml-14">
                          {results.next_steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                              {index + 1}
                              </div>
                              <p className="text-gray-700 pt-1 text-sm sm:text-base leading-relaxed">{step}</p>
                          </div>
                          ))}
                      </div>
                      </div>
                  )}

                  {/* Know Your Rights */}
                  {Array.isArray(results.know_your_rights) && results.know_your_rights.length > 0 && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-100 shadow-sm">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Know Your Rights</h3>
                      </div>
                      <div className="space-y-3 ml-11 sm:ml-14">
                          {results.know_your_rights.map((right, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{right}</p>
                          </div>
                          ))}
                      </div>
                      </div>
                  )}

                  {/* Applicable Laws */}
                  {Array.isArray(results.applicable_laws) && results.applicable_laws.length > 0 && (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Applicable Laws</h3>
                      </div>
                      <div className="space-y-4 ml-11 sm:ml-14">
                          {results.applicable_laws.map((law, index) => (
                          <div key={index} className="bg-indigo-50 rounded-lg p-3 sm:p-4 border-l-4 border-indigo-400">
                              <div className="text-gray-700">
                              {typeof law === "string" ? (
                                  <p className="text-sm sm:text-base">{law}</p>
                              ) : (
                                  <div>
                                  <p className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">{law.Section}</p>
                                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{law.Explanation}</p>
                                  </div>
                              )}
                              </div>
                          </div>
                          ))}
                      </div>
                      {results.law_reference_source && (
                          <div className="mt-4 sm:mt-6 ml-11 sm:ml-14 p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 italic">
                              <strong>Reference:</strong> {results.law_reference_source}
                          </p>
                          </div>
                      )}
                      </div>
                  )}

                  {/* Do's and Don'ts */}
                  {results.dos_and_donts && (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Do&apos;s and Don&apos;ts</h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ml-11 sm:ml-14">
                          {results.dos_and_donts.do && (
                          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                              </div>
                              <h4 className="text-sm sm:text-base font-semibold text-green-800">Do&apos;s</h4>
                              </div>
                              <div className="space-y-2">
                              {results.dos_and_donts.do.map((item, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-green-700 text-xs sm:text-sm leading-relaxed">{item}</p>
                                  </div>
                              ))}
                              </div>
                          </div>
                          )}
                          {results.dos_and_donts.dont && (
                          <div className="bg-red-50 rounded-lg p-3 sm:p-4 border-l-4 border-red-400">
                              <div className="flex items-center gap-2 mb-3">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                              </div>
                              <h4 className="text-sm sm:text-base font-semibold text-red-800">Don&apos;ts</h4>
                              </div>
                              <div className="space-y-2">
                              {results.dos_and_donts.dont.map((item, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-red-700 text-xs sm:text-sm leading-relaxed">{item}</p>
                                  </div>
                              ))}
                              </div>
                          </div>
                          )}
                      </div>
                      </div>
                  )}

                  {/* Penalties */}
                  {Array.isArray(results.possible_fines_or_penalties) && results.possible_fines_or_penalties.length > 0 && (
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-l-4 border-red-500 shadow-sm">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-red-800">Possible Penalties</h3>
                      </div>
                      <div className="space-y-3 ml-11 sm:ml-14">
                          {results.possible_fines_or_penalties.map((penalty, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-red-700 text-sm sm:text-base leading-relaxed">{penalty}</p>
                          </div>
                          ))}
                      </div>
                      </div>
                  )}

                  {/* Legal Representation */}
                  {results.should_escalate_to_lawyer && (
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-100 shadow-sm">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Legal Representation</h3>
                      </div>
                      <div className="space-y-3 ml-11 sm:ml-14">
                          {Array.isArray(results.should_escalate_to_lawyer)
                          ? results.should_escalate_to_lawyer.map((advice, index) => (
                              <div key={index} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{advice}</p>
                              </div>
                              ))
                          : (
                              <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{results.should_escalate_to_lawyer}</p>
                              </div>
                          )}
                      </div>
                      </div>
                  )}

                  {/* Contact Help Resources */}
                  {results.contact_help_resources && results.contact_help_resources.contacts && results.contact_help_resources.contacts.length > 0 && (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          </div>
                          <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Emergency Contacts</h3>
                          {results.contact_help_resources.description && (
                              <p className="text-gray-600 text-sm mt-1 leading-relaxed">{results.contact_help_resources.description}</p>
                          )}
                          </div>
                      </div>
                      
                      {/* Contacts Grid */}
                      <div className="ml-11 sm:ml-14 space-y-3">
                          {results.contact_help_resources.contacts.map((contact, index) => (
                          <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 sm:p-4 border border-gray-200 transition-colors duration-200">
                              <div className="flex items-start justify-between gap-2 sm:gap-4">
                                  <div className="flex-1 min-w-0">
                                      <div className="mb-1">
                                          <h4 className="text-sm sm:text-base font-medium text-gray-800">{contact.name}</h4>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                                          {contact.phone && (
                                              <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                  </svg>
                                                  {contact.phone}
                                              </a>
                                          )}
                                          
                                          {contact.email && (
                                              <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                  </svg>
                                                  Email
                                              </a>
                                          )}
                                          
                                          {contact.website && (
                                              <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                  </svg>
                                                  Website
                                              </a>
                                          )}
                                      </div>
                                      
                                      {contact.notes && (
                                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{contact.notes}</p>
                                      )}
                                  </div>
                              </div>
                          </div>
                          ))}
                      </div>
                      
                      {/* Disclaimer */}
                      <div className="ml-11 sm:ml-14 mt-4 p-3 bg-amber-50 rounded-lg border-l-3 border-amber-400">
                          <p className="text-amber-700 text-xs leading-relaxed">
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <strong>Note:</strong> Please verify contact details before use. Information may change without notice.
                          </p>
                      </div>
                      </div>
                  )}

                  {/* Additional Advice */}
                  {Array.isArray(results.additional_advice) && results.additional_advice.length > 0 && (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Additional Advice</h3>
                      </div>
                      <div className="space-y-3 ml-11 sm:ml-14">
                          {results.additional_advice.map((advice, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{advice}</p>
                          </div>
                          ))}
                      </div>
                      </div>
                  )}

                  {/* Final Message */}
                  {results.final_reassurance && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-l-4 border-green-400 shadow-sm">
                      <div className="flex items-start gap-3 sm:gap-4">
                          <div className="text-2xl sm:text-3xl">💚</div>
                          <div>
                          <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">Final Message</h3>
                          <p className="text-green-700 leading-relaxed text-sm sm:text-base">{results.final_reassurance}</p>
                          </div>
                      </div>
                      </div>
                  )}
                </div>
            </div>
            </div>
          {loading && <LoadingOverlay message="Saving your information..." />}
        </div>
    );
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              ⚖️ AI Legal Assistant
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Get Help with Your Situation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your details to get AI-powered guidance based on your situation and location.
            </p>
          </div>

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
                      <p className="font-bold text-red-800 mb-1">Emergency Mode</p>
                      <p className="text-red-700 text-sm">
                        {formData.reportingFor === 'someone_else'
                          ? "We're prioritizing their emergency. If they are in immediate danger, please contact emergency services first."
                          : "We're prioritizing your emergency. If you're in immediate danger, please contact emergency services first."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ReportingForComponent 
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />

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
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                          {formData.reportingFor === 'someone_else' ? "What's Their Emergency?" : "What's the Emergency?"}
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600">
                          {formData.reportingFor === 'someone_else'
                            ? "Describe their urgent legal issue"
                            : "Describe your urgent legal issue"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                        {formData.reportingFor === 'someone_else'
                          ? "Describe their emergency legal problem *"
                          : "Describe your emergency legal problem *"}
                      </label>
                      <textarea
                        value={formData.problem}
                        onChange={(e) => handleInputChange('problem', e.target.value)}
                        className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none ${
                          errors.problem ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        rows={5}
                        placeholder={
                          formData.reportingFor === 'someone_else'
                            ? "Please describe their emergency situation in detail. Include what happened, when, and what help they need."
                            : "Please describe your emergency situation in detail. Include what happened, when, and what immediate help you need."
                        }
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
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        {formData.reportingFor === 'someone_else' ? 'Their Personal Information' : 'Your Personal Information'}
                      </h2>
                      <p className="text-sm lg:text-base text-gray-600">
                        {formData.reportingFor === 'someone_else'
                          ? 'Please tell us about the person you are reporting for'
                          : 'Tell us about yourself'}
                      </p>
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
                    <DateTimeInfo
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
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
                      handleCountryChange={handleCountryChange}
                      handleStateChange={handleStateChange}
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
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                          {formData.reportingFor === 'someone_else' ? 'Their Personal Information' : 'Your Personal Information'}
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600">
                          {formData.reportingFor === 'someone_else'
                            ? 'Please tell us about the person you are reporting for'
                            : 'Tell us about yourself'}
                        </p>
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
                    <DateTimeInfo
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
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
                      handleCountryChange={handleCountryChange}
                      handleStateChange={handleStateChange}
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
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        {formData.reportingFor === 'someone_else' ? 'Their Legal Issue' : 'Your Legal Issue'}
                      </h2>
                      <p className="text-sm lg:text-base text-gray-600">
                        {formData.reportingFor === 'someone_else'
                          ? 'Describe their legal problem in detail'
                          : 'Describe your legal problem in detail'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                      {formData.reportingFor === 'someone_else'
                        ? 'Describe their legal problem in detail *'
                        : 'Describe your legal problem in detail *'}
                    </label>
                    <textarea
                      value={formData.problem}
                      onChange={(e) => handleInputChange('problem', e.target.value)}
                      className={`w-full px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 rounded-xl lg:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none ${
                        errors.problem ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      rows={5}
                      placeholder={
                        formData.reportingFor === 'someone_else'
                          ? "Please provide as much detail as possible about their legal issue. Include relevant dates, people involved, documents, and what outcome they're seeking."
                          : "Please provide as much detail as possible about your legal issue. Include relevant dates, people involved, documents, and what outcome you're seeking."
                      }
                    />
                    {errors.problem && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.problem}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <span className="mr-1">💬</span>
                      {formData.problem.length} characters. More details help us provide better guidance.
                    </p>
                  </div>
                </div>

                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 lg:py-4 lg:px-8 rounded-xl lg:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center text-sm lg:text-base">
                    <span className="mr-2">⚖️</span>
                    Get Legal Guidance
                  </span>
                </LoadingButton>
                
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-6 py-3 lg:px-8 lg:py-4 border-2 border-gray-300 rounded-xl lg:rounded-2xl text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 font-medium"
                >
                  <span className="flex items-center justify-center text-sm lg:text-base">
                    <span className="mr-2">🗑️</span>
                    Clear Form
                  </span>
                </button>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800 mb-2">Important Disclaimer:</p>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      This AI assistant provides general information and guidance related to common legal situations. It is not a substitute 
                      for professional advice and does not replace consultation with a qualified attorney. For serious or complex matters, 
                      please consult with a licensed lawyer in your jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
             </form>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay message="Analyzing your legal issue..." />}
    </div>
  );
}