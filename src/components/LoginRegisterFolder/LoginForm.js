import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { authService } from '../../api/apiService';
import ImageContainer from '../Micilinious/ImageContainer';

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

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        if (validateLoginForm()) {
            setLoading(true);
            try {
                const data = await authService.login(loginformData);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successfully' });
                setLoginFormData({ loginEmail: '', password: '' });
                setTimeout(() => {
                    setUserId(data.result.id);
                    navigate("/dashBoard");
                }, 1000);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
            } finally {
                setLoading(false);
            }
        }
    };

    const signupclick = () => {
        navigate("/");
    };

    useEffect(() => {
        validateLoginForm();
    }, [loginformData]);

    return (
        <div className="container-fluid">
            <Toast ref={toast} />

            <div className="auth-container">
                <div className="auth-card">
                    <ImageContainer />
                    <div className="login-section">
                            <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424699/Screenshot_2024-07-31_164744_ii2feo.png" className="logo img-fluid mb-3" alt="logo" />
                            <h1 className='sl-heading'>Log In</h1>
                            <p>Don't have an account? <span onClick={signupclick} style={{ color: "blue", cursor: "pointer" }}>Sign Up</span></p>
                        <form onSubmit={handleLoginFormSubmit}>
                            <label>Email<span style={{color:"red"}}>*</span></label>
                            <input type="email" name="loginEmail" placeholder="Email" onChange={handleChangelogin} onBlur={handleBlur} className='form-control mb-2' />
                            {touchedFields.loginEmail && loginFormErrors.loginEmail && <p className="text-danger">{loginFormErrors.loginEmail}</p>}

                            <label>Password<span style={{color:"red"}}>*</span></label>
                            <input type="password" name="password" placeholder="Password" onChange={handleChangelogin} onBlur={handleBlur} className='form-control mb-2' />
                            {touchedFields.password && loginFormErrors.password && <p className="text-danger">{loginFormErrors.password}</p>}

                            <button type="submit" className='btn btn-primary w-100 mt-2' disabled={loading}>
                                {loading ? <div className="spinner-border spinner-border-sm"></div> : "Log In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

