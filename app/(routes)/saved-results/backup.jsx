// app/saved-results/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Eye, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  const router = useRouter();
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
        setQueries(data.data.data);
        setTotalPages(Math.ceil(data.data.total / itemsPerPage));
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
      
      const response = await fetch(`/api/legal-queries/${queryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setQueries(queries.filter(q => q.id !== queryId));
      } else {
        setError(data.error || 'Failed to delete result');
      }
    } catch (error) {
      console.error('Error deleting query:', error);
      setError('Failed to delete result');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredQueries = queries.filter(query =>
    query.query_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.ai_intro?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your saved results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Legal Results</h1>
              <p className="text-gray-600">Your previously saved legal assessments and advice</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get New Legal Advice
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your saved results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results Grid */}
          {filteredQueries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'No results found' : 'No saved results yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start by getting legal advice and save your results for future reference'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Legal Advice
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div key={query.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-500">{formatDate(query.created_at)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {query.query_text?.substring(0, 100)}...
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {query.ai_intro?.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                      <button
                        onClick={() => handleViewQuery(query)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteQuery(query.id)}
                        disabled={deleteLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      page === currentPage
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing full query */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Legal Assessment</h2>
                  <p className="text-gray-500 mt-1">{formatDate(selectedQuery.created_at)}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Question</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedQuery.query_text}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal Assessment</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedQuery.ai_intro}</p>
                </div>
              </div>

              {selectedQuery.legal_options && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal Options</h3>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedQuery.legal_options}</p>
                  </div>
                </div>
              )}

              {selectedQuery.next_steps && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Next Steps</h3>
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedQuery.next_steps}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}