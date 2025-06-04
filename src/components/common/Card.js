import React from 'react';

/**
 * Card component for displaying content in a card layout
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {ReactNode} props.headerActions - Additional actions to display in the header
 * @param {ReactNode} props.footer - Footer content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {Function} props.onClick - Click handler for the card
 * @returns {JSX.Element} - Rendered component
 */
const Card = ({ 
  children, 
  title, 
  headerActions, 
  footer, 
  className = '', 
  style = {}, 
  onClick 
}) => {
  return (
    <div 
      className={`app-card ${className}`} 
      style={style}
      onClick={onClick}
    >
      {(title || headerActions) && (
        <div className="app-card-header">
          {title && <h3 className="app-card-title">{title}</h3>}
          {headerActions && (
            <div className="app-card-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="app-card-body">
        {children}
      </div>
      
      {footer && (
        <div className="app-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;