// src/app/courses/page.tsx
"use client";

import { useState, useEffect } from 'react';

interface Course {
  _id: string;
  name: string;
  type: 'Theory' | 'Practical';
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/courses');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to fetch');
        setCourses(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Courses
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-blue-100">
            A comprehensive list of courses offered, taught and coordinated by our faculty.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
              isOpen
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'bg-white border-l-4 border-transparent hover:bg-gray-50'
            }`}
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3">
              <svg
                className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span
                className={`text-base sm:text-lg font-bold tracking-wide uppercase ${
                  isOpen ? 'text-blue-700' : 'text-gray-800'
                }`}
              >
                Courses Taught
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-blue-600' : 'text-gray-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="px-5 sm:px-8 py-6 border-t border-gray-100">
              {courses.length === 0 ? (
                <p className="text-gray-500 italic text-center py-6">
                  No courses available.
                </p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  {courses.map((course) => (
                    <li key={course._id} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1.5">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </span>
                      </span>
                      <span className="text-gray-800 text-sm sm:text-base leading-relaxed">
                        {course.name}{' '}
                        <span className="text-gray-500">({course.type})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}