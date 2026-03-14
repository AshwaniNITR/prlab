"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Type definitions
interface Patent {
  _id?: string;
  id: string; // fallback UI ID
  title: string;
  Applno?: string;
  Status?: string;
  Inventors?: string;
  FilingDate?: string;
  GrantDate?: string;
}

interface Journal {
  _id?: string;
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  type?: string;
  status?: string;
}

interface Conference {
  _id?: string;
  id: string;
  title: string;
  authors?: string;
  conference?: string;
  year?: string;
  month?: string;
  pages?: string;
  location?: string;
  type?: string;
  status?: string;
}

type PublicationItem = Patent | Journal | Conference;
type PublicationType = "patent" | "journal" | "conference" | "bookchapter";

const Page = () => {
  const params = useParams();
  const pageType = params.slug as PublicationType;
  
  const [data, setData] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [query, setQuery] = useState("");
  const [yearFilters, setYearFilters] = useState<string[]>([]);
  const [showYearMenu, setShowYearMenu] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PublicationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let endpoint = `/api/${pageType}`;
        if (pageType === "bookchapter") {
          endpoint = `/api/journal`;
        }
        
        const res = await fetch(endpoint);
        const responseData = await res.json();

        if (responseData.success && Array.isArray(responseData.data)) {
          let items = responseData.data;
          if (pageType === "bookchapter") {
            items = items.filter((item: any) => item.type === "Book Chapter");
          }
          
          const transformed: PublicationItem[] = items.map((item: any, index: number) => {
            const base = {
              ...item,
              id: (index + 1).toString(), // display ID
              _id: item._id, // db ID used for operations
            };
            if (item.FilingDate) base.FilingDate = new Date(item.FilingDate).toISOString().split('T')[0];
            if (item.GrantDate) base.GrantDate = new Date(item.GrantDate).toISOString().split('T')[0];
            return base;
          });
          
          setData(transformed);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (pageType) {
      fetchData();
    }
  }, [pageType]);

  const getTitle = (): string => {
    switch (pageType) {
      case "patent": return "Patents (Admin)";
      case "journal": return "Journal Publications (Admin)";
      case "conference": return "Conference Proceedings (Admin)";
      case "bookchapter": return "Book Chapters (Admin)";
      default: return "Publications (Admin)";
    }
  };

  const getIcon = (): string => {
    switch (pageType) {
      case "patent": return "⚡";
      case "journal": return "📚";
      case "conference": return "🎤";
      case "bookchapter": return "📖";
      default: return "📄";
    }
  };

  const openEditModal = (item: PublicationItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const deletePublication = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this publication?')) return;
    
    try {
      // For bookchapter, it uses the journal API
      const apiType = pageType === 'bookchapter' ? 'journal' : pageType;
      const res = await fetch(`/api/${apiType}/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setData(prev => prev.filter((item) => item._id !== id));
      } else {
        alert(result.error || 'Failed to delete publication');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting publication');
    }
  };

  // Helper functions for filtering
  const extractYearMap = (v?: string | number | null): string | null => {
    if (!v) return null;
    const match = String(v).match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  };

  const getItemYear = (item: PublicationItem): string | null => {
    if ("year" in item && item.year) return String(item.year);
    if ("FilingDate" in item) return extractYearMap((item as Patent).FilingDate);
    if ("GrantDate" in item) return extractYearMap((item as Patent).GrantDate);
    return null;
  };

  const availableYears = Array.from(
    new Set(data.map(getItemYear).filter((y): y is string => Boolean(y)))
  ).sort((a, b) => Number(b) - Number(a));

  const filteredData = data.filter((item) => {
    const matchesQuery = Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase());
    const year = getItemYear(item);
    const matchesYear = yearFilters.length === 0 || (year && yearFilters.includes(year));
    return matchesQuery && matchesYear;
  });

  // Reusable Input Component
  const InputField = ({ label, name, defaultValue, type = "text", required = false }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1">{label}</label>
      <input type={type} name={name} defaultValue={defaultValue || ''} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="max-w-7xl mx-auto relative pl-0 md:pl-20 lg:pl-24 xl:pl-28">
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-2">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">{getIcon()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-2">
            {getTitle()}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-blue-700 max-w-2xl mx-auto font-medium px-2">
            Manage your publications here
          </p>
        </div>

        {/* Results + Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 border border-blue-100 w-full sm:w-auto">
            <p className="text-blue-800 font-semibold text-sm sm:text-base">
              Showing <span className="text-blue-600 font-bold">{filteredData.length}</span> entries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 w-full sm:w-64 md:w-72 lg:w-80">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2 text-sm sm:text-base"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 sm:p-2 transition-colors duration-300 flex-shrink-0">
                <span className="text-sm sm:text-base">🔍</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowYearMenu(!showYearMenu)}
                className="bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-full shadow-sm transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                🗓️ Filter
              </button>

              {showYearMenu && (
                <div className="absolute top-full sm:top-12 right-0 sm:right-0 mt-2 sm:mt-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-full sm:w-44 z-50 max-h-60 overflow-y-auto">
                  <button onClick={() => setYearFilters([])} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Clear All</button>
                  <div className="border-t border-gray-200 my-1"></div>
                  {availableYears.map((year) => {
                    const isSelected = yearFilters.includes(year);
                    return (
                      <button key={year} onClick={() => setYearFilters((prev) => isSelected ? prev.filter((y) => y !== year) : [...prev, year])} className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-blue-100 ${isSelected ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"}`}>
                        <input type="checkbox" checked={isSelected} readOnly className="mr-2 accent-blue-600" /> {year}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-500 border-solid mb-3 sm:mb-4"></div>
            <p className="text-blue-800 font-medium text-base sm:text-lg">
              Loading data...
            </p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredData.map((item) => (
              <div key={item._id || item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100 hover:border-blue-300 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-2xl">{getIcon()}</div>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">#{item.id}</span>
                </div>
                
                <h3 className="text-lg font-bold text-blue-900 mb-4 line-clamp-3 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                
                  <div className="space-y-2 flex-grow text-sm">
                  {pageType === "patent" && (
                    <>
                      {(item as Patent).Applno && <div className="flex items-center"><span className="text-blue-700 font-medium mr-2">App No:</span> <span className="text-gray-700 truncate">{(item as Patent).Applno}</span></div>}
                      {(item as Patent).Status && <div className="flex items-center"><span className="text-blue-700 font-medium mr-2">Status:</span> 
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (item as Patent).Status === "Granted"
                            ? "bg-green-100 text-green-800"
                            : (item as Patent).Status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {(item as Patent).Status}
                        </span>
                      </div>}
                    </>
                  )}
                  {(pageType === "journal" || pageType === "bookchapter") && (
                    <>
                      {(item as Journal).authors && <div className="text-gray-600 line-clamp-1">{(item as Journal).authors}</div>}
                      {(item as Journal).year && <div className="flex items-center"><span className="text-blue-700 font-medium mr-2">Year:</span> <span className="text-gray-700">{(item as Journal).year}</span></div>}
                    </>
                  )}
                  {pageType === "conference" && (
                    <>
                      {(item as Conference).conference && <div className="text-gray-600 line-clamp-1">{(item as Conference).conference}</div>}
                      {(item as Conference).year && <div className="flex items-center"><span className="text-blue-700 font-medium mr-2">Year:</span> <span className="text-gray-700">{(item as Conference).year}</span></div>}
                    </>
                  )}
                </div>

                {/* Constant Edit & Delete Buttons */}
                <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => openEditModal(item)} 
                    className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" 
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deletePublication(item._id)} 
                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors" 
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center border border-blue-100 mx-2 sm:mx-0">
            <div className="text-blue-300 mb-3 sm:mb-4">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
              No Data Found
            </h3>
            <p className="text-blue-700 text-sm sm:text-base">
              No {pageType} entries available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal Base Layer */}
      {isEditModalOpen && itemToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Edit {getTitle().replace(' (Admin)', '')}</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                const apiType = pageType === 'bookchapter' ? 'journal' : pageType;
                const formData = new FormData(e.currentTarget);
                
                try {
                  // For conferences/journals it uses JSON instead of multipart actually, 
                  // but we implemented the APIs to support both since we used the body parser logic.
                  // Except wait, our patent/journal API expects JSON if content type is JSON. 
                  const dataObj = Object.fromEntries(formData.entries());
                  
                  const res = await fetch(`/api/${apiType}/${itemToEdit._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataObj)
                  });
                  const result = await res.json();
                  
                  if (result.success) {
                    setData(prev => prev.map(m => m._id === itemToEdit._id ? { ...m, ...dataObj } as any : m));
                    closeEditModal();
                  } else {
                    alert(result.error || 'Failed to update publication');
                  }
                } catch (err) {
                  alert('Error updating publication');
                } finally {
                  setIsSaving(false);
                }
              }} className="space-y-4">
                
                <InputField label="Title" name="title" defaultValue={itemToEdit.title} required={true} />
                
                {pageType === "patent" && (
                  <>
                    <InputField label="Application No" name="Applno" defaultValue={(itemToEdit as Patent).Applno} />
                    <InputField label="Status" name="Status" defaultValue={(itemToEdit as Patent).Status} />
                    <InputField label="Inventors" name="Inventors" defaultValue={(itemToEdit as Patent).Inventors} />
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Filing Date" type="date" name="FilingDate" defaultValue={(itemToEdit as Patent).FilingDate} /></div>
                      <div className="flex-1"><InputField label="Grant Date" type="date" name="GrantDate" defaultValue={(itemToEdit as Patent).GrantDate} /></div>
                    </div>
                  </>
                )}

                {(pageType === "journal" || pageType === "bookchapter") && (
                  <>
                    <InputField label="Authors" name="authors" defaultValue={(itemToEdit as Journal).authors} />
                    <InputField label="Journal" name="journal" defaultValue={(itemToEdit as Journal).journal} />
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Year" type="number" name="year" defaultValue={(itemToEdit as Journal).year} /></div>
                      <div className="flex-1"><InputField label="Volume" name="volume" defaultValue={(itemToEdit as Journal).volume} /></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Issue" name="issue" defaultValue={(itemToEdit as Journal).issue} /></div>
                      <div className="flex-1"><InputField label="Pages" name="pages" defaultValue={(itemToEdit as Journal).pages} /></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Type" name="type" defaultValue={(itemToEdit as Journal).type} /></div>
                      <div className="flex-1"><InputField label="Status" name="status" defaultValue={(itemToEdit as Journal).status} /></div>
                    </div>
                  </>
                )}

                {pageType === "conference" && (
                  <>
                    <InputField label="Authors" name="authors" defaultValue={(itemToEdit as Conference).authors} />
                    <InputField label="Conference" name="conference" defaultValue={(itemToEdit as Conference).conference} />
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Year" type="number" name="year" defaultValue={(itemToEdit as Conference).year} /></div>
                      <div className="flex-1"><InputField label="Month" name="month" defaultValue={(itemToEdit as Conference).month} /></div>
                    </div>
                    <InputField label="Location" name="location" defaultValue={(itemToEdit as Conference).location} />
                    <div className="flex gap-4">
                      <div className="flex-1"><InputField label="Pages" name="pages" defaultValue={(itemToEdit as Conference).pages} /></div>
                      <div className="flex-1"><InputField label="Type" name="type" defaultValue={(itemToEdit as Conference).type} /></div>
                    </div>
                    <InputField label="Status" name="status" defaultValue={(itemToEdit as Conference).status} />
                  </>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button type="button" onClick={closeEditModal} className="px-5 py-2.5 text-gray-900 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-colors">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Page;
