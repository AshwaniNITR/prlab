"use client";

import React, { useState } from 'react';

interface JournalFormData {
  title: string;
  author: string;
  journal: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  type: string;
  status: string;
}

const JournalForm = () => {
  const [journals, setJournals] = useState<JournalFormData[]>([
    {
      title: '',
      author: '',
      journal: '',
      year: new Date().getFullYear().toString(),
      volume: '',
      issue: '',
      pages: '',
      type: 'Research Article',
      status: 'Published'
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; details?: string[] } | null>(null);

  const handleChange = (index: number, field: keyof JournalFormData, value: string) => {
    const updatedJournals = [...journals];
    updatedJournals[index] = {
      ...updatedJournals[index],
      [field]: value
    };
    setJournals(updatedJournals);
  };

  const addMoreJournal = () => {
    setJournals([
      ...journals,
      {
        title: '',
        author: '',
        journal: '',
        year: new Date().getFullYear().toString(),
        volume: '',
        issue: '',
        pages: '',
        type: 'Research Article',
        status: 'Published'
      }
    ]);
  };

  const removeJournal = (index: number) => {
    if (journals.length > 1) {
      const updatedJournals = journals.filter((_, i) => i !== index);
      setJournals(updatedJournals);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Filter out empty journals (all required fields empty)
      const journalsToSubmit = journals.filter(journal => 
        journal.title.trim() && 
        journal.author.trim() && 
        journal.journal.trim() && 
        journal.year.trim()
      );

      if (journalsToSubmit.length === 0) {
        setMessage({ 
          type: 'error', 
          text: 'Please add at least one journal with required fields.' 
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(journalsToSubmit),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: journalsToSubmit.length > 1 
            ? `${journalsToSubmit.length} journals added successfully!` 
            : 'Journal added successfully!' 
        });
        // Reset form
        setJournals([{
          title: '',
          author: '',
          journal: '',
          year: new Date().getFullYear().toString(),
          volume: '',
          issue: '',
          pages: '',
          type: 'Research Article',
          status: 'Published'
        }]);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message,
          details: result.errors
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to submit journals. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    'Research Article',
    'Review Article',
    'Short Communication',
    'Case Study',
    'Book Chapter',
    'Editorial',
    'Letter to Editor',
    'Conference Paper'
  ];

  const statusOptions = [
    'Published',
    'Accepted',
    'Under Review',
    'Submitted',
    'In Press'
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  const isFormValid = journals.some(journal => 
    journal.title.trim() && 
    journal.author.trim() && 
    journal.journal.trim() && 
    journal.year.trim()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Add Journal Publications
          </h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto font-medium">
            Pattern Recognition and Machine Intelligence Laboratory
          </p>
          <div className="mt-4 bg-green-100/50 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-green-800 font-medium">
              {journals.length} journal{journals.length !== 1 ? 's' : ''} ready to add
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start">
                <span className={`mr-3 text-xl mt-1 ${
                  message.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {message.type === 'success' ? '✅' : '❌'}
                </span>
                <div>
                  <span className="font-medium block mb-1">{message.text}</span>
                  {message.details && message.details.length > 0 && (
                    <ul className="text-sm mt-2 space-y-1">
                      {message.details.map((detail, idx) => (
                        <li key={idx} className="text-red-600">• {detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {journals.map((journal, index) => (
              <div key={index} className="border-2 border-green-100 rounded-2xl p-6 bg-white/50 relative group">
                {/* Journal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-green-900 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                      {index + 1}
                    </span>
                    Journal Publication #{index + 1}
                  </h3>
                  {journals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeJournal(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove journal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Journal Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">
                      Title *
                    </label>
                    <textarea
                      value={journal.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Enter the complete journal title..."
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">
                      Author(s) *
                    </label>
                    <input
                      type="text"
                      value={journal.author}
                      onChange={(e) => handleChange(index, 'author', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="e.g., Samit Ari, John Doe, Jane Smith"
                    />
                  </div>

                  {/* Journal Name */}
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">
                      Journal Name *
                    </label>
                    <input
                      type="text"
                      value={journal.journal}
                      onChange={(e) => handleChange(index, 'journal', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="e.g., IEEE Transactions on Pattern Analysis"
                    />
                  </div>

                  {/* Year and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year */}
                    <div>
                      <label className="block text-sm font-semibold text-green-800 mb-2">
                        Publication Year *
                      </label>
                      <select
                        value={journal.year}
                        onChange={(e) => handleChange(index, 'year', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-semibold text-green-800 mb-2">
                        Publication Type *
                      </label>
                      <select
                        value={journal.type}
                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select Type</option>
                        {typeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Volume, Issue, and Pages */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Volume */}
                    <div>
                      <label className="block text-sm font-semibold text-green-800 mb-2">
                        Volume
                      </label>
                      <input
                        type="text"
                        value={journal.volume}
                        onChange={(e) => handleChange(index, 'volume', e.target.value)}
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="e.g., 12"
                      />
                    </div>

                    {/* Issue */}
                    <div>
                      <label className="block text-sm font-semibold text-green-800 mb-2">
                        Issue
                      </label>
                      <input
                        type="text"
                        value={journal.issue}
                        onChange={(e) => handleChange(index, 'issue', e.target.value)}
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="e.g., 3"
                      />
                    </div>

                    {/* Pages */}
                    <div>
                      <label className="block text-sm font-semibold text-green-800 mb-2">
                        Pages
                      </label>
                      <input
                        type="text"
                        value={journal.pages}
                        onChange={(e) => handleChange(index, 'pages', e.target.value)}
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="e.g., 123-145"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-2">
                      Status
                    </label>
                    <select
                      value={journal.status}
                      onChange={(e) => handleChange(index, 'status', e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addMoreJournal}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Journal
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-green-200">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isSubmitting || !isFormValid
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding {journals.length > 1 ? `${journals.length} Journals...` : 'Journal...'}
                  </div>
                ) : (
                  journals.length > 1 ? `Add ${journals.length} Journals` : 'Add Journal'
                )}
              </button>
            </div>

            {/* Form Note */}
            <div className="text-center">
              <p className="text-sm text-green-600">
                Fields marked with * are required. Empty journal entries will be ignored.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalForm;