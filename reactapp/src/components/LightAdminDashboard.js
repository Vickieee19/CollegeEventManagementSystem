import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

import { 
  CalendarDaysIcon, 
  BoltIcon, 
  UsersIcon, 
  ClockIcon,
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  CircleStackIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
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

const StatCard = ({ value, max, label, color, IconComponent }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    teal: 'text-teal-600 bg-teal-50',
    blue: 'text-blue-600 bg-blue-50', 
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50'
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
      </div>
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            className={colorClasses[color].split(' ')[0]}
          />
        </svg>
      </div>
    </div>
  );
};

const RecentRegistrationsTable = ({ recentRegistrations = [], setShowRegistrationsModal }) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...recentRegistrations].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField]?.toLowerCase() || '';
    const bValue = b[sortField]?.toLowerCase() || '';
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-4 px-4 font-semibold text-gray-700 cursor-pointer hover:text-teal-600 transition-colors"
                onClick={() => handleSort('studentName')}
              >
                <div className="flex items-center space-x-2">
                  <span>Student Name</span>
                  <SortIcon field="studentName" />
                </div>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Student ID</th>
              <th 
                className="text-left py-4 px-4 font-semibold text-gray-700 cursor-pointer hover:text-teal-600 transition-colors"
                onClick={() => handleSort('eventTitle')}
              >
                <div className="flex items-center space-x-2">
                  <span>Event Registered For</span>
                  <SortIcon field="eventTitle" />
                </div>
              </th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 5).map((registration, i) => (
              <motion.tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="py-4 px-4">
                  <div className="font-semibold text-gray-900">{registration.studentName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600 font-mono text-sm">{registration.studentId}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-800 font-medium">{registration.eventTitle}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600 text-sm">{registration.registrationDate}</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-center">
        <motion.button
          onClick={() => setShowRegistrationsModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold 
                     rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 
                     shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
          whileHover={{ x: 2 }}
        >
          <span>View All Registrations</span>
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

const LightAdminDashboard = () => {
  const { events = [], registrations = [], addEvent } = useEvents() || { events: [], registrations: [], addEvent: () => {} };
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [showAllRegistrations, setShowAllRegistrations] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [registrationTrends, setRegistrationTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'TECHNICAL',
    status: 'open'
  });

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0
  });
  const [availableEvents, setAvailableEvents] = useState([]);
  const [showEventSelection, setShowEventSelection] = useState(false);
  const [showEventRegistrations, setShowEventRegistrations] = useState(false);
  const [selectedEventRegistrations, setSelectedEventRegistrations] = useState([]);
  const [selectedEventName, setSelectedEventName] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Use real registrations from context
  const contextRegistrations = registrations || [];
  const recentRegistrations = contextRegistrations.slice(0, 6);

  // Fetch backend data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchEvents();
    
    // Listen for registration events to refresh admin data
    const handleRegistrationUpdate = () => {
      console.log('Admin dashboard: Registration event received, refreshing data...');
      setTimeout(() => {
        fetchDashboardData();
        fetchEvents();
      }, 1000);
    };
    
    window.addEventListener('studentRegistered', handleRegistrationUpdate);
    window.addEventListener('refreshAdminData', handleRegistrationUpdate);
    
    return () => {
      window.removeEventListener('studentRegistered', handleRegistrationUpdate);
      window.removeEventListener('refreshAdminData', handleRegistrationUpdate);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        fetch('https://bakend-folder-college-event.onrender.com/api/events?page=0&size=1000'),
        fetch('https://bakend-folder-college-event.onrender.com/api/registrations')
      ]);
      
      const eventsData = await eventsRes.json();
      const registrationsData = await registrationsRes.json();
      
      setStats({
        totalEvents: eventsData.content?.length || eventsData.length || 0,
        totalRegistrations: registrationsData.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ totalEvents: 0, totalRegistrations: 0 });
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events?page=0&size=1000');
      const data = await response.json();
      setAvailableEvents(data.content || data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Show event selection modal for report generation
  const handleGenerateFullReport = () => {
    setShowEventSelection(true);
  };

  // Download registrations for specific event
  const downloadEventReport = async (eventId, eventName) => {
    try {
      setLoading(true);
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${eventId}`);
      const data = await response.json();
      
      // Convert to CSV and download
      const csvContent = convertToCSV(data.map(reg => ({
        'Student Name': reg.studentName || reg.user?.name,
        'Student ID': reg.student?.studentId || reg.user?.username,
        'Email': reg.email || reg.user?.email,
        'Department': reg.department || reg.user?.department,
        'Year': reg.year || reg.user?.year,
        'Phone': reg.phone,
        'Registration Date': new Date(reg.registrationDate).toLocaleDateString(),
        'Attended': reg.attended ? 'Yes' : 'No'
      })));
      
      downloadCSV(csvContent, `${eventName.replace(/\s+/g, '_')}_registrations.csv`);
      setShowEventSelection(false);
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report');
      setLoading(false);
    }
  };

  // Show event selection for viewing registrations
  const handleViewRegistrationLists = () => {
    setShowRegistrationsModal(true);
  };

  // View registrations for specific event
  const viewEventRegistrations = async (eventId, eventName) => {
    try {
      setLoading(true);
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${eventId}`);
      const data = await response.json();
      
      setSelectedEventRegistrations(data);
      setSelectedEventName(eventName);
      setShowRegistrationsModal(false);
      setShowEventRegistrations(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      alert('Error fetching registrations');
      setLoading(false);
    }
  };

  // Show event selection for marking attendance
  const handleMarkAttendance = () => {
    setShowAttendanceModal(true);
  };

  // Load attendance for specific event
  const loadEventAttendance = async (eventId, eventName) => {
    try {
      setLoading(true);
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${eventId}`);
      const data = await response.json();
      
      console.log('Loaded attendance data:', data);
      console.log('Registration IDs:', data.map(r => ({ id: r.id, name: r.studentName || r.user?.name })));
      
      setAttendanceData(data);
      setSelectedEventName(eventName);
      setSelectedEventId(eventId);
      setShowAttendanceModal(false);
      setShowAttendanceList(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      alert('Error loading attendance data');
      setLoading(false);
    }
  };

  // Update attendance status
  const updateAttendance = async (registrationId, attended) => {
    try {
      console.log('Updating attendance:', registrationId, attended);
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/${registrationId}/attendance?attended=${attended}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        console.log('Attendance updated successfully');
        // Update local state
        setAttendanceData(prev => 
          prev.map(reg => 
            reg.id === registrationId ? { ...reg, attended } : reg
          )
        );
      } else {
        const errorText = await response.text();
        console.error('Failed to update attendance:', errorText);
        alert(`Failed to update attendance: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert(`Error updating attendance: ${error.message}`);
    }
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      try {
        const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName: newEvent.title,
            date: newEvent.date,
            time: newEvent.time,
            venue: newEvent.location,
            description: newEvent.description,
            category: newEvent.category,
            capacity: 100
          })
        });
        
        if (response.ok) {
          window.dispatchEvent(new CustomEvent('eventCreated'));
          setNewEvent({ title: '', date: '', time: '', location: '', description: '', category: 'TECHNICAL', status: 'open' });
          setShowCreateModal(false);
        }
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminData = {
    name: user?.name || 'Admin',
    email: user?.email || 'admin@university.edu',
    role: 'Administrator',
    department: user?.department || 'Administration',
    totalEvents: stats.totalEvents,
    totalRegistrations: stats.totalRegistrations
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="fixed inset-0 bg-geometric-pattern opacity-40" style={{ backgroundSize: '20px 20px' }} />
      <div className="fixed inset-0 bg-wave-pattern opacity-20" />

      {/* Admin Header */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-white/95 to-gray-50/95 
                   backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-gray-200/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-xl font-black text-gray-800">
                Campus <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Admin</span>
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 px-3 py-2 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
              >
                <UserCircleIcon className="w-6 h-6 text-gray-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{adminData.name}</p>
                </div>
              </button>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 
                           rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="pt-16 relative z-10 p-6">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Campus Events <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Control</span>
          </h1>
          <p className="text-gray-500 font-normal text-lg">Professional event management & analytics dashboard</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <LightCard>
            <StatCard value={stats.totalEvents} max={50} label="Total Events" color="teal" IconComponent={CalendarDaysIcon} />
          </LightCard>
          <LightCard>
            <StatCard value={stats.totalRegistrations} max={500} label="Total Registrations" color="emerald" IconComponent={UsersIcon} />
          </LightCard>
        </div>

        <LightCard className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="flex justify-center">
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                         overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <PlusIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Create Event</span>
                <span className="text-blue-100 text-sm mt-1">Add new campus event</span>
              </div>
            </motion.button>
          </div>
        </LightCard>

        <LightCard className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <ChartBarIcon className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
            </div>
            <motion.button 
              onClick={handleGenerateFullReport}
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
            >
              <CircleStackIcon className="w-4 h-4 mr-2" />
              {loading ? 'Generating...' : 'Generate Report'}
            </motion.button>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button 
              onClick={handleGenerateFullReport}
              disabled={loading}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {loading ? 'Generating...' : 'Generate Full Report'}
            </motion.button>
            <motion.button 
              onClick={handleViewRegistrationLists}
              disabled={loading}
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {loading ? 'Loading...' : 'View Registration Lists'}
            </motion.button>
            <motion.button 
              onClick={handleMarkAttendance}
              className="flex items-center justify-center px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Attendance
            </motion.button>
          </div>
        </LightCard>

        <LightCard className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              ...recentRegistrations.slice(0, 3).map(reg => ({
                event: reg.eventTitle,
                action: `New registration by ${reg.studentName}`,
                time: new Date(reg.registrationDate).toLocaleTimeString(),
                type: 'registration'
              })),
              { event: 'System', action: 'Dashboard loaded', time: 'Just now', type: 'update' }
            ].map((activity, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 
                           border border-gray-200/50 transition-all duration-200 hover:shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'registration' ? 'bg-emerald-500' :
                    activity.type === 'update' ? 'bg-blue-500' : 'bg-teal-500'
                  }`} />
                  <div>
                    <p className="text-gray-900 font-semibold">{activity.event}</p>
                    <p className="text-gray-500 text-sm font-medium">{activity.action}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm font-medium">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </LightCard>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             text-gray-800 placeholder-gray-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             text-gray-800 placeholder-gray-500"
                />
                
                <textarea
                  placeholder="Event Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                             text-gray-800 placeholder-gray-500 resize-none"
                />
                
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ACADEMIC">Academic</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl 
                             hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold 
                             rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg 
                             hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAllRegistrations && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">All Event Registrations</h3>
                  <button
                    onClick={() => setShowAllRegistrations(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Searchable, sortable table of all registration records system-wide</p>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRegistrations.length > 0 ? allRegistrations.map((registration, i) => (
                        <motion.tr
                          key={registration.id || i}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{registration.studentName || registration.user?.name}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-800 font-medium">{registration.eventName || registration.event?.eventName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600 text-sm">{new Date(registration.registrationDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              registration.attended ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {registration.attended ? 'Attended' : 'Registered'}
                            </span>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-500">
                            No registrations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Registrations: <span className="font-semibold text-gray-800">{allRegistrations.length}</span></span>
                  <button
                    onClick={() => setShowAllRegistrations(false)}
                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showRegistrationsModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Select Event to View Registrations</h3>
                  <button
                    onClick={() => setShowRegistrationsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Choose an event to view registered student details</p>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="space-y-3">
                  {availableEvents.length > 0 ? availableEvents.map((event, i) => (
                    <motion.button
                      key={event.eventId || i}
                      onClick={() => viewEventRegistrations(event.eventId, event.eventName)}
                      disabled={loading}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 disabled:opacity-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.eventName}</h4>
                          <p className="text-sm text-gray-600">{event.date} • {event.venue}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.category}</p>
                        </div>
                        <div className="text-purple-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  )) : (
                    <div className="py-8 text-center text-gray-500">
                      No events found.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events: <span className="font-semibold text-gray-800">{availableEvents.length}</span></span>
                  <button
                    onClick={() => setShowRegistrationsModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showEventRegistrations && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-6xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Registrations for {selectedEventName}</h3>
                    <p className="text-gray-600 mt-2">{selectedEventRegistrations.length} students registered</p>
                  </div>
                  <button
                    onClick={() => setShowEventRegistrations(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEventRegistrations.length > 0 ? selectedEventRegistrations.map((registration, i) => (
                        <motion.tr
                          key={registration.id || i}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{registration.studentName || registration.user?.name}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600 font-mono text-sm">{registration.student?.studentId || registration.user?.username}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600 text-sm">{registration.email || registration.user?.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600 text-sm">{registration.department || registration.user?.department}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600 text-sm">{new Date(registration.registrationDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              registration.attended ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {registration.attended ? 'Attended' : 'Registered'}
                            </span>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-gray-500">
                            No students registered for this event yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Registrations: <span className="font-semibold text-gray-800">{selectedEventRegistrations.length}</span></span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowEventRegistrations(false);
                        setShowRegistrationsModal(true);
                      }}
                      className="px-6 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Back to Events
                    </button>
                    <button
                      onClick={() => setShowEventRegistrations(false)}
                      className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showEventSelection && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Select Event for Report</h3>
                  <button
                    onClick={() => setShowEventSelection(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Choose an event to download registered student details</p>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="space-y-3">
                  {availableEvents.length > 0 ? availableEvents.map((event, i) => (
                    <motion.button
                      key={event.eventId || i}
                      onClick={() => downloadEventReport(event.eventId, event.eventName)}
                      disabled={loading}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.eventName}</h4>
                          <p className="text-sm text-gray-600">{event.date} • {event.venue}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.category}</p>
                        </div>
                        <div className="text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  )) : (
                    <div className="py-8 text-center text-gray-500">
                      No events found.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events: <span className="font-semibold text-gray-800">{availableEvents.length}</span></span>
                  <button
                    onClick={() => setShowEventSelection(false)}
                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAttendanceModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Select Event for Attendance</h3>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Choose an event to mark student attendance</p>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="space-y-3">
                  {availableEvents.length > 0 ? availableEvents.map((event, i) => (
                    <motion.button
                      key={event.eventId || i}
                      onClick={() => loadEventAttendance(event.eventId, event.eventName)}
                      disabled={loading}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 disabled:opacity-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.eventName}</h4>
                          <p className="text-sm text-gray-600">{event.date} • {event.venue}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.category}</p>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  )) : (
                    <div className="py-8 text-center text-gray-500">
                      No events found.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events: <span className="font-semibold text-gray-800">{availableEvents.length}</span></span>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAttendanceList && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Mark Attendance - {selectedEventName}</h3>
                    <p className="text-gray-600 mt-2">{attendanceData.length} students registered</p>
                  </div>
                  <button
                    onClick={() => setShowAttendanceList(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-96 p-6">
                <div className="space-y-3">
                  {attendanceData.length > 0 ? attendanceData.map((registration, i) => (
                    <motion.div
                      key={registration.id || i}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {registration.studentName || registration.user?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: {registration.student?.studentId || registration.user?.username}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${registration.id}`}
                            checked={registration.attended === true}
                            onChange={() => {
                              console.log('Setting present for:', registration.id);
                              updateAttendance(registration.id, true);
                            }}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-green-600 font-medium">Present</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${registration.id}`}
                            checked={registration.attended === false || registration.attended === null || registration.attended === undefined}
                            onChange={() => {
                              console.log('Setting absent for:', registration.id);
                              updateAttendance(registration.id, false);
                            }}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-red-600 font-medium">Absent</span>
                        </label>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-8 text-center text-gray-500">
                      No students registered for this event yet.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">
                    <span>Present: <span className="font-semibold text-green-600">{attendanceData.filter(r => r.attended === true).length}</span></span>
                    <span className="ml-4">Absent: <span className="font-semibold text-red-600">{attendanceData.filter(r => r.attended === false).length}</span></span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowAttendanceList(false);
                        setShowAttendanceModal(true);
                      }}
                      className="px-6 py-2 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
                    >
                      Back to Events
                    </button>
                    <button
                      onClick={() => setShowAttendanceList(false)}
                      className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircleIcon className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{adminData.name}</h3>
                <p className="text-gray-600">{adminData.email}</p>
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full mt-2">
                  {adminData.role}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">Department</p>
                  <p className="text-gray-800 font-semibold">{adminData.department}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-teal-600">{adminData.totalEvents}</p>
                    <p className="text-sm text-teal-700 font-medium">Total Events</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">{adminData.totalRegistrations}</p>
                    <p className="text-sm text-emerald-700 font-medium">Total Registrations</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightAdminDashboard;