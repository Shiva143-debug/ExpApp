import { Link ,useLocation} from 'react-router-dom';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { LiaDeskpro, LiaProceduresSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import { SiProxmox } from "react-icons/si";
import './Slidebar.css';
import { useState, useEffect } from 'react';

function Slidebar({isdark}) {  
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
        <>
<<<<<<< HEAD
 <div className='slidebar d-flex flex-column' style={{ position: 'fixed', top: 80, left: 0, width: "15%",height:"100vh",backgroundColor:isdark?"rgb(59, 58, 58)": "white",boxShadow: isdark? '0 2px 4px white':'0 2px 4px rgba(0, 0, 0, 0.1)' }}>
=======
        <div className='slidebar d-flex flex-column' style={{ position: 'fixed', top: 80, left: 0, width: "15%",height:"100vh",backgroundColor:isdark?"gray": "white",boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)' }}>
>>>>>>> f4b03f3176fdc39ca6bf8fb9cf3a3a93449e1c77

            <Link to="/dashBoard" className='nav-link'>
                <button onClick={() => setActiveButton('dashboard')} className={`mb-5 mt-2 ${activeButton === 'dashboard' ? "active" : "sideButton"}`}>
                    <SiProxmox style={{ marginRight: "50px" }} />DashBoard
                </button>
            </Link>
    
            <Link to="/additems" className='nav-link'>
                <button onClick={() => setActiveButton('additems')} className={`mb-5 ${activeButton === 'additems' ? "active" : "sideButton"}`}>
                    <MdOutlineProductionQuantityLimits style={{ marginRight: "50px" }} /> Add Expences
                </button>
            </Link>

            <Link to="/addcat" className='nav-link'>
                <button onClick={() => setActiveButton('addcat')} className={`mb-5 ${activeButton === 'addcat' ? "active" : "sideButton"}`}>
                    <LiaDeskpro style={{ marginRight: "50px" }} />   Add Category
                </button>
            </Link>

            <Link to="/source" className='nav-link'>
                <button onClick={() => setActiveButton('source')} className={`mb-5 ${activeButton === 'source' ? "active" : "sideButton"}`}>
                    <LiaProceduresSolid style={{ marginRight: "50px" }} />   Add Source
                </button>
            </Link>

            <Link to="/reports" className='nav-link'>
                <button onClick={() => setActiveButton('reports')} className={`mb-5 ${activeButton === 'reports' ? "active" : "sideButton"}`}>
                    <TbReportSearch style={{ marginRight: "50px" }} />   Reports
                </button>
            </Link>
        </div>
        

        </>
    );
}

export default Slidebar;
