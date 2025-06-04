import React from 'react';

/**
 * FormInput component for rendering different types of form inputs
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, number, select, textarea, etc.)
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {any} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.error - Error message
 * @param {Array} props.options - Options for select inputs
 * @param {Object} props.inputProps - Additional props for the input element
 * @returns {JSX.Element} - Rendered component
 */
const FormInput = ({ 
  type = 'text', 
  name, 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  required = false, 
  error = '', 
  options = [],
  inputProps = {}
}) => {
  // Render different input types
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`app-form-control ${error ? 'is-invalid' : ''}`}
            required={required}
            {...inputProps}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`app-form-control ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
            required={required}
            {...inputProps}
          />
        );
        
      case 'checkbox':
        return (
          <div className="app-form-check">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={value || false}
              onChange={onChange}
              className={`app-form-check-input ${error ? 'is-invalid' : ''}`}
              required={required}
              {...inputProps}
            />
            <label className="app-form-check-label" htmlFor={name}>
              {label}
            </label>
          </div>
        );
        
      case 'radio':
        return (
          <div className="app-form-radio-group">
            {options.map((option) => (
              <div key={option.value} className="app-form-radio">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className={`app-form-radio-input ${error ? 'is-invalid' : ''}`}
                  required={required}
                  {...inputProps}
                />
                <label className="app-form-radio-label" htmlFor={`${name}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'date':
      case 'number':
      case 'email':
      case 'password':
      case 'text':
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`app-form-control ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
            required={required}
            {...inputProps}
          />
        );
    }
  };
  
  return (
    <div className="app-form-group">
      {type !== 'checkbox' && label && (
        <label className="app-form-label" htmlFor={name}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && <div className="app-form-error">{error}</div>}
    </div>
  );
};

export default FormInput;