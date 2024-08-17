import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Toast } from 'primereact/toast';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import Slidebar from "./Slidebar";
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageUtils from './ImageUtils';



function Additems({ id,isdark }) {
    // const location = useLocation();
    // const { id } = this.props;
    // const id = location.state.id;
    // console.log(id)

    const [Data, setData] = useState([])
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("select");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [cost, setCost] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSource, setSelectedSource] = useState("select Source");
    const [sourceData, setSourceData] = useState([])
    const [attachFile, setAttachFile] = useState("");
    const [taxApplicable, setTaxApplicable] = useState("no");
    const [percentage, setPercentage] = useState("");
    const [taxAmount, setTaxAmount] = useState("");


    const toast = useRef(null);
    const navigate = useNavigate();
    // console.log(products)

    useEffect(() => {
        const userId = id;

        fetch(`https://exciting-spice-armadillo.glitch.me/categories/${userId}`)
            .then(res => res.json())
            .then(data => setData(data)
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
        // fetchProducts("select");
    })


    // useEffect(() => {
    //     const userId = id;
    //     fetch(`https://exciting-spice-armadillo.glitch.me/getSourceData/${userId}`)
    //         .then(res => res.json())
    //         .then(data => setSourceData(data)
    //             .catch(err => console.log(err))
    //         )
    //         .catch(err => console.log(err))


    // }, [id])

    useEffect(() => {
        const userId = id;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        fetch(`https://exciting-spice-armadillo.glitch.me/getSourceData/${userId}`)
            .then(res => res.json())
            .then(data => {
                const filteredData = data.filter(item => {
                    const itemDate = new Date(item.date); 
                    return itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
                });
                setSourceData(filteredData);
            })
            .catch(err => console.log(err));
    }, [id]);


    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        fetchProducts(selectedValue)
    };



    const fetchProducts = (category) => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/products?category=${category}&user_id=${userId}`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.log(err));
    };


    const handleProductChange = (event) => {
        const selectedProduct = event.target.value;
        setSelectedProduct(selectedProduct);
    };

    const handleSourceSelectChange = (event) => {
        setSelectedSource(event.target.value)
    }

    const handleTaxApplicableChange = event => {
        setTaxApplicable(event.target.value)



    }

    const onPercentage = (event) => {
        const percentage = event.target.value;
        setPercentage(percentage);
        const calculatedTaxAmount = (cost * (percentage / 100)).toFixed(2);

        setTaxAmount(calculatedTaxAmount);


    }

    const onChangeCost = (event) => {
        setCost(event.target.value)
    }

    const onChangePurchaseDate = (event) => {
        setPurchaseDate(event.target.value)
    }

    const onChangeDescription = (event) => {
        setDescription(event.target.value)
    }

    const handleImageChange = (e) => {

        if (e.target.files && e.target.files[0]) {
            ImageUtils.convertImage(e.target.files[0]).then(function (base64) {
                setAttachFile(base64);
            })
        }
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseData = {
            id, category: selectedCategory, product: selectedProduct, cost, source: selectedSource, p_date: purchaseDate, description, is_tax_app: taxApplicable, percentage, tax_amount: taxAmount, image: attachFile
        }

        if (taxApplicable === "no") {
            expenseData.percentage = 0;
            expenseData.tax_amount = 0;

        }




        if (selectedCategory === "select") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select category' });
            return;
        }
        else if (selectedProduct === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select Product' });
            return;
        }
        else if (cost === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Enter cost' });
            return;
        }
        else if (selectedSource === "select Source") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select source' });
            return;
        } else if (purchaseDate === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select purchaseDate' });
            return;
        } else {
            axios.post("https://exciting-spice-armadillo.glitch.me/postExpenseData", expenseData)
                .then(res => {
                    // console.log(res);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Source of Expence added successfully' });
                    document.getElementById("addForm").reset();
                    setTaxApplicable("no")
                    setPercentage("")
                    setTaxAmount("")
                    setSelectedSource("select Source")
                    setDescription("")
                    setPurchaseDate("")
                    setCost("")
                    setSelectedProduct("")
                    setSelectedCategory("")
                    setAttachFile("")

                })
                .catch(err => {
                    console.log(err);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: err });

                });
        }
    }


    const onBack = () => {
        navigate("/dashBoard");
    }

    const uniqueSourceNames = [...new Set(sourceData.map((d) => d.source))];

    const isMobile = useMediaQuery('(max-width:768px)');
    // console.log(uniqueSourceNames)



    return (
        <div className="d-flex flex-column">
            
                <div class="d-flex">
                    {!isMobile && (
                        <div style={{ width: "15%" }}>
                            <Slidebar isdark={isdark}/>
                        </div>
                    )}
                    <div className="d-flex flex-column" style={{ width: isMobile ? "100%" : "85%", backgroundColor:isdark?"black": "whitesmoke",fontFamily: "Arial, sans-serif" }}>
                        <Toast ref={toast} />

                        <h2 style={{ color:isdark?"white": "black", textAlign: "start", width: "300px", marginTop: "150px", marginLeft: "50px" }}>Add Expence</h2>
                        <form id="addForm" className={isMobile ? "p-2  mb-5" : "mb-5 p-5"} style={{ width: "90%", minHeight: "80vh" }} onSubmit={handleSubmit}>
                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Category:</label>
                                </div>
                                <div class="col-6">
                                    <select id="id" class="form-control" value={selectedCategory}
                                        onChange={handleSelectChange}>
                                        <option value="select">Select</option>
                                        {Data.map((d) => (
                                            <option key={d.categoryId} value={d.category}>
                                                {d.category}
                                            </option>
                                        ))}

                                        <option value="others">others</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Expence Name:</label>
                                </div>
                                <div class="col-6">

                                    {selectedCategory === "others" && <input type="text" placeholder="Enter Expence Name" className="form-control"
                                        value={selectedProduct}
                                        onChange={handleProductChange} />}

                                    {selectedCategory !== "others" &&
                                        <select
                                            className="form-control"
                                            value={selectedProduct}
                                            onChange={handleProductChange}
                                        >
                                            <option value="">Select a Product</option>
                                            {products.map((product) => (
                                                <option key={product.productId} value={product.product}>
                                                    {product.product}
                                                </option>
                                            ))}
                                        </select>
                                    }
                                </div>
                            </div>
                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>cost:</label>
                                </div>
                                <div class="col-6">
                                    <input type="number" placeholder="Enter cost" className="form-control"
                                        onChange={onChangeCost} />
                                </div>
                            </div>


                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="costFrom" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Cost From:</label>
                                </div>
                                <div class="col-6">
                                    <select id="costFrom" class="form-control" value={selectedSource}
                                        onChange={handleSourceSelectChange}>
                                        <option value="select">Select the source</option>
                                        {uniqueSourceNames.map((source) => (
                                            <option key={source} value={source}>
                                                {source}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-1 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>purchase/spend Date:</label>
                                </div>
                                <div class="col-6">
                                    <input type="date" placeholder="Enter purchase Date" className="form-control"
                                        onChange={onChangePurchaseDate} />
                                </div>
                            </div>

                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold pt-5" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Description:</label>
                                </div>
                                <div class="col-6 mt-5">
                                    <textarea rows="1" placeholder="This is the default text inside the textarea." cols="40" className="form-control" onChange={onChangeDescription}>

                                    </textarea>

                                </div>
                            </div>

                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Attach Image:</label>
                                </div>
                                <div class="col-6">
                                    <input type="file" id="image" className="form-control" onChange={handleImageChange} />

                                </div>
                            </div>

                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Applicable:</label>
                                </div>

                                <div class="col-6" style={{ display: "flex" }}>
                                    <div className="px-2">
                                        <input type="radio" id="yes" name="yesORno" value="yes" onChange={handleTaxApplicableChange} checked={taxApplicable === "yes"} />
                                        <label style={{color:isdark?"white": "navy"}} for="yes">YES</label>
                                    </div>
                                    <div className="px-2">
                                        <input type="radio" id="no" name="yesORno" value="no" onChange={handleTaxApplicableChange} checked={taxApplicable === "no"} />
                                        <label style={{color:isdark?"white": "navy"}} for="no">NO</label>
                                    </div>
                                </div>



                            </div>
                            {taxApplicable === "yes" ? (
                                <>
                                    <div className="mb-5 row">
                                        <div class="col-6">
                                            <label htmlFor="" className="px-5 fw-bold" style={{ color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Percentage:</label>
                                        </div>
                                        <div class="col-6 ">
                                            <input type="number" placeholder="Enter percentage" className="form-control"
                                                onChange={onPercentage} value={percentage} />
                                        </div>

                                    </div>
                                    <div className="mb-5 row">
                                        <div class="col-6">
                                            <label htmlFor="" className="px-5 fw-bold" style={{color:isdark?"white": "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Amount:</label>
                                        </div>
                                        <div class="col-6 ">
                                            <input type="number" value={taxAmount} className="form-control" disabled />
                                        </div>


                                    </div>

                                </>


                            ) : ""}

                            <div className="mb-5 mt-5 d-flex justify-content-between mx-5">
                                <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Back</button>
                                <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>ADD</button>
                            </div>
                        </form>
                    </div>
                </div>
        

        </div>
    );
}

export default Additems;
