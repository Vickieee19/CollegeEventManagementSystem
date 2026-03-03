import React from 'react';
import { motion } from 'framer-motion';

const SmartCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  glow = false 
}) => {
  const variants = {
    default: 'bg-white/10 border-white/20',
    glass: 'bg-gradient-to-br from-white/25 to-white/5 border-white/30',
    neural: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-300/30',
    data: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-300/30'
  };

  return (
    <motion.div
      className={`
        backdrop-blur-xl border rounded-3xl p-6 relative overflow-hidden
        ${variants[variant]}
        ${hover ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${glow ? 'shadow-lg shadow-purple-500/25' : ''}
        transition-all duration-500 ease-out
        ${className}
      `}
      whileHover={hover ? { y: -5 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default SmartCard;