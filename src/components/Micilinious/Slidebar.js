import { Link, useLocation } from 'react-router-dom';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { LiaDeskpro, LiaProceduresSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import { SiProxmox } from "react-icons/si";
import '../../styles/Slidebar.css'
import { useState, useEffect } from 'react';

function Slidebar({ isdark }) {
    const location = useLocation();
    const [activeButton, setActiveButton] = useState(getActiveButton(location.pathname));

    useEffect(() => {
        setActiveButton(getActiveButton(location.pathname));
    }, [location]);

    function getActiveButton(pathname) {
        switch (pathname) {
            case "/dashBoard":
                return "dashboard";
            case "/additems":
                return "additems";
            case "/addcat":
                return "addcat";
            case "/source":
                return "source";
            case "/reports":
                return "reports";
            default:
                return "dashboard";
        }
    }

    return (
        <div 
            className={`slidebar d-flex flex-column ${isdark ? 'dark-slidebar' : ''}`} 
            style={{ position: 'fixed', top: 80, 
                left: 0, 
                zIndex: 1000
            }}
        >
            <Link to="/dashBoard" className='nav-link'>
                <button 
                    onClick={() => setActiveButton('dashboard')} 
                    className={activeButton === 'dashboard' ? "active" : "sideButton"}
                >
                    <SiProxmox className="nav-icon" />
                    <small>Dashboard</small>
                </button>
            </Link>

            <Link to="/additems" className='nav-link'>
                <button 
                    onClick={() => setActiveButton('additems')} 
                    className={activeButton === 'additems' ? "active" : "sideButton"}
                >
                    <MdOutlineProductionQuantityLimits className="nav-icon" />
                    <small>Expense</small>
                </button>
            </Link>

            <Link to="/addcat" className='nav-link'>
                <button 
                    onClick={() => setActiveButton('addcat')} 
                    className={activeButton === 'addcat' ? "active" : "sideButton"}
                >
                    <LiaDeskpro className="nav-icon" />
                    <small>Category</small>
                </button>
            </Link>

            <Link to="/source" className='nav-link'>
                <button 
                    onClick={() => setActiveButton('source')} 
                    className={activeButton === 'source' ? "active" : "sideButton"}
                >
                    <LiaProceduresSolid className="nav-icon" />
                    <small>Source</small>
                </button>
            </Link>

            <Link to="/reports" className='nav-link'>
                <button 
                    onClick={() => setActiveButton('reports')} 
                    className={activeButton === 'reports' ? "active" : "sideButton"}
                >
                    <TbReportSearch className="nav-icon" />
                    <small>Reports</small>
                </button>
            </Link>
        </div>
    );
}

export default Slidebar;
