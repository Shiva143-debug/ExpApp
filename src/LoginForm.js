import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageContainer from './ImageContainer';
import { Toast } from 'primereact/toast';
import './App.css';

const LoginForm = ({ setUserId }) => {

    const [loginFormErrors, setLoginFormErrors] = useState({});
    const [loginformData, setLoginFormData] = useState({ loginEmail: '', password: '' });
    const [touchedFields, setTouchedFields] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleChangelogin = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginformData, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields({ ...touchedFields, [name]: true });
        validateLoginForm();
    };

    const validateLoginForm = () => {
        const errors = {};
        if (!loginformData.loginEmail) {
            errors.loginEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginformData.loginEmail)) {
            errors.loginEmail = 'Email is invalid';
        }
        if (!loginformData.password) errors.password = 'Password is required';
        setLoginFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLoginFormSubmit = (e) => {
        e.preventDefault();
        if (validateLoginForm()) {
            setLoading(true);
            axios.post("https://exciting-spice-armadillo.glitch.me/login", loginformData)
                .then(res => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
                    // setLoginFormData({ loginEmail: '', password: '' }); 
                    setTimeout(() => {
                        navigate("/dashBoard");
                        setUserId(res.data.result.id);
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
                })
            .finally(() => setLoading(false));
        }
    };

    const signupclick = () => {
        navigate("/")
    };

    useEffect(() => {
        validateLoginForm();
    }, [loginformData]);


    return (
     
        <div className="container">
            <Toast ref={toast} />
            <ImageContainer />
            <div className='form-section'>
                <div className='form-border'>
                    <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424699/Screenshot_2024-07-31_164744_ii2feo.png" className="logo" alt="logo" />
                    <h1 className='sl-heading'>Log In</h1>
                    <p>Don't have an account? <span onClick={signupclick}>Sign Up</span></p>
                    <div>
                        <form onSubmit={handleLoginFormSubmit}>
                            <label>Email address*</label>
                            <input type="loginEmail" name="loginEmail" placeholder="Email" onChange={handleChangelogin} onBlur={handleBlur} className='mb-2'/>
                            {touchedFields.loginEmail && loginFormErrors.loginEmail && <p className="error">{loginFormErrors.loginEmail}</p>}
                            <label>Password*</label>
                            <input type="password" name="password" placeholder="Password" onChange={handleChangelogin} onBlur={handleBlur} className='mb-2'/>
                            {touchedFields.password && loginFormErrors.password && <p className="error">{loginFormErrors.password}</p>}
                         
                            {/* <button type="submit" className='mt-2'>Log In</button> */}
                        
                            <button type="submit" className='mt-2' disabled={loading}>
                                {loading ? (
                                    <div className="spinner"></div> 
                                ) : (
                                    "Log In"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginForm;