"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FileText, User, Calendar, Edit, Trash2, Plus } from "lucide-react";

interface ResearchItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt?: string;
}

export default function AdminResearchPage() {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [researchToEdit, setResearchToEdit] = useState<ResearchItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/research");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setResearch(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch research:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening the modal
    if (!window.confirm("Are you sure you want to delete this research item?")) return;

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/research/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResearch(research.filter(item => item._id !== id));
      } else {
        alert("Failed to delete research item.");
      }
    } catch (error) {
      console.error("Error deleting research:", error);
      alert("An error occurred while deleting the research item.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Create FormData for the API (matches the POST endpoint structure)
    const apiFormData = new FormData();
    apiFormData.append('members[0][title]', formData.get('title') as string);
    apiFormData.append('members[0][description]', formData.get('description') as string);
    
    if (formData.get('image')) {
      apiFormData.append('members[0][image]', formData.get('image') as File);
    }

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        body: apiFormData,
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResearch(prev => [...data.data, ...prev]);
        setIsAddModalOpen(false);
      } else {
        alert(data.message || "Failed to add research item");
      }
    } catch (error) {
      console.error("Error adding research:", error);
      alert("An error occurred while adding the research item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!researchToEdit) return;
    
    setIsSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const res = await fetch(`/api/research/${researchToEdit._id}`, {
        method: "PATCH",
        body: formData,
      });
      
      const data = await res.json();
      if (data.success && data.data) {
        setResearch(prev => prev.map(item => item._id === researchToEdit._id ? data.data : item));
        setIsEditModalOpen(false);
        setResearchToEdit(null);
      } else {
        alert(data.message || "Failed to update research item");
      }
    } catch (error) {
      console.error("Error updating research:", error);
      alert("An error occurred while updating the research item");
    } finally {
      setIsSaving(false);
    }
  };

  const renderAddModal = () => {
    if (!isAddModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsAddModalOpen(false)}
        />
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-[70]">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Research Item</h2>
          
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Research Title</label>
              <input type="text" name="title" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" placeholder="e.g., Deep Learning for Pattern Recognition" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Research Image</label>
                <input type="file" name="image" accept="image/*" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Description / Abstract</label>
              <textarea name="description" required rows={6} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" placeholder="Provide a detailed description of the research, methodology, findings, or publication abstract..."></textarea>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)} 
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
               >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : 'Create Research Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!isEditModalOpen || !researchToEdit) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => { setIsEditModalOpen(false); setResearchToEdit(null); }}
        />
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-[70]">
          <button
            onClick={() => { setIsEditModalOpen(false); setResearchToEdit(null); }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Research Item</h2>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Research Title</label>
              <input type="text" name="title" defaultValue={researchToEdit.title} required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Update Image (Optional)</label>
                <input type="file" name="image" accept="image/*" className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
                {researchToEdit.image && (
                  <p className="text-xs text-gray-500 mt-1">Current image will be kept if no new image is selected</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Description / Abstract</label>
              <textarea name="description" defaultValue={researchToEdit.description} required rows={6} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50"></textarea>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => { setIsEditModalOpen(false); setResearchToEdit(null); }} 
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
               >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          </div>

          {/* Header with Add Button */}
          <div className="text-center mb-16 sm:mb-24 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
              <span className="text-3xl">🔬</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Research & Publications
            </h1>
            <p className="text-lg sm:text-xl text-blue-700 max-w-2xl mx-auto font-medium mb-8">
              Manage research projects, publications, and scholarly work at the
              Pattern Recognition and Machine Intelligence Laboratory.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add New Research
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-16 lg:space-y-32">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                <p className="text-blue-800 font-semibold text-xl animate-pulse">
                  Loading research...
                </p>
              </div>
            ) : research.length > 0 ? (
              research.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item._id}
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 lg:gap-16 items-center group relative`}
                  >
                    {/* Image Container */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative aspect-video sm:aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-blue-700 opacity-50" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Container */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                          {item.title}
                        </h2>
                        
                        {/* Meta info row */}
                       
                      </div>

                      <div className="prose prose-blue max-w-none relative">
                        <p className="text-lg text-gray-700 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                        <button 
                          onClick={() => setSelectedResearch(item)}
                          className="text-blue-600 hover:text-blue-800 font-semibold mt-2 inline-flex items-center group/btn transition-colors"
                        >
                          Read more
                          <span className="ml-1 transform transition-transform group-hover/btn:translate-x-1">→</span>
                        </button>
                      </div>

                      {/* Decorative line */}
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-4 transform origin-left transition-transform duration-500 group-hover:scale-x-150"></div>

                      {/* Admin Controls */}
                      <div className={`flex w-full mt-6 ${isEven ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setResearchToEdit(item);
                              setIsEditModalOpen(true);
                            }}
                            className="flex items-center justify-center p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shadow-sm"
                            title="Edit Research"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            disabled={isDeleting === item._id}
                            className="flex items-center justify-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            title="Delete Research"
                          >
                            {isDeleting === item._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-6 text-blue-300">
                  <FileText className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  No Research Items Found
                </h3>
                <p className="text-xl text-gray-600 max-w-lg mx-auto">
                  Click the "Add New Research" button to start adding research projects and publications.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Research Details Modal */}
        {selectedResearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-y-auto bg-gray-900/60 backdrop-blur-sm transition-opacity">
            <div 
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden transform transition-all mt-10 md:mt-0"
              role="dialog" 
              aria-modal="true"
            >
              {/* Modal Image Header */}
              {selectedResearch.image ? (
                <div className="relative h-40 sm:h-56 md:h-64 w-full bg-gray-100">
                  <Image
                    src={selectedResearch.image}
                    alt={selectedResearch.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  <button 
                    onClick={() => setSelectedResearch(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 transition-colors z-10"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-end p-4">
                  <button 
                    onClick={() => setSelectedResearch(null)}
                    className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 sm:p-8 lg:p-10 max-h-[45vh] overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedResearch.title}
                </h2>
                
                {/* Meta info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {selectedResearch.createdAt && (
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">
                        {new Date(selectedResearch.createdAt).toLocaleDateString("en-US", {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <User className="w-5 h-5 mr-3 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium">Pattern Recognition and Machine Intelligence Laboratory</span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-blue prose-lg max-w-none text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">Abstract</h3>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {selectedResearch.description}
                  </p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedResearch(null)}
                  className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {renderAddModal()}
      {renderEditModal()}
    </>
  );
}