import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

// Styles
import './App.css';
import './styles/variables.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Components
import Footer from "./components/Footer";

// Pages
import AddCategory from "./components/AddCategory";
import Source from "./components/Source";
import DashBoard from "./components/DashBoard";
import ImageComponent from "./components/Micilinious/ImageComponent";
import LoginForm from "./components/LoginRegisterFolder/LoginForm";
import Additems from "./components/Additems";
import Header from "./components/Header";
import SignUpForm from "./components/LoginRegisterFolder/SignUpForm";
import Reports from "./components/Reports";

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';

// Layout component that wraps authenticated pages
const Layout = ({ children }) => {
  const { userId, isDark, toggleTheme } = useAuth();
  const { globalLoading } = useLoading();
  const location = useLocation();
  const isLoginRoute = location.pathname === '/' || location.pathname === '/login';
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // Apply dark mode to body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  return (
    <>
      {!isLoginRoute && <Header />}
      <main className={`app-main ${isDark ? 'dark-mode' : ''}`}>
        {children}
      </main>
      {isMobile && <Footer />}
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { userId } = useAuth();
  
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App component with routes
const AppRoutes = () => {
  const { userId, isDark, login } = useAuth();
  
  useEffect(() => {
    document.title = "Expenditure Application";
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SignUpForm />} />
      <Route path="/login" element={<LoginForm setUserId={login} />} />
      
      <Route path="/dashBoard" element={
        <ProtectedRoute>
          <Layout>
            <DashBoard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/additems" element={
        <ProtectedRoute>
          <Layout>
            <Additems />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/addcat" element={
        <ProtectedRoute>
          <Layout>
            <AddCategory />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/source" element={
        <ProtectedRoute>
          <Layout>
            <Source />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/image" element={<ImageComponent />} />
      
      {/* Redirect to dashboard if already logged in */}
      <Route path="*" element={userId ? <Navigate to="/dashBoard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App component wrapped with providers
function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
