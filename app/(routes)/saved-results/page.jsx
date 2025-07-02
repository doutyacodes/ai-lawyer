"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Eye, Trash2, Search, Filter, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { LoadingButton, LoadingOverlay } from '@/components/ui/Loading';


const ResultsModal = ({ query, onClose }) => {
  if (!query || !query.response_json) return null;

  const results = query.response_json;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
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