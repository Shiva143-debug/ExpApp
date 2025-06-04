import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';

/**
 * DataTableWrapper component for displaying data in a table with loading, empty, and error states
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to display in the table
 * @param {Array} props.columns - Column definitions
 * @param {boolean} props.loading - Whether the data is loading
 * @param {string} props.error - Error message to display
 * @param {Function} props.onRetry - Callback for retry button when error occurs
 * @param {string} props.emptyMessage - Message to display when no data is available
 * @param {Object} props.tableProps - Additional props to pass to the DataTable component
 * @returns {JSX.Element} - Rendered component
 */
const DataTableWrapper = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  error = null,
  onRetry,
  emptyMessage = 'No data available',
  tableProps = {}
}) => {
  // Show loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Show error message
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }
  
  // Show empty state
  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  return (
    <div className="app-datatable-container">
      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '100%' }}
        className="app-datatable"
        emptyMessage={emptyMessage}
        responsiveLayout="scroll"
        {...tableProps}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            sortable={col.sortable !== false}
            style={col.style || {}}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default DataTableWrapper;