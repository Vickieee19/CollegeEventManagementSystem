import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const EventList = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', date: '', status: '' });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    specialRequirements: ''
  });

  // Auto-populate form when modal opens
  useEffect(() => {
    if (showRegistrationModal && user) {
      setRegistrationData({
        fullName: user.name || '',
        email: user.email || '',
        phone: '',
        studentId: user.username || '',
        department: user.department || '',
        year: user.year || '',
        specialRequirements: ''
      });
    }
  }, [showRegistrationModal, user]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.username) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8081/api/events/with-status/${user.username}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const formattedEvents = data.content.map(event => ({
              eventId: event.id,
              eventName: event.eventName,
              date: event.date,
              time: event.time,
              venue: event.venue,
              category: event.category,
              capacity: event.capacity,
              registeredCount: event.registeredCount || 0,
              status: 'open',
              isRegistered: event.isRegistered
            }));
            setEvents(formattedEvents);
          }
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      }
      setLoading(false);
    };

    fetchEvents();
  }, [user]);

  console.log('Events loaded:', events.length, events);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || event.category === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, filters]);

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
      {event.isRegistered && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          ✓ Registered
        </div>
      )}
      <div className={`h-48 relative overflow-hidden ${
        event.category === 'TECHNICAL' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
        event.category === 'CULTURAL' ? 'bg-gradient-to-br from-pink-500 to-rose-600' :
        event.category === 'SPORTS' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
        'bg-gradient-to-br from-indigo-500 to-blue-600'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-6xl">
            {event.category === 'TECHNICAL' ? '💻' : 
             event.category === 'CULTURAL' ? '🎭' : 
             event.category === 'SPORTS' ? '⚽' : '📚'}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{event.eventName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === 'open' ? 'bg-green-100 text-green-800' :
            event.status === 'waitlist' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {event.status}
          </span>
        </div>
        <div className="space-y-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center">
            <span className="mr-2">📅</span> {event.date} at {event.time}
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span> {event.venue}
          </div>
          <div className="flex items-center">
            <span className="mr-2">👥</span> {event.registeredCount || 0}/{event.capacity || 'N/A'} registered
          </div>
        </div>
        <div className="flex gap-2">
          <button
            data-testid={`view-details-${event.eventId}`}
            onClick={() => {
              setSelectedEvent(event);
              setShowDetailsModal(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            View Details
          </button>
          {!event.isRegistered && (
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login');
                  return;
                }
                setSelectedEvent(event);
                setShowRegistrationModal(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const CalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const eventsByDate = {};
    filteredEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        const day = eventDate.getDate();
        if (!eventsByDate[day]) eventsByDate[day] = [];
        eventsByDate[day].push(event);
      }
    });

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvents = eventsByDate[day];
      days.push(
        <div key={day} className={`h-24 border border-slate-200 p-2 ${hasEvents ? 'bg-blue-50' : 'bg-white'}`}>
          <div className="font-semibold text-sm text-slate-900 mb-1">{day}</div>
          {hasEvents && hasEvents.slice(0, 2).map((event, idx) => (
            <div key={idx} className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-1 truncate">
              {event.eventName}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-7 gap-0 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-slate-700 bg-slate-50">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0 border border-slate-200">{days}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Campus Events</h1>
            <p className="text-slate-600">Discover and register for exciting campus events</p>
          </div>
          
          {/* View Toggle (FR13) */}
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}>
              Grid View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}>
              Calendar View
            </button>
          </div>
        </div>

        {/* Search and Filters (FR8) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              data-testid="category-select"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="TECHNICAL">Technical</option>
              <option value="CULTURAL">Cultural</option>
              <option value="SPORTS">Sports</option>
              <option value="ACADEMIC">Academic</option>
            </select>
            <button
              onClick={() => {setSearchTerm(''); setFilters({category: '', date: '', status: ''});}}
              className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">Showing {filteredEvents.length} of {events.length} events</p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading events...</p>
          </div>
        ) : viewMode === 'grid' ? (
          filteredEvents.length === 0 ? (
            <div data-testid="empty-events" className="text-center py-16">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div key={event.eventId} data-testid={`event-card-${event.eventId}`}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )
        ) : (
          <CalendarView />
        )}

        {/* Registration Modal */}
        <AnimatePresence>
          {showRegistrationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowRegistrationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Register for Event</h2>
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {selectedEvent && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-900">{selectedEvent.eventName}</h3>
                    <p className="text-blue-700 text-sm">{selectedEvent.date} at {selectedEvent.time}</p>
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (selectedEvent && user?.username) {
                    try {
                      const token = localStorage.getItem('token');
                      
                      // Use only the event registration endpoint
                      const response = await fetch(`http://localhost:8081/api/events/${selectedEvent.eventId}/register?username=${user.username}`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      
                      if (response.ok) {
                        
                        alert('Registration successful! You can view your registrations in your Dashboard.');
                        
                        // Update the current event's registration status and count immediately
                        setEvents(prevEvents => 
                          prevEvents.map(event => 
                            event.eventId === selectedEvent.eventId 
                              ? { ...event, isRegistered: true, registeredCount: (event.registeredCount || 0) + 1 }
                              : event
                          )
                        );
                        
                        // Also update the selectedEvent for the modal
                        setSelectedEvent(prev => ({ ...prev, isRegistered: true, registeredCount: (prev.registeredCount || 0) + 1 }));
                        
                        // Trigger dashboard refresh
                        window.dispatchEvent(new CustomEvent('registrationComplete'));
                        
                        // Refresh events to get latest data from server
                        setTimeout(async () => {
                          const eventsResponse = await fetch(`http://localhost:8081/api/events/with-status/${user.username}`, {
                            headers: {
                              'Authorization': `Bearer ${token}`
                            }
                          });
                          
                          if (eventsResponse.ok) {
                            const data = await eventsResponse.json();
                            const formattedEvents = data.content.map(event => ({
                              eventId: event.id,
                              eventName: event.eventName,
                              date: event.date,
                              time: event.time,
                              venue: event.venue,
                              category: event.category,
                              capacity: event.capacity,
                              registeredCount: event.registeredCount || 0,
                              status: 'open',
                              isRegistered: event.isRegistered
                            }));
                            setEvents(formattedEvents);
                          }
                        }, 500);
                      } else {
                        const error = await response.text();
                        alert('Registration failed: ' + error);
                      }
                    } catch (error) {
                      alert('Registration failed: ' + error.message);
                    }
                  }
                  setShowRegistrationModal(false);
                  setRegistrationData({
                    fullName: user?.name || '', email: user?.email || '', phone: '', studentId: user?.username || '', department: user?.department || '', year: user?.year || '', specialRequirements: ''
                  });
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={registrationData.fullName}
                      onChange={(e) => setRegistrationData({...registrationData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Student ID *</label>
                    <input
                      type="text"
                      required
                      value={registrationData.studentId}
                      onChange={(e) => setRegistrationData({...registrationData, studentId: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                    <select
                      required
                      value={registrationData.department}
                      onChange={(e) => setRegistrationData({...registrationData, department: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Year *</label>
                    <select
                      required
                      value={registrationData.year}
                      onChange={(e) => setRegistrationData({...registrationData, year: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Special Requirements</label>
                    <textarea
                      value={registrationData.specialRequirements}
                      onChange={(e) => setRegistrationData({...registrationData, specialRequirements: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any dietary restrictions, accessibility needs, etc."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit Registration
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-900">{selectedEvent.eventName}</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Event Header */}
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
                    <div className="text-white text-6xl">
                      {selectedEvent.category === 'TECHNICAL' ? '💻' : 
                       selectedEvent.category === 'CULTURAL' ? '🎭' : 
                       selectedEvent.category === 'SPORTS' ? '⚽' : '📚'}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Date & Time</p>
                        <p className="text-slate-600">{selectedEvent.date} at {selectedEvent.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                      <MapPinIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Venue</p>
                        <p className="text-slate-600">{selectedEvent.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                      <UserGroupIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Category</p>
                        <p className="text-slate-600">{selectedEvent.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                      <ClockIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedEvent.status === 'open' ? 'bg-green-100 text-green-800' :
                          selectedEvent.status === 'waitlist' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEvent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Registrations</p>
                      <p className="text-slate-600">{selectedEvent.registeredCount || 0} / {selectedEvent.capacity || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Event Description */}
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">About This Event</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Join us for an exciting {selectedEvent.category.toLowerCase()} event that promises to be both educational and entertaining. 
                      This event is designed to bring together students from various departments and provide a platform for learning, 
                      networking, and skill development. Don't miss this opportunity to be part of something amazing!
                    </p>
                  </div>

                  {/* Registration Status */}
                  {selectedEvent.isRegistered ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <p className="text-green-800 font-semibold">You are registered for this event</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate('/login');
                          return;
                        }
                        setShowDetailsModal(false);
                        setShowRegistrationModal(true);
                      }}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Register for This Event
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventList;