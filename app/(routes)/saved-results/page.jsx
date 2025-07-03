"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Eye, Trash2, Search, Filter, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { LoadingButton, LoadingOverlay } from '@/components/ui/Loading';


const ResultsModal = ({ query, onClose }) => {
  if (!query || !query.response_json) return null;

  const results = query.response_json;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[100vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Legal Advice Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="space-y-6">
            {/* Original Query */}
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-400">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Original Query</h3>
              <p className="text-gray-700">{query.problem}</p>
            </div>

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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Do's and Don'ts</h3>
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
                            <h4 className="text-sm sm:text-base font-semibold text-green-800">Do's</h4>
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
                            <h4 className="text-sm sm:text-base font-semibold text-red-800">Don'ts</h4>
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
    </div>
  );
};

export default function SavedResultsPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const itemsPerPage = 10;

useEffect(() => {
    const checkAndFetch = async () => {
        try {
        const res = await fetch("/api/auth/auth-check", {
            credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
            fetchQueries(); // user is authenticated, now fetch the queries
        } else {
            // Redirect to login if not authenticated
            window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
        }
        } catch (error) {
        console.error("Error during auth check:", error);
        window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
        }
    };

    checkAndFetch();
    }, [currentPage]);


  const fetchQueries = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      
      const response = await fetch(`/api/legal-queries?limit=${itemsPerPage}&offset=${offset}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 
      });

      const data = await response.json();
      
      if (data.success) {
        setQueries(data.data);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } else {
        setError(data.error || 'Failed to fetch saved results');
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      setError('Failed to fetch saved results');
    } finally {
      setLoading(false);
    }
  };


  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const handleDeleteQuery = async (queryId) => {
    if (!confirm('Are you sure you want to delete this saved result?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      // Simulate delete API call
      setTimeout(() => {
        setQueries(queries.filter(q => q.id !== queryId));
        setDeleteLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error deleting query:', error);
      setError('Failed to delete result');
      setDeleteLoading(false);
    }
  };

const filteredQueries = (queries || []).filter(query => {
    console.log('Query object:', query); // Debug log
    console.log('Search term:', searchTerm); // Debug log
    
    // If no search term, show all
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const problemMatch = query.problem?.toLowerCase().includes(searchLower);
    const introMatch = query.response_json?.ai_intro?.toLowerCase().includes(searchLower);
    
    console.log('Problem match:', problemMatch, 'Intro match:', introMatch);
    
    return problemMatch || introMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Saved Legal Results</h1>
            </div>
            <p className="text-gray-600">View and manage your previously saved legal consultations</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your saved results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors duration-200">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Results Grid */}
          <div className="space-y-6">
            {filteredQueries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved results found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Your saved legal consultations will appear here'}
                </p>
              </div>
            ) : (
              filteredQueries.map((query) => (
                <div key={query.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {query.locality}, {query.state}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          Case #{query.id}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Legal Consultation
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {truncateText(query.problem)}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(query.created_at)}
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Completed
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
                      <button
                        onClick={() => handleViewQuery(query)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      
                      {/* <LoadingButton
                        loading={deleteLoading}
                        onClick={() => handleDeleteQuery(query.id)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </LoadingButton> */}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ResultsModal
          query={selectedQuery}
          onClose={() => {
            setShowModal(false);
            setSelectedQuery(null);
          }}
        />
      )}

      {deleteLoading && <LoadingOverlay message="Deleting result..." />}
    </div>
  );
}