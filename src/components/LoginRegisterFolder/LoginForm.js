import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { authService } from '../../api/apiService';
import './AuthStyles.css';

const LoginForm = ({ setUserId }) => {
    const [loginFormErrors, setLoginFormErrors] = useState({});
    const [loginformData, setLoginFormData] = useState({ loginEmail: '', password: '' });
    const [touchedFields, setTouchedFields] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                setTouchedFields({});
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
        <div className="auth-wrapper">
            <Toast ref={toast} />
            
            {/* Background Animation */}
            <div className="auth-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                </div>
            </div>

            <div className="auth-container">
                <div className="auth-card modern-card">
                    {/* Left Side - Branding */}
                    <div className="auth-brand-section">
                        <div className="brand-content">
                            <div className="brand-logo">
                                <div className="logo-circle">
                                    <i className="fas fa-rocket"></i>
                                </div>
                            </div>
                            <h2 className="brand-title">Welcome Back!</h2>
                            <p className="brand-subtitle">
                                Sign in to continue your journey with us. We're excited to have you back!
                            </p>
                            <div className="brand-features">
                                <div className="feature-item">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Secure & Protected</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-bolt"></i>
                                    <span>Lightning Fast</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-heart"></i>
                                    <span>Made with Love</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="auth-form-section px-5">
                       
                            <div className="form-header">
                                {/* <img  src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424699/Screenshot_2024-07-31_164744_ii2feo.png"  className="form-logo"  alt="logo" /> */}
                                <h1 className="form-title">Sign In</h1>
                                <p className="form-subtitle">
                                    Don't have an account? 
                                    <span onClick={signupclick} className="auth-link">
                                        Create one here
                                    </span>
                                </p>
                            </div>

                            <form onSubmit={handleLoginFormSubmit} className="auth-form">
                                <div className="input-group">
                                    <label className="input-label"> Email Address<span className="required">*</span></label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-envelope input-icon"></i>
                                        <input  type="email"  name="loginEmail"  placeholder="Enter your email" value={loginformData.loginEmail} onChange={handleChangelogin}  onBlur={handleBlur}  className={`modern-input ${touchedFields.loginEmail && loginFormErrors.loginEmail ? 'error' : ''}`}/>
                                    </div>
                                    {touchedFields.loginEmail && loginFormErrors.loginEmail && (
                                        <div className="error-message">
                                            <i className="fas fa-exclamation-circle"></i>
                                            {loginFormErrors.loginEmail}
                                        </div>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label"> Password <span className="required">*</span></label>
                                    <div className="input-wrapper">
                                        <i className="fas fa-lock input-icon"></i>
                                        <input  type={showPassword ? "text" : "password"} name="password"  placeholder="Enter your password" value={loginformData.password} onChange={handleChangelogin}  onBlur={handleBlur}  className={`modern-input ${touchedFields.password && loginFormErrors.password ? 'error' : ''}`}/>
                                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    {touchedFields.password && loginFormErrors.password && (
                                        <div className="error-message">
                                            <i className="fas fa-exclamation-circle"></i>
                                            {loginFormErrors.password}
                                        </div>
                                    )}
                                </div>

                                {/* <div className="form-options">
                                    <label className="checkbox-container">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                        Remember me
                                    </label>
                                    <a href="#" className="forgot-password">Forgot Password?</a>
                                </div> */}

                                <button  type="submit"  className={`modern-button ${loading ? 'loading' : ''}`} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="button-spinner"></div>
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </>
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

