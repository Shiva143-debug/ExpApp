import { useState, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import { categoryService } from '../api/apiService';

const Category = ({ id, isdark, close, updateData, selectedCategory }) => {
    const [values, setValues] = useState({ category: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);

    const toast = useRef(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    useEffect(() => {
        if (selectedCategory) {
            setValues({ category: selectedCategory.category });
            setIsEditMode(true);
            setEditCategoryId(selectedCategory.id);
        }
    }, [selectedCategory]);

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        const uppercaseCategory = values.category ? values.category.toLocaleUpperCase() : '';

        if (!values.category.trim()) {
            if (toast.current) {
                toast.current.show({severity: 'warn',summary: 'Warning',detail: 'Please enter category'});
            }
            return;
        }

        try {
            if (isEditMode) {
                const updateCategoryData = {user_id: id,category: uppercaseCategory,};
                await categoryService.updateCategory(editCategoryId, updateCategoryData);
                if (toast.current) {
                    toast.current.show({severity: 'success',summary: 'Success',detail: 'Category updated successfully'});
                }
            } else {
                const categoryData = {id,category: uppercaseCategory,};
                await categoryService.addCategory(categoryData);
                if (toast.current) {
                    toast.current.show({severity: 'success',summary: 'Success',detail: 'Category added successfully'});
                }
            }

            // Reset and close
            setValues({ category: "" });
            setIsEditMode(false);
            setEditCategoryId(null);
            popClose();
        } catch (error) {
            console.error('Error handling category:', error);
            if (toast.current) {
                toast.current.show({severity: 'error',summary: 'Error',detail: 'An error occurred while processing your request'});
            }
        }
    };

    const popClose = () => {
        setTimeout(() => {close();}, 300);
    };

    return (
        <div className="p-2">
            <form className={isMobile ? "p-3" : "p-5"} style={{ width: "100%", backgroundColor: isdark ? "black" : "whitesmoke", fontFamily: "Arial, sans-serif"}} onSubmit={handleSubmitCategory}>
                <Toast ref={toast} />
                <div className="row">
                    <div className="col-4">
                        <label className="fw-bold"  style={{color: isdark ? "white" : "black", fontSize: isMobile ? '16px' : '20px',paddingTop: "15px"}}>
                            Category Name <span style={{color:"red"}}>*</span>:
                        </label>
                    </div>
                    <div className="col-5">
                        <input type="text" value={values.category} placeholder="Enter Category Name" className="form-control mt-2 mb-2"
                            style={{width: "100%",padding: isMobile ? "5px" : "10px"}}
                            onChange={e =>
                                setValues({ ...values, category: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-3 mt-2">
                        <button type="submit" className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}> {isEditMode ? "UPDATE" : "ADD"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Category;
