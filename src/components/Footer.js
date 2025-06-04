import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdLabel, MdOutlineAttachMoney, MdOutlineLabel, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { LiaDeskpro, LiaProceduresSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import { SiProxmox } from "react-icons/si";
import '../styles/Footer.css';
import { FaMoneyBillWave, FaTags } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isDark } = useAuth();
  const location = useLocation();
  
  // Function to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`mobile-footer ${isDark ? 'dark-footer' : ''}`}>
      <Link to="/dashBoard" className="footer-item">
        <div className={`footer-icon-container ${isActive('/dashBoard') ? 'active-footer-item' : ''}`}>
          <MdDashboard className="footer-icon" />
          <small className="footer-label">Dashboard</small>
        </div>
      </Link>
      
      <Link to="/additems" className="footer-item">
        <div className={`footer-icon-container ${isActive('/additems') ? 'active-footer-item' : ''}`}>
          <MdOutlineAttachMoney className="footer-icon" />
          <small className="footer-label">Expenses</small>
        </div>
      </Link>
      
      <Link to="/addcat" className="footer-item">
        <div className={`footer-icon-container ${isActive('/addcat') ? 'active-footer-item' : ''}`}>
          <FaTags className="footer-icon" />
          <small className="footer-label">Category</small>
        </div>
      </Link>
      
      <Link to="/source" className="footer-item">
        <div className={`footer-icon-container ${isActive('/source') ? 'active-footer-item' : ''}`}>
          <FaMoneyBillWave className="footer-icon" />
          <small className="footer-label">Source</small>
        </div>
      </Link>
      
      <Link to="/reports" className="footer-item">
        <div className={`footer-icon-container ${isActive('/reports') ? 'active-footer-item' : ''}`}>
          <TbReportSearch className="footer-icon" />
          <small className="footer-label">Reports</small>
        </div>
      </Link>
    </div>
  );
};

export default Footer;