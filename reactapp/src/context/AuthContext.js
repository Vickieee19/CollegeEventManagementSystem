import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token);
      console.log('User data from localStorage:', userData);
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Check if it's an admin token (simple token)
          if (token.startsWith('admin_')) {
            console.log('Admin token detected, restoring admin session');
            setIsLoggedIn(true);
            setUser(user);
          } else {
            // Regular JWT token validation
            const response = await fetch('https://bakend-folder-college-event.onrender.com/api/auth/validate', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Validation response status:', response.status);
            if (response.ok) {
              const validatedUserData = await response.json();
              console.log('User data from validation:', validatedUserData);
              setIsLoggedIn(true);
              setUser(validatedUserData);
              // Update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(validatedUserData));
            } else {
              console.log('Token validation failed, using cached user data');
              // Don't remove token immediately, use cached data
              setIsLoggedIn(true);
              setUser(user);
            }
          }
        } catch (error) {
          console.log('Token validation error, using cached data:', error);
          // Don't clear data on network errors, use cached data
          if (userData) {
            try {
              const user = JSON.parse(userData);
              setIsLoggedIn(true);
              setUser(user);
            } catch (parseError) {
              console.log('Failed to parse cached user data');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      } else {
        console.log('No token or user data found in localStorage');
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = (userData, token) => {
    console.log('Storing token:', token);
    console.log('Storing user data:', userData);
    
    // Clear previous user's registration data
    localStorage.removeItem('registeredEvents');
    localStorage.removeItem('studentId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDepartment');
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    // Clear all user-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('registeredEvents');
    localStorage.removeItem('studentId');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDepartment');
    
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};