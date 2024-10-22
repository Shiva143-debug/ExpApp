import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Slidebar from "./Slidebar";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';


function Source({ id, isdark, selectedSource, close }) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {id, source: sourceName, amount, date: salaryDate}
        const updateSourceData = { user_id: id, source: sourceName, amount, date: salaryDate }

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
        if (isEditMode) {
            axios.put(`https://exciting-spice-armadillo.glitch.me/updateSource/${editSourceId}`, updateSourceData)
                .then((res) => {
                    if (toast.current) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'updated Source of Income' });
                    }
                    // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
                    popClose()
                })
                .catch((err) => {
                    console.log(err);
                    if (toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating source of income' });
                    }
                    // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating product' });
                });
        }
        else {

            axios.post("https://exciting-spice-armadillo.glitch.me/addSource", values)
                .then(res => {
                    console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Source of Income added successfully' });
                    document.getElementById("myForm").reset();
                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add Source of Income' });
                });
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
                        <div style={{ width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "whitesmoke", color: isdark ? "white" : "", top: 100, fontFamily: "Arial, sans-serif" }} className="d-flex flex-column justify-content-center align-items-center vh-100">
                            <Toast ref={toast} />
                            <center><h1 style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? "18px" : "28px", marginTop: isMobile ? "10px" : "120px" }}>{isEditMode ? "UPDATE" : "ADD"} THE <i style={{ color: "red" }}>SOURCE</i> OF INCOME</h1></center>
                            <form id="myForm" onSubmit={handleSubmit} className={isMobile ? "p-2 rounded mb-5 pt-5" : " rounded mb-5 p-5"} style={{ width: isMobile ? "90%" : "60%", backgroundColor: isdark ? "black" : "white", boxShadow: isdark ? "0px 0px 10px white" : "5px 5px 10px rgba(0, 0, 0, 0.3)" }}>
                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '16px' : '20px' }}>Source Name:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="text" placeholder="Enter source Name" value={sourceName} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}
                                            onChange={handleSourceNameChange} />
                                    </div>
                                </div>
                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '16px' : '20px' }}>Amount:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="number" placeholder="Enter cost" value={amount} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={handleAmountChange} />
                                    </div>
                                </div>

                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '16px' : '20px' }}>Date:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="date" placeholder="Enter purchase Date" value={salaryDate} className={`form-control ${isdark ? 'dark-mode-input' : 'light-mode-input'}`} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={onChangeSalaryDate} />
                                    </div>
                                </div>

                                <div className="mb-5 mt-2 d-flex justify-content-between mx-5">
                                    {!isEditMode && <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Back</button>}
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
