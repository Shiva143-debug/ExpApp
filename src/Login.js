import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css';
 
function Login({ setUserId }) {
    const [registerClicked, setRegisterClick] = useState(true)
    const [loginClicked, setLoginClick] = useState(false)
    const [FullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobileNo, setmobileNumber] = useState("")
    const [address, setAddress] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showForget, setShowForget] = useState(false)
    const [updatedpassword, setUpdatedPassword] = useState("")
    const [updatedConfirmpassword, setUpdatedConfirmPassword] = useState("")
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);


    const onRegisterClick = () => {
        setRegisterClick(true)
        setLoginClick(false)

    }

    const onLoginClick = () => {
        setLoginClick(true)
        setRegisterClick(false)
    }

    const handleFormSubmit = (e) => {

        e.preventDefault();
        const values = {
            full_name: FullName, email, mobile_no: mobileNo, address
        }

        if (!values.full_name) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter FullName' });
            return;
        }
        else if (!values.email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter email' });
            return;
        }

        else if (!values.mobile_no) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter mobileNo' });
            return;
        }
        else if (!values.address) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter address' });
            return;
        }
        else {
            setLoading(true);
            axios.post("https://exciting-spice-armadillo.glitch.me//register", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Account Created successfully' });
                    setFullName("")
                    setEmail("")
                    setmobileNumber("")
                    setAddress("")
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email already exists. Please use a different email address.' });
                })
                .finally(() => setLoading(false));
        }

    }


    const handleLoginFormSubmit = (e) => {

        e.preventDefault();
        const values = {
            loginEmail, password
        }
        if (!values.loginEmail) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter valid Email' });
            return;
        }
        else if (!values.password) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter password' });
            return;
        }
        else {
            setLoading(true);
            axios.post("https://exciting-spice-armadillo.glitch.me/login", values)
                .then(res => {


                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
                    setLoginEmail("")
                    setPassword("")
                    setTimeout(() => {
                        navigate("/dashBoard");
                        setUserId(res.data.result.id);
                    }, 1000)



                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
                })
                .finally(() => setLoading(false));

        }

    }

    const isMobile = useMediaQuery('(max-width:768px)');

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleForgotLinkClick = () => {
        setShowForget(true)
    }


    const handleResetFormSubmit = (e) => {
        e.preventDefault();
        // Check if passwords match before submitting form

        setPasswordsMatch(true)
        const values = {
            email, updatedpassword, updatedConfirmpassword
        }

        if (!values.email) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter Email' });
            return;
        }
        else if (!values.updatedpassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter New password' });
            return;
        }

        else if (!values.updatedConfirmpassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter confirm password' });
            return;
        } else if (values.updatedpassword !== values.updatedConfirmpassword) {
            setPasswordsMatch(false);
            return;
        } else {
            setLoading(true);
            axios.put("https://exciting-spice-armadillo.glitch.me/updateUserPassword", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'password updated successfully' });
                    setEmail("")
                    setUpdatedPassword("")
                    setUpdatedConfirmPassword("")
                    setPasswordsMatch(true)

                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please Enter Valid Email' });
                    setEmail("")
                    setUpdatedPassword("")
                    setUpdatedConfirmPassword("")
                    setPasswordsMatch(true)
                }).finally(() => setLoading(false));
        }

        setTimeout(() => {
            setShowForget(false)
        }, 2000)
    }


    const onCancel = () => {
        setShowForget(false)
    }


    return (
        <div className={isMobile ? "mobile-login-form-container" : 'login-form-container'} >
            <Toast ref={toast} />

            <img
                src="images\login.jpg"
                className="login-img"
                alt="website login"
            />

            {!showForget &&

                <div className={isMobile ? "mobile-form-container" : 'form-container'}>

                    <div className='d-flex' style={{ width: "100%" }}>
                        <button onClick={onRegisterClick} style={{ backgroundColor: registerClicked ? "gray" : "white", color: registerClicked ? "white" : "", border: "1px solid whitesmoke", width: "100%", padding: "5px" }}>Register</button>
                        <button onClick={onLoginClick} style={{ backgroundColor: loginClicked ? "gray" : "white", color: loginClicked ? "white" : "", border: "1px solid whitesmoke", width: "100%", padding: "5px" }}>Login</button>
                    </div>
                    {registerClicked &&
                        <form id="register" onSubmit={handleFormSubmit}>
                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>FullName:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="text"
                                        placeholder="FullName"
                                        value={FullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Email:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Mobile Number:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="number"
                                        placeholder="Enter Mobile Number"
                                        value={mobileNo}
                                        onChange={(e) => setmobileNumber(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Address:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="text"
                                        placeholder="Enter Adress"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>
                            <div className='button-container'>
                                
                                {loading ? (
                                    <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="login-button">
                                        Register
                                    </button>
                                )}
                            </div>
                        </form>
                    }

                    {loginClicked &&
                        <form id="login" onSubmit={handleLoginFormSubmit}>
                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Email:</label>
                                </div>
                                <div class="col-6">
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        style={{ height: "30px" }}
                                        className="form-control mx-3"
                                    />
                                </div>

                            </div>

                            <div className='row pt-5'>
                                <div class="col-5">
                                    <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Password:</label>
                                </div>
                                <div class="col-6">


                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ height: '30px', marginRight: '8px', flex: 1 }}
                                            className="form-control mx-3"
                                        />
                                        {showPassword ? (
                                            <FaEyeSlash onClick={handleTogglePasswordVisibility} style={{ cursor: 'pointer' }} />
                                        ) : (
                                            <FaEye onClick={handleTogglePasswordVisibility} style={{ cursor: 'pointer' }} />
                                        )}
                                    </div>

                                    <button class="mt-3" style={{ float: 'right', border: "none", color: "blue", backgroundColor: "transparent" }} onClick={handleForgotLinkClick}>Forgot Password?</button>

                                </div>

                            </div>

                            <div className='button-container'>
                              
                                {loading ? (
                                    <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="login-button">
                                        Login
                                    </button>
                                )}
                            </div>

                        </form>
                    }

                </div>
            }

            {showForget &&
                <div className={isMobile ? "mobile-form-container" : 'form-container'}>
                    <h1 class="pt-5" style={{ textAlign: "center", fontWeight: "bold" }}>Update Password</h1>
                    <form id="forget" onSubmit={handleResetFormSubmit}>
                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Email:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>New Password:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Enter password"
                                    value={updatedpassword}
                                    onChange={(e) => setUpdatedPassword(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        <div className='row pt-5'>
                            <div class="col-5">
                                <label htmlFor="" className="px-2 fw-bold" style={{ color: "navy", fontSize: isMobile ? "14px" : '20px' }}>Confirm Password:</label>
                            </div>
                            <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Enter password"
                                    value={updatedConfirmpassword}
                                    onChange={(e) => setUpdatedConfirmPassword(e.target.value)}
                                    style={{ height: "30px" }}
                                    className="form-control mx-3"
                                />
                            </div>

                        </div>

                        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match. Please try again.</p>}



                        <div className='button-container mt-5 mb-5' style={{ display: "flex", justifyContent: "space-around" }}>
                            <button onClick={onCancel} className={`btn btn-dark ${isMobile ? "btn-sm" : "btn-lg"}`}>Cancel</button>
                            {loading ? (
                                    <div className="spinner-border text-primary" role="status" style={{ backgroundColor: "blue", color: "white" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>
                                        Submit
                                    </button>
                                )}
                            {/* <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>Submit</button> */}
                        </div>

                    </form>
                </div>
            }
        </div>
    )
}

export default Login
