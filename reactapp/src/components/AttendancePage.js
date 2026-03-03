import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AttendancePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  // Fetch upcoming/active events
  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      // JWT token must be included in Authorization header
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  // Fetch registrations for selected event
  const fetchEventRegistrations = async (eventId) => {
    try {
      setLoading(true);
      // JWT token must be included in Authorization header
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/${eventId}/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  // FR4.2: Mark attendance for a student
  const toggleAttendance = async (registrationId, currentStatus) => {
    try {
      // JWT token must be included in Authorization header
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/${registrationId}/attendance`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attended: !currentStatus })
      });

      if (response.ok) {
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, attended: !currentStatus }
            : reg
        ));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance');
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    fetchEventRegistrations(event.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        </div>

        {!selectedEvent ? (
          /* Event Selection */
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Event</h2>
            {loading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-teal-500 cursor-pointer transition-colors"
                    onClick={() => handleEventSelect(event)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-semibold text-gray-900">{event.eventName}</h3>
                    <p className="text-gray-600 text-sm">{event.date} • {event.venue}</p>
                    <p className="text-teal-600 text-sm mt-2">{event.registeredCount || 0} registrations</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Attendance Marking */
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedEvent.eventName}</h2>
                <p className="text-gray-600">{selectedEvent.date} • {selectedEvent.venue}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Events
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading registrations...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <motion.tr
                        key={registration.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{registration.studentName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-600 font-mono text-sm">{registration.studentId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-600">{registration.department}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleAttendance(registration.id, registration.attended)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              registration.attended
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {registration.attended ? (
                              <>
                                <CheckIcon className="w-4 h-4 mr-1" />
                                Present
                              </>
                            ) : (
                              <>
                                <XMarkIcon className="w-4 h-4 mr-1" />
                                Absent
                              </>
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;