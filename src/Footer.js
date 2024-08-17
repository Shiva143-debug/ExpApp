import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import './MobileSlidebar.css';

const Footer = ({isdark}) => {
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
        <div style={{ width: "100%", position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor:isdark? "black":"gray", justifyContent: "space-around", borderRadius:"16px 16px 0px 0px" ,borderTop: "2px solid whitesmoke", display: "flex", flexWrap: "wrap", fontSize: "14px" }}>
            <Link to="/dashBoard" className='nav-link'>
                <button onClick={() => setActiveButton("dashboard")} className={`${activeButton === 'dashboard' ? "active" : "MobileSideButton"} d-flex flex-column justify-content-center align-items-center`}>
                <FaHome />DashBoard
                </button>
            </Link>

            
            <Link to="/additems" className='nav-link'>
                <button onClick={() => setActiveButton("additems")} className={`${activeButton === 'additems' ? "active" : "MobileSideButton"} d-flex flex-column justify-content-center align-items-center`}>
                <GiExpense />Expences
                </button>
            </Link>

            <Link to="/addcat" className='nav-link'>
                <button onClick={() => setActiveButton("addcat")} className={`${activeButton === 'addcat' ? "active" : "MobileSideButton"} d-flex flex-column justify-content-center align-items-center`}>
                <BiCategoryAlt /> Category
                </button>
            </Link>

            <Link to="/source" className='nav-link'>
                <button onClick={() => setActiveButton("source")} className={`${activeButton === 'source' ? "active" : "MobileSideButton"} d-flex flex-column justify-content-center align-items-center`}>
                <FaMoneyBill1Wave /> Source
                </button>
            </Link>

            <Link to="/reports" className='nav-link'>
                <button onClick={() => setActiveButton("reports")} className={`${activeButton === 'reports' ? "active" : "MobileSideButton"} d-flex flex-column justify-content-center align-items-center`}>
                <TbReportSearch />Reports
                </button>
            </Link>
        </div>
        // <div style={{width:"100%" ,position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "grey", justifyContent: "space-around", borderTop: "1px solid whitesmoke", display: "flex",flexWrap:"wrap",fontSize:"14px" }}>
        //     <Link to="/dashBoard" className='nav-link'>
        //         <button className={`${activeButton === 'dashboard' ? "active" : "MobileSideButton"}`}>
        //             DashBoard
        //         </button>
        //     </Link>
        //     <Link to="/additems" className='nav-link'>
        //         <button className={`${activeButton === 'additems' ? "active" : "MobileSideButton"}`}>
        //             Expences
        //         </button>
        //     </Link>

        //     <Link to="/addcat" className='nav-link'>
        //         <button className={`${activeButton === 'addcat' ? "active" : "MobileSideButton"}`}>
        //             Category
        //         </button>
        //     </Link>

        //     <Link to="/source" className='nav-link'>
        //         <button className={`${activeButton === 'source' ? "active" : "MobileSideButton"}`}>
        //             Source
        //         </button>
        //     </Link>

        //     <Link to="/reports" className='nav-link'>
        //         <button className={`${activeButton === 'reports' ? "active" : "MobileSideButton"}`}>
        //             Reports
        //         </button>
        //     </Link>
        // </div>
    )
}

export default Footer;

