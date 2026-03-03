import React, { createContext, useContext, useState } from 'react';
import { sampleAllEvents } from '../data/sampleEvents';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(sampleAllEvents);
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('eventRegistrations');
    return saved ? JSON.parse(saved) : [];
  });

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Math.max(...events.map(e => e.id), 0) + 1,
      isRegistered: false
    };
    setEvents(prev => [...prev, eventWithId]);
    return eventWithId;
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addRegistration = (eventId, registrationData) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newRegistration = {
      id: Date.now() + Math.random(),
      eventId,
      eventTitle: event.title,
      studentName: registrationData.fullName,
      studentId: registrationData.studentId,
      email: registrationData.email,
      phone: registrationData.phone,
      department: registrationData.department,
      year: registrationData.year,
      specialRequirements: registrationData.specialRequirements,
      registrationDate: new Date().toLocaleString()
    };

    setRegistrations(prev => {
      const updated = [newRegistration, ...prev];
      localStorage.setItem('eventRegistrations', JSON.stringify(updated));
      console.log('Adding registration:', newRegistration);
      console.log('Current registrations:', updated.length);
      return updated;
    });
    return newRegistration;
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      addEvent,
      updateEvent,
      deleteEvent,
      addRegistration
    }}>
      {children}
    </EventContext.Provider>
  );
};