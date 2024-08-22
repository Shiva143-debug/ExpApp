import React, { useRef } from 'react';
import { IoIosSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import './App.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoMdExit } from "react-icons/io";
import "./index.css"
import "./MobileSlidebar.css"
import ImageUtils from './ImageUtils';
import axios from 'axios';


function Header({ id,isdark, toggleTheme }) {
    console.log(id)
    // const [isdark, setDark] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('white');
    const navigate = useNavigate();
    const toast = useRef(null);

    const [image, setImage] = useState("https://res.cloudinary.com/dxgbxchqm/image/upload/v1705489701/Screenshot_2024-01-17_163735_e4hqkc.png")


    const toggletheme = () => {
        toggleTheme();
        setBackgroundColor(isdark ? 'white' : '#242424');
      };

    // const toggletheme = () => {
    //     setDark(!isdark)
    //     setBackgroundColor(isdark ? 'white' : 'gray');
      
    // }

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


    // const handleImageChange = (e) => {
    //     let img = e.target.files[0]
    //     // console.log(img)

    //     var urlCreator = window.URL || window.webkitURL;
    //     var imageUrl = urlCreator.createObjectURL(img);

    //     // console.log(imageUrl)

    //     setImage(imageUrl);

    //     const values = {
    //         profile_picture_url:imageUrl, id
    //     }

    //     // console.log(values)
    //     axios.post('https://exciting-spice-armadillo.glitch.me/uploadProfilePicture', values)
    //         .then((response) => {
    //             console.log('Profile picture uploaded successfully');
    //         })
    //         .catch((error) => {
    //             console.error('Error uploading profile picture:', error);
    //         });

    // };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            ImageUtils.convertImage(e.target.files[0]).then(function (base64) {
                // console.log(base64);
                // setProfilePictureUrl(base64);
                setImage(base64);

                const values = {
                    profile_picture_url:base64,
                    id: id // Assuming id is defined somewhere in your component
                };

                console.log(values)

                axios.post('https://exciting-spice-armadillo.glitch.me/uploadProfilePicture', values)
                    .then((response) => {
                        console.log('Profile picture uploaded successfully');
                    })
                    .catch((error) => {
                        console.error('Error uploading profile picture:', error);
                    });
            });
        }
    };



    useEffect(() => {
        fetch(`https://exciting-spice-armadillo.glitch.me/getPhoto/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0 && data[0].profile_picture_url) {
                    setImage(data[0].profile_picture_url);
                }
            })
            .catch(err => console.log(err));
    }, [id, image]);




    const isMobile = useMediaQuery('(max-width:768px)');


    return (
        <div className="d-flex justify-content-between" style={{ position: "fixed", width: "100vw", backgroundColor: backgroundColor,color:isdark?"white":"black", zIndex: 100, padding: "10px", boxShadow:isdark? '0 2px 4px white':  '0 2px 4px rgba(0, 0, 0, 0.1)',}}>
            <Toast ref={toast} />

            <ConfirmPopup style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          <div class="d-flex ">
            <img src="images/companyName.webp" alt="comapanyImage" style={{ width:isMobile?"40px": "50px" }} />
           {!isMobile && <h1>Expenditure</h1>}

            </div>
            <div className="d-flex">


                {isdark === false ? (<IoMoon size={isMobile?30:50} className="icon mt-2" onClick={(e) => toggletheme()} />) : (<IoIosSunny className="icon mt-2" size={isMobile?30:50} onClick={(e) => toggletheme()} />)}

                <div>
                    <input
                        type="file"
                        accept="image/*"
                        id="profile-pic"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <label htmlFor="profile-pic">

                        <img
                            src={image || 'https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png'}
                            alt="profile"
                            className="profile"
                            style={{ width:isMobile?'30px':'50px', height:isMobile?"30px": "50px", borderRadius: "50%", marginTop: "5px", marginLeft: '10px', cursor: 'pointer' }}
                        />
                    </label>
                </div>
                {!isMobile &&
                    <button onClick={confirm1} type="button" className="logout-button" style={{ marginTop: "10px", height: "50px" ,marginRight:"20px"}}>Logout</button>
                }
                {isMobile && <IoMdExit size={30} style={{ margin: "5px 10px" }} onClick={confirm1} />}


            </div>

        </div>
    )
}

export default Header
