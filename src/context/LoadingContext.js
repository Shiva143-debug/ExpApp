import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context
const LoadingContext = createContext();

// Loading provider component
export const LoadingProvider = ({ children }) => {
  // Global loading state
  const [globalLoading, setGlobalLoading] = useState(false);
  
  // Component-specific loading states
  const [componentLoading, setComponentLoading] = useState({});
  
  // Set global loading state
  const showGlobalLoader = useCallback(() => {
    setGlobalLoading(true);
  }, []);
  
  const hideGlobalLoader = useCallback(() => {
    setGlobalLoading(false);
  }, []);
  
  // Set component loading state
  const setComponentLoadingState = useCallback((componentId, isLoading) => {
    setComponentLoading(prev => ({
      ...prev,
      [componentId]: isLoading
    }));
  }, []);
  
  // Check if a specific component is loading
  const isComponentLoading = useCallback((componentId) => {
    return componentLoading[componentId] || false;
  }, [componentLoading]);
  
  // Create a wrapper for API calls to automatically handle loading states
  const withLoading = useCallback((apiCall, componentId = null, useGlobalLoader = false) => {
    return async (...args) => {
      try {
        // Set loading state
        if (useGlobalLoader) {
          showGlobalLoader();
        }
        if (componentId) {
          setComponentLoadingState(componentId, true);
        }
        
        // Execute the API call
        const result = await apiCall(...args);
        return result;
      } catch (error) {
        // Re-throw the error to be handled by the caller
        throw error;
      } finally {
        // Clear loading state
        if (useGlobalLoader) {
          hideGlobalLoader();
        }
        if (componentId) {
          setComponentLoadingState(componentId, false);
        }
      }
    };
  }, [showGlobalLoader, hideGlobalLoader, setComponentLoadingState]);
  
  // Context value
  const value = {
    globalLoading,
    showGlobalLoader,
    hideGlobalLoader,
    setComponentLoadingState,
    isComponentLoading,
    withLoading
  };
  
  return (
    <LoadingContext.Provider value={value}>
      {/* Global loading spinner */}
      {globalLoading && (
        <div className="global-loader-container">
          <div className="loader-spinner"></div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;