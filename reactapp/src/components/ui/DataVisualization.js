import React from 'react';
import { motion } from 'framer-motion';

export const StatRing = ({ value, max, label, color = 'purple' }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    purple: 'stroke-purple-400',
    blue: 'stroke-blue-400',
    emerald: 'stroke-emerald-400',
    pink: 'stroke-pink-400'
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            className={colors[color]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="text-sm text-white/70 mt-2">{label}</span>
    </div>
  );
};

export const TrendChart = ({ data, height = 60 }) => {
  const max = Math.max(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 200;
    const y = height - (value / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg width="200" height={height} className="w-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
        <motion.polyline
          fill="none"
          stroke="rgb(139, 92, 246)"
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.polygon
          fill="url(#gradient)"
          points={`0,${height} ${points} 200,${height}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
      </svg>
    </div>
  );
};