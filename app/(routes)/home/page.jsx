'use client';

import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';

import { LoadingButton, LoadingOverlay } from '@/components/ui/Loading';
import { formStorage, isAuthenticated } from '@/lib/auth-client';

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
          throw new Error(result.error || 'Failed to get legal advice');
        }

        setResults(result.data);
        setCurrentStep('results');
      } catch (error) {
        console.error('API Error:', error);
        alert('Something went wrong while fetching legal advice. Please try again.');
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
      // <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      //   {/* Animated background elements */}
      //   <div className="absolute inset-0 overflow-hidden">
      //     <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      //     <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      //     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      //   </div>

      //   <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
      //     <div className="max-w-6xl mx-auto">
      //       {/* Hero Section */}
      //       <div className="text-center mb-16">
      //         <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
      //           <span className="text-cyan-300 text-sm font-medium">⚡ AI-Powered Legal Assistance</span>
      //         </div>
              
      //         <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
      //           Legal <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Assistant</span> AI
      //         </h1>
              
      //         <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
      //           Get instant, personalized legal guidance powered by advanced AI. 
      //           Professional advice tailored to your location and situation.
      //         </p>
              
      //         <button
      //           onClick={() => setShowIntro(false)}
      //           className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
      //         >
      //           <span className="relative z-10">Get Legal Help Now</span>
      //           <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
      //         </button>
      //       </div>

      //       {/* Features Grid */}
      //       <div className="grid md:grid-cols-3 gap-8 mb-16">
      //         {[
      //           {
      //             icon: "📋",
      //             title: "Provide Details",
      //             description: "Share your location and legal issue with our secure form"
      //           },
      //           {
      //             icon: "🧠",
      //             title: "AI Analysis",
      //             description: "Our AI analyzes your case using comprehensive legal databases"
      //           },
      //           {
      //             icon: "⚖️",
      //             title: "Expert Guidance",
      //             description: "Receive personalized advice and actionable next steps"
      //           }
      //         ].map((feature, index) => (
      //           <div key={index} className="group relative">
      //             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      //             <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
      //               <div className="text-4xl mb-4">{feature.icon}</div>
      //               <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      //               <p className="text-gray-300 leading-relaxed">{feature.description}</p>
      //             </div>
      //           </div>
      //         ))}
      //       </div>

      //       {/* Trust Indicators */}
      //       <div className="text-center">
      //         <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
      //           <div className="flex items-center space-x-6 text-sm text-gray-300">
      //             <span className="flex items-center">
      //               <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
      //               AI-Powered Analysis
      //             </span>
      //             <span className="flex items-center">
      //               <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
      //               Jurisdiction-Specific
      //             </span>
      //             <span className="flex items-center">
      //               <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
      //               Confidential & Secure
      //             </span>
      //           </div>
      //         </div>
              
      //         <p className="text-xs text-gray-400 mt-6 max-w-2xl mx-auto">
      //           This service provides general legal information and should not replace professional legal counsel. 
      //           For complex matters, please consult with a qualified attorney.
      //         </p>
      //       </div>
      //     </div>
      //   </div>
      // </div>

      // <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      //   {/* Simple animated background */}
      //   <div className="absolute inset-0 overflow-hidden">
      //     <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      //     <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      //   </div>

      //   <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      //     <div className="text-center max-w-2xl">
      //       <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
      //         Legal <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Assistant</span> AI
      //       </h1>
            
      //       <p className="text-xl text-gray-200 leading-relaxed mb-12">
      //         Get personalized legal guidance powered by AI. Simply share your location and situation to receive tailored advice.
      //       </p>
            
      //       <button
      //         onClick={() => setShowIntro(false)}
      //         className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
      //       >
      //         Get Started
      //       </button>
            
      //       <p className="text-sm text-gray-400 mt-8 max-w-lg mx-auto">
      //         This service provides general legal information. For complex matters, consult with a qualified attorney.
      //       </p>
      //     </div>
      //   </div>
      // </div>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="text-4xl mb-4">⚖️</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Legal Assistant AI
            </h1>
            <p className="text-gray-200 leading-relaxed">
              Get personalized legal guidance. Share your location and situation to receive tailored advice.
            </p>
          </div>
          
          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Get Started
          </button>
          
          <p className="text-xs text-gray-400 mt-6">
            Provides general legal information. Consult an attorney for complex matters.
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <button
                onClick={handleBackToForm}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Form
              </button>
              <LoadingButton
                loading={loading}
                onClick={handleSaveResults}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Save Legal Advice
              </LoadingButton>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* AI Intro */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Legal Assessment</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{results.ai_intro}</p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-purple-500 rounded-full mr-3"></span>
                  Case Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{results.summary}</p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-emerald-500 rounded-full mr-3"></span>
                  Immediate Next Steps
                </h3>
                <div className="space-y-4">
                  {results.next_steps?.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Know Your Rights */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-amber-500 rounded-full mr-3"></span>
                  Know Your Rights
                </h3>
                <div className="grid gap-3">
                  {results.know_your_rights?.map((right, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-3 h-3 bg-amber-500 rounded-full mt-2"></div>
                      <p className="text-gray-700">{right}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicable Laws */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full mr-3"></span>
                  Applicable Laws
                </h3>
                <div className="grid gap-3">
                {results.applicable_laws?.map((law, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-3 h-3 bg-indigo-500 rounded-full mt-2"></div>
                    <div className="text-gray-700">
                      {typeof law === "string" ? (
                        <p>{law}</p>
                      ) : (
                        <>
                          <p className="font-medium">{law.law}</p>
                          <p className="text-sm text-gray-600">{law.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                </div>
                {results.law_reference_source && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 italic">
                      <strong>Reference:</strong> {results.law_reference_source}
                    </p>
                  </div>
                )}
              </div>

              {/* Warnings */}
              {results.important_warnings && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border-l-4 border-red-400 shadow-lg">
                  <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    Important Warnings
                  </h3>
                  <div className="grid gap-3">
                    {results.important_warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-red-700">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penalties */}
              {results.possible_fines_or_penalties && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-8 border-l-4 border-red-500 shadow-lg">
                  <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full mr-3"></span>
                    Possible Penalties
                  </h3>
                  <div className="grid gap-3">
                    {results.possible_fines_or_penalties.map((penalty, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-red-700">{penalty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lawyer Recommendation */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-purple-500 rounded-full mr-3"></span>
                  Legal Representation
                </h3>
                <div className="grid gap-3">
                  {Array.isArray(results.should_escalate_to_lawyer) ? (
                    results.should_escalate_to_lawyer.map((advice, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-gray-700">{advice}</p>
                      </div>
                    ))
                  ) : results.should_escalate_to_lawyer ? (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                      <p className="text-gray-700">{results.should_escalate_to_lawyer}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Additional Advice */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-teal-500 rounded-full mr-3"></span>
                  Additional Advice
                </h3>
                <div className="grid gap-3">
                  {results.additional_advice?.map((advice, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-3 h-3 bg-teal-500 rounded-full mt-2"></div>
                      <p className="text-gray-700">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Reassurance */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-l-4 border-green-400 shadow-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💚</span>
                  Final Message
                </h3>
                <p className="text-green-700 leading-relaxed text-lg">{results.final_reassurance}</p>
              </div>
            </div>
          </div>
        </div>
        {loading && <LoadingOverlay message="Saving your legal advice..." />}
      </div>
    );
  }

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
              Legal Consultation Form
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Provide your details to receive personalized legal guidance tailored to your jurisdiction
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 lg:p-12">
              {/* Location Section */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Location Information</h2>
                    <p className="text-gray-600">Help us provide jurisdiction-specific guidance</p>
                  </div>
                </div>
                
                  <div className="grid lg:grid-cols-2 gap-8">
                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Country *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full px-6 py-4 pr-12 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
                          errors.country ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '20px'
                        }}
                      >
                        <option value="">Select your country</option>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      State/Province *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={!formData.country}
                        className={`w-full px-6 py-4 pr-12 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
                          !formData.country ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                        } ${
                          errors.state ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '20px'
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      City/Locality *
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                        errors.locality ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter your city or locality"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Place of Incident (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.incident_place}
                      onChange={(e) => handleInputChange('incident_place', e.target.value)}
                      className="w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 border-gray-200 hover:border-gray-300"
                      placeholder="If different from your location"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Age */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gender *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-no-repeat bg-right-4 ${
                          errors.gender ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundSize: '20px'
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Problem */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Legal Issue</h2>
                    <p className="text-gray-600">Describe your legal problem in detail</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Describe your legal problem in detail *
                  </label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none ${
                      errors.problem ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    rows={6}
                    placeholder="Please provide as much detail as possible about your legal issue. Include relevant dates, people involved, documents, and what outcome you're seeking. The more information you provide, the better guidance we can offer."
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">⚖️</span>
                    Get Legal Guidance
                  </span>
                </LoadingButton>
                
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 font-medium"
                >
                  <span className="flex items-center justify-center">
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
                      This AI assistant provides general legal information and guidance. It does not constitute 
                      legal advice and should not replace consultation with a qualified attorney. For complex 
                      legal matters, please consult with a licensed lawyer in your jurisdiction.
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