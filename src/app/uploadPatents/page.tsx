"use client";

import React, { useState } from 'react';

interface PatentFormData {
  title: string;
  Applno: string;
  Status: string;
  Inventors: string;
  FilingDate: string;
  GrantDate: string;
}

const PatentForm = () => {
  const [patents, setPatents] = useState<PatentFormData[]>([
    {
      title: '',
      Applno: '',
      Status: '',
      Inventors: '',
      FilingDate: '',
      GrantDate: ''
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (index: number, field: keyof PatentFormData, value: string) => {
    const updatedPatents = [...patents];
    updatedPatents[index] = {
      ...updatedPatents[index],
      [field]: value
    };
    setPatents(updatedPatents);
  };

  const addMorePatent = () => {
    setPatents([
      ...patents,
      {
        title: '',
        Applno: '',
        Status: '',
        Inventors: '',
        FilingDate: '',
        GrantDate: ''
      }
    ]);
  };

  const removePatent = (index: number) => {
    if (patents.length > 1) {
      const updatedPatents = patents.filter((_, i) => i !== index);
      setPatents(updatedPatents);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Filter out empty patents (all fields empty)
      const patentsToSubmit = patents.filter(patent => 
        patent.title.trim() || 
        patent.Applno.trim() || 
        patent.Status.trim() || 
        patent.Inventors.trim()
      );

      if (patentsToSubmit.length === 0) {
        setMessage({ type: 'error', text: 'Please add at least one patent with required fields.' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/patent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patentsToSubmit),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: patentsToSubmit.length > 1 
            ? `${patentsToSubmit.length} patents added successfully!` 
            : 'Patent added successfully!' 
        });
        // Reset form
        setPatents([{
          title: '',
          Applno: '',
          Status: '',
          Inventors: '',
          FilingDate: '',
          GrantDate: ''
        }]);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit patents. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    'Granted',
    'Pending',
    'First Evaluation Report Submitted',
    'Under Review',
    'Filed'
  ];

  const isFormValid = patents.some(patent => 
    patent.title.trim() && 
    patent.Applno.trim() && 
    patent.Status.trim() && 
    patent.Inventors.trim()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Add Patents
          </h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto font-medium">
            Pattern Recognition and Machine Intelligence Laboratory
          </p>
          <div className="mt-4 bg-blue-100/50 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-blue-800 font-medium">
              {patents.length} patent{patents.length !== 1 ? 's' : ''} ready to add
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <span className={`mr-3 text-xl ${
                  message.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {message.type === 'success' ? '✅' : '❌'}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {patents.map((patent, index) => (
              <div key={index} className="border-2 border-blue-100 rounded-2xl p-6 bg-white/50 relative">
                {/* Patent Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                      {index + 1}
                    </span>
                    Patent #{index + 1}
                  </h3>
                  {patents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePatent(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove patent"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Patent Form Fields */}
                <div className="space-y-6">
                  {/* Patent Title */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Patent Title *
                    </label>
                    <textarea
                      value={patent.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      required
                      rows={3}
                      className="w-full text-black px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Enter the complete patent title..."
                    />
                  </div>

                  {/* Application Number */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Application Number *
                    </label>
                    <input
                      type="text"
                      value={patent.Applno}
                      onChange={(e) => handleChange(index, 'Applno', e.target.value)}
                      required
                      className="w-full text-black px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="e.g., 202331058606 or 85/Kol/08"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Status *
                    </label>
                    <select
                      value={patent.Status}
                      onChange={(e) => handleChange(index, 'Status', e.target.value)}
                      required
                      className="w-full text-black px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Inventors */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Inventors *
                    </label>
                    <input
                      type="text"
                      value={patent.Inventors}
                      onChange={(e) => handleChange(index, 'Inventors', e.target.value)}
                      required
                      className="w-full text-black px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="e.g., Samit Ari, John Doe, Jane Smith"
                    />
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filing Date */}
                    <div>
                      <label className="block  text-sm font-semibold text-blue-800 mb-2">
                        Filing Date
                      </label>
                      <input
                        type="date"
                        value={patent.FilingDate}
                        onChange={(e) => handleChange(index, 'FilingDate', e.target.value)}
                        className="w-full px-4 py-3 text-black border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>

                    {/* Grant Date */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Grant Date
                      </label>
                      <input
                        type="date"
                        value={patent.GrantDate}
                        onChange={(e) => handleChange(index, 'GrantDate', e.target.value)}
                        className="w-full px-4 py-3 text-black border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addMorePatent}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Patent
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-blue-200">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isSubmitting || !isFormValid
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding {patents.length > 1 ? `${patents.length} Patents...` : 'Patent...'}
                  </div>
                ) : (
                  patents.length > 1 ? `Add ${patents.length} Patents` : 'Add Patent'
                )}
              </button>
            </div>

            {/* Form Note */}
            <div className="text-center">
              <p className="text-sm text-blue-600">
                Fields marked with * are required. Empty patents will be ignored.
              </p>
            </div>
          </form>
        </div>

      
      </div>
    </div>
  );
};

export default PatentForm;