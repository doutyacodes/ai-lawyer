// hooks/useLegalForm.js
import { useState, useEffect, useCallback } from 'react';
import { formStorage } from '@/lib/auth-client';
// import { formStorage } from '../lib/auth-client';

const initialFormData = {
  country: '',
  state: '',
  locality: '',
  incident_place: '',
  age: '',
  gender: '',
  problem: ''
};

export function useLegalForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = formStorage.load('form_data');
    if (savedData) {
      setFormData({ ...initialFormData, ...savedData });
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    if (hasData) {
      formStorage.save('form_data', formData);
    }
  }, [formData]);

  const updateField = useCallback((field, value) => {
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
  }, [errors]);

  const validateForm = useCallback(() => {
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
  }, [formData]);

  const clearForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    formStorage.clear('form_data');
  }, []);

  const submitForm = useCallback(async (onSuccess, onError) => {
    if (!validateForm()) return false;
    
    setIsLoading(true);
    
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
        onSuccess(data.data);
        return true;
      } else {
        onError(data.error || 'Something went wrong');
        return false;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      onError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  return {
    formData,
    errors,
    isLoading,
    updateField,
    validateForm,
    clearForm,
    submitForm,
  };
}

// Hook for managing results and saving
export function useLegalResults() {
  const [results, setResults] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveResults = useCallback(async (formData, resultsData) => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/save-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          response_json: resultsData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: 'Legal advice saved successfully!' };
      } else if (data.requiresAuth) {
        return { success: false, requiresAuth: true };
      } else {
        return { success: false, message: data.error || 'Failed to save' };
      }
    } catch (error) {
      console.error('Save error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    results,
    setResults,
    isSaving,
    saveResults,
  };
}