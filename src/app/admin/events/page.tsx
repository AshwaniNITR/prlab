"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Edit, Trash2, Plus } from "lucide-react";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/event");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEvents(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening the modal
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/event/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event._id !== id));
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    // The event API expects data in the format exactly as it processes it
    // i.e formData.append('events[0][title]', value)
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Reconstruct the form map for the API
    const apiFormData = new FormData();
    apiFormData.append('events[0][title]', formData.get('title') as string);
    apiFormData.append('events[0][description]', formData.get('description') as string);
    apiFormData.append('events[0][date]', formData.get('date') as string);
    apiFormData.append('events[0][time]', formData.get('time') as string);
    apiFormData.append('events[0][location]', formData.get('location') as string);
    
    if (formData.get('image')) {
      apiFormData.append('events[0][image]', formData.get('image') as File);
    }

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        body: apiFormData,
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvents(prev => [...data.data, ...prev]);
        setIsAddModalOpen(false);
      } else {
        alert(data.message || "Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventToEdit) return;
    
    setIsSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const res = await fetch(`/api/event/${eventToEdit._id}`, {
        method: "PATCH",
        body: formData,
      });
      
      const data = await res.json();
      if (data.success && data.data) {
        setEvents(prev => prev.map(ev => ev._id === eventToEdit._id ? data.data : ev));
        setIsEditModalOpen(false);
        setEventToEdit(null);
      } else {
        alert(data.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("An error occurred while updating the event");
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
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Event</h2>
          
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Event Title</label>
              <input type="text" name="title" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Date</label>
                <input type="date" name="date" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Time</label>
                <input type="text" name="time" placeholder="e.g. 10:00 AM - 12:00 PM" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Location</label>
                <input type="text" name="location" required placeholder="e.g. TIIR Auditorium" className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Event Image</label>
                <input type="file" name="image" accept="image/*" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
              <textarea name="description" required rows={4} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50"></textarea>
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
                {isSaving ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!isEditModalOpen || !eventToEdit) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => { setIsEditModalOpen(false); setEventToEdit(null); }}
        />
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-[70]">
          <button
            onClick={() => { setIsEditModalOpen(false); setEventToEdit(null); }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Event</h2>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Event Title</label>
              <input type="text" name="title" defaultValue={eventToEdit.title} required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  defaultValue={eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : ''} 
                  required 
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Time</label>
                <input type="text" name="time" defaultValue={eventToEdit.time} placeholder="e.g. 10:00 AM - 12:00 PM" required className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Location</label>
                <input type="text" name="location" defaultValue={eventToEdit.location} required placeholder="e.g. TIIR Auditorium" className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Update Image (Optional)</label>
                <input type="file" name="image" accept="image/*" className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
              <textarea name="description" defaultValue={eventToEdit.description} required rows={4} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-blue-50/50"></textarea>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => { setIsEditModalOpen(false); setEventToEdit(null); }} 
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

        {/* Header */}
        <div className="text-center mb-16 sm:mb-24 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Upcoming & Past Events
          </h1>
          <p className="text-lg sm:text-xl text-blue-700 max-w-2xl mx-auto font-medium mb-8">
            Discover the latest happenings, workshops, and seminars at the
            Pattern Recognition and Machine Intelligence Laboratory.
          </p>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-16 lg:space-y-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
              <p className="text-blue-800 font-semibold text-xl animate-pulse">
                Loading events...
              </p>
            </div>
          ) : events.length > 0 ? (
            events.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={event._id}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-16 items-center group relative`}
                >
                  {/* Image Container */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-video sm:aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                          <span className="text-6xl opacity-50">📷</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                        {event.title}
                      </h2>
                      
                      {/* Meta info row */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm font-medium text-gray-600">
                        {event.date && (
                          <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-colors hover:bg-blue-100 hover:border-blue-300">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 transition-colors hover:bg-indigo-100 hover:border-indigo-300">
                            <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100 transition-colors hover:bg-cyan-100 hover:border-cyan-300">
                            <MapPin className="w-4 h-4 mr-2 text-cyan-600" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="prose prose-blue max-w-none relative">
                      <p className="text-lg text-gray-700 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <button 
                        onClick={() => setSelectedEvent(event)}
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
                            setEventToEdit(event);
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center justify-center p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shadow-sm"
                          title="Edit Event"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(event._id, e)}
                          disabled={isDeleting === event._id}
                          className="flex items-center justify-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                          title="Delete Event"
                        >
                          {isDeleting === event._id ? (
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
                <Calendar className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Events Scheduled
              </h3>
              <p className="text-xl text-gray-600 max-w-lg mx-auto">
                Check back later for updates on upcoming workshops, seminars, and laboratory events.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-y-auto bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden transform transition-all mt-10 md:mt-0"
            role="dialog" 
            aria-modal="true"
          >
            {/* Modal Image Header */}
            {selectedEvent.image ? (
              <div className="relative h-40 sm:h-56 md:h-64 w-full bg-gray-100">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <button 
                  onClick={() => setSelectedEvent(null)}
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
                  onClick={() => setSelectedEvent(null)}
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
                {selectedEvent.title}
              </h2>
              
              {/* Meta info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {selectedEvent.date && (
                  <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <span className="font-medium">
                      {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {selectedEvent.time && (
                  <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <Clock className="w-5 h-5 mr-3 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium">{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl sm:col-span-2">
                    <MapPin className="w-5 h-5 mr-3 text-cyan-600 flex-shrink-0" />
                    <span className="font-medium">{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-blue prose-lg max-w-none text-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">About the Event</h3>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {renderEditModal()}
    </>
  );
}
