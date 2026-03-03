// Sample data structure for Student Dashboard
export const sampleRegisteredEvents = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    date: "2024-02-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Cultural Festival",
    date: "2024-02-20",
    time: "6:00 PM",
    location: "Campus Grounds",
    status: "waitlisted"
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "2024-02-25",
    time: "9:00 AM",
    location: "Exhibition Hall",
    status: "confirmed"
  }
];

export const sampleAttendedEvents = [
  {
    id: 4,
    title: "Orientation Program",
    date: "2024-01-10",
    time: "9:00 AM",
    location: "Main Hall",
    status: "attended"
  },
  {
    id: 5,
    title: "Workshop on AI",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "Computer Lab",
    status: "attended"
  }
];

/* 
Expected JSON Data Structure:

registeredEvents: Array of objects with:
- id: number (unique identifier)
- title: string (event name)
- date: string (YYYY-MM-DD format)
- time: string (HH:MM AM/PM format)
- location: string (venue name)
- status: string ("confirmed", "waitlisted", "pending")

attendedEvents: Array of objects with:
- id: number (unique identifier)
- title: string (event name)
- date: string (YYYY-MM-DD format)
- time: string (HH:MM AM/PM format)
- location: string (venue name)
- status: string ("attended")
*/