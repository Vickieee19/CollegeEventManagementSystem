import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentEventList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentData, setStudentData] = useState({
    studentName: user?.name || '',
    studentId: user?.username || user?.rollNo || '',
    email: user?.email || '',
    department: user?.department || '',
    year: user?.year || '',
    phone: ''
  });

  useEffect(() => {
    localStorage.removeItem('registeredEvents');
    setRegisteredEvents(new Set());
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    const handleEventCreated = () => fetchEvents();
    window.addEventListener('eventCreated', handleEventCreated);
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventCreated', handleEventCreated);
    };
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (events.length > 0) {
      checkRegisteredEvents();
    }
  }, [events]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const pageParam = searchTerm ? '&size=1000' : `&size=6`;
      const currentPageParam = searchTerm ? '' : `page=${currentPage}&`;
      const response = await fetch(`http://localhost:8081/api/events?${currentPageParam}${pageParam}${searchParam}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!response.ok) {
        const fallbackResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/events?${currentPageParam}${pageParam}${searchParam}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let eventList = fallbackData.content.map(event => ({
            id: event.eventId,
            title: event.eventName,
            date: event.date,
            time: event.time,
            location: event.venue,
            category: event.category,
            description: event.description,
            status: event.status || "ACTIVE"
          }));
          
          if (searchTerm) {
            eventList = eventList.filter(event => 
              event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          setEvents(eventList);
          setTotalPages(fallbackData.totalPages);
          setLoading(false);
          return;
        }
      }
      
      const data = await response.json();
      const eventList = await Promise.all(data.content.map(async event => {
        let registrationCount = 0;
        try {
          const countResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/event/${event.eventId}`);
          if (countResponse.ok) {
            const registrations = await countResponse.json();
            registrationCount = Array.isArray(registrations) ? registrations.length : 0;
            console.log(`Event ${event.eventName} has ${registrationCount} registrations`);
          }
        } catch (error) {
          console.log('Could not get registration count for event', event.eventId);
        }
        
        return {
          id: event.eventId,
          title: event.eventName,
          date: event.date,
          time: event.time,
          location: event.venue,
          category: event.category,
          description: event.description,
          status: event.status || "ACTIVE",
          registrationCount: registrationCount,
          capacity: event.capacity
        };
      }));
      
      let filteredEvents = eventList;
      if (searchTerm) {
        filteredEvents = eventList.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setEvents(filteredEvents);
      setTotalPages(data.totalPages);
    } catch (error) {
      try {
        const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
        const pageParam = searchTerm ? '&size=1000' : `&size=6`;
        const currentPageParam = searchTerm ? '' : `page=${currentPage}&`;
        const fallbackResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/events?${currentPageParam}${pageParam}${searchParam}`);
        const fallbackData = await fallbackResponse.json();
        let eventList = fallbackData.content.map(event => ({
          id: event.eventId,
          title: event.eventName,
          date: event.date,
          time: event.time,
          location: event.venue,
          category: event.category,
          description: event.description,
          status: event.status || "ACTIVE"
        }));
        
        if (searchTerm) {
          eventList = eventList.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setEvents(eventList);
        setTotalPages(fallbackData.totalPages);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
    setLoading(false);
  };

  const checkRegisteredEvents = async () => {
    const studentId = user?.username || user?.rollNo || localStorage.getItem('studentId') || sessionStorage.getItem('studentId') || localStorage.getItem('username');
    if (!studentId || events.length === 0) return;
    
    try {
      const userRegsResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/student/${studentId}`);
      if (userRegsResponse.ok) {
        const userRegistrations = await userRegsResponse.json();
        const registeredSet = new Set();
        userRegistrations.forEach(reg => {
          if (reg.event && reg.event.eventId) {
            registeredSet.add(reg.event.eventId);
          }
        });
        setRegisteredEvents(registeredSet);
        // Update localStorage for persistence
        localStorage.setItem('registeredEvents', JSON.stringify(Array.from(registeredSet)));
      } else {
        // Fallback to localStorage
        const cachedEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
        setRegisteredEvents(new Set(cachedEvents));
      }
    } catch (error) {
      // Fallback to localStorage
      const cachedEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      setRegisteredEvents(new Set(cachedEvents));
    }
  };

  const handleRegisterClick = async (event) => {
    const studentId = user?.username || user?.rollNo || localStorage.getItem('studentId') || sessionStorage.getItem('studentId');
    if (studentId) {
      try {
        const checkResponse = await fetch(`https://bakend-folder-college-event.onrender.com/api/registrations/check/${studentId}/${event.id}`);
        if (checkResponse.ok) {
          const isRegistered = await checkResponse.json();
          if (isRegistered) {
            alert('You are already registered for this event!');
            return;
          }
        }
      } catch (error) {
        console.log('Could not check registration status');
      }
    }
    
    // Pre-fill form with user data if available
    if (user) {
      setStudentData({
        studentName: user.name || '',
        studentId: user.username || user.rollNo || '',
        email: user.email || '',
        department: user.department || '',
        year: user.year || '',
        phone: ''
      });
    }
    
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async () => {
    if (!studentData.studentName || !studentData.studentId || !studentData.email || !studentData.department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const registrationPayload = {
        eventId: selectedEvent.id,
        studentId: studentData.studentId,
        studentName: studentData.studentName,
        email: studentData.email,
        department: studentData.department,
        year: studentData.year,
        phone: studentData.phone
      };
      
      let response = await fetch('https://bakend-folder-college-event.onrender.com/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });
      
      if (response.ok) {
        alert('Successfully registered for the event!');
        
        // Only update localStorage if not already authenticated
        if (!user) {
          localStorage.setItem('studentId', studentData.studentId);
          localStorage.setItem('username', studentData.studentId);
          localStorage.setItem('userEmail', studentData.email);
          localStorage.setItem('userDepartment', studentData.department);
        }
        
        setRegisteredEvents(prev => {
          const newSet = new Set([...prev, selectedEvent.id]);
          const registeredArray = Array.from(newSet);
          localStorage.setItem('registeredEvents', JSON.stringify(registeredArray));
          return newSet;
        });
        
        if (window.updateUserContext) {
          window.updateUserContext({
            username: studentData.studentId,
            email: studentData.email,
            department: studentData.department,
            name: studentData.studentName
          });
        }
        
        window.dispatchEvent(new CustomEvent('studentRegistered', {
          detail: { 
            eventId: selectedEvent.id,
            eventName: selectedEvent.title,
            studentData: {
              ...studentData,
              registrationDate: new Date().toISOString().split('T')[0]
            }
          }
        }));
        
        window.dispatchEvent(new CustomEvent('refreshStudentData'));
        window.dispatchEvent(new CustomEvent('registrationComplete'));
        window.dispatchEvent(new CustomEvent('refreshAdminData'));
        
        setTimeout(() => {
          fetchEvents();
          checkRegisteredEvents();
        }, 500);
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshStudentData'));
        }, 2000);
        
        setStudentData({
          studentName: '',
          studentId: '',
          email: '',
          department: '',
          year: '',
          phone: ''
        });
        setShowRegistrationModal(false);
        setSelectedEvent(null);
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Registration failed with status:', response.status);
        console.error('Error response:', errorText);
        console.error('Payload sent:', registrationPayload);
        try {
          const errorData = JSON.parse(errorText);
          if (errorData && errorData.error === 'ALREADY_REGISTERED') {
            alert(errorData.message || 'You are already registered for this event!');
          } else {
            alert('Registration failed: ' + (errorData.message || errorText));
          }
        } catch {
          alert('Registration failed: ' + errorText);
        }
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-violet-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-2xl animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
          <p className="text-slate-700 text-lg font-medium tracking-wide">Discovering amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white relative">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Campus Events
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover and join amazing campus events
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-slate-500 mt-2">
                Page {currentPage + 1} of {totalPages} • Showing {events.length} events
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-6 lg:mb-0 lg:mr-8">
                    {/* Event Title */}
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-8 bg-blue-500 rounded-full mr-4"></div>
                      <h2 className="text-2xl font-bold text-slate-800">{event.title}</h2>
                    </div>
                      
                    {/* Event Details */}
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">{event.date}</span>
                          <span className="mx-2 text-slate-400">•</span>
                          <span className="text-slate-600">{event.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-slate-600">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-slate-800">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-600">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{event.category}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-600">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-slate-800">{event.registrationCount || 0}</span>
                          <span className="mx-2 text-slate-500">registered</span>
                          {event.capacity && <span className="text-slate-500">/ {event.capacity}</span>}
                        </div>
                      </div>
                    </div>
                      
                    {/* Description */}
                    {event.description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-slate-700 leading-relaxed">{event.description}</p>
                      </div>
                    )}
                      
                    {/* Action Button */}
                    <div className="flex justify-end mt-6">
                      {event.status === 'COMPLETED' ? (
                        <button 
                          disabled
                          className="bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg cursor-not-allowed flex items-center"
                        >
                          <div className="w-4 h-4 mr-2 bg-gray-300 rounded-full"></div>
                          Event Concluded
                        </button>
                      ) : registeredEvents.has(event.id) ? (
                        <button 
                          disabled
                          className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg cursor-not-allowed flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Registered
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRegisterClick(event)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                        >
                          <span className="mr-2">Register</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 4) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Register for Event</h3>
              <p className="text-slate-600">{selectedEvent?.title}</p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={studentData.studentName}
                onChange={(e) => setStudentData({...studentData, studentName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <input
                type="text"
                placeholder="Student ID *"
                value={studentData.studentId}
                onChange={(e) => setStudentData({...studentData, studentId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <input
                type="email"
                placeholder="Email Address *"
                value={studentData.email}
                onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <select
                value={studentData.department}
                onChange={(e) => setStudentData({...studentData, department: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department *</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
              </select>
              
              <select
                value={studentData.year}
                onChange={(e) => setStudentData({...studentData, year: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={studentData.phone}
                onChange={(e) => setStudentData({...studentData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Modal Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  setSelectedEvent(null);
                  setStudentData({
                    studentName: '',
                    studentId: '',
                    email: '',
                    department: '',
                    year: '',
                    phone: ''
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegistrationSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentEventList;