import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const categoryColors = {
    TECHNICAL: 'from-blue-500 to-cyan-500',
    CULTURAL: 'from-purple-500 to-pink-500',
    SPORTS: 'from-emerald-500 to-teal-500',
    ACADEMIC: 'from-amber-500 to-orange-500'
  };

  const categoryIcons = {
    TECHNICAL: '💻',
    CULTURAL: '🎭',
    SPORTS: '⚽',
    ACADEMIC: '📚'
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-500">
        {/* Category Stripe */}
        <div className={`h-1 bg-gradient-to-r ${categoryColors[event.category] || categoryColors.TECHNICAL}`} />
        
        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${categoryColors[event.category] || categoryColors.TECHNICAL} flex items-center justify-center text-2xl`}>
                {categoryIcons[event.category] || '📅'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {event.eventName}
                </h3>
                <span className="text-white/60 text-sm">{event.category}</span>
              </div>
            </div>
            
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <button
                onClick={() => navigate(`/events/${event.eventId}`)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                →
              </button>
            </motion.div>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-white/70 text-sm">
              <span className="mr-2">📅</span>
              {event.date}
            </div>
            <div className="flex items-center text-white/70 text-sm">
              <span className="mr-2">📍</span>
              {event.venue}
            </div>
          </div>

          {/* Registration Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Open for Registration</span>
            </div>
            
            <motion.button
              onClick={() => navigate(`/events/${event.eventId}`)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EventDiscovery = ({ events = [], loading = false }) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list, featured

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-4" />
            <div className="h-6 bg-white/20 rounded mb-2" />
            <div className="h-4 bg-white/20 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Discover Events</h2>
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
          {[
            { mode: 'grid', icon: '⊞', label: 'Grid' },
            { mode: 'list', icon: '☰', label: 'List' },
            { mode: 'featured', icon: '★', label: 'Featured' }
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 lg:grid-cols-2 gap-8'
          }
        >
          {events.map((event, index) => (
            <EventCard key={event.eventId} event={event} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {events.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-8xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
          <p className="text-white/60">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;