

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  // User ID state
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  // Theme state (dark/light)
  const [isdark, setIsDark] = useState(false);

  // Loading state for initial authentication check
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Update localStorage when userId changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  // Update document body class and localStorage when theme changes
  useEffect(() => {
    if (isdark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isdark]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          try {
            setUserId(storedUserId);
          } catch (error) {
            localStorage.removeItem('userId');
            setUserId(null);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setIsDark(prevState => !prevState);
  }, []);

  // Login function
  const login = useCallback(async (id) => {
    setUserId(id);
   
  }, []);


  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setUserId(null);

  }, []);

 

  // Context value
  const value = {
    userId,
    isdark,
    loading: initialLoading,
    login,
    logout,
    toggleTheme,
  };

  // Show loading spinner during initial authentication check
  if (initialLoading) {
    return <LoadingSpinner fullScreen message="Initializing application..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;