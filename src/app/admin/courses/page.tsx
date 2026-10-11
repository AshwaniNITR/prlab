// src/app/admin/courses/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';

interface Course {
  _id: string;
  name: string;
  type: 'Theory' | 'Practical';
  createdAt?: string;
  updatedAt?: string;
}

type FilterType = 'all' | 'Theory' | 'Practical';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  // Single-add form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Theory' | 'Practical'>('Theory');
  const [adding, setAdding] = useState(false);

  // Bulk add form
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState<'Theory' | 'Practical'>('Theory');
  const [bulkAdding, setBulkAdding] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Theory' | 'Practical'>('Theory');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);

  // ─────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/courses', { cache: 'no-store' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch');
      setCourses(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  // ─────────────────────────────────────────────
  // Add single course
  // ─────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setAdding(true);
      setError(null);
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), type: newType }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to add');

      setCourses((prev) => [...prev, json.data]);
      setNewName('');
      setSuccessMsg(`Added "${json.data.name}"`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setAdding(false);
    }
  };

  // ─────────────────────────────────────────────
  // Bulk add
  // ─────────────────────────────────────────────
  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (names.length === 0) {
      setError('Please enter at least one course name (one per line).');
      return;
    }

    try {
      setBulkAdding(true);
      setError(null);
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses: names.map((name) => ({ name, type: bulkType })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to bulk add');

      setCourses((prev) => [...prev, ...(json.data || [])]);
      setBulkText('');
      setSuccessMsg(`Added ${json.count} course(s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setBulkAdding(false);
    }
  };

  // ─────────────────────────────────────────────
  // Edit
  // ─────────────────────────────────────────────
  const startEdit = (course: Course) => {
    setEditingId(course._id);
    setEditName(course.name);
    setEditType(course.type);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditType('Theory');
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setSavingEdit(true);
      setError(null);
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), type: editType }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update');

      setCourses((prev) => prev.map((c) => (c._id === id ? json.data : c)));
      setSuccessMsg('Course updated');
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSavingEdit(false);
    }
  };

  // ─────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────
  const handleDelete = async (course: Course) => {
    try {
      setDeletingId(course._id);
      setError(null);
      const res = await fetch(`/api/courses/${course._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete');

      setCourses((prev) => prev.filter((c) => c._id !== course._id));
      setSuccessMsg(`Deleted "${course.name}"`);
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  // ─────────────────────────────────────────────
  // Derived
  // ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (filter !== 'all' && c.type !== filter) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, filter, search]);

  const stats = useMemo(
    () => ({
      total: courses.length,
      theory: courses.filter((c) => c.type === 'Theory').length,
      practical: courses.filter((c) => c.type === 'Practical').length,
    }),
    [courses]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Admin · Courses
              </h1>
              <p className="mt-2 text-blue-100">
                Add, edit, and manage courses for the public courses page.
              </p>
            </div>
            <button
              onClick={fetchCourses}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Courses" value={stats.total} color="blue" />
          <StatCard label="Theory" value={stats.theory} color="indigo" />
          <StatCard label="Practical" value={stats.practical} color="purple" />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12.02a2 2 0 00-3.48 0L2.33 16.01A2 2 0 004.07 19z"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {/* Add forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Single add */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Course
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Digital Signal Processing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex gap-2">
                  {(['Theory', 'Practical'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        newType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={adding || !newName.trim()}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding...' : 'Add Course'}
              </button>
            </form>

            {/* Toggle bulk */}
            <button
              onClick={() => setShowBulk((s) => !s)}
              className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
            >
              {showBulk ? '− Hide bulk upload' : '+ Bulk upload'}
            </button>
          </div>

          {/* Bulk add */}
          {showBulk && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Bulk Upload
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                One course name per line. All will be created with the selected type.
              </p>
              <form onSubmit={handleBulkAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex gap-2">
                    {(['Theory', 'Practical'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBulkType(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          bulkType === t
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Names
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={'Analog Communication Systems\nDigital Signal Processing\nSoft Computing'}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={bulkAdding || !bulkText.trim()}
                  className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkAdding ? 'Uploading...' : 'Upload All'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'Theory', 'Practical'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 italic">
              {courses.length === 0 ? 'No courses yet. Add one above.' : 'No courses match the filter.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide w-16">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide w-32">
                    Type
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((course, i) => {
                  const isEditing = editingId === course._id;
                  return (
                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-blue-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{course.name}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as 'Theory' | 'Practical')}
                            className="w-full px-2 py-1.5 border border-blue-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="Theory">Theory</option>
                            <option value="Practical">Practical</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              course.type === 'Theory'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {course.type}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => saveEdit(course._id)}
                              disabled={savingEdit || !editName.trim()}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {savingEdit ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(course)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => setConfirmDelete(course)}
                              disabled={deletingId === course._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12.02a2 2 0 00-3.48 0L2.33 16.01A2 2 0 004.07 19z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete course?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete <strong>"{confirmDelete.name}"</strong>? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deletingId === confirmDelete._id}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                >
                  {deletingId === confirmDelete._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// StatCard helper
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'indigo' | 'purple';
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0`}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}