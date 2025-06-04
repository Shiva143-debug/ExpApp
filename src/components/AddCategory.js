import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Toast } from 'primereact/toast';
import { CiSquarePlus } from "react-icons/ci";
import { Dialog } from 'primereact/dialog';
import Slidebar from "./Micilinious/Slidebar";
import { categoryService, productService } from '../api/apiService';
import Category from "./Category";

function AddCategory({ id, isdark, close, selectedCategory }) {
    const [values, setValues] = useState({
        category: "",
        product: "",
    });

    const [categories, setCategories] = useState([]);
    const [selectedOption, setSelectedOption] = useState("select");
    const [loading, setLoading] = useState(false);
    const [showDialogue, setShowDialogue] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    const navigate = useNavigate();
    const toast = useRef(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    // Prepare data objects for API calls
    const productData = { id, category: selectedOption, product: values.product, };

    const updateProductData = { user_id: id, product: values.product, };

    // Close popup with delay
    const popClose = () => {
        setTimeout(() => { close && close(); }, 300);
    };

    // Handle form submission
    const handleSubmitProduct = async (e) => {
        e.preventDefault();
 
        // Form validation
        if (selectedOption === "select") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select a category' });
            setLoading(false);
            return;
        } else if (!values.product) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter a product name' });
            setLoading(false);
            return;
        }

        try {
            if (isEditMode) {
                await productService.updateProduct(editProductId, updateProductData)
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Updated CategoryExpence successfully' });
                }
                popClose();
            } else {
                await productService.addProduct(productData)
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'CategoryExpense added successfully' });

                // Reset form
                onClear();
            }
        } catch (error) {
            console.error('Error handling CategoryExpense:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while processing your request' });
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        getCategoriesData()
    }, [id])

    const getCategoriesData = async () => {
        if (id) {
            try {
                const data = await categoryService.getCategories(id);
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
    };


    // Set form data when in edit mode
    useEffect(() => {
        if (selectedCategory) {
            setValues({ product: selectedCategory.product });
            setSelectedOption(selectedCategory.category);
            setIsEditMode(true);
            setEditProductId(selectedCategory.id);
        }
    }, [selectedCategory]);

    // Event handlers
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const onClear = () => {
        setValues({ category: "", product: "" });
        setSelectedOption("select");
    };

    const openCategoryDialog = () => {
        setShowDialogue(true);
    };

    const closeCategoryDialog = () => {
        setShowDialogue(false);
        getCategoriesData();
    };

    const updateCategoriesList = (newCategory) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
    };

    // Styles
    const containerStyle = {
        backgroundColor: isdark ? "black" : "whitesmoke",
        color: isdark ? "white" : "black",
        fontFamily: "Arial, sans-serif"
    };

    const formStyle = {
        width: isMobile ? "100%" : "60%",
        backgroundColor: isdark ? "transparent" : "white",
        marginBottom: isEditMode ? "-100px" : "20px",
        boxShadow: isdark ? "0px 0px 10px white" : "5px 5px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "8px"
    };

    const inputStyle = {
        backgroundColor: isdark ? "black" : "white",
        color: isdark ? "white" : "black",
        borderRadius: "4px",
        border: isdark ? "1px solid #444" : "1px solid #ced4da"
    };

    const labelStyle = {
        color: isdark ? "white" : "black",
        fontSize: isMobile ? '14px' : '20px',
        fontWeight: "bold"
    };

    const headingStyle = {
        color: isdark ? "white" : "black",
        // marginTop: isMobile ? "10px" : isEditMode ? "-150px" : "150px",
        // paddingTop: isEditMode ? "100px" : "",
        // textAlign: "center"
    };

    return (
        <div className="d-flex flex-column">
            <div className="d-flex">
                {!isMobile && !isEditMode && (
                    <div style={{ width: "15%" }}>
                        <Slidebar isdark={isdark} />
                    </div>
                )}

                <div className="d-flex flex-column justify-content-center "
                    style={{ width: isMobile ? "100%" : "85%", marginTop: isEditMode ? "-50px" : "", height: isEditMode ? "80vh" : "100vh" }}>

                    {loading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                        </div>
                    )}

                    {!loading && (
                        <div className="d-flex flex-column justify-content-center align-items-center rounded p-4 p-md-5"
                            style={{ ...containerStyle, width: "100%", height: isEditMode ? "100%" : "100%" }}>

                            <Toast ref={toast} position="top-right" />

                            {!isEditMode && <h2 style={headingStyle} className="pb-2">ADD CATEGORY/EXPENCE</h2>}
                            {isEditMode && <h4 style={headingStyle} className="pb-2">UPDATE CATEGORY/EXPENCE</h4>}

                            {/* {!isEditMode && <p className="text-center mb-4">*To add items, first select a category or create a new one if needed</p>} */}

                            <form className={`${isMobile ? "p-3" : "p-4 p-md-5"} rounded mb-5`} style={formStyle} onSubmit={handleSubmitProduct}>

                                {!isEditMode && (
                                    <div className="row mb-4 align-items-center">
                                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                                            <label htmlFor="categorySelect" style={labelStyle}>Select Category<span style={{color:"red"}}>*</span>:</label>
                                        </div>

                                        <div className="col-10 col-md-6">
                                            <select id="categorySelect" className="form-select" value={selectedOption} onChange={handleSelectChange} style={inputStyle}>
                                                <option value="select">Select Category</option>
                                                {[...new Set(categories.map((d) => d.category))].map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-2 col-md-1">
                                            <CiSquarePlus onClick={openCategoryDialog} size={40} className="clickable-icon" style={{ color: isdark ? "white" : "black", cursor: "pointer" }} title="Add New Category" />
                                        </div>
                                    </div>
                                )}

                                <div className="row mb-4 align-items-center">
                                    <div className="col-12 col-md-4 mb-3 mb-md-0">
                                        <label htmlFor="productInput" style={labelStyle}>Expence Name<span style={{color:"red"}}>*</span>:</label>
                                    </div>

                                    <div className="col-12 col-md-7">
                                        <input id="productInput" type="text" placeholder="Enter Expence Name" className="form-control" style={inputStyle} value={values.product || ''} onChange={e => setValues({ ...values, product: e.target.value })} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <div>
                                        {!isEditMode && (
                                            <button type="button" onClick={onClear} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`}> Clear</button>
                                        )}
                                    </div>
                                    <div>
                                        <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}> {isEditMode ? "UPDATE" : "ADD"} </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <Dialog visible={showDialogue} style={{ width: isMobile ? '90vw' : '50vw' }} onHide={closeCategoryDialog} header="ADD CATEGORY" draggable={false} resizable={false} className={isdark ? "dark-dialog" : ""}>
                        <Category close={closeCategoryDialog} id={id} isdark={isdark} updateData={updateCategoriesList} />
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;
