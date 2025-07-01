"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, List, Shield, AlertTriangle, Clock, Users, FileText, ExternalLink } from 'lucide-react';

// Generate or retrieve user ID
const getUserId = () => {
  if (typeof window === 'undefined') return null;
  
  let userId = localStorage.getItem('legal_assistant_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('legal_assistant_user_id', userId);
  }
  return userId;
};

export default function LegalAssistant() {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    age: '',
    gender: '',
    problem: ''
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [pastQueries, setPastQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    if (id) {
      fetchUserHistory(id);
    }
  }, []);

  const fetchUserHistory = async (userId) => {
    try {
      const response = await fetch(`/api/user-queries/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPastQueries(data.queries || []);
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const listFormatted = boldFormatted.split('\n').map(line => {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        return `<li class="ml-4 mb-2">${match[2]}</li>`;
      }
      return line;
    }).join('\n');
    return listFormatted;
  };

  const ResponseSection = ({ title, icon: Icon, content, isArray = false, isObject = false }) => {
    if (!content || content === null) return null;
    
    if (isArray && Array.isArray(content) && content.length === 0) return null;

    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>
        
        {isArray && Array.isArray(content) ? (
          <ul className="space-y-2">
            {content.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{typeof item === 'object' ? JSON.stringify(item) : item}</span>
              </li>
            ))}
          </ul>
        ) : isObject && typeof content === 'object' ? (
          <div className="space-y-3">
            {Object.entries(content).map(([key, value]) => (
              value && (
                <div key={key} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}</h4>
                  <p className="text-gray-700 mt-1">{value}</p>
                </div>
              )
            ))}
          </div>
        ) : (
          <div 
            className="text-gray-700 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formatText(content) }}
          />
        )}
      </div>
    );
  };

  const ProfessionalsSection = ({ professionals }) => {
    if (!professionals || !Array.isArray(professionals) || professionals.length === 0) return null;

    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-900">Recommended Legal Professionals</h3>
        </div>
        <div className="grid gap-4">
          {professionals.map((professional, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{professional.type}</h4>
                  {professional.specialization && (
                    <p className="text-sm text-blue-600 mt-1">{professional.specialization}</p>
                  )}
                  {professional.region && (
                    <p className="text-sm text-gray-600 mt-1">Region: {professional.region}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimilarCasesSection = ({ cases }) => {
    if (!cases || !Array.isArray(cases) || cases.length === 0) return null;

    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-900">Similar Past Cases</h3>
        </div>
        <div className="space-y-4">
          {cases.map((case_item, index) => (
            <div key={index} className="border-l-4 border-green-200 pl-4 py-2">
              <h4 className="font-medium text-gray-900">{case_item.title}</h4>
              <p className="text-gray-700 text-sm mt-1">{case_item.summary}</p>
              {case_item.reference_link && (
                <a 
                  href={case_item.reference_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Reference Link
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResponse = (response) => {
    try {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      const content = data.content || data;

      return (
        <div className="mt-6 space-y-4">
          {/* <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Legal Analysis</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm"
            >
              {showHistory ? 'Hide History' : 'View History'}
            </Button>
          </div> */}
          
          <ResponseSection
            title="Issue Summary"
            icon={BookOpen}
            content={content.issue_summary}
          />
          
          {content.legal_context && (
            <ResponseSection
              title="Legal Context"
              icon={Shield}
              content={content.legal_context}
              isObject={true}
            />
          )}
          
          {content.required_procedures && (
            <div className="space-y-4">
              <ResponseSection
                title="Step by Step Actions"
                icon={List}
                content={content.required_procedures.step_by_step_actions}
                isArray={true}
              />
              
              <ResponseSection
                title="Legal Authorities to Contact"
                icon={Users}
                content={content.required_procedures.legal_authorities_to_contact}
              />
              
              <ResponseSection
                title="Required Documents"
                icon={FileText}
                content={content.required_procedures.documents_required}
                isArray={true}
              />
              
              <ResponseSection
                title="Time Limits"
                icon={Clock}
                content={content.required_procedures.time_limits}
              />
            </div>
          )}
          
          <ProfessionalsSection professionals={content.recommended_legal_professionals} />
          
          <ResponseSection
            title="Risks and Warnings"
            icon={AlertTriangle}
            content={content.risks_and_warnings}
          />
          
          <SimilarCasesSection cases={content.similar_past_cases} />
          
          <ResponseSection
            title="Additional Notes and Advice"
            icon={BookOpen}
            content={content.notes_and_advice}
          />
          
          {content.law_reference_source && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Reference Source:</strong> {content.law_reference_source}
              </p>
            </div>
          )}
          
          {content.disclaimer && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> {content.disclaimer}
              </p>
            </div>
          )}
        </div>
      );
    } catch (error) {
      return (
        <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
          <AlertDescription>Error displaying response. Please try again.</AlertDescription>
        </Alert>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/generate-legal-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data);
      
      // Refresh history after new query
      if (userId) {
        await fetchUserHistory(userId);
      }
    } catch (err) {
      setError('Sorry, there was an error processing your request. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPastQuery = (query) => {
    setResponse({ content: query });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Legal Assistant</h1>
          {/* {userId && (
            <p className="text-sm text-gray-600">User ID: {userId.slice(-8)}</p>
          )} */}
        </div>
{/* 
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Legal Analysis</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm"
          >
            {showHistory ? 'Hide History' : 'View History'}
          </Button>
        </div> */}

        {/* History Section */}
        {showHistory && pastQueries.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Previous Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pastQueries.map((query, index) => (
                  <div key={query.id} className="border rounded p-3 hover:bg-gray-50 cursor-pointer" onClick={() => loadPastQuery(query)}>
                    <p className="text-sm font-medium">{query.issue_summary || 'Legal Query'}</p>
                    <p className="text-xs text-gray-500 truncate">{query.original_issue}</p>
                    <p className="text-xs text-gray-400">{new Date(query.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Tell us about your situation</CardTitle>
            <CardDescription>Fill in the details below and we&apos;ll provide relevant legal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe your legal issue
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Describe your situation in detail..."
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get Legal Guidance'}
              </Button>
            </form>
            
            {error && (
              <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  {renderResponse(response)}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}