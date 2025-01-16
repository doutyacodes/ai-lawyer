"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, List } from 'lucide-react';


export default function LegalAssistant() {
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

  const formatText = (text) => {
    // Handle markdown-style bold text
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle numbered lists
    const listFormatted = boldFormatted.split('\n').map(line => {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        return `<li class="ml-4 mb-2">${match[2]}</li>`;
      }
      return line;
    }).join('\n');
  
    return listFormatted;
  };

  const ResponseSection = ({ title, icon: Icon, content }) => (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      </div>
      <div 
        className="text-gray-700 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: formatText(content) }}
      />
    </div>
  );

  const renderResponse = (response) => {
    try {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      const content = data.content || data;

      return (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Analysis</h2>
          
          <ResponseSection
            title="Legal Issue Overview"
            icon={BookOpen}
            content={content.problem}
          />
          
          <ResponseSection
            title="Rules and Procedures"
            icon={List}
            content={content.rules_and_procedures}
          />
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
      const response = await fetch('/api/get-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError('Sorry, there was an error processing your request. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Legal Assistant</h1>
        </div>

        {/* Main Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Tell us about your situation</CardTitle>
            <CardDescription>Fill in the details below and we'll provide relevant legal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Selection */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stete</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  />
                </div>

                {/* Age Input */}
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

                {/* Gender Selection */}
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

              {/* Problem Description */}
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get Legal Guidance'}
              </Button>
            </form>
            
            {/* Error Message */}
            {error && (
              <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Updated Response Section */}
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