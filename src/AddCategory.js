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

    // const uppercaseCategory = values.category ? values.category.toLocaleUpperCase() : '';

    // const categoryData = {
    //     id, category: uppercaseCategory,
    // };

    const productData = {
        id,
        category: selectedOption,
        product: values.product,
    };

    // const handleSubmitCategory = (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     if (!values.category) {
    //         toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter category' });
    //         setLoading(false);
    //         return;
    //     } else {
    //         axios.post("https://exciting-spice-armadillo.glitch.me/addshopcategory", categoryData)
    //             .then(res => {
    //                 console.log(res);
    //                 setData(prevData => [...prevData, categoryData]);
    //                 console.log(Data)
    //                 setValues({});
    //                 toast.current.show({ severity: 'success', summary: 'Success', detail: 'category added successfully' });

    //                 setValues({});

    //                 setLoading(false);

    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 setLoading(false);

    //             });
    //     }
    // };


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

    const isMobile = useMediaQuery('(max-width:768px)');

    const iconClick = () => {
        setShowDialouge(true)
    }

    const onHide = () => {
        setShowDialouge(false)
    }


    const updateData = (newCategory) => {
        setData(prevData => [...prevData, newCategory]);
      };


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
                                <div className="d-flex flex-column justify-content-center align-items-center rounded p-5" style={{ width: "100%", height: "100%", backgroundColor: isdark ? "black" : "whitesmoke", color: isdark ? "white" : "" }}>
                                    <Toast ref={toast} />

                                    <h2 style={{ color: isdark ? "white" : "navy", marginTop: isMobile ? "10px" : "150px" }} className="pb-2">ADD CATEGORY</h2>

                                    {/* <form className={isMobile ? "p-2  rounded mb-5" : " rounded mb-5 p-5"} style={{ width: isMobile ? "100%" : "70%", backgroundColor: isdark ? "#555555" : "white" }} onSubmit={handleSubmitCategory}>
                                        <div className="row">
                                            <div className="col-1">
                                                <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>category:</label>
                                            </div>
                                            <div className="col-6">
                                                <input type="text" placeholder="Enter Category Name" className="form-control mx-5" style={{ width: isMobile ? "80%" : "100%", padding: isMobile ? "5px" : "10px" }} onChange={e => setValues({ ...values, category: e.target.value })} />
                                            </div>
                                            <div className="col-1"></div>
                                            <div className="col-2">
                                                <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>ADD</button>
                                            </div>
                                        </div>
                                    </form> */}

                                    <p>*To Add Itmes first you need to choose category if the category is not present in the below form</p>

                                    <form className={isMobile ? "p-3 rounded mb-5" : "rounded mb-5 p-5 mb-5"} style={{ width: isMobile ? "100%" : "70%", backgroundColor: isdark ? "#555555" : "white", marginBottom: "20px" }} onSubmit={handleSubmitProduct}>
                                        <div className="row">
                                            <div class="col-4 mb-5">
                                                <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>choose Category:</label>
                                            </div>

                                            <div class="col-6">
                                                <select id="id" class="form-control" value={selectedOption}
                                                    onChange={handleSelectChange}>
                                                    <option value="select">Select Category</option>
                                                    {/* {Data.map((d) => (
                                                        <option key={d.id} value={d.category}>
                                                            {d.category}
                                                        </option>
                                                    ))} */}

                                                    {[...new Set(Data.map((d) => d.category))].map((category, index) => (
                                                        <option key={index} value={category}>
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
                                                <input type="text" placeholder="Enter Product/item Name" className="form-control"
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

                            <Dialog visible={showDialogue} style={{ width: '50vw' }} onHide={onHide} >
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
