import React from 'react';
import { motion } from 'framer-motion';
import StudentEventList from './StudentEventList';

const StudentEventsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-150 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-20 bg-gradient-to-r from-blue-400/40 to-purple-400/40 transform rotate-45 blur-3xl animate-blob-drift" />
        <div className="absolute top-40 right-32 w-32 h-8 bg-gradient-to-r from-pink-400/40 to-rose-400/40 rounded-full blur-2xl animate-blob-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-gradient-to-br from-emerald-400/40 to-teal-400/40 transform rotate-12 blur-3xl animate-blob-drift" style={{animationDelay: '4s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 transform rotate-45 blur-2xl animate-gentle-float" style={{animationDelay: '1s'}} />
        <div className="absolute inset-0 bg-white/5" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StudentEventList />
        </motion.div>
      </div>
    </div>
  );
};

export default StudentEventsPage;