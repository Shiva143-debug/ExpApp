import { useState, useRef,useEffect } from "react"
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

const Category = ({ id, isdark, close, updateData ,selectedCategory}) => {

    const [values, setValues] = useState({
        category: "",
    })
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);

    const toast = useRef(null);
    const uppercaseCategory = values.category ? values.category.toLocaleUpperCase() : '';
    const categoryData = {id, category: uppercaseCategory,};
    const updateCategoryData={user_id:id, category: uppercaseCategory,};

    useEffect(() => {
        if (selectedCategory) {
            setValues({ category:selectedCategory.category });
            // setSelectedOption(selectedCategory.category);
            setIsEditMode(true); 
            setEditCategoryId(selectedCategory.id);
        }
    }, [selectedCategory]); 


    const handleSubmitCategory = (e) => {
        e.preventDefault();
        if (!values.category) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter category' });
            return;
        }    
        
        if (isEditMode) {
            axios.put(`https://exciting-spice-armadillo.glitch.me/updateCategory/${editCategoryId}`, updateCategoryData)
                .then((res) => {
                    if (toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating category' });
                    }
                    // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
                    popClose()
                })
                .catch((err) => {
                    console.log(err);
                    if (toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating category' });
                    }
                    // toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating product' });
                });
        }
        else {
            axios.post("https://exciting-spice-armadillo.glitch.me/addshopcategory", categoryData)
                .then(res => {
                    console.log(res);
                    updateData(categoryData);
                    setValues({ category: "" });
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'category added successfully' });
                    setValues({ category: "" });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    const popClose = () => {
        setTimeout(() => { close(); }, 300);
    };

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <div class="p-2">
            <form class={isMobile ? "p-3" : "p-5"} style={{ width: "100%", backgroundColor: isdark ? "black" : "whiteSmoke", fontFamily: "Arial, sans-serif" }} onSubmit={handleSubmitCategory}>
                <Toast ref={toast} />
                <div className="row" >
                    <div className="col-3">
                        <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px', paddingTop: "10px" }}>category:</label>
                    </div>
                    <div className="col-5">
                        <input type="text" value={values.category} placeholder="Enter Category Name" className="form-control mt-2 mb-2" style={{ width: isMobile ? "100%" : "100%", padding: isMobile ? "5px" : "10px" }} onChange={e => setValues({ ...values, category: e.target.value })} />
                    </div>
                    <div className="col-1"></div>
                    <div className="col-2">
                        <button type="submit" onClick={popClose} className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>{isEditMode ? "UPDATE" : "ADD"}</button>
                    </div>
                </div>
            </form>

        </div>

    )
}

export default Category
