import React from 'react';

/**
 * LoadingSpinner component for displaying loading states
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.fullScreen - Whether to display the spinner in full screen mode
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.message - Optional message to display below the spinner
 * @param {boolean} props.overlay - Whether to show a background overlay
 * @returns {JSX.Element} - Rendered component
 */
const LoadingSpinner = ({ 
  fullScreen = false, 
  size = 'md', 
  message = 'Loading...', 
  overlay = false 
}) => {
  // Determine spinner size
  const spinnerSize = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  }[size] || '40px';
  
  // Determine border size
  const borderSize = {
    sm: '2px',
    md: '4px',
    lg: '6px'
  }[size] || '4px';
  
  // Styles for the spinner
  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: `${borderSize} solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${borderSize} solid var(--primary-color)`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };
  
  // Styles for the container
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: fullScreen ? '0' : '2rem',
    height: fullScreen ? '100vh' : 'auto',
    width: fullScreen ? '100vw' : '100%',
    position: fullScreen || overlay ? 'fixed' : 'relative',
    top: fullScreen || overlay ? '0' : 'auto',
    left: fullScreen || overlay ? '0' : 'auto',
    backgroundColor: overlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    zIndex: fullScreen || overlay ? '9999' : '1',
  };
  
  // Styles for the message
  const messageStyle = {
    marginTop: '1rem',
    color: overlay ? 'white' : 'inherit',
    fontSize: {
      sm: 'var(--font-size-sm)',
      md: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)'
    }[size] || 'var(--font-size-base)'
  };
  
  return (
    <div style={containerStyle} className="loading-spinner-container">
      <div style={spinnerStyle} className="loader-spinner"></div>
      {message && <div style={messageStyle} className="loading-message">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;