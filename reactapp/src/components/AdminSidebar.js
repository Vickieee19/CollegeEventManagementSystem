import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: HomeIcon
    },
    {
      name: 'Event Management',
      path: '/admin/events',
      icon: ChartBarIcon
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: UserGroupIcon
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-200/50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-xl font-black text-gray-800 mb-1">
            Campus Events
          </h1>
          <p className="text-xs text-gray-500 font-medium">Control Panel</p>
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                active 
                  ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: active ? 0 : 4 }}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
              <span className="font-medium">{item.name}</span>
              {active && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-teal-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200/50">
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 
                     rounded-xl transition-all duration-200 group"
          whileHover={{ x: 4 }}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 group-hover:text-red-500" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/90 backdrop-blur-lg border border-gray-200/60 rounded-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50/95 to-white/95 backdrop-blur-xl 
                        border-r border-gray-200/60 shadow-lg shadow-gray-200/20">
          <SidebarContent />
        </div>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-50/95 to-white/95 
                       backdrop-blur-xl border-r border-gray-200/60 shadow-xl flex flex-col"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
    </>
  );
};

export default AdminSidebar;