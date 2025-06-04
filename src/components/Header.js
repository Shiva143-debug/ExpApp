import React, { useRef } from 'react';
import { IoIosSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoMdExit } from "react-icons/io";
import { Toast } from 'primereact/toast';

import ImageUtils from '../ImageUtils';
import axios from 'axios';
import { use } from 'react';
import { authService } from '../api/apiService';


function Header({ id, isdark, toggleTheme }) {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [image, setImage] = useState("https://res.cloudinary.com/dxgbxchqm/image/upload/v1705489701/Screenshot_2024-01-17_163735_e4hqkc.png")

    const toggletheme = () => {
        toggleTheme();
        // setBackgroundColor(isdark ? 'white' : '#242424');
    };

    const accept = () => {
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'You have LoggedOut successflly', life: 3000 });
        setTimeout(() => {
            navigate("/");
        }, 1000)

    };

    const reject = () => {
        toast.current.show({ severity: 'success', summary: 'Rejected', detail: 'You have not Logout', life: 3000 });
    };

    const confirm1 = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to Logout?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            baseZIndex: 1000,
            className: 'custom-confirm-dialog',
            accept,
            reject
        });
    };

    const handleImageChange =  (e) => {
        if (e.target.files && e.target.files[0]) {
            ImageUtils.convertImage(e.target.files[0]).then(function (base64) {
                setImage(base64);
                const values = {
                    profile_picture_url: base64,
                    id: id
                };
                try {
                    authService.uploadProfilePicture(values);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile picture uploaded successfully' });
                     getProfileImage();
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error uploading profile picture' });
                }
            });
        }
    };

    useEffect(() => {
        getProfileImage();
    }, [id, image])

    const getProfileImage = async () => {
        try {
            const data = await authService.getProfilePicture(id);
            if (data && data.length > 0 && data[0].profile_picture_url) {
                setImage(data[0].profile_picture_url);
            }
        } catch (error) {
            console.log(error);
        }

    }


    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div className="d-flex justify-content-between" style={{ position: "fixed", width: "100vw", backgroundColor: isdark ? "#242424" : "white", color: isdark ? "white" : "black", zIndex: 100, padding: "10px", boxShadow: isdark ? '0 2px 4px white' : '0 2px 4px rgba(0, 0, 0, 0.1)', }}>
            <Toast ref={toast} />
            <ConfirmPopup style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div class="d-flex ">
                {/* <img src="images/companyName.webp" alt="comapanyImage" style={{ width:isMobile?"40px": "50px" }} /> */}
                <h2>Expenditure</h2>
            </div>
            <div className="d-flex">
                {isdark === false ? (<IoMoon size={isMobile ? 30 : 50} className="icon mt-2" onClick={(e) => toggletheme()} />) : (<IoIosSunny className="icon mt-2" size={isMobile ? 30 : 50} onClick={(e) => toggletheme()} />)}
                <div>
                    <input type="file" accept="image/*" id="profile-pic" style={{ display: 'none' }} onChange={handleImageChange} />
                    <label htmlFor="profile-pic">
                        <img src={image || 'https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png'} alt="profile" className="profile" style={{ width: isMobile ? '30px' : '50px', height: isMobile ? "30px" : "50px", borderRadius: "50%", marginTop: "5px", marginLeft: '10px', cursor: 'pointer' }} />
                    </label>
                </div>
                {!isMobile &&
                    <button onClick={confirm1} type="button" className="logout-button" style={{ marginTop: "10px", height: "50px", marginRight: "20px" }}>Logout</button>
                }
                {isMobile && <IoMdExit size={30} style={{ margin: "5px 10px" }} onClick={confirm1} />}
            </div>
        </div>
    )
}

export default Header
