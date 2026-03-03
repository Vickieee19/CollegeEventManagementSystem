import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const StudentActivityTracker = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudentActivities();
    
    // Listen for new registrations
    const handleStudentRegistered = (event) => {
      const { eventId, studentData } = event.detail;
      addNewActivity(eventId, studentData);
    };
    
    window.addEventListener('studentRegistered', handleStudentRegistered);
    
    return () => {
      window.removeEventListener('studentRegistered', handleStudentRegistered);
    };
  }, []);

  const fetchStudentActivities = async () => {
    try {
      // Mock data - replace with actual API call
      const mockActivities = [
        {
          id: 1,
          studentId: 'ST001',
          studentName: 'John Doe',
          email: 'john@university.edu',
          department: 'Computer Science',
          year: '3rd Year',
          totalRegistrations: 3,
          totalAttendance: 2,
          recentActivities: [
            {
              eventId: 1,
              eventName: 'Tech Symposium 2024',
              action: 'registered',
              timestamp: '2024-01-15T10:30:00Z',
              attended: true
            },
            {
              eventId: 2,
              eventName: 'Career Fair',
              action: 'registered',
              timestamp: '2024-01-14T14:20:00Z',
              attended: false
            }
          ]
        },
        {
          id: 2,
          studentId: 'ST002',
          studentName: 'Jane Smith',
          email: 'jane@university.edu',
          department: 'Engineering',
          year: '2nd Year',
          totalRegistrations: 2,
          totalAttendance: 1,
          recentActivities: [
            {
              eventId: 3,
              eventName: 'Workshop on AI',
              action: 'registered',
              timestamp: '2024-01-13T09:15:00Z',
              attended: true
            }
          ]
        }
      ];
      
      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student activities:', error);
      setLoading(false);
    }
  };

  const addNewActivity = (eventId, studentData) => {
    const newActivity = {
      eventId,
      eventName: 'New Event Registration',
      action: 'registered',
      timestamp: new Date().toISOString(),
      attended: false
    };

    setActivities(prev => {
      const existingStudentIndex = prev.findIndex(s => s.studentId === studentData.studentId);
      
      if (existingStudentIndex >= 0) {
        // Update existing student
        const updated = [...prev];
        updated[existingStudentIndex] = {
          ...updated[existingStudentIndex],
          totalRegistrations: updated[existingStudentIndex].totalRegistrations + 1,
          recentActivities: [newActivity, ...updated[existingStudentIndex].recentActivities]
        };
        return updated;
      } else {
        // Add new student
        return [...prev, {
          id: prev.length + 1,
          ...studentData,
          totalRegistrations: 1,
          totalAttendance: 0,
          recentActivities: [newActivity]
        }];
      }
    });
  };

  const markAttendance = async (studentId, eventId, attended) => {
    try {
      // API call to mark attendance
      const response = await fetch(`https://bakend-folder-college-event.onrender.com/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          eventId,
          attended,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Update local state
        setActivities(prev => prev.map(student => {
          if (student.studentId === studentId) {
            return {
              ...student,
              totalAttendance: attended ? student.totalAttendance + 1 : student.totalAttendance,
              recentActivities: student.recentActivities.map(activity => 
                activity.eventId === eventId ? { ...activity, attended } : activity
              )
            };
          }
          return student;
        }));
        
        alert(`Attendance ${attended ? 'marked' : 'unmarked'} successfully!`);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to update attendance');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Activity Tracking</h2>
        <p className="text-gray-600">Monitor student event registrations and attendance in real-time</p>
      </div>

      <div className="grid gap-6">
        {activities.map((student) => (
          <motion.div
            key={student.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            whileHover={{ y: -2 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{student.studentName}</h3>
                    <p className="text-sm text-gray-600">{student.studentId} • {student.department}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="w-4 h-4 mr-1" />
                        {student.email}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <AcademicCapIcon className="w-4 h-4 mr-1" />
                        {student.year}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{student.totalRegistrations}</div>
                      <div className="text-xs text-gray-500">Registered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{student.totalAttendance}</div>
                      <div className="text-xs text-gray-500">Attended</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Activities</h4>
                <div className="space-y-2">
                  {student.recentActivities.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{activity.eventName}</span>
                          <div className="text-xs text-gray-500">
                            {activity.action} on {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.attended 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.attended ? 'Attended' : 'Registered'}
                        </span>
                        
                        {!activity.attended && (
                          <button
                            onClick={() => markAttendance(student.studentId, activity.eventId, true)}
                            className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                          >
                            Mark Present
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {student.recentActivities.length > 3 && (
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all activities ({student.recentActivities.length})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedStudent.studentName} - Activity Details</h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96 p-6">
              <div className="space-y-3">
                {selectedStudent.recentActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{activity.eventName}</div>
                      <div className="text-sm text-gray-500">
                        {activity.action} on {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.attended 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.attended ? 'Attended' : 'Registered'}
                      </span>
                      
                      {!activity.attended && (
                        <button
                          onClick={() => markAttendance(selectedStudent.studentId, activity.eventId, true)}
                          className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                        >
                          Mark Present
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentActivityTracker;