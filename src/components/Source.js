import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slidebar from "./Micilinious/Slidebar";
import { sourceService } from '../api/apiService';
import "../App.css"
import { useAuth } from "../context/AuthContext";


function Source({  selectedSource, close }) {
    const { userId, isdark } = useAuth();
    const [salaryDate, setSelectedDate] = useState("");
    const [sourceName, setSourceName] = useState("");
    const [amount, setAmount] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editSourceId, setEditSourceId] = useState(null);
    const navigate = useNavigate();
    const toast = useRef(null);


    useEffect(() => {
        if (selectedSource) {
            setSourceName(selectedSource.source);
            setAmount(selectedSource.amount);
            setSelectedDate(selectedSource.date);
            setIsEditMode(true);
            setEditSourceId(selectedSource.id);
        }
    }, [selectedSource]);

    const onChangeSalaryDate = (event) => {
        setSelectedDate(event.target.value)
    }

    const handleSourceNameChange = (event) => {
        setSourceName(event.target.value)
    }

    const handleAmountChange = (event) => {
        setAmount(event.target.value)
    }

    const onClear = () => {
        setSourceName("");
        setAmount("");
        setSelectedDate("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = { userId, source: sourceName, amount, date: salaryDate }
        const updateSourceData = { user_id: userId, source: sourceName, amount, date: salaryDate }

        if (!values.source) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter sourceName' });
            return;
        }
        else if (!values.amount) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter amount' });
            return;
        }

        else if (!values.date) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter salaryDate' });
            return;
        }

        try {
            if (isEditMode) {
                await sourceService.updateSource(editSourceId, updateSourceData);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Updated Source of Income successfully' });
                }
                popClose();
            } else {
                await sourceService.addSource(values);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Source of Income added successfully' });

                // Reset form
                onClear();
            }
        } catch (error) {
            console.error('Error handling source data:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while processing your request' });
        }

    }

    const popClose = () => {
        setTimeout(() => { close(); }, 300);
    };

    const onBack = () => {
        navigate("/dashBoard");
    }

    const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <>
            <div className="d-flex flex-column">
                <div>
                    <div class="d-flex">
                        {!isMobile && !isEditMode && (
                            <div style={{ width: "15%" }}>
                                <Slidebar isdark={isdark} />
                            </div>
                        )}
                        <div style={{ width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "whitesmoke", color: isdark ? "white" : "", top: 100, fontFamily: "Arial, sans-serif", marginTop: isEditMode ? "-150px" : "" }} className="d-flex flex-column justify-content-center align-items-center vh-100">
                            <Toast ref={toast} />
                            <center><h1 style={{ color: isdark ? "white" : "black", fontSize: isMobile ? "18px" : "28px", marginTop: isMobile ? "10px" : "120px" }}>{isEditMode ? "UPDATE" : "ADD"} THE <i style={{ color: "red" }}>SOURCE</i> OF INCOME</h1></center>
                            <form id="myForm" onSubmit={handleSubmit} className={isMobile ? "p-2 rounded pt-5" : " rounded mb-5 p-5"} style={{ width: isMobile ? "90%" : "60%", backgroundColor: isdark ? "black" : "white", boxShadow: isdark ? "0px 0px 10px white" : "5px 5px 10px rgba(0, 0, 0, 0.3)", marginBottom: isEditMode ? "-150px" : "" }}>
                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '16px' : '20px' }}>Source Name<span style={{ color: "red" }}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div class="col-6">
                                        <input type="text" placeholder="Enter source Name" value={sourceName} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}
                                            onChange={handleSourceNameChange} />
                                    </div>
                                </div>
                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '16px' : '20px' }}>Amount<span style={{ color: "red" }}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div class="col-6">
                                        <input type="number" placeholder="Enter cost" value={amount} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={handleAmountChange} />
                                    </div>
                                </div>

                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '16px' : '20px' }}>Date<span style={{ color: "red" }}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div class="col-6">
                                        <input type="date" placeholder="Enter purchase Date" value={salaryDate} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={onChangeSalaryDate} />
                                    </div>
                                </div>

                                <div className="mb-5 mt-2 d-flex justify-content-between mx-5">
                                    {!isEditMode && <button onClick={onClear} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Clear</button>}
                                    <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>{isEditMode ? "UPDATE" : "ADD"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Source
