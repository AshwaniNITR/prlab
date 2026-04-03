"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FileText, Calendar, User, ExternalLink } from "lucide-react";

interface ResearchItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt?: string;
}

export default function ResearchPage() {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
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

    fetchResearch();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 ">
      <div className=" mx-auto relative">
        
        {/* Animated background elements */}
        

        {/* Header */}
        {/* <div className="text-center mb-16 sm:mb-24 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Research & Publications
          </h1>
          <p className="text-lg sm:text-xl text-blue-700 max-w-2xl mx-auto font-medium">
            Explore cutting-edge research, innovative projects, and scholarly publications from the
            Pattern Recognition and Machine Intelligence Laboratory.
          </p>
        </div> */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Research
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-blue-100">
             Explore cutting-edge research, innovative projects, and scholarly publications from the Pattern Recognition and Machine Intelligence Laboratory.
             {/* Discover our latest research projects, publications, and breakthroughs in pattern recognition and machine intelligence. */}
            </p>
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 space-y-16 lg:space-y-32">
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
                  } gap-8 lg:gap-16 items-center group`}
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
                      {/* <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm font-medium text-gray-600">
                        {item.createdAt && (
                          <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-colors hover:bg-blue-100 hover:border-blue-300">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                       
                      </div> */}
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
                Check back later for updates on our latest research projects and publications.
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
                  className="object-contain"
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
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
             
              </div> */}

              {/* Description */}
              <div className="prose prose-blue prose-lg max-w-none text-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">Description</h3>
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
  );
}