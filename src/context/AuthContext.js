// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Create the context
// const AuthContext = createContext();

// // Custom hook to use the auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // Provider component
// export const AuthProvider = ({ children }) => {
//   // User ID state
//   const [userId, setUserId] = useState(() => {
//     return localStorage.getItem('userId') || null;
//   });

//   // Theme state (dark/light)
//   const [isDark, setIsDark] = useState(false);

//   // Update localStorage when userId changes
//   useEffect(() => {
//     if (userId) {
//       localStorage.setItem('userId', userId);
//     } else {
//       localStorage.removeItem('userId');
//     }
//   }, [userId]);

//   // Toggle theme function
//   const toggleTheme = () => {
//     setIsDark(prevState => !prevState);
//   };

//   // Login function
//   const login = (id) => {
//     setUserId(id);
//   };

//   // Logout function
//   const logout = () => {
//     setUserId(null);
//   };

//   // Context value
//   const value = {
//     userId,
//     isDark,
//     login,
//     logout,
//     toggleTheme
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../api/apiService';
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

  // User data state
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });

  // Theme state (dark/light)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Loading state for initial authentication check
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Global application loading state
  const [appLoading, setAppLoading] = useState(false);
  
  // Error state
  const [authError, setAuthError] = useState(null);

  // Update localStorage when userId changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      setUserData(null);
    }
  }, [userId]);

  // Update userData in localStorage when it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  // Update document body class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        
        if (token && storedUserId) {
          // Verify token with backend
          try {
            await authService.verifyToken(token);
            setUserId(storedUserId);
          } catch (error) {
            // Token is invalid, clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userData');
            setUserId(null);
            setUserData(null);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthError('Authentication check failed');
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
  const login = useCallback(async (id, userData = {}, token = null) => {
    setUserId(id);
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    if (Object.keys(userData).length > 0) {
      setUserData(userData);
    }
  }, []);

  // Update user data
  const updateUserData = useCallback((data) => {
    setUserData(prevData => ({
      ...prevData,
      ...data
    }));
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setUserId(null);
    setUserData(null);
  }, []);

  // Set global loading state
  const setGlobalLoading = useCallback((isLoading) => {
    setAppLoading(isLoading);
  }, []);

  // Context value
  const value = {
    userId,
    userData,
    isDark,
    loading: initialLoading,
    appLoading,
    authError,
    login,
    logout,
    toggleTheme,
    updateUserData,
    setGlobalLoading
  };

  // Show loading spinner during initial authentication check
  if (initialLoading) {
    return <LoadingSpinner fullScreen message="Initializing application..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {appLoading && <LoadingSpinner overlay message="Loading..." />}
    </AuthContext.Provider>
  );
};

export default AuthContext;