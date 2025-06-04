import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * ErrorMessage component for displaying error messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Optional callback function for retry button
 * @param {string} props.type - Error type ('error', 'warning', 'info')
 * @returns {JSX.Element} - Rendered component
 */
const ErrorMessage = ({ 
  message = 'An error occurred. Please try again.', 
  onRetry, 
  type = 'error' 
}) => {
  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderColor: 'var(--warning-color)',
          color: '#856404'
        };
      case 'info':
        return {
          backgroundColor: 'rgba(23, 162, 184, 0.1)',
          borderColor: 'var(--info-color)',
          color: '#0c5460'
        };
      case 'error':
      default:
        return {
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderColor: 'var(--danger-color)',
          color: '#721c24'
        };
    }
  };
  
  const typeStyles = getTypeStyles();
  
  return (
    <div 
      className="error-message-container"
      style={{
        padding: '1rem',
        borderRadius: 'var(--border-radius-md)',
        border: `1px solid ${typeStyles.borderColor}`,
        backgroundColor: typeStyles.backgroundColor,
        color: typeStyles.color,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <FaExclamationTriangle size={24} />
      <div className="error-message-content" style={{ flex: 1 }}>
        <p style={{ margin: 0 }}>{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'transparent',
              border: `1px solid ${typeStyles.color}`,
              borderRadius: 'var(--border-radius-sm)',
              color: typeStyles.color,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;