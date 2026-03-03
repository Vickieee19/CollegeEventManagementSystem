import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const EventListingPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events');
        if (response.ok) {
          const data = await response.json();
          // Handle different API response structures
          const eventList = Array.isArray(data) ? data : (data.content || []);
          setEvents(eventList);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    const matchesSearch = event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 hover:bg-white/70 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/30 hover:-translate-y-2"
    >
      <div className={`h-48 rounded-2xl overflow-hidden mb-6 relative ${
        event.category === 'TECHNICAL' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
        event.category === 'CULTURAL' ? 'bg-gradient-to-br from-pink-500 to-rose-600' :
        event.category === 'SPORTS' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
        'bg-gradient-to-br from-indigo-500 to-blue-600'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-6xl">
            {event.category === 'TECHNICAL' ? '💻' : 
             event.category === 'CULTURAL' ? '🎭' : 
             event.category === 'SPORTS' ? '⚽' : '📚'}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900">{event.eventName}</h3>
        
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center">
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            {event.venue}
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            Capacity: {event.capacity}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold">
            {event.category}
          </span>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Register to Join
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #64748b 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #64748b 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 40px 40px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/30 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-slate-200/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <SparklesIcon className="w-9 h-9 text-cyan-600 mr-4" />
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                Campus Events
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-cyan-600 hover:text-cyan-700 font-semibold border-2 border-cyan-600/20 hover:border-cyan-600/40 rounded-xl transition-all duration-300 hover:bg-cyan-50/50"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-0.5"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore exciting events happening on campus. Register to participate and connect with your community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-6 mb-8 shadow-lg shadow-slate-200/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800 placeholder-slate-500"
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800"
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical</option>
                <option value="CULTURAL">Cultural</option>
                <option value="SPORTS">Sports</option>
                <option value="ACADEMIC">Academic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.eventId || event.id} event={event} />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <CalendarDaysIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingPage;