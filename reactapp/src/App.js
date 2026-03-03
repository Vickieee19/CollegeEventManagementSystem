import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PremiumLoginPage from './components/auth/PremiumLoginPage';
import PremiumRegisterPage from './components/auth/PremiumRegisterPage';
import StudentDashboard from './components/StudentDashboard.jsx';
import LightAdminDashboard from './components/LightAdminDashboard';
import EventManagementPage from './components/EventManagementPage';
import UserManagementPage from './components/UserManagementPage';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import StudentEventsPage from './components/StudentEventsPage';
import EventListingPage from './components/EventListingPage';
import { EventProvider } from './context/EventContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-pink-150">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen relative">
        <Routes>
          <Route path="/login" element={<PremiumLoginPage />} />
          <Route path="/register" element={<PremiumRegisterPage />} />
          <Route path="/student" element={<StudentLayout><StudentDashboard registeredEvents={[]} attendedEvents={[]} /></StudentLayout>} />
          <Route path="/student/events" element={<StudentLayout><StudentEventsPage /></StudentLayout>} />
          <Route path="/admin" element={<AdminLayout><LightAdminDashboard /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><EventManagementPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagementPage /></AdminLayout>} />
          <Route path="/events" element={<StudentLayout><EventList /></StudentLayout>} />
          <Route path="/events/:eventId" element={<StudentLayout><EventDetails /></StudentLayout>} />
          <Route path="/event-listing" element={<EventListingPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}

export default App;