import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const StudentNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [studentData, setStudentData] = useState({
    name: user?.name || 'Student',
    email: user?.email || 'student@university.edu',
    studentId: user?.rollNo || 'N/A',
    department: user?.department || 'N/A',
    year: user?.year || 'N/A',
    registeredEvents: 0,
    attendedEvents: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?.username) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/events/user/${user.username}/registrations`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setStudentData(prev => ({
              ...prev,
              registeredEvents: data.count || 0,
              attendedEvents: data.attendedCount || 0
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
          // Fallback: try to get stats from localStorage
          const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
          setStudentData(prev => ({
            ...prev,
            registeredEvents: registeredEvents.length,
            attendedEvents: 0
          }));
        }
      }
    };

    fetchUserStats();
  }, [user]);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/student',
      icon: HomeIcon
    },
    {
      name: 'Events',
      path: '/student/events',
      icon: CalendarDaysIcon
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/student') {
      return location.pathname === '/student';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-white/95 to-gray-50/95 
                   backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-gray-200/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-xl font-black text-gray-800">
                Campus <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Events</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: active ? 0 : -2 }}
                  >
                    <Icon className={`w-5 h-5 mr-2 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 px-3 py-2 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
              >
                <UserCircleIcon className="w-6 h-6 text-gray-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{studentData.name}</p>
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-gray-200/60 pt-4 mt-4">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center px-4 py-2 mb-2 w-full hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <UserCircleIcon className="w-6 h-6 text-gray-500 mr-3" />
                  <div className="text-sm text-left">
                    <p className="font-semibold text-gray-800">{studentData.name}</p>
                    <p className="text-gray-500">{studentData.email}</p>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 
                             hover:text-red-600 rounded-xl transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Content Spacer */}
      <div className="h-16" />

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircleIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{studentData.name}</h3>
              <p className="text-gray-600">{studentData.email}</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">Student ID</p>
                  <p className="text-gray-800 font-semibold">{studentData.studentId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">Year</p>
                  <p className="text-gray-800 font-semibold">{studentData.year}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-sm text-gray-500 font-medium">Department</p>
                <p className="text-gray-800 font-semibold">{studentData.department}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-600">{studentData.registeredEvents}</p>
                  <p className="text-sm text-blue-700 font-medium">Registered Events</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-600">{studentData.attendedEvents}</p>
                  <p className="text-sm text-emerald-700 font-medium">Attended Events</p>
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
    </>
  );
};

export default StudentNavbar;