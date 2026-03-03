// API Version - use this if you want to connect to backend
const loadEventsAPI = async () => {
  try {
    const response = await fetch('https://bakend-folder-college-event.onrender.com/api/events');
    const data = await response.json();
    
    const eventList = data.content.map(event => ({
      id: event.eventId,
      title: event.eventName,
      date: event.date,
      time: event.time,
      location: event.venue,
      category: event.category,
      description: event.description
    }));
    
    setEvents(eventList);
  } catch (error) {
    setEvents(sampleAllEvents);
  }
  setLoading(false);
};