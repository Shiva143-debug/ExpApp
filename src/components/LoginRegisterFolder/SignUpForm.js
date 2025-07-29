
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { authService } from '../../api/apiService';
import './AuthStyles.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', mobile_no: '', address: '' });
    const [formErrors, setFormErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields({ ...touchedFields, [name]: true });
        validateForm();
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.full_name) errors.full_name = 'Full name is required';
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.mobile_no) errors.mobile_no = 'Phone number is required';
        else if (formData.mobile_no.length !== 10) { errors.mobile_no = 'Phone number must be exactly 10 digits';} 
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const values = {
            full_name: formData.full_name,
            email: formData.email,
            mobile_no: formData.mobile_no,
            address: formData.address,
        };

        if (validateForm()) {
            setLoading(true);
            try {
                await authService.register(values);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration completed successfully' });
                setFormData({ full_name: '', email: '', mobile_no: '', address: '' });
                setTouchedFields({});
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
                setLoading(false);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email already exists. Please use a different email address.' });
                setLoading(false);
            }
        }
    };

    const signinclick = () => {
        navigate("/login");
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

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
                    <div className="auth-brand-section signup-brand">
                        <div className="brand-content">
                            <div className="brand-logo">
                                <div className="logo-circle">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                            </div>
                            <h2 className="brand-title">Join Our Community!</h2>
                            <p className="brand-subtitle">
                                Create your account and become part of something amazing. Your journey starts here!
                            </p>
                            <div className="brand-features">
                                <div className="feature-item">
                                    <i className="fas fa-users"></i>
                                    <span>Join 10k+ Users</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-gift"></i>
                                    <span>Free Forever</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-clock"></i>
                                    <span>Setup in Minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className="auth-form-section px-5">
                        <div className="form-header">
                            {/* <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424699/Screenshot_2024-07-31_164744_ii2feo.png" className="form-logo"  alt="logo"/> */}
                            <h1 className="form-title">Create Account</h1>
                            <p className="form-subtitle">
                                Already have an account?
                                <span onClick={signinclick} className="auth-link">
                                    Sign in here
                                </span>
                            </p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="auth-form">
                            <div className="input-group">
                                <label className="input-label">Full Name<span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <i className="fas fa-user input-icon"></i>
                                    <input type="text" name="full_name" placeholder="Enter your full name" value={formData.full_name} onChange={handleChange} onBlur={handleBlur} className={`modern-input ${touchedFields.full_name && formErrors.full_name ? 'error' : ''}`}/>
                                </div>
                                {touchedFields.full_name && formErrors.full_name && (
                                    <div className="error-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {formErrors.full_name}
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address<span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <i className="fas fa-envelope input-icon"></i>
                                    <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`modern-input ${touchedFields.email && formErrors.email ? 'error' : ''}`}/>
                                </div>
                                {touchedFields.email && formErrors.email && (
                                    <div className="error-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {formErrors.email}
                                    </div>
                                )}
                            </div>

                          <div className="input-group">
    <label className="input-label">
        Phone Number<span className="required">*</span>
    </label>
    <div className="input-wrapper">
        <i className="fas fa-phone input-icon"></i>
        <input
            type="tel"
            name="mobile_no"
            placeholder="Enter your phone number"
            value={formData.mobile_no}
            onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleChange({ target: { name: 'mobile_no', value } });
            }}
            onBlur={handleBlur}
            className={`modern-input ${
                touchedFields.mobile_no && formErrors.mobile_no ? 'error' : ''
            }`}
        />
    </div>
    {touchedFields.mobile_no && formErrors.mobile_no && (
        <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {formErrors.mobile_no}
        </div>
    )}
</div>


                            <div className="input-group">
                                <label className="input-label">Address<span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <i className="fas fa-map-marker-alt input-icon"></i>
                                    <input type="text" name="address" placeholder="Enter your address(Optional)" value={formData.address} onChange={handleChange} className={`modern-input ${touchedFields.address && formErrors.address ? 'error' : ''}`}/>
                                </div>
                            </div>


                            <button type="submit" className={`modern-button ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
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

export default SignUpForm;