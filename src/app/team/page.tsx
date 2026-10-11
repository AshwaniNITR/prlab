// app/team/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
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

interface Publication {
  _id: string;
  title?: string;
  // Patent fields
  Applno?: string;
  Status?: string;
  Inventors?: string;
  FilingDate?: string;
  GrantDate?: string;
  // Journal fields
  authors?: string;
  journal?: string;
  year?: number | string;
  volume?: string;
  issue?: string;
  pages?: string;
  type?: string;
  status?: string;
  // Conference fields
  conference?: string;
  month?: string;
  location?: string;
  [key: string]: any;
}

interface PublicationsState {
  journals: Publication[];
  patents: Publication[];
  conferences: Publication[];
}

type Category = 'all' | 'present' | 'past' | 'phd' | 'mtech' | 'btech';

const truncateText = (text: string, wordLimit: number): string => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
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

  const [publications, setPublications] = useState<PublicationsState>({
    journals: [],
    patents: [],
    conferences: [],
  });

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
      const response = await fetch('https://prlab.vercel.app/api/team');
      const additional = await fetch('https://prlab.vercel.app/api/masterApi');
      if (!response.ok || !additional.ok) {
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      const additionalData = await additional.json();

      if (data.success) {
        setTeamMembers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch team members');
      }

      if (additionalData?.success && additionalData?.data) {
        setPublications({
          journals: additionalData.data.journals || [],
          patents: additionalData.data.patents || [],
          conferences: additionalData.data.conferences || [],
        });
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

    const filtered = teamMembers.filter(member => {
      const memberCategory = getMemberCategory(member);
      return memberCategory === category;
    });

    setFilteredMembers(filtered);
  };

  const openMemberModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
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

  const isAuthorMatch = (memberName: string, authorString?: string | null): boolean => {
    if (!authorString || !memberName) return false;
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    return normalize(authorString).includes(normalize(memberName));
  };

  const selectedMemberPublications = useMemo(() => {
    if (!selectedMember) return { journals: [], patents: [], conferences: [] };

    const name = selectedMember.name;

    const patents = publications.patents.filter(p =>
      isAuthorMatch(name, p.Inventors)
    );

    const journals = publications.journals.filter(j =>
      isAuthorMatch(name, j.authors)
    );

    const conferences = publications.conferences.filter(c =>
      isAuthorMatch(name, c.authors)
    );

    return { journals, patents, conferences };
  }, [publications, selectedMember]);

  const totalPublications =
    selectedMemberPublications.journals.length +
    selectedMemberPublications.patents.length +
    selectedMemberPublications.conferences.length;

  // Modal component with flip animation
  // const MemberModal = () => {
  //   if (!selectedMember) return null;

  //   const [showPublications, setShowPublications] = useState(false);

  //   const status = getStatus(selectedMember);
  //   const category = getMemberCategory(selectedMember);

  //   const categoryColors = {
  //     phd: 'bg-blue-100 text-blue-800',
  //     mtech: 'bg-yellow-100 text-yellow-800',
  //     btech: 'bg-red-100 text-red-800',
  //   };

  //   const statusColors = {
  //     present: 'bg-green-100 text-green-800',
  //     past: 'bg-purple-100 text-purple-800',
  //   };

  //   // Minimalist label/value row
  //   const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => {
  //     if (value === undefined || value === null || value === '') return null;
  //     return (
  //       <div className="flex text-sm leading-relaxed">
  //         <span className="text-gray-500 w-24 flex-shrink-0">{label}</span>
  //         <span className="text-gray-900 break-words">{value}</span>
  //       </div>
  //     );
  //   };

  //   return (
  //     <div className="fixed inset-0 z-50">
  //       {/* Backdrop */}
  //       <div
  //         className="fixed inset-0 backdrop-blur-sm bg-black/40"
  //         onClick={closeModal}
  //       />

  //       {/* Modal Container */}
  //       <div className="fixed inset-0 overflow-y-auto">
  //         <div className="flex min-h-full items-center justify-center p-4">
  //           {/* Flip wrapper - perspective for 3D effect */}
  //           <div
  //             className="relative w-full max-w-4xl md:max-h-[90vh]"
  //             style={{ perspective: '2000px' }}
  //           >
  //             {/* Flip inner container */}
  //             <div
  //               className="relative w-full transition-transform duration-700"
  //               style={{
  //                 transformStyle: 'preserve-3d',
  //                 transform: showPublications ? 'rotateY(180deg)' : 'rotateY(0deg)',
  //               }}
  //             >
  //               {/* FRONT FACE - Profile */}
  //               <div
  //                 className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden md:max-h-[90vh]"
  //                 style={{
  //                   backfaceVisibility: 'hidden',
  //                   WebkitBackfaceVisibility: 'hidden',
  //                 }}
  //               >
  //                 {/* Close button */}
  //                 <button
  //                   onClick={closeModal}
  //                   className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-90 hover:bg-gray-100 transition-colors shadow-lg"
  //                   aria-label="Close modal"
  //                 >
  //                   <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //                   </svg>
  //                 </button>

  //                 <div className="flex flex-col md:flex-row h-full">
  //                   {/* Left Column - Image */}
  //                   <div className="w-full md:w-2/5">
  //                     <div className="relative h-64 md:h-full">
  //                       {selectedMember.image ? (
  //                         <Image
  //                           src={selectedMember.image}
  //                           alt={selectedMember.name}
  //                           fill
  //                           className="object-cover"
  //                           sizes="(max-width: 768px) 100vw, 40vw"
  //                           priority
  //                         />
  //                       ) : (
  //                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
  //                           <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  //                           </svg>
  //                         </div>
  //                       )}

  //                       <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
  //                         <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[status]}`}>
  //                           {status === 'present' ? 'Present' : 'Alumni'}
  //                         </span>
  //                         <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${categoryColors[category]}`}>
  //                           {category.toUpperCase()}
  //                         </span>
  //                       </div>
  //                     </div>
  //                   </div>

  //                   {/* Right Column - Details */}
  //                   <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
  //                     <div className="mb-6">
  //                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
  //                         {selectedMember.name}
  //                       </h2>
  //                       <p className="text-lg md:text-xl text-gray-700 font-medium">
  //                         {selectedMember.designation}
  //                       </p>
  //                     </div>

  //                     <div className="mb-6 p-4 bg-gray-50 rounded-lg">
  //                       <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
  //                       <div className="space-y-3">
  //                         {selectedMember.enrolledDate && (
  //                           <div className="flex items-center">
  //                             <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
  //                               <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  //                               </svg>
  //                             </div>
  //                             <div>
  //                               <p className="text-sm text-gray-600">Enrolled Date</p>
  //                               <p className="font-medium text-gray-900">
  //                                 {new Date(selectedMember.enrolledDate).toLocaleDateString('en-US', {
  //                                   year: 'numeric',
  //                                   month: 'short',
  //                                   day: 'numeric'
  //                                 })}
  //                               </p>
  //                             </div>
  //                           </div>
  //                         )}

  //                         {selectedMember.graduatedDate && (
  //                           <div className="flex items-center">
  //                             <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
  //                               <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  //                               </svg>
  //                             </div>
  //                             <div>
  //                               <p className="text-sm text-gray-600">Graduated Date</p>
  //                               <p className="font-medium text-gray-900">
  //                                 {new Date(selectedMember.graduatedDate).toLocaleDateString('en-US', {
  //                                   year: 'numeric',
  //                                   month: 'short',
  //                                   day: 'numeric'
  //                                 })}
  //                               </p>
  //                             </div>
  //                           </div>
  //                         )}
  //                       </div>
  //                     </div>

  //                     <div className="pb-4">
  //                       <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
  //                       {selectedMember.Description ? (
  //                         <div className="text-gray-700 leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto pr-2">
  //                           {selectedMember.Description}
  //                         </div>
  //                       ) : (
  //                         <p className="text-gray-500 italic">No description provided.</p>
  //                       )}
  //                     </div>

  //                     {/* Publications button */}
  //                     <div className="pt-4 border-t border-gray-100">
  //                       <button
  //                         onClick={() => setShowPublications(true)}
  //                         className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
  //                       >
  //                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  //                         </svg>
  //                         Publications ({totalPublications})
  //                       </button>
  //                     </div>

  //                     {/* Bottom Close Button for Mobile Only */}
  //                     <div className="block md:hidden pt-4">
  //                       <button
  //                         onClick={closeModal}
  //                         className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
  //                       >
  //                         Close
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* BACK FACE - Publications */}
  //               <div
  //                 className="absolute inset-0 bg-white w-full rounded-2xl shadow-2xl overflow-hidden md:max-h-[90vh]"
  //                 style={{
  //                   backfaceVisibility: 'hidden',
  //                   WebkitBackfaceVisibility: 'hidden',
  //                   transform: 'rotateY(180deg)',
  //                 }}
  //               >
  //                 {/* Close button (back) */}
  //                 <button
  //                   onClick={closeModal}
  //                   className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-90 hover:bg-gray-100 transition-colors shadow-lg"
  //                   aria-label="Close modal"
  //                 >
  //                   <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //                   </svg>
  //                 </button>

  //                 <div className="h-full overflow-y-auto p-6 md:p-8 max-h-[70vh] md:max-h-[90vh]">
  //                   {/* Header */}
  //                   <div className="mb-6 flex items-start justify-between gap-4">
  //                     <div>
  //                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
  //                         Publications
  //                       </h2>
  //                       <p className="text-gray-600 text-sm">{selectedMember.name}</p>
  //                     </div>
  //                     <button
  //                       onClick={() => setShowPublications(false)}
  //                       className="flex-shrink-0 flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
  //                     >
  //                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  //                       </svg>
  //                       Back to Profile
  //                     </button>
  //                   </div>

  //                   {totalPublications === 0 ? (
  //                     <div className="text-center py-12">
  //                       <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  //                       </svg>
  //                       <p className="text-gray-500 italic">No publications found for this member.</p>
  //                     </div>
  //                   ) : (
  //                     <div className="space-y-8">
  //                       {/* PATENTS */}
  //                       {selectedMemberPublications.patents.length > 0 && (
  //                         <section>
  //                           <div className="flex items-center gap-2 mb-4">
  //                             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
  //                               Patents
  //                             </h3>
  //                             <span className="text-xs text-gray-400">
  //                               {selectedMemberPublications.patents.length}
  //                             </span>
  //                             <div className="flex-1 h-px bg-gray-200 ml-2" />
  //                           </div>

  //                           <div className="space-y-4">
  //                             {selectedMemberPublications.patents.map((p) => (
  //                               <div key={p._id} className="pb-4 border-b border-gray-100 last:border-0">
  //                                 <p className="font-medium text-gray-900 mb-2">{p.title}</p>
  //                                 <div className="space-y-1">
  //                                   <DetailRow label="Application" value={p.Applno} />
  //                                   <DetailRow label="Status" value={p.Status} />
  //                                   <DetailRow
  //                                     label="Filed"
  //                                     value={
  //                                       p.FilingDate
  //                                         ? new Date(p.FilingDate).toLocaleDateString('en-US', {
  //                                           year: 'numeric',
  //                                           month: 'short',
  //                                           day: 'numeric',
  //                                         })
  //                                         : undefined
  //                                     }
  //                                   />
  //                                   <DetailRow
  //                                     label="Granted"
  //                                     value={
  //                                       p.GrantDate
  //                                         ? new Date(p.GrantDate).toLocaleDateString('en-US', {
  //                                           year: 'numeric',
  //                                           month: 'short',
  //                                           day: 'numeric',
  //                                         })
  //                                         : undefined
  //                                     }
  //                                   />
  //                                   <DetailRow label="Inventors" value={p.Inventors} />
  //                                 </div>
  //                               </div>
  //                             ))}
  //                           </div>
  //                         </section>
  //                       )}

  //                       {/* JOURNALS */}
  //                       {selectedMemberPublications.journals.length > 0 && (
  //                         <section>
  //                           <div className="flex items-center gap-2 mb-4">
  //                             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
  //                               Journals
  //                             </h3>
  //                             <span className="text-xs text-gray-400">
  //                               {selectedMemberPublications.journals.length}
  //                             </span>
  //                             <div className="flex-1 h-px bg-gray-200 ml-2" />
  //                           </div>

  //                           <div className="space-y-4">
  //                             {selectedMemberPublications.journals.map((j) => (
  //                               <div key={j._id} className="pb-4 border-b border-gray-100 last:border-0">
  //                                 <p className="font-medium text-gray-900 mb-2">{j.title}</p>
  //                                 <div className="space-y-1">
  //                                   <DetailRow label="Journal" value={j.journal} />
  //                                   <DetailRow label="Year" value={j.year} />
  //                                   <DetailRow label="Volume" value={j.volume} />
  //                                   <DetailRow label="Issue" value={j.issue} />
  //                                   <DetailRow label="Pages" value={j.pages} />
  //                                   <DetailRow label="Type" value={j.type} />
  //                                   <DetailRow label="Status" value={j.status} />
  //                                   <DetailRow label="Authors" value={j.authors} />
  //                                 </div>
  //                               </div>
  //                             ))}
  //                           </div>
  //                         </section>
  //                       )}

  //                       {/* CONFERENCES */}
  //                       {selectedMemberPublications.conferences.length > 0 && (
  //                         <section>
  //                           <div className="flex items-center gap-2 mb-4">
  //                             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
  //                               Conferences
  //                             </h3>
  //                             <span className="text-xs text-gray-400">
  //                               {selectedMemberPublications.conferences.length}
  //                             </span>
  //                             <div className="flex-1 h-px bg-gray-200 ml-2" />
  //                           </div>

  //                           <div className="space-y-4">
  //                             {selectedMemberPublications.conferences.map((c) => (
  //                               <div key={c._id} className="pb-4 border-b border-gray-100 last:border-0">
  //                                 <p className="font-medium text-gray-900 mb-2">{c.title}</p>
  //                                 <div className="space-y-1">
  //                                   <DetailRow label="Conference" value={c.conference} />
  //                                   <DetailRow label="Year" value={c.year} />
  //                                   <DetailRow label="Month" value={c.month} />
  //                                   <DetailRow label="Location" value={c.location} />
  //                                   <DetailRow label="Pages" value={c.pages} />
  //                                   <DetailRow label="Type" value={c.type} />
  //                                   <DetailRow label="Status" value={c.status} />
  //                                   <DetailRow label="Authors" value={c.authors} />
  //                                 </div>
  //                               </div>
  //                             ))}
  //                           </div>
  //                         </section>
  //                       )}
  //                     </div>
  //                   )}

  //                   {/* Bottom Close Button for Mobile Only */}
  //                   <div className="block md:hidden pt-6">
  //                     <button
  //                       onClick={closeModal}
  //                       className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
  //                     >
  //                       Close
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
    // Modal component with flip animation
  const MemberModal = () => {
    if (!selectedMember) return null;

    const [showPublications, setShowPublications] = useState(false);

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

    // Minimalist label/value row
    const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => {
      if (value === undefined || value === null || value === '') return null;
      return (
        <div className="flex text-sm leading-relaxed">
          <span className="text-gray-500 w-24 flex-shrink-0">{label}</span>
          <span className="text-gray-900 break-words">{value}</span>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/40"
          onClick={closeModal}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto overscroll-contain pt-20">
          <div className="flex min-h-full items-start md:items-center justify-center p-4">
            {/* Flip wrapper - perspective for 3D effect */}
            <div
              className="relative w-full max-w-4xl"
              style={{ perspective: '2000px' }}
            >
              {/* Flip inner container */}
              <div
                className="relative w-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: showPublications ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT FACE - Profile */}
                <div
                  className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-90 hover:bg-gray-100 transition-colors shadow-lg"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - Image */}
                    <div className="w-full md:w-2/5">
                      <div className="relative h-64 md:h-full md:min-h-[500px]">
                        {selectedMember.image ? (
                          <Image
                            src={selectedMember.image}
                            alt={selectedMember.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[status]}`}>
                            {status === 'present' ? 'Present' : 'Alumni'}
                          </span>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${categoryColors[category]}`}>
                            {category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="w-full md:w-3/5 p-6 md:p-8 md:max-h-[80vh] md:overflow-y-auto">
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {selectedMember.name}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-700 font-medium">
                          {selectedMember.designation}
                        </p>
                      </div>

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                        <div className="space-y-3">
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
                                    month: 'short',
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
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                        {selectedMember.Description ? (
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {selectedMember.Description}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No description provided.</p>
                        )}
                      </div>

                      {/* Publications button */}
                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setShowPublications(true)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Publications ({totalPublications})
                        </button>
                      </div>

                      {/* Bottom Close Button for Mobile Only */}
                      <div className="block md:hidden pt-4">
                        <button
                          onClick={closeModal}
                          className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK FACE - Publications */}
                <div
                  className="absolute inset-0 bg-white w-full rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Close button (back) */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-90 hover:bg-gray-100 transition-colors shadow-lg"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="h-full overflow-y-auto p-6 md:p-8 md:max-h-[90vh] overscroll-contain">
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          Publications
                        </h2>
                        <p className="text-gray-600 text-sm">{selectedMember.name}</p>
                      </div>
                      <button
                        onClick={() => setShowPublications(false)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Profile
                      </button>
                    </div>

                    {totalPublications === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-gray-500 italic">No publications found for this member.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* PATENTS */}
                        {selectedMemberPublications.patents.length > 0 && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Patents
                              </h3>
                              <span className="text-xs text-gray-400">
                                {selectedMemberPublications.patents.length}
                              </span>
                              <div className="flex-1 h-px bg-gray-200 ml-2" />
                            </div>

                            <div className="space-y-4">
                              {selectedMemberPublications.patents.map((p) => (
                                <div key={p._id} className="pb-4 border-b border-gray-100 last:border-0">
                                  <p className="font-medium text-gray-900 mb-2">{p.title}</p>
                                  <div className="space-y-1">
                                    <DetailRow label="Application" value={p.Applno} />
                                    <DetailRow label="Status" value={p.Status} />
                                    <DetailRow
                                      label="Filed"
                                      value={
                                        p.FilingDate
                                          ? new Date(p.FilingDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })
                                          : undefined
                                      }
                                    />
                                    <DetailRow
                                      label="Granted"
                                      value={
                                        p.GrantDate
                                          ? new Date(p.GrantDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })
                                          : undefined
                                      }
                                    />
                                    <DetailRow label="Inventors" value={p.Inventors} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* JOURNALS */}
                        {selectedMemberPublications.journals.length > 0 && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Journals
                              </h3>
                              <span className="text-xs text-gray-400">
                                {selectedMemberPublications.journals.length}
                              </span>
                              <div className="flex-1 h-px bg-gray-200 ml-2" />
                            </div>

                            <div className="space-y-4">
                              {selectedMemberPublications.journals.map((j) => (
                                <div key={j._id} className="pb-4 border-b border-gray-100 last:border-0">
                                  <p className="font-medium text-gray-900 mb-2">{j.title}</p>
                                  <div className="space-y-1">
                                    <DetailRow label="Journal" value={j.journal} />
                                    <DetailRow label="Year" value={j.year} />
                                    <DetailRow label="Volume" value={j.volume} />
                                    <DetailRow label="Issue" value={j.issue} />
                                    <DetailRow label="Pages" value={j.pages} />
                                    <DetailRow label="Type" value={j.type} />
                                    <DetailRow label="Status" value={j.status} />
                                    <DetailRow label="Authors" value={j.authors} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* CONFERENCES */}
                        {selectedMemberPublications.conferences.length > 0 && (
                          <section>
                            <div className="flex items-center gap-2 mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Conferences
                              </h3>
                              <span className="text-xs text-gray-400">
                                {selectedMemberPublications.conferences.length}
                              </span>
                              <div className="flex-1 h-px bg-gray-200 ml-2" />
                            </div>

                            <div className="space-y-4">
                              {selectedMemberPublications.conferences.map((c) => (
                                <div key={c._id} className="pb-4 border-b border-gray-100 last:border-0">
                                  <p className="font-medium text-gray-900 mb-2">{c.title}</p>
                                  <div className="space-y-1">
                                    <DetailRow label="Conference" value={c.conference} />
                                    <DetailRow label="Year" value={c.year} />
                                    <DetailRow label="Month" value={c.month} />
                                    <DetailRow label="Location" value={c.location} />
                                    <DetailRow label="Pages" value={c.pages} />
                                    <DetailRow label="Type" value={c.type} />
                                    <DetailRow label="Status" value={c.status} />
                                    <DetailRow label="Authors" value={c.authors} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    )}

                    {/* Bottom Close Button for Mobile Only */}
                    <div className="block md:hidden pt-6">
                      <button
                        onClick={closeModal}
                        className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
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
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${activeCategory === key
                  ? 'ring-2 ring-offset-2 ring-blue-500'
                  : ''
                  } ${color}`}
              >
                {label} ({categoryStats[key as keyof typeof categoryStats]})
              </button>
            ))}
          </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => {
              const status = getStatus(member);
              const category = getMemberCategory(member);
              const description = member.Description || '';
              const wordCount = description.split(/\s+/).length;
              const shouldTruncate = wordCount > 20;
              const truncatedDescription = shouldTruncate ? truncateText(description, 20) : description;

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
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col h-full"
                >
                  <div className="relative h-56 bg-gray-100 overflow-hidden flex-shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}

                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                      {status === 'present' ? 'Present' : 'Alumni'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {member.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${categoryColors[category]}`}>
                        {category.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-700 font-medium text-sm mb-4 line-clamp-1">{member.designation}</p>

                    {description && (
                      <div className="mb-4 flex-grow">
                        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                          {truncatedDescription}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMemberModal(member);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
                      {member.enrolledDate && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">Enrolled: {new Date(member.enrolledDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                        </div>
                      )}

                      {member.graduatedDate && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">Graduated: {new Date(member.graduatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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