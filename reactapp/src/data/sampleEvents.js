// Sample data structure for Event Listing Page
export const sampleAllEvents = [
  {
    id: 1,
    title: "Tech Symposium 2024: AI & Machine Learning",
    date: "2024-02-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    category: "TECHNICAL",
    status: "open",
    isRegistered: false,
    eventImage: null
  },
  {
    id: 2,
    title: "Annual Cultural Festival",
    date: "2024-02-20",
    time: "6:00 PM",
    location: "Campus Grounds",
    category: "CULTURAL",
    status: "open",
    isRegistered: true,
    eventImage: null
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "2024-02-25",
    time: "9:00 AM",
    location: "Exhibition Hall",
    category: "ACADEMIC",
    status: "waitlist",
    isRegistered: false,
    eventImage: null
  },
  {
    id: 4,
    title: "Inter-College Basketball Championship",
    date: "2024-03-01",
    time: "3:00 PM",
    location: "Sports Complex",
    category: "SPORTS",
    status: "open",
    isRegistered: false,
    eventImage: null
  },
  {
    id: 5,
    title: "Hackathon 2024: Code for Change",
    date: "2024-03-05",
    time: "8:00 AM",
    location: "Computer Lab",
    category: "TECHNICAL",
    status: "full",
    isRegistered: true,
    eventImage: null
  },
  {
    id: 6,
    title: "Literary Symposium",
    date: "2024-03-10",
    time: "2:00 PM",
    location: "Library Hall",
    category: "ACADEMIC",
    status: "open",
    isRegistered: false,
    eventImage: null
  }
];

/* 
Expected JSON Data Structure for allEvents prop:

allEvents: Array of objects with:
- id: number (unique identifier)
- title: string (event name)
- date: string (YYYY-MM-DD format)
- time: string (HH:MM AM/PM format)
- location: string (venue name)
- category: string ("TECHNICAL", "CULTURAL", "SPORTS", "ACADEMIC")
- status: string ("open", "waitlist", "full")
- isRegistered: boolean (true if student is already registered)
- eventImage: string|null (URL to event image or null for default)
*/