import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import Slidebar from "./Slidebar";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CiSquarePlus } from "react-icons/ci";
import Category from "./Category";
import { Dialog } from 'primereact/dialog';


function AddCategory({ id, isdark }) {
    const [values, setValues] = useState({
        category: "",
        product: "",
    })

    const [Data, setData] = useState([])
    const [selectedOption, setSelectedOption] = useState("select");
    const [loading, setLoading] = useState(false)
    const [showDialogue, setShowDialouge] = useState(false)
    const navigate = useNavigate();
    const toast = useRef(null);

    const productData = {
        id,
        category: selectedOption,
        product: values.product,
    };

    const handleSubmitProduct = (e) => {
        e.preventDefault();
        if (selectedOption === "select") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select category' });
            return;
        }
        else if (!values.product) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter product' });
            return;
        }
        axios.post("https://exciting-spice-armadillo.glitch.me/addproduct", productData)
            .then(res => {
                console.log(res);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
                setLoading(false)
                setSelectedOption("select")
                setValues({});

            })
            .catch(err => {
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: err });

            });

    };

    useEffect(() => {
        const userId = id;

        fetch(`https://exciting-spice-armadillo.glitch.me/categories/${userId}`)
            .then(res => res.json())
            .then(data => setData(data)
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }, [id])

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };

    const onBack = () => {
        navigate("/dashBoard");
    }
    const iconClick = () => {
        setShowDialouge(true)
    }

    const onHide = () => {
        setShowDialouge(false)
    }

    const updateData = (newCategory) => {
        setData(prevData => [...prevData, newCategory]);
      };

      const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <>
            <div className="d-flex flex-column">

                <div>
                    <div class="d-flex">
                        {!isMobile && (
                            <div style={{ width: "15%" }}>
                                <Slidebar isdark={isdark} />
                            </div>
                        )}
                        <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ width: isMobile ? "100%" : "85%" }}>

                            {loading && (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                                </div>
                            )}

                            {!loading && (
                                <div className="d-flex flex-column justify-content-center align-items-center rounded p-5" style={{ width: "100%", height: "100%", backgroundColor: isdark ? "black" : "whitesmoke", color: isdark ? "white" : "",fontFamily: "Arial, sans-serif" }}>
                                    <Toast ref={toast} />

                                    <h2 style={{ color: isdark ? "white" : "navy", marginTop: isMobile ? "10px" : "150px" }} className="pb-2">ADD CATEGORY</h2>

                                 

                                    <p>*To Add Itmes first you need to choose category if the category is not present in the below form</p>

                                    <form className={isMobile ? "p-3 rounded mb-5" : "rounded mb-5 p-5 mb-5"} style={{ width: isMobile ? "100%" : "60%", backgroundColor: isdark ? "transparent" : "white", marginBottom: "20px" ,boxShadow:isdark?"0px 0px 10px white": "5px 5px 10px rgba(0, 0, 0, 0.3)"}} onSubmit={handleSubmitProduct}>
                                        <div className="row">
                                            <div class="col-4 mb-5">
                                                <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>choose Category:</label>
                                            </div>

                                            <div class="col-6">
                                                <select id="id" class="form-control" value={selectedOption}
                                                    onChange={handleSelectChange} style={{ backgroundColor:isdark? "black":"white",color: isdark ? "white" : "black"}}>
                                                    <option value="select" style={{ backgroundColor:isdark? "black":"white",color: isdark ? "white" : "black"}}>Select Category</option>
                                   
                                                    {[...new Set(Data.map((d) => d.category))].map((category, index) => (
                                                        <option key={index} value={category} style={{ backgroundColor:isdark? "black":"white",color: isdark ? "white" : "black"}}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div class="col-1">
                                                <CiSquarePlus onClick={iconClick} />
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div class="col-4">
                                                <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Item/spent Name:</label>
                                            </div>

                                            <div class="col-7">
                                                <input type="text" placeholder="Enter Product/item Name" className="form-control" style={{ backgroundColor:isdark? "black":"white",color: isdark ? "white" : "black"}}
                                                    onChange={e => setValues({ ...values, product: e.target.value })} />
                                            </div>

                                        </div>

                                        <div className="d-flex justify-content-between mt-5">
                                            <div>
                                                <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Back</button>
                                            </div>
                                            <div>
                                                <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>ADD</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                            )}

                            <Dialog visible={showDialogue} style={{ width:isMobile? '90vw' :'50vw'}} onHide={onHide} >
                                <Category close={onHide}  id={id} isdark={isdark} updateData={updateData}/>
                            </Dialog>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddCategory
