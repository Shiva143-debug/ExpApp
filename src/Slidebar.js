import { Link, useLocation } from 'react-router-dom';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { LiaDeskpro, LiaProceduresSolid } from "react-icons/lia";
import { TbReportSearch } from "react-icons/tb";
import { SiProxmox } from "react-icons/si";
import './Slidebar.css';
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
        <>
            <div className='slidebar d-flex flex-column' style={{ position: 'fixed', top: 80, left: 0, width: "15%", height: "100vh", backgroundColor: isdark ? "rgb(59, 58, 58)" : "white", boxShadow: isdark ? '0 2px 4px white' : '0 2px 4px rgba(0, 0, 0, 0.1)' }}>

                <Link to="/dashBoard" className='nav-link'>
                    <button onClick={() => setActiveButton('dashboard')} className={`mb-5 mt-2 ${activeButton === 'dashboard' ? "active" : "sideButton"}`} style={{ backgroundColor: isdark ? "transparent" : "",color:isdark?"white":"",border:isdark?"3px solid rgba(0, 0, 0, 0.1)":""}}>
                        <SiProxmox />DashBoard
                    </button>
                </Link>

                <Link to="/additems" className='nav-link'>
                    <button onClick={() => setActiveButton('additems')} className={`mb-5 ${activeButton === 'additems' ? "active" : "sideButton"}`} style={{ backgroundColor: isdark ? "transparent" : "",color:isdark?"white":"",border:isdark?"3px solid rgba(0, 0, 0, 0.1)":""}}>
                        <MdOutlineProductionQuantityLimits /> Expences
                    </button>
                </Link>

                <Link to="/addcat" className='nav-link'>
                    <button onClick={() => setActiveButton('addcat')} className={`mb-5 ${activeButton === 'addcat' ? "active" : "sideButton"}`} style={{ backgroundColor: isdark ? "transparent" : "",color:isdark?"white":"",border:isdark?"3px solid rgba(0, 0, 0, 0.1)":""}}>
                        <LiaDeskpro />  Category
                    </button>
                </Link>

                <Link to="/source" className='nav-link'>
                    <button onClick={() => setActiveButton('source')} className={`mb-5 ${activeButton === 'source' ? "active" : "sideButton"}`} style={{ backgroundColor: isdark ? "transparent" : "",color:isdark?"white":"",border:isdark?"3px solid rgba(0, 0, 0, 0.1)":""}}>
                        <LiaProceduresSolid />   Add Source
                    </button>
                </Link>

                <Link to="/reports" className='nav-link'>
                    <button onClick={() => setActiveButton('reports')} className={`mb-5 ${activeButton === 'reports' ? "active" : "sideButton"}`} style={{ backgroundColor: isdark ? "transparent" : "",color:isdark?"white":"",border:isdark?"3px solid rgba(0, 0, 0, 0.1)":""}}>
                        <TbReportSearch />   Reports
                    </button>
                </Link>
            </div>


        </>
    );
}

export default Slidebar;
