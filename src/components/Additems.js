import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import Slidebar from "./Micilinious/Slidebar";
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageUtils from '../ImageUtils';
import { categoryService, expenseService, sourceService } from '../api/apiService';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/AddItems.css"
import { useAuth } from "../context/AuthContext";


function Additems({  selectedExpence, close }) {
    const { userId, isdark } = useAuth();
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
        fetchCategories();
    }, [userId]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories(userId);
            setData(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        fetchProducts(selectedValue)
    };

    const fetchProducts = async (category) => {
        try {
            const data = await categoryService.getProductsByCategory(category, userId);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
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

    const getSources = async (date) => {
        try {
            const selectedDate = new Date(date);
            const currentMonth = selectedDate.getMonth() + 1;
            const currentYear = selectedDate.getFullYear();

            const data = await sourceService.getAllSourceData(userId);
            console.log("source data",data)
            const filteredData = data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
            });
            setSourceData(filteredData);
        } catch (error) {
            console.error('Error fetching source data:', error);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const expenseData = {userId,category: selectedCategory,product: selectedProduct,cost,source: selectedSource,p_date: purchaseDate,description,is_tax_app: taxApplicable,percentage,tax_amount: taxAmount,image: attachFile}

        const updateItemData = {user_id: userId,cost,p_date: purchaseDate,description,is_tax_app: taxApplicable,percentage,tax_amount: taxAmount}

        if (taxApplicable === "no") {
            expenseData.percentage = 0;
            expenseData.tax_amount = 0;
        }

        // Validation
        if (selectedCategory === "select") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select category' });
            return;
        }
        else if (selectedProduct === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please Select Expense' });
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

        try {
            if (isEditMode) {
                await expenseService.updateExpense(editItemId, updateItemData);
                if (toast.current) {
                    toast.current.show({severity: 'success',summary: 'Success',detail: 'Updated Expense successfully'});
                }
                popClose();
            } else {
                await expenseService.addExpense(expenseData);
                toast.current.show({severity: 'success',summary: 'Success',detail: 'Expense added successfully'});

                // Reset form
                onClear();
            }
        } catch (error) {
            console.error('Error handling expense:', error);
            toast.current.show({severity: 'error',summary: 'Error',detail: 'An error occurred while processing your request'});
        }
    }

    const onClear = () => {
        document.getElementById("addForm").reset();
        setTaxApplicable("no");
        setPercentage("");
        setTaxAmount("");
        setSelectedSource("select Source");
        setDescription("");
        setPurchaseDate("");
        setCost("");
        setSelectedProduct("");
        setSelectedCategory("");
        setAttachFile("");
    }

    const uniqueSourceNames = [...new Set(sourceData.map((d) => d.source))];
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div className="add-items-container">
            <div className="d-flex">
                {!isMobile && !isEditMode && (
                    <div className="sidebar-container">
                        <Slidebar isdark={isdark} />
                    </div>
                )}
                <div className={`content-container ${isMobile ? 'mobile' : ''} ${isdark ? 'dark' : 'light'} ${isEditMode ? 'edit-mode' : ''}`}>
                    <Toast ref={toast} />
                    <h2 className="form-title">Expense</h2>
                    <form id="addForm" className={`add-items-form ${isMobile ? 'mobile' : 'desktop'}`} onSubmit={handleSubmit}>

                        <div className="row">
                            {/* Category Section */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Category <span style={{color:"red"}}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <select id="id" disabled={isEditMode} className={`form-control ${isdark ? 'dark' : 'light'}`} value={selectedCategory} onChange={handleSelectChange}>
                                            <option value="select">Select category</option>
                                            {Data.map((d) => (
                                                <option key={d.categoryId} value={d.category}>{d.category}</option>
                                            ))}
                                            <option
                                                value="others">others</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Expense Name Section */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>

                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Expense Name<span style={{color:"red"}}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        {selectedCategory === "others" ? (
                                            <input type="text" placeholder="Enter Expense Name" className={`form-control ${isdark ? 'dark' : 'light'}`} value={selectedProduct} onChange={handleProductChange} />
                                        ) : (
                                            <select className={`form-control ${isdark ? 'dark' : 'light'}`} value={selectedProduct} onChange={handleProductChange}>
                                                <option value="">Select Expence</option>
                                                {products.map((product) => (
                                                    <option key={product.productId} value={product.product}>{product.product}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            {/* cost */}
                            <div className="col-12 col-md-6">
                               <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Cost<span style={{color:"red"}}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <input type="number" value={cost} placeholder="Enter cost" onChange={onChangeCost} className={`form-control ${isdark ? 'dark' : 'light'}`} />
                                    </div>
                                </div>
                            </div>
                            {/* purchaseDate */}
                            <div className="col-12 col-md-6">
                               <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Purchase/Spend Date<span style={{color:"red"}}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <input type="date" value={purchaseDate} placeholder="Enter purchase Date" className={`form-control ${isdark ? 'dark' : 'light'}`} onChange={onChangePurchaseDate} />
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="row">
                            {/* cost from section */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Cost From<span style={{color:"red"}}>*</span></label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <select id="costFrom" className={`form-control ${isdark ? 'dark' : 'light'}`} value={selectedSource} onChange={handleSourceSelectChange}>
                                            <option value="select">Select the source</option>
                                            {uniqueSourceNames.map((source) => (
                                                <option key={source} value={source}>
                                                    {source}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* attachme image */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'} ${isMobile ? 'mobile' : 'desktop'}`}>Attach Image</label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <input type="file" id="image" className={`form-control ${isdark ? 'dark' : 'light'}`} onChange={handleImageChange} />
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="row">
                            {/* description */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'}`}>Description</label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <textarea rows="2" value={description} placeholder="Enter description here" cols="40" className={`form-control ${isdark ? 'dark' : 'light'}`} onChange={onChangeDescription}>
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            {/* tax applicable */}
                            <div className="col-12 col-md-6">
                                <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                    <div className="col-5">
                                        <label className={`form-label ${isdark ? 'dark' : 'light'} ${isMobile ? 'mobile' : 'desktop'}`}>Tax Applicable</label>
                                    </div>
                                    <div className="col-1"><b>:</b></div>
                                    <div className="col-6">
                                        <div className="radio-container">
                                            <div className="radio-option">
                                                <input type="radio" id="yes" name="yesORno" value="yes" onChange={handleTaxApplicableChange} checked={taxApplicable === "yes"} />
                                                <label className={isdark ? 'dark' : 'light'} htmlFor="yes">YES</label>
                                            </div>
                                            <div className="radio-option">
                                                <input type="radio" id="no" name="yesORno" value="no" onChange={handleTaxApplicableChange} checked={taxApplicable === "no"} />
                                                <label className={isdark ? 'dark' : 'light'} htmlFor="no">NO</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {taxApplicable === "yes" &&
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                        <div className="col-5">
                                            <label className={`form-label ${isdark ? 'dark' : 'light'} ${isMobile ? 'mobile' : 'desktop'}`}>Tax Percentage</label>
                                        </div>
                                        <div className="col-1"><b>:</b></div>
                                        <div className="col-6">
                                            <input type="number" placeholder="Enter percentage" className={`form-control ${isdark ? 'dark' : 'light'}`} onChange={onPercentage} value={percentage} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className={`d-flex align-items-center justify-content-between gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                        <div className="col-5">
                                            <label className={`form-label ${isdark ? 'dark' : 'light'} ${isMobile ? 'mobile' : 'desktop'}`}>Tax Amount</label>
                                        </div>
                                        <div className="col-1"><b>:</b></div>
                                        <div className="col-6">
                                            <input type="number" value={taxAmount} className={`form-control ${isdark ? 'dark' : 'light'}`} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="buttons-container">
                            {!isEditMode && <button onClick={onClear} className={`btn btn-secondary ${isMobile ? "btn-sm" : "btn-lg"}`}>Clear</button>}
                            <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>
                                {isEditMode ? "Update Expense" : "Add Expense"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Additems;