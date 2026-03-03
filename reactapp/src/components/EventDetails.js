import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [studentId, setStudentId] = useState(user?.username || user?.rollNo || '');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      console.log('Loading event details for ID:', eventId);
      
      // Direct API calls instead of using utility functions
      const eventResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/${eventId}`);
      const registrationsResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${eventId}`);
      
      if (eventResponse.ok) {
        const eventData = await eventResponse.json();
        console.log('Event data:', eventData);
        setEvent(eventData);
      } else {
        console.error('Failed to fetch event:', eventResponse.status);
        setMessage('Event not found');
      }
      
      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json();
        console.log('Registrations data:', registrationsData);
        setRegistrations(registrationsData || []);
      } else {
        console.log('No registrations found');
        setRegistrations([]);
      }
    } catch (err) {
      console.error('Error loading event details:', err);
      setMessage('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const currentStudentId = studentId || user?.username || user?.rollNo;
    if (!currentStudentId) {
      setMessage('Please enter a student ID');
      return;
    }
    
    try {
      setRegistering(true);
      
      // Use the registration endpoint directly
      const registrationData = {
        eventId: parseInt(eventId),
        studentId: currentStudentId,
        studentName: user?.name || 'Student',
        email: user?.email || '',
        department: user?.department || '',
        year: user?.year || '',
        phone: ''
      };
      
      const response = await fetch('https://bakend-folder-college-event.onrender.com/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      if (response.ok) {
        setMessage('Registration successful!');
        loadEventDetails();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        setMessage(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Registration failed: ' + err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-purple-700 font-medium">Loading event details...</p>
      </motion.div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg border border-purple-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Event Not Found</h2>
          <p className="text-slate-600 mb-6">{message || 'The requested event could not be found.'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );

  const isFull = registrations.length >= event.capacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-purple-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <motion.button 
            onClick={() => window.history.back()} 
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ← Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm shadow-lg border border-purple-200 rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="px-8 py-6 border-b border-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-2xl font-semibold text-slate-900">{event.eventName}</h1>
            <p className="text-purple-600 mt-1">Event Details & Registration</p>
          </motion.div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-lg font-medium text-slate-900 mb-3">Event Description</h3>
                  <p className="text-slate-700 leading-relaxed">{event.description || 'No description available for this event.'}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-purple-50/50 rounded-lg p-6 border border-purple-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Date</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{event.date}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Time</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{event.time}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Venue</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{event.venue}</dd>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Category</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{event.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Capacity</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{event.capacity} Participants</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-purple-600 uppercase tracking-wide">Registered</dt>
                        <dd className="mt-1 text-slate-900 font-medium">{registrations.length} of {event.capacity}</dd>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div 
                  className="bg-white border border-purple-200 rounded-lg p-6 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Event Registration</h3>
                  
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Registration Status</span>
                      <span className={`text-sm font-medium ${
                        isFull ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {isFull ? 'Full' : `${event.capacity - registrations.length} spots available`}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${
                          isFull ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((registrations.length / event.capacity) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 1.2 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  {event.status !== 'COMPLETED' ? (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Student ID
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your Student ID"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          className="w-full px-3 py-2 border border-purple-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          disabled={user && (user.username || user.rollNo)}
                        />
                      </div>
                      
                      <motion.button
                        onClick={handleRegister}
                        disabled={isFull || registering || (!studentId && !user?.username && !user?.rollNo)}
                        className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {registering ? 'Processing Registration...' : isFull ? 'Event Full' : 'Register for Event'}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-6 bg-purple-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                    >
                      <div className="text-purple-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium">Event Completed</p>
                      <p className="text-sm text-slate-500 mt-1">Registration is no longer available</p>
                    </motion.div>
                  )}

                  {message && (
                    <motion.div 
                      className={`mt-4 p-3 rounded-md text-sm font-medium ${
                        message.includes('successful') 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;