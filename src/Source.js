import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Slidebar from "./Slidebar";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';


function Source({ id ,isdark}) {
    const [salaryDate, setSelectedDate] = useState("");  
    const [sourceName, setSourceName] = useState("");
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();
    const toast = useRef(null);


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

        const values = {
            id,source:sourceName, amount, date:salaryDate
        }

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

    const onBack = () => {
        navigate("/dashBoard");
    }
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <>
            <div className="d-flex flex-column">

                <div>
                    <div class="d-flex">
                        {!isMobile && (
                            <div style={{ width: "15%" }}>
                                <Slidebar isdark={isdark}/>
                            </div>
                        )}
                        <div style={{ width: isMobile ? "100%" : "85%", backgroundColor:isdark?"black": "whitesmoke", color:isdark?"white": "", top: 100,fontFamily: "Arial, sans-serif" }} className="d-flex flex-column justify-content-center align-items-center vh-100">
                            <Toast ref={toast} />
                            <center><h1 style={{ color:isdark?"white": "navy" ,fontSize:isMobile?"18px":"28px"}}>ADD THE <i style={{ color: "red" }}>SOURCE</i> OF INCOME</h1></center>
                            <form id="myForm" onSubmit={handleSubmit} className={isMobile ? "p-2 rounded mb-5 pt-5" : " rounded mb-5 p-5"} style={{ width: isMobile ? "90%" : "60%", height: "60vh",backgroundColor:isdark?"#555555":"white" }}>


                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{color:isdark?"white": "navy", fontSize: isMobile ? '16px' : '20px' }}>Source Name:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="text" placeholder="Enter source Name" className="form-control"
                                            onChange={handleSourceNameChange} />
                                    </div>
                                </div>
                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '16px' : '20px' }}>Amount:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="number" placeholder="Enter cost" className="form-control"
                                            onChange={handleAmountChange} />
                                    </div>
                                </div>

                                <div className="mb-5 row">
                                    <div class="col-5">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '16px' : '20px' }}>Date:</label>
                                    </div>
                                    <div class="col-6">
                                        <input type="date" placeholder="Enter purchase Date" className="form-control"
                                            onChange={onChangeSalaryDate} />
                                    </div>
                                </div>
                    

                                <div className="mb-5 mt-5 d-flex justify-content-between mx-5">
                                    <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Back</button>
                                    <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>ADD</button>
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
