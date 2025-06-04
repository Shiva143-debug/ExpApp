
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import ImageContainer from '../Micilinious/ImageContainer';
import { authService } from '../../api/apiService';

const SignUpForm = () => {

    const [formData, setFormData] = useState({ full_name: '', email: '', mobile_no: '', address: '' });
    const [formErrors, setFormErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [loading, setLoading] = useState(false);
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
        // if (!formData.user_password) errors.user_password = 'Password is required';
        if (!formData.mobile_no) errors.mobile_no = 'Phone number is required';
        if (formData.mobile_no.length > 10) errors.mobile_no = 'Phone number must be 10 digits only';
        if (!formData.address) errors.address = 'address is required';
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
                setFormData({ full_name: '', email: '', user_password: '', mobile_no: '', address: '' })
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
        navigate("/login")
    };

    useEffect(() => {
        validateForm();
    }, [formData]);


    return (
        <div className="container-fluid">
            <Toast ref={toast} />
            <div className="auth-container">
                <div className="auth-card">
                    <ImageContainer />
                    <div className="login-section">

                        <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1722424699/Screenshot_2024-07-31_164744_ii2feo.png" className="logo" alt="logo" />
                        <h1 className='sl-heading'>Sign Up</h1>
                        <p>Already have an account? <span onClick={signinclick} style={{ color: "blue" }}>Sign In</span></p>
                        <form onSubmit={handleFormSubmit}>
                            <label>FullName<span style={{color:"red"}}>*</span></label>
                            <input type="text" name="full_name" placeholder="FullName" onChange={handleChange} onBlur={handleBlur} className='mb-2' />
                            {touchedFields.full_name && formErrors.full_name && <p className="error">{formErrors.full_name}</p>}
                            <label>Email address<span style={{color:"red"}}>*</span></label>
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} onBlur={handleBlur} className='mb-2' />
                            {touchedFields.email && formErrors.email && <p className="error">{formErrors.email}</p>}

                            <label>Phone<span style={{color:"red"}}>*</span></label>
                            <input type="number" name="mobile_no" placeholder="mobile number" onChange={handleChange} onBlur={handleBlur} className='mb-2' />
                            {touchedFields.mobile_no && formErrors.mobile_no && <p className="error">{formErrors.mobile_no}</p>}

                            <label>Address<span style={{color:"red"}}>*</span></label>
                            <input type="address" name="address" placeholder="Address" onChange={handleChange} onBlur={handleBlur} className='mb-2' />
                            {touchedFields.address && formErrors.address && <p className="error">{formErrors.address}</p>}
                            <label>
                                <input type="checkbox" /> I agree to the <span>Terms of Service</span> and <span>privacy policy</span>
                            </label>
                            {/* <button type="submit" className='mt-2'>Create your free account</button> */}
                            <button type="submit" className='mt-2 l-r-button' disabled={loading} >
                                {loading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    "Create your free account"
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