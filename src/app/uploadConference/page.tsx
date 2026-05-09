"use client";

import React, { useState, useEffect } from 'react';

interface ConferenceFormData {
  title: string;
  authors: string[];
  otherAuthorName: string;
  conference: string;
  year: string;
  month: string;
  location: string;
  pages: string;
  type: string;
  status: string;
}

interface TeamMember {
  _id: string;
  name: string;
}

const ConferenceForm = () => {
  const [conferences, setConferences] = useState<ConferenceFormData[]>([
    {
      title: '',
      authors: [],
      otherAuthorName: '',
      conference: '',
      year: new Date().getFullYear().toString(),
      month: '',
      location: '',
      pages: '',
      type: 'Oral Presentation',
      status: 'Presented'
    }
  ]);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; details?: string[] } | null>(null);

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        const result = await response.json();
        
        if (result.success && result.data) {
          setTeamMembers(result.data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoadingTeam(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleAuthorChange = (index: number, selectedAuthors: string[]) => {
    const updatedConferences = [...conferences];
    updatedConferences[index] = {
      ...updatedConferences[index],
      authors: selectedAuthors,
      // Reset otherAuthorName if "Others" is not selected
      otherAuthorName: selectedAuthors.includes('Others') ? updatedConferences[index].otherAuthorName : ''
    };
    setConferences(updatedConferences);
  };

  const handleOtherAuthorNameChange = (index: number, name: string) => {
    const updatedConferences = [...conferences];
    updatedConferences[index] = {
      ...updatedConferences[index],
      otherAuthorName: name
    };
    setConferences(updatedConferences);
  };

  const handleChange = (index: number, field: keyof ConferenceFormData, value: string) => {
    const updatedConferences = [...conferences];
    updatedConferences[index] = {
      ...updatedConferences[index],
      [field]: value
    };
    setConferences(updatedConferences);
  };

  const addMoreConference = () => {
    setConferences([
      ...conferences,
      {
        title: '',
        authors: [],
        otherAuthorName: '',
        conference: '',
        year: new Date().getFullYear().toString(),
        month: '',
        location: '',
        pages: '',
        type: 'Oral Presentation',
        status: 'Presented'
      }
    ]);
  };

  const removeConference = (index: number) => {
    if (conferences.length > 1) {
      const updatedConferences = conferences.filter((_, i) => i !== index);
      setConferences(updatedConferences);
    }
  };

  const getAuthorsString = (authors: string[], otherAuthorName: string): string => {
    const selectedAuthors = [...authors];
    
    // Replace 'Others' with the custom name if provided
    const othersIndex = selectedAuthors.indexOf('Others');
    if (othersIndex !== -1 && otherAuthorName.trim()) {
      selectedAuthors[othersIndex] = otherAuthorName.trim();
    } else if (othersIndex !== -1 && !otherAuthorName.trim()) {
      // Remove 'Others' if no name provided
      selectedAuthors.splice(othersIndex, 1);
    }
    
    return selectedAuthors.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Process conferences: convert authors array to string and filter out empty ones
      const conferencesToSubmit = conferences
        .map(conference => ({
          ...conference,
          authors: getAuthorsString(conference.authors, conference.otherAuthorName)
        }))
        .filter(conference => 
          conference.title.trim() && 
          conference.authors.trim() && 
          conference.conference.trim() && 
          conference.year.trim()
        );

      if (conferencesToSubmit.length === 0) {
        setMessage({ 
          type: 'error', 
          text: 'Please add at least one conference with required fields.' 
        });
        setIsSubmitting(false);
        return;
      }

      // Remove otherAuthorName from the data sent to API
      const finalData = conferencesToSubmit.map(({ otherAuthorName, ...rest }) => rest);

      const response = await fetch('/api/conference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: finalData.length > 1 
            ? `${finalData.length} conferences added successfully!` 
            : 'Conference added successfully!' 
        });
        // Reset form
        setConferences([{
          title: '',
          authors: [],
          otherAuthorName: '',
          conference: '',
          year: new Date().getFullYear().toString(),
          month: '',
          location: '',
          pages: '',
          type: 'Oral Presentation',
          status: 'Presented'
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
        text: 'Failed to submit conferences. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    'Oral Presentation',
    'Poster Presentation',
    'Keynote Address',
    'Invited Talk',
    'Workshop',
    'Tutorial',
    'Panel Discussion',
    'Proceedings Paper'
  ];

  const statusOptions = [
    'Presented',
    'Accepted',
    'Submitted',
    'Under Review',
    'Scheduled'
  ];

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  const isFormValid = conferences.some(conference => 
    conference.title.trim() && 
    (conference.authors.length > 0 || conference.otherAuthorName.trim()) && 
    conference.conference.trim() && 
    conference.year.trim()
  );

  // Prepare author options from team members
  const authorOptions = teamMembers.map(member => member.name);
  authorOptions.push('Others'); // Add "Others" option

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">🎤</span>
          </div>
          <h1 className="text-4xl font-bold text-purple-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Add Conference Publications
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto font-medium">
            Pattern Recognition and Machine Intelligence Laboratory
          </p>
          <div className="mt-4 bg-purple-100/50 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-purple-800 font-medium">
              {conferences.length} conference{conferences.length !== 1 ? 's' : ''} ready to add
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-8">
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
            {conferences.map((conference, index) => (
              <div key={index} className="border-2 border-purple-100 rounded-2xl p-6 bg-white/50 relative group">
                {/* Conference Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-purple-900 flex items-center">
                    <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                      {index + 1}
                    </span>
                    Conference Publication #{index + 1}
                  </h3>
                  {conferences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeConference(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove conference"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Conference Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Paper Title *
                    </label>
                    <textarea
                      value={conference.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl text-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Enter the complete conference paper title..."
                    />
                  </div>

                  {/* Authors - Multi-select dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Author(s) *
                    </label>
                    {isLoadingTeam ? (
                      <div className="flex items-center space-x-2 text-purple-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Loading team members...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <select
                          multiple
                          value={conference.authors}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            handleAuthorChange(index, selectedOptions);
                          }}
                          className="w-full px-4 py-3 border border-purple-200 rounded-xl text-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          size={Math.min(6, authorOptions.length)}
                        >
                          {authorOptions.map((author) => (
                            <option key={author} value={author}>
                              {author}
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-purple-600">
                          Hold Ctrl (Cmd on Mac) to select multiple authors
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Other Author Name - shown only when Others is selected */}
                  {conference.authors.includes('Others') && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Other Author Name *
                      </label>
                      <input
                        type="text"
                        value={conference.otherAuthorName}
                        onChange={(e) => handleOtherAuthorNameChange(index, e.target.value)}
                        required
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter the author's full name"
                      />
                      <p className="text-xs text-purple-500 mt-1">
                        Enter the name of the author who is not in the team list
                      </p>
                    </div>
                  )}

                  {/* Selected Authors Preview */}
                  {(conference.authors.length > 0 || conference.otherAuthorName) && (
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-sm font-medium text-purple-800 mb-1">Selected Authors:</p>
                      <p className="text-sm text-purple-700">
                        {getAuthorsString(conference.authors, conference.otherAuthorName) || 'None selected'}
                      </p>
                    </div>
                  )}

                  {/* Conference Name */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Conference Name *
                    </label>
                    <input
                      type="text"
                      value={conference.conference}
                      onChange={(e) => handleChange(index, 'conference', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-purple-200 text-black rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="e.g., IEEE International Conference on Computer Vision"
                    />
                  </div>

                  {/* Year and Month */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Conference Year *
                      </label>
                      <select
                        value={conference.year}
                        onChange={(e) => handleChange(index, 'year', e.target.value)}
                        required
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Conference Month
                      </label>
                      <select
                        value={conference.month}
                        onChange={(e) => handleChange(index, 'month', e.target.value)}
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select Month</option>
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location and Pages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={conference.location}
                        onChange={(e) => handleChange(index, 'location', e.target.value)}
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="e.g., Paris, France or Virtual"
                      />
                    </div>

                    {/* Pages */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Pages
                      </label>
                      <input
                        type="text"
                        value={conference.pages}
                        onChange={(e) => handleChange(index, 'pages', e.target.value)}
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="e.g., 123-145"
                      />
                    </div>
                  </div>

                  {/* Type and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Presentation Type *
                      </label>
                      <select
                        value={conference.type}
                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                        required
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      >
                        <option value="">Select Type</option>
                        {typeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-2">
                        Status
                      </label>
                      <select
                        value={conference.status}
                        onChange={(e) => handleChange(index, 'status', e.target.value)}
                        className="w-full px-4 py-3 border text-black border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
              </div>
            ))}

            {/* Add More Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addMoreConference}
                className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Conference
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-purple-200">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isSubmitting || !isFormValid
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding {conferences.length > 1 ? `${conferences.length} Conferences...` : 'Conference...'}
                  </div>
                ) : (
                  conferences.length > 1 ? `Add ${conferences.length} Conferences` : 'Add Conference'
                )}
              </button>
            </div>

            {/* Form Note */}
            <div className="text-center">
              <p className="text-sm text-purple-600">
                Fields marked with * are required. Empty conference entries will be ignored.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConferenceForm;