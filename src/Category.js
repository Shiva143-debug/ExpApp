import { useState ,useRef} from "react"
import useMediaQuery from '@mui/material/useMediaQuery';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const Category = ({id,isdark,close,updateData}) => {

    const [values, setValues] = useState({
        category: "",
        product: "",
    })
    const [Data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useRef(null);

    const uppercaseCategory = values.category ? values.category.toLocaleUpperCase() : '';

    const categoryData = {
        id, category: uppercaseCategory,
    };

    const handleSubmitCategory = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!values.category) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter category' });
            // setLoading(false);
            return;
        } else {
            axios.post("https://exciting-spice-armadillo.glitch.me/addshopcategory", categoryData)
                .then(res => {
                    console.log(res);
                    // setData(prevData => [...prevData, categoryData]);
                    updateData(categoryData);
                    console.log(Data)
                    setValues({category: ""});
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'category added successfully' });

                    setValues({ category: "",
                        product: ""});

                    setLoading(false);

                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);

                });
        }
    };

    
    const popClose = () => {

        setTimeout(() => {
        close();
           
        }, 300);

    };

    const isMobile = useMediaQuery('(max-width:768px)');




    return (
        <div  class="p-2">
        <form  class={isMobile?"p-3":"p-5"} style={{width:"100%", backgroundColor: isdark ? "black" : "whiteSmoke",fontFamily: "Arial, sans-serif" }} onSubmit={handleSubmitCategory}>
             <Toast ref={toast} />
            <div className="row" >
                <div className="col-3">
                    <label htmlFor="" className="fw-bold" style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px',paddingTop:"10px" }}>category:</label>
                </div>
                <div className="col-5">
                    <input type="text" placeholder="Enter Category Name" className="form-control mt-2 mb-2" style={{ width: isMobile ? "100%" : "100%", padding: isMobile ? "5px" : "10px" }} onChange={e => setValues({ ...values, category: e.target.value })} />
                </div>
                <div className="col-1"></div>
                <div className="col-2">
                    <button type="submit" onClick={popClose} className={`btn btn-primary ${isMobile ? "btn-sm" : "btn-lg"}`}>ADD</button>
                </div>
            </div>
        </form>

        </div>

    )
}

export default Category
