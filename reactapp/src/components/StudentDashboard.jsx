import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';


const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [attendedCount, setAttendedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Force clear all data for fresh start
    setRegisteredEvents([]);
    setRegistrationCount(0);
    setAttendedCount(0);
    
    // Clear previous user's registration data on dashboard mount
    const currentUser = localStorage.getItem('studentId') || localStorage.getItem('username') || user?.username;
    const storedUser = localStorage.getItem('lastActiveUser');
    
    if (currentUser && currentUser !== storedUser) {
      console.log('New user detected, clearing all registration data');
      localStorage.removeItem('registeredEvents');
      localStorage.setItem('lastActiveUser', currentUser);
    }
    
    // Fetch data immediately
    fetchData();
    const interval = setInterval(fetchData, 10000);
    
    // Listen for registration events
    const handleRegistrationUpdate = () => {
      console.log('Dashboard - Registration event received, refreshing data...');
      // Immediate refresh
      fetchData();
      // Additional refresh after delay
      setTimeout(fetchData, 1000);
      setTimeout(fetchData, 3000);
    };
    
    window.addEventListener('registrationComplete', handleRegistrationUpdate);
    window.addEventListener('studentRegistered', handleRegistrationUpdate);
    
    // Listen for event creation and registration updates
    const handleEventCreated = () => {
      fetchData();
    };
    const handleRefreshData = () => {
      fetchData();
    };
    
    window.addEventListener('eventCreated', handleEventCreated);
    window.addEventListener('refreshStudentData', handleRefreshData);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventCreated', handleEventCreated);
      window.removeEventListener('refreshStudentData', handleRefreshData);
      window.removeEventListener('registrationComplete', handleRegistrationUpdate);
      window.removeEventListener('studentRegistered', handleRegistrationUpdate);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use the same logic as StudentEventList - prioritize studentId
      const username = localStorage.getItem('studentId') || localStorage.getItem('username') || user?.username;
      console.log('Dashboard - Using username:', username);
      
      if (!username) {
        console.log('No username available, resetting to empty state');
        setRegisteredEvents([]);
        setRegistrationCount(0);
        setAttendedCount(0);
        setLoading(false);
        return;
      }
      
      console.log('Dashboard - Fetching registrations for:', username);
      
      // Use the same endpoint as StudentEventList
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/student/${username}`);
      
      if (response.ok) {
        const registrations = await response.json();
        console.log('Dashboard - Server returned registrations:', registrations);
        
        // Always set fresh data, don't merge with previous
        setRegisteredEvents(registrations);
        setRegistrationCount(registrations.length);
        setAttendedCount(registrations.filter(r => r.attended).length);
        
        console.log('Dashboard - Updated state:', {
          count: registrations.length,
          attended: registrations.filter(r => r.attended).length
        });
      } else {
        console.log('Dashboard - No registrations found or error, resetting to empty');
        setRegisteredEvents([]);
        setRegistrationCount(0);
        setAttendedCount(0);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Dashboard - Failed to fetch data:', error);
      // Reset to empty state on error
      setRegisteredEvents([]);
      setRegistrationCount(0);
      setAttendedCount(0);
      setLoading(false);
    }
  };



  const handleCancelRegistration = (event) => {
    setSelectedEvent(event);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    console.log('Cancelled registration for:', selectedEvent?.title);
    setShowCancelModal(false);
    setSelectedEvent(null);
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      waitlisted: 'bg-amber-100 text-amber-800 border-amber-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status.toLowerCase()] || statusStyles.pending}`}>
        {status}
      </span>
    );
  };

  const EventCard = ({ event, isUpcoming = true }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{event.title}</h3>
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date} at {event.time}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {isUpcoming && <StatusBadge status={event.status} />}
          {!isUpcoming && (
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Attendance Confirmed
            </div>
          )}
        </div>
      </div>
      
      {isUpcoming && (
        <div className="flex justify-end">
          <button
            onClick={() => handleCancelRegistration(event)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Cancel Registration
          </button>
        </div>
      )}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">No events yet</h3>
      <p className="text-slate-600 mb-6">Start exploring and register for exciting campus events!</p>
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Discover New Events
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
              <p className="text-purple-700">Manage your event registrations and view your attendance history</p>
            </div>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Events Registered</p>
                <p className="text-2xl font-bold text-slate-900">{registrationCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Events Attended</p>
                <p className="text-2xl font-bold text-slate-900">{attendedCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Department</p>
                <p className="text-lg font-bold text-slate-900">{user?.department || localStorage.getItem('userDepartment') || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        </div>



        {/* My Registrations */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6">My Registrations</h2>
          <div className="space-y-4">
            {registeredEvents.length > 0 ? (
              registeredEvents.map((registration) => (
                <div key={registration.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">{registration.event.eventName}</h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {registration.event.date} at {registration.event.time}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {registration.event.venue}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {registration.event.category}
                        </div>
                        {registration.event.description && (
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{registration.event.description}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-3">Registered on: {new Date(registration.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        registration.attended ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {registration.attended ? 'Attended' : 'Registered'}
                      </span>
                      <button
                        onClick={() => navigate(`/events/${registration.event.eventId}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">No registrations yet</div>
            )}
          </div>
        </motion.div>

        {/* Cancel Registration Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Cancel Registration</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel your registration for "{selectedEvent?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Keep Registration
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;