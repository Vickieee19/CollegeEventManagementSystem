import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, attendedCount: 0 });

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (user?.username) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8081/api/events/user/${user.username}/registrations`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setRegistrations(data.registrations || []);
            setStats({
              count: data.count || 0,
              attendedCount: data.attendedCount || 0
            });
          }
        } catch (error) {
          console.error('Failed to fetch registrations:', error);
        }
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Registrations</h1>
          <p className="text-slate-600">Track your registered events and attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900">{stats.count}</p>
                <p className="text-slate-600">Total Registrations</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900">{stats.attendedCount}</p>
                <p className="text-slate-600">Events Attended</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No registrations yet</h3>
            <p className="text-slate-600">Start exploring events and register for ones that interest you!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration, index) => (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-white text-4xl">
                    {registration.event.category === 'TECHNICAL' ? '💻' : 
                     registration.event.category === 'CULTURAL' ? '🎭' : 
                     registration.event.category === 'SPORTS' ? '⚽' : '📚'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{registration.event.eventName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.attended ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.attended ? 'Attended' : 'Registered'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {registration.event.date} at {registration.event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {registration.event.venue}
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-center">🏷️</span>
                      {registration.event.category}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Registered on {new Date(registration.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;