import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchEvents, deleteEvent, updateEvent } from '../utils/api';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const LightCard = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white/90 backdrop-blur-lg border border-gray-200/60 rounded-2xl p-6 
                shadow-lg shadow-gray-200/25 hover:shadow-xl hover:shadow-gray-200/35 
                transition-all duration-300 ${className}`}
    whileHover={{ y: -3, scale: 1.005 }}
  >
    {children}
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const EventManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ venue: '', description: '' });

  useEffect(() => {
    fetchEventsData();
    const interval = setInterval(fetchEventsData, 5000);
    
    // Listen for event creation
    const handleEventCreated = () => {
      fetchEventsData();
    };
    window.addEventListener('eventCreated', handleEventCreated);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventCreated', handleEventCreated);
    };
  }, [currentPage]);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const response = await fetchEvents(currentPage, 10);
      
      // Fetch registration counts for each event
      const eventsWithCounts = await Promise.all(
        response.data.content.map(async (event) => {
          try {
            const regResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${event.eventId}`);
            const registrations = await regResponse.json();
            return {
              id: event.eventId,
              title: event.eventName,
              date: event.date,
              venue: event.venue,
              description: event.description,
              status: event.status || 'ACTIVE',
              registeredCount: registrations.length
            };
          } catch (error) {
            return {
              id: event.eventId,
              title: event.eventName,
              date: event.date,
              venue: event.venue,
              description: event.description,
              status: event.status || 'ACTIVE',
              registeredCount: 0
            };
          }
        })
      );
      
      setEvents(eventsWithCounts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    
    if (eventDateObj < today) {
      return 'COMPLETED';
    } else if (eventDateObj.toDateString() === today.toDateString()) {
      return 'PUBLISHED';
    } else {
      return 'PUBLISHED';
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This will also remove all registrations.')) {
      try {
        const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/${eventId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchEventsData(); // Refresh the list
          alert('Event deleted successfully');
        } else {
          alert('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
      }
    }
  };

  const handleToggleStatus = async (eventId) => {
    try {
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/${eventId}/status`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchEventsData(); // Refresh the list
      } else {
        alert('Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Error updating event status');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditForm({ venue: event.venue || '', description: event.description || '' });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: editingEvent.title,
          date: editingEvent.date,
          venue: editForm.venue,
          description: editForm.description
        })
      });
      
      if (response.ok) {
        setShowEditModal(false);
        setEditingEvent(null);
        fetchEventsData();
        window.dispatchEvent(new CustomEvent('eventUpdated'));
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    const matchesDate = !dateFilter || event.date.includes(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 bg-geometric-pattern opacity-40" style={{ backgroundSize: '20px 20px' }} />
      <div className="fixed inset-0 bg-wave-pattern opacity-20" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                Event <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Management</span>
              </h1>
              <p className="text-gray-500 font-normal text-lg">Manage and monitor all campus events</p>
            </div>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold 
                         rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 
                         shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
              whileHover={{ x: 2 }}
              onClick={() => window.location.href = '/admin'}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create New Event</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <LightCard className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                           text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Date Filter */}
            <input
              type="month"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
            />
          </div>
        </LightCard>

        {/* Events Table */}
        <LightCard>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading events...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Event Title</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Registered</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, i) => (
                    <motion.tr
                      key={event.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600">{new Date(event.date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-800 font-medium">{event.registeredCount}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditEvent(event)}
                            title="Edit Event"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className={`p-2 rounded-lg transition-colors ${
                              event.status === 'COMPLETED' 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleStatus(event.id)}
                            title={event.status === 'COMPLETED' ? 'Mark as Active' : 'Mark as Completed'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d={event.status === 'COMPLETED' 
                                  ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                  : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} 
                              />
                            </svg>
                          </motion.button>
                          <motion.button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteEvent(event.id)}
                            title="Delete Event"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </LightCard>

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    placeholder="Event Venue"
                    value={editForm.venue}
                    onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                               text-gray-800 placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Event Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                               text-gray-800 placeholder-gray-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl 
                             hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEvent}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold 
                             rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg 
                             hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Update Event</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagementPage;