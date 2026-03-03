import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 20
  }));

  // Fetch recent events from database
  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events');
        if (response.ok) {
          const data = await response.json();
          // Handle different API response structures
          const events = Array.isArray(data) ? data : (data.content || []);
          // Get the 5 most recent events
          const sortedEvents = events.sort((a, b) => new Date(b.createdDate || b.id) - new Date(a.createdDate || a.id));
          const recent = sortedEvents.slice(0, 5).map(event => ({
            id: event.eventId || event.id,
            title: event.eventName,
            subtitle: `${event.category} Event`,
            description: event.description || `Join us for ${event.eventName} at ${event.venue}`,
            date: event.date,
            time: event.time,
            venue: event.venue,
            category: event.category,
            image: getEventImage(event.category),
            cta: "Learn More"
          }));
          setRecentEvents(recent);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to empty array
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const getEventImage = (category) => {
    const images = {
      'TECHNICAL': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      'CULTURAL': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
      'SPORTS': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'ACADEMIC': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';
  };

  const featuredSlides = recentEvents.length > 0 ? recentEvents : [
    {
      id: 1,
      title: "No Recent Events",
      subtitle: "Stay tuned for upcoming events",
      description: "New events will be posted soon. Check back regularly for updates!",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      cta: "Explore Events"
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className="group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 hover:bg-white/70 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/30 hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-cyan-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Interactive Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
        
        {/* Cursor light ripple effect */}
        <div 
          className="absolute w-80 h-80 rounded-full pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 160,
            top: mousePosition.y - 160,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 30%, rgba(147, 197, 253, 0.04) 60%, transparent 100%)',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Floating particles */}
        {particles.map((particle) => {
          const particleX = (particle.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1200);
          const particleY = (particle.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800);
          const distanceFromCursor = Math.sqrt(
            Math.pow(mousePosition.x - particleX, 2) +
            Math.pow(mousePosition.y - particleY, 2)
          );
          const repelForce = Math.max(0, 120 - distanceFromCursor) / 120;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size * 3,
                height: particle.size * 3,
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 100%)',
                transform: `translate(${repelForce * 30}px, ${repelForce * 20}px)`
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                scale: { duration: 4 + particle.delay, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3 + particle.delay, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          );
        })}
        
        {/* Moving gradient orbs */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0.05) 50%, transparent 100%)',
            filter: 'blur(1px)'
          }}
          animate={{
            x: [100, 300, 100],
            y: [200, 100, 200],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          style={{
            right: '10%',
            top: '30%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 100%)',
            filter: 'blur(1px)'
          }}
          animate={{
            x: [-50, 50, -50],
            y: [0, -30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      {/* Fixed Navigation Header with Blur */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-2xl border-b border-white/20 shadow-lg shadow-slate-200/10"
      >
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
      </motion.nav>

      {/* Hero Carousel Section */}
      <div className="relative z-10 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 lg:px-8"
        >
          <div className="relative h-96 bg-white/50 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/20 overflow-hidden">
            {/* Carousel Container */}
            <div className="relative h-full">
              {featuredSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                    index === currentSlide ? 'translate-x-0' : 
                    index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                  }`}
                >
                  <div className="flex h-full">
                    {/* Content Side */}
                    <div className="flex-1 flex items-center p-12">
                      <div className="max-w-lg">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="text-4xl font-black text-slate-900 mb-3 tracking-tight"
                        >
                          {slide.title}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-xl text-cyan-600 font-semibold mb-4"
                        >
                          {slide.subtitle}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="text-slate-600 mb-6 leading-relaxed"
                        >
                          {slide.description}
                        </motion.p>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          onClick={() => navigate('/event-listing')}
                          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                          {slide.cta}
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Image Side */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ChevronLeftIcon className="w-6 h-6 text-slate-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ChevronRightIcon className="w-6 h-6 text-slate-700" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {featuredSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tight"
          >
            Discover, Connect,{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Participate
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Your premium gateway to campus life. Discover extraordinary events, connect with your community, and participate in experiences that define your academic journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-6 justify-center items-center flex-wrap"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white/70 backdrop-blur-sm border-2 border-white/50 text-slate-700 font-semibold rounded-2xl hover:bg-white/80 hover:border-white/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1"
            >
              Register Now
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Premium Features for{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Modern Campus Life
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of campus event management with our sophisticated, user-centric platform designed for the modern academic environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={MagnifyingGlassIcon}
            title="Event Discovery"
            description="Intelligent search and discovery system with advanced filtering, personalized recommendations, and real-time updates."
            delay={1.0}
          />
          <FeatureCard
            icon={CalendarDaysIcon}
            title="Smart Registration"
            description="Seamless one-click registration with instant confirmations, calendar sync, and automated reminder systems."
            delay={1.1}
          />
          <FeatureCard
            icon={UserGroupIcon}
            title="Event Management"
            description="Comprehensive administrative tools with intuitive CRUD operations, bulk management, and real-time collaboration."
            delay={1.2}
          />
          <FeatureCard
            icon={ChartBarIcon}
            title="Analytics Dashboard"
            description="Advanced participation tracking with detailed analytics, engagement metrics, and comprehensive reporting tools."
            delay={1.3}
          />
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          className="relative bg-white/50 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-16 text-center shadow-2xl shadow-slate-200/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-[2rem]" />
          <div className="relative z-10">
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
              Transform Your Campus Experience Today
            </h3>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the next generation of students and administrators who are revolutionizing campus engagement through our premium event management platform.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border-2 border-white/60 text-slate-700 font-semibold rounded-2xl hover:bg-white/80 hover:border-white/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced floating accent elements */}
      <motion.div
        className="absolute top-1/4 right-16 w-4 h-4 rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0.1) 70%, transparent 100%)'
        }}
        animate={{ 
          y: [0, -30, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-16 w-3 h-3 rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 70%, transparent 100%)'
        }}
        animate={{ 
          y: [0, 25, 0],
          x: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
};

export default LandingPage;