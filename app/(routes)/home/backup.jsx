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
        </div>

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