// app/team/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TeamMember {
  _id: string;
  name: string;
  image: string;
  designation: string;
  enrolledDate?: string;
  graduatedDate?: string;
  Description?: string;
}

type Category = 'all' | 'present' | 'past' | 'phd' | 'mtech' | 'btech';

// Truncate text function
const truncateText = (text: string, wordLimit: number): string => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembersByCategory(activeCategory);
  }, [teamMembers, activeCategory]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/team');
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch team members');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMemberCategory = (member: TeamMember): 'phd' | 'mtech' | 'btech' => {
    const designation = member.designation.toLowerCase();
    
    if (designation.includes('phd') || designation.includes('ph.d')) {
      return 'phd';
    } else if (designation.includes('mtech') || designation.includes('m.tech') || designation.includes('masters')) {
      return 'mtech';
    } else if (designation.includes('btech') || designation.includes('b.tech') || designation.includes('bachelor')) {
      return 'btech';
    }
    
    // Default fallback based on common patterns
    if (designation.includes('phd')) return 'phd';
    if (designation.includes('mtech')) return 'mtech';
    return 'btech';
  };

  const getStatus = (member: TeamMember): 'present' | 'past' => {
    return member.graduatedDate ? 'past' : 'present';
  };

  const filterMembersByCategory = (category: Category) => {
    if (category === 'all') {
      setFilteredMembers(teamMembers);
      return;
    }

    if (category === 'present') {
      const presentMembers = teamMembers.filter(member => !member.graduatedDate);
      setFilteredMembers(presentMembers);
      return;
    }

    if (category === 'past') {
      const pastMembers = teamMembers.filter(member => member.graduatedDate);
      setFilteredMembers(pastMembers);
      return;
    }

    // For phd, mtech, btech categories
    const filtered = teamMembers.filter(member => {
      const memberCategory = getMemberCategory(member);
      return memberCategory === category;
    });
    
    setFilteredMembers(filtered);
  };

  const openMemberModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  const getCategoryStats = () => {
    const stats = {
      all: teamMembers.length,
      present: teamMembers.filter(m => !m.graduatedDate).length,
      past: teamMembers.filter(m => m.graduatedDate).length,
      phd: teamMembers.filter(m => getMemberCategory(m) === 'phd').length,
      mtech: teamMembers.filter(m => getMemberCategory(m) === 'mtech').length,
      btech: teamMembers.filter(m => getMemberCategory(m) === 'btech').length,
    };
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Modal component
  const MemberModal = () => {
    if (!selectedMember) return null;

    const status = getStatus(selectedMember);
    const category = getMemberCategory(selectedMember);
    
    const categoryColors = {
      phd: 'bg-blue-100 text-blue-800',
      mtech: 'bg-yellow-100 text-yellow-800',
      btech: 'bg-red-100 text-red-800',
    };

    const statusColors = {
      present: 'bg-green-100 text-green-800',
      past: 'bg-purple-100 text-purple-800',
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity"
          onClick={closeModal}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div className="relative h-full min-h-[400px]">
                {selectedMember.image ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-32 h-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                
                {/* Badges on image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
                    {status === 'present' ? 'Present Member' : 'Alumni'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[category]}`}>
                    {category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="p-8 overflow-y-auto max-h-[90vh]">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
                  <p className="text-xl text-gray-700 font-medium">{selectedMember.designation}</p>
                </div>

                {/* Dates Section */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    {selectedMember.enrolledDate && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Enrolled Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedMember.enrolledDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedMember.graduatedDate && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Graduated Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedMember.graduatedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  {selectedMember.Description ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedMember.Description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No description provided.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <button
                onClick={fetchTeamMembers}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Our Team
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-blue-100">
              Meet our talented team members. Current students, alumni, and researchers working together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter by Category</h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { key: 'all', label: 'All Members', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
              { key: 'present', label: 'Present Members', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
              { key: 'past', label: 'Past Members', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
              { key: 'phd', label: 'PhD Students', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
              { key: 'mtech', label: 'M.Tech Students', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
              { key: 'btech', label: 'B.Tech Students', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as Category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === key 
                    ? 'ring-2 ring-offset-2 ring-blue-500' 
                    : ''
                } ${color}`}
              >
                {label} ({categoryStats[key as keyof typeof categoryStats]})
              </button>
            ))}
          </div>

          {/* Active Filter Info */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-700">
              Showing <span className="font-semibold">{filteredMembers.length}</span> team member(s) 
              {activeCategory !== 'all' && ` in ${activeCategory.toUpperCase()} category`}
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.747a4.007 4.007 0 01-4.014 4.014" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">No team members match the current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMembers.map((member) => {
              const status = getStatus(member);
              const category = getMemberCategory(member);
              const wordCount = member.Description ? member.Description.split(' ').length : 0;
              const shouldTruncate = wordCount > 50;
              const truncatedDescription = shouldTruncate ? truncateText(member.Description || '', 50) : member.Description;
              
              const categoryColors = {
                phd: 'bg-blue-100 text-blue-800',
                mtech: 'bg-yellow-100 text-yellow-800',
                btech: 'bg-red-100 text-red-800',
              };

              const statusColors = {
                present: 'bg-green-100 text-green-800',
                past: 'bg-purple-100 text-purple-800',
              };

              return (
                <div
                  key={member._id}
                  onClick={() => openMemberModal(member)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                >
                  {/* Member Image */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
                      {status === 'present' ? 'Present' : 'Alumni'}
                    </div>
                    
                    {/* View Details Badge */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white bg-opacity-90 rounded-full text-sm font-semibold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Details →
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category]}`}>
                        {category.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 font-medium mb-4">{member.designation}</p>
                    
                    {member.Description && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-2">
                          {truncatedDescription}
                          {shouldTruncate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openMemberModal(member);
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Read more
                            </button>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {member.enrolledDate && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Enrolled: {new Date(member.enrolledDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {member.graduatedDate && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Graduated: {new Date(member.graduatedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(categoryStats).map(([key, count]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Refresh Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={fetchTeamMembers}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Refresh team data"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <MemberModal />}
    </div>
  );
}