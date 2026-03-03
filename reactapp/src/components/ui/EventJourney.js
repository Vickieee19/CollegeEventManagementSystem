import React from 'react';
import { motion } from 'framer-motion';

const EventJourney = ({ events = [] }) => {
  const journeySteps = [
    { status: 'registered', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
    { status: 'upcoming', icon: '⏰', color: 'from-purple-500 to-pink-500' },
    { status: 'attended', icon: '✨', color: 'from-emerald-500 to-teal-500' },
    { status: 'completed', icon: '🏆', color: 'from-amber-500 to-orange-500' }
  ];

  return (
    <div className="relative">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3">🚀</span>
        My Event Journey
      </h3>
      
      <div className="relative">
        {/* Journey Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-emerald-500 opacity-30" />
        
        <div className="space-y-6">
          {events.map((event, index) => {
            const step = journeySteps.find(s => s.status === event.status) || journeySteps[0];
            
            return (
              <motion.div
                key={event.id}
                className="relative flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Journey Node */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {step.icon}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                </div>
                
                {/* Event Card */}
                <motion.div
                  className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${step.color} text-white`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{event.date} • {event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">{event.category}</span>
                    {event.status === 'completed' && (
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-400 text-xs">+50 XP</span>
                        <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-xs">⭐</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventJourney;