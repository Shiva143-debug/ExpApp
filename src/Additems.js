import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Slidebar from "./Slidebar";
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageUtils from './ImageUtils';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"


function Additems({ id, isdark, selectedExpence, close }) {
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedExpence) {
            setSelectedCategory(selectedExpence.category);
            setEditItemId(selectedExpence.id)
            setSelectedProduct(selectedExpence.product);
            setCost(selectedExpence.cost);
            setPurchaseDate(selectedExpence.p_date);
            setDescription(selectedExpence.description)
            setSelectedSource(selectedExpence.source)
            setTaxApplicable(selectedExpence.is_tax_app)
            setPercentage(selectedExpence.percentage)
            setTaxAmount(selectedExpence.tax_amount)
            setAttachFile(selectedExpence.image)
            setIsEditMode(true);
        }
    }, [selectedExpence]);


    const popClose = () => {
        setTimeout(() => { close(); }, 300);
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

    const getSources = (date) => {
        const userId = id;
        const selectedDate = new Date(date);
        const currentMonth = selectedDate.getMonth() + 1;
        const currentYear = selectedDate.getFullYear();
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
    }

    const onChangePurchaseDate = (event) => {
        setPurchaseDate(event.target.value)
        getSources(event.target.value)
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

        const updateItemData = {
            user_id: id,  cost,  p_date: purchaseDate, description, is_tax_app: taxApplicable, percentage, tax_amount: taxAmount
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
        }

        if (isEditMode) {
            axios.put(`https://exciting-spice-armadillo.glitch.me/updateExpense/${editItemId}`, updateItemData)
                .then((res) => {
                    if (toast.current) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Updated Expence successfully' });
                    }
                    // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
                    popClose()
                })
                .catch((err) => {
                    console.log(err);
                    if (toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating Expence' });
                    }
                    // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating product' });
                });
        }
        else {
            axios.post("https://exciting-spice-armadillo.glitch.me/postExpenseData", expenseData)
                .then(res => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Expence added successfully' });
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

    return (
        <div className="d-flex flex-column">
            <div class="d-flex">
                {!isMobile && !isEditMode && (
                    <div style={{ width: "15%" }}>
                        <Slidebar isdark={isdark} />
                    </div>
                )}
                <div className="d-flex flex-column" style={{ width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "whitesmoke", fontFamily: "Arial, sans-serif" }}>
                    <Toast ref={toast} />
                    <h2 style={{ color: isdark ? "white" : "black", textAlign: "start", width: "300px", marginTop: "100px", marginLeft: "50px" }}>Add Expence</h2>
                    <form id="addForm" className={isMobile ? "p-2  mb-5" : "mb-5 p-5"} style={{ width: "90%", minHeight: "80vh" }} onSubmit={handleSubmit}>
                    {!isEditMode &&
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Category:</label>
                            </div>
                            <div class="col-6">
                                <select id="id" disabled={isEditMode} class="form-control" value={selectedCategory} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={handleSelectChange}>
                                    <option value="select" style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>Select category</option>
                                    {Data.map((d) => (
                                        <option key={d.categoryId} value={d.category} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>
                                            {d.category}
                                        </option>
                                    ))}
                                    <option value="others">others</option>
                                </select>
                            </div>
                        </div>
}
                        {!isEditMode &&
                            <div className="mb-5 row">
                                <div class="col-6">
                                    <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Expence Name:</label>
                                </div>

                                <div class="col-6">
                                    {selectedCategory === "others" && <input type="text" placeholder="Enter Expence Name" className="form-control" style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} value={selectedProduct} onChange={handleProductChange} />}
                                    {selectedCategory !== "others" &&
                                        <select className="form-control" value={selectedProduct} onChange={handleProductChange} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}
                                        >
                                            <option value="" style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>Select a Product</option>
                                            {products.map((product) => (
                                                <option key={product.productId} value={product.product} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>
                                                    {product.product}
                                                </option>
                                            ))}
                                        </select>
                                    }
                                </div>

                            </div>
                        }
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>cost:</label>
                            </div>
                            <div class="col-6">
                                <input type="number" value={cost} placeholder="Enter cost" onChange={onChangeCost} className="form-control" style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>purchase/spend Date:</label>
                            </div>
                            <div class="col-6">
                                <input type="date" value={purchaseDate} placeholder="Enter purchase Date" className="form-control" onChange={onChangePurchaseDate} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} />
                            </div>
                        </div>
                        {!isEditMode &&
                        <div className="mb-1 row">
                            <div class="col-6">
                                <label htmlFor="costFrom" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Cost From:</label>
                            </div>
                            <div class="col-6">
                                <select id="costFrom" class="form-control" value={selectedSource} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} onChange={handleSourceSelectChange}>
                                    <option value="select" style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>Select the source</option>
                                    {uniqueSourceNames.map((source) => (
                                        <option key={source} value={source} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
}
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold pt-5" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Description:</label>
                            </div>
                            <div class="col-6 mt-5">
                                <textarea rows="1" value={description} placeholder="This is the default text inside the textarea." cols="40" className="form-control" onChange={onChangeDescription} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }}>
                                </textarea>
                            </div>
                        </div>
                        {!isEditMode &&
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Attach Image:</label>
                            </div>
                            <div class="col-6">
                                <input type="file" id="image" className="form-control" onChange={handleImageChange} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} />
                            </div>
                        </div>
}
                        <div className="mb-5 row">
                            <div class="col-6">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Applicable:</label>
                            </div>
                            <div class="col-6" style={{ display: "flex" }}>
                                <div className="px-2">
                                    <input type="radio" id="yes" name="yesORno" value="yes" onChange={handleTaxApplicableChange} checked={taxApplicable === "yes"} />
                                    <label style={{ color: isdark ? "white" : "navy" }} for="yes">YES</label>
                                </div>
                                <div className="px-2">
                                    <input type="radio" id="no" name="yesORno" value="no" onChange={handleTaxApplicableChange} checked={taxApplicable === "no"} />
                                    <label style={{ color: isdark ? "white" : "navy" }} for="no">NO</label>
                                </div>
                            </div>
                        </div>
                        {taxApplicable === "yes" ? (
                            <>
                                <div className="mb-5 row">
                                    <div class="col-6">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Percentage:</label>
                                    </div>
                                    <div class="col-6 ">
                                        <input type="number" placeholder="Enter percentage" className="form-control" onChange={onPercentage} value={percentage} style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} />
                                    </div>

                                </div>
                                <div className="mb-5 row">
                                    <div class="col-6">
                                        <label htmlFor="" className="px-5 fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}>Tax Amount:</label>
                                    </div>
                                    <div class="col-6 ">
                                        <input type="number" value={taxAmount} className="form-control" disabled style={{ backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "black" }} a />
                                    </div>
                                </div>
                            </>
                        ) : ""}

                        <div className="mb-5 mt-5 d-flex justify-content-between mx-5">
                        {!isEditMode &&  <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}>Back</button>}
                        <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>{isEditMode ? "UPDATE" : "ADD"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Additems;
