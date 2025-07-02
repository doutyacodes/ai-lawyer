'use client';

import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';
import { LoadingButton, LoadingOverlay } from '@/components/ui/Loading';
import { isAuthenticated, formStorage } from '@/lib/auth';

export default function LegalAssistantPage() {
  // Form states
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    locality: '',
    incident_place: '',
    age: '',
    gender: '',
    problem: ''
  });

  // UI states
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'results'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [showIntro, setShowIntro] = useState(true);

  // Load form data from storage on mount
  useEffect(() => {
    const savedData = formStorage.load('form_data');
    if (savedData) {
      setFormData(savedData);
      setShowIntro(false);
    }
    
    // Load countries
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
    } else {
      setStates([]);
    }
  }, [formData.country]);

  // Save form data to storage whenever it changes
  useEffect(() => {
    if (!showIntro) {
      formStorage.save('form_data', formData);
    }
  }, [formData, showIntro]);

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
    
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.problem.trim()) {
      newErrors.problem = 'Please describe your legal problem';
    } else if (formData.problem.trim().length < 10) {
      newErrors.problem = 'Please provide more details about your problem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/legal-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setCurrentStep('results');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResults = async () => {
    if (!isAuthenticated()) {
      // Redirect to login page
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
        alert('Legal advice saved successfully!');
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
  };

  const handleClearForm = () => {
    setFormData({
      country: '',
      state: '',
      locality: '',
      incident_place: '',
      age: '',
      gender: '',
      problem: ''
    });
    formStorage.clear('form_data');
    setErrors({});
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="professional-card p-8 sm:p-12">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-5xl font-bold text-primary mb-4">
                  Legal Assistant AI
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Get immediate legal guidance powered by AI. Our assistant provides 
                  professional advice tailored to your specific situation and location.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Provide Details</h3>
                  <p className="text-sm text-muted-foreground">Share your location and legal issue</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Get Guidance</h3>
                  <p className="text-sm text-muted-foreground">Receive personalized legal advice</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Take Action</h3>
                  <p className="text-sm text-muted-foreground">Follow immediate next steps</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowIntro(false)}
                className="professional-button text-lg px-8 py-4"
              >
                Get Legal Help Now
              </button>
              
              <p className="text-xs text-muted-foreground mt-4">
                This service provides general legal information and should not replace professional legal counsel.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <button
                onClick={handleBackToForm}
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
              >
                ← Back to Form
              </button>
              <LoadingButton
                loading={loading}
                onClick={handleSaveResults}
                className="mobile-button"
              >
                Save Legal Advice
              </LoadingButton>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* AI Intro */}
              <div className="professional-card p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Legal Assessment</h2>
                <p className="text-foreground leading-relaxed">{results.ai_intro}</p>
              </div>

              {/* Summary */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Case Summary</h3>
                <p className="text-foreground leading-relaxed">{results.summary}</p>
              </div>

              {/* Next Steps */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Immediate Next Steps</h3>
                <div className="space-y-2">
                  {results.next_steps?.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Know Your Rights */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Know Your Rights</h3>
                <div className="space-y-2">
                  {results.know_your_rights?.map((right, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <p className="text-foreground">{right}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicable Laws */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Applicable Laws</h3>
                <div className="space-y-2">
                  {results.applicable_laws?.map((law, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-accent-foreground rounded-full mt-2"></span>
                      <p className="text-foreground">{law}</p>
                    </div>
                  ))}
                </div>
                {results.law_reference_source && (
                  <p className="text-sm text-muted-foreground mt-4 italic">
                    Reference: {results.law_reference_source}
                  </p>
                )}
              </div>

              {/* Warnings */}
              {results.important_warnings && (
                <div className="professional-card p-6 border-l-4 border-warning">
                  <h3 className="text-lg font-semibold text-warning mb-3">⚠️ Important Warnings</h3>
                  <div className="space-y-2">
                    {results.important_warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-warning rounded-full mt-2"></span>
                        <p className="text-foreground">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penalties */}
              {results.possible_fines_or_penalties && (
                <div className="professional-card p-6 border-l-4 border-destructive">
                  <h3 className="text-lg font-semibold text-destructive mb-3">Possible Penalties</h3>
                  <div className="space-y-2">
                    {results.possible_fines_or_penalties.map((penalty, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-destructive rounded-full mt-2"></span>
                        <p className="text-foreground">{penalty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lawyer Recommendation */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Legal Representation</h3>
                <div className="space-y-2">
                  {results.should_escalate_to_lawyer?.map((advice, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <p className="text-foreground">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Advice */}
              <div className="professional-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Additional Advice</h3>
                <div className="space-y-2">
                  {results.additional_advice?.map((advice, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-accent-foreground rounded-full mt-2"></span>
                      <p className="text-foreground">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Reassurance */}
              <div className="professional-card p-6 bg-success/5 border-l-4 border-success">
                <h3 className="text-lg font-semibold text-success mb-3">Final Message</h3>
                <p className="text-foreground leading-relaxed">{results.final_reassurance}</p>
              </div>
            </div>
          </div>
        </div>
        {loading && <LoadingOverlay message="Saving your legal advice..." />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              Legal Assistant
            </h1>
            <p className="text-muted-foreground">
              Please provide your details to get personalized legal guidance
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="professional-card p-6 sm:p-8 space-y-6">
            {/* Location Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Location Information
              </h2>
              
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`professional-select ${errors.country ? 'border-destructive' : ''}`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-destructive text-sm mt-1">{errors.country}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State/Province *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`professional-select ${errors.state ? 'border-destructive' : ''}`}
                  disabled={!formData.country}
                >
                  <option value="">Select State/Province</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-destructive text-sm mt-1">{errors.state}</p>
                )}
              </div>

              {/* Locality */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City/Locality *
                </label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) => handleInputChange('locality', e.target.value)}
                  className={`professional-input ${errors.locality ? 'border-destructive' : ''}`}
                  placeholder="Enter your city or locality"
                />
                {errors.locality && (
                  <p className="text-destructive text-sm mt-1">{errors.locality}</p>
                )}
              </div>

              {/* Incident Place */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Place of Incident (Optional)
                </label>
                <input
                  type="text"
                  value={formData.incident_place}
                  onChange={(e) => handleInputChange('incident_place', e.target.value)}
                  className="professional-input"
                  placeholder="If different from your location"
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Personal Information
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`professional-input ${errors.age ? 'border-destructive' : ''}`}
                    placeholder="Your age"
                    min="1"
                    max="150"
                  />
                  {errors.age && (
                    <p className="text-destructive text-sm mt-1">{errors.age}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`professional-select ${errors.gender ? 'border-destructive' : ''}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-destructive text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Legal Problem */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Legal Issue
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Describe your legal problem in detail *
                </label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  className={`professional-textarea ${errors.problem ? 'border-destructive' : ''}`}
                  rows={6}
                  placeholder="Please provide as much detail as possible about your legal issue. Include relevant dates, people involved, documents, and what outcome you're seeking. The more information you provide, the better guidance we can offer."
                />
                {errors.problem && (
                  <p className="text-destructive text-sm mt-1">{errors.problem}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.problem.length} characters. More details help us provide better advice.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <LoadingButton
                type="submit"
                loading={loading}
                className="flex-1 mobile-button"
              >
                Get Legal Guidance
              </LoadingButton>
              
              <button
                type="button"
                onClick={handleClearForm}
                className="px-6 py-3 border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-foreground transition-colors mobile-button"
              >
                Clear Form
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-4 rounded-md">
              <p className="font-medium mb-1">Important Disclaimer:</p>
              <p>
                This AI assistant provides general legal information and guidance. It does not constitute 
                legal advice and should not replace consultation with a qualified attorney. For complex 
                legal matters, please consult with a licensed lawyer in your jurisdiction.
              </p>
            </div>
          </form>
        </div>
      </div>
      {loading && <LoadingOverlay message="Analyzing your legal issue..." />}
    </div>
  );
}