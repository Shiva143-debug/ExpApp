import React from 'react';
import { FaInbox, FaPlus } from 'react-icons/fa';

/**
 * EmptyState component for displaying when no data is available
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.icon - Icon to display (default: 'inbox')
 * @param {Function} props.actionHandler - Optional callback for action button
 * @param {string} props.actionLabel - Label for the action button
 * @param {string} props.description - Optional additional description
 * @returns {JSX.Element} - Rendered component
 */
const EmptyState = ({ 
  message = 'No data available', 
  icon = 'inbox',
  actionHandler,
  actionLabel = 'Add New',
  description
}) => {
  // Determine which icon to display
  const renderIcon = () => {
    switch (icon) {
      case 'plus':
        return <FaPlus size={48} />;
      case 'inbox':
      default:
        return <FaInbox size={48} />;
    }
  };
  
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {renderIcon()}
      </div>
      <h3 className="empty-state-message">{message}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {actionHandler && (
        <button 
          onClick={actionHandler}
          className="app-btn primary"
          style={{ marginTop: '1rem' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;