import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...props }) => {
  const isAuthenticated = true

  return isAuthenticated ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute

