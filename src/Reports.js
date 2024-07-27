// import { useState, useEffect, useRef } from "react"
// import Slidebar from "./Slidebar"
// import { ProgressSpinner } from 'primereact/progressspinner';
// import "./Reports.css"
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { CSVLink } from "react-csv";
// import { FaDownload } from "react-icons/fa";
// import { FaTrash } from 'react-icons/fa';
// import { Toast } from 'primereact/toast';
// import { FiEye } from 'react-icons/fi';
// import { useNavigate } from "react-router-dom";
// import ImageComponent from "./ImageComponent";

// // import { Button } from "bootstrap";
// // import Modal from './Modal';


// const months = [
//     "January", "February", "March", "April",
//     "May", "June", "July", "August",
//     "September", "October", "November", "December"
// ];


// const currentYear = new Date().getFullYear();
// const years = Array.from({ length: 7 }, (_, index) => (currentYear - 3 + index).toString());


// function Reports({ id, isdark }) {
//     const [Month, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
//     const [Year, setSelectedYear] = useState(new Date().getFullYear().toString());
//     const [totalCostData, setExpenseCost] = useState([])
//     const [sourceData, setSourceData] = useState([])
//     // const [totalMinusExpenseData, setFilteredSourceData] = useState([])
//     const [showTable, setViewTable] = useState(false)
//     const [showItems, setViewItems] = useState(false)
//     const [showCategories, setViewCategories] = useState(false)
//     const [productsData, setProductsData] = useState([]);
//     const [categoriesData, setCategoriesData] = useState([]);
//     const [showImageComponent, setViewImageComponent] = useState(false)
//     const [image, setImage] = useState("");
//     const navigate = useNavigate();


//     const [searchTerm, setSearchTerm] = useState("");
//     const toast = useRef(null);


//     const [loading, setLoading] = useState(false)

//     const handleSelectChange = (event) => {
//         const { name, value } = event.target;
//         if (name === "month") {
//             setSelectedMonth(value);
//         } else if (name === "year") {
//             setSelectedYear(value);
//         }
//     };

//     useEffect(() => {
//         const userId = id;
//         fetch(`https://exciting-spice-armadillo.glitch.me/getExpenseCost/${userId}`)
//             .then(res => res.json())
//             .then(data => setExpenseCost(data))
//             .catch(err => console.log(err))
//     }, [id]);

//     useEffect(() => {
//         const userId = id;
//         fetch(`https://exciting-spice-armadillo.glitch.me/getReportSource/${userId}`)
//             .then(res => res.json())
//             .then(data => setSourceData(data))
//             .catch(err => console.log(err))
//     }, [id]);

//     // useEffect(() => {
//     //     const userId = id;
//     //     fetch(`https://exciting-spice-armadillo.glitch.me/filteredSourceData?month=${Month}&year=${Year}&user_id=${userId}`)
//     //         .then(res => res.json())
//     //         .then(data => setFilteredSourceData(data))
//     //         .catch(err => console.log(err));
//     // }, [Month, Year, id]);


//     useEffect(() => {
//         const userId = id;

//         fetch(`https://exciting-spice-armadillo.glitch.me/getCategoriesAndProducts/${userId}`)
//             .then(res => res.json())
//             .then(data => setProductsData(data))
//             .catch(err => console.log(err));
//     }, [id]);


//     useEffect(() => {
//         const userId = id;

//         fetch(`https://exciting-spice-armadillo.glitch.me/getCategories/${userId}`)
//             .then(res => res.json())
//             .then(data => setCategoriesData(data))
//             .catch(err => console.log(err));
//     }, [id]);



//     const filteredSourceData = sourceData.filter((item) => {
//         return item.month === parseInt(Month) && item.year === Year;
//     });


//     const aggregatedData = filteredSourceData.reduce((acc, curr) => {
//         if (acc[curr.source]) {
//             acc[curr.source] += parseInt(curr.amount);
//         } else {
//             acc[curr.source] = parseInt(curr.amount);
//         }
//         return acc;
//     }, {});


//     const totalAmount = filteredSourceData.reduce((total, item) => {
//         let totalamount = total + parseInt(item.amount);
//         return totalamount;
//     }, 0);



//     const filteredTotalCostData = totalCostData.filter((d) => {
//         return d.month.toString() === Month & d.year.toString() === Year;
//     });

//     const isMobile = useMediaQuery('(max-width:768px)');


//     const click = () => {
//         setViewTable(true)
//     }

//     const onClickCat = () => {
//         setViewCategories(true)
//     }

//     const onClickProducts = () => {

//         setViewItems(true)
//     }

//     const onBack = () => {
//         setViewTable(false)
//         setViewItems(false)
//         setViewCategories(false)
//     }






//     const csvData = filteredTotalCostData.map(item => ({
//         Category: item.category,
//         Product: item.product,
//         Cost: item.cost,
//         Source: item.source,
//         PurchaseDate: item.p_date,
//         // PurchaseDate:item.p_date.substring(2, 4) + '-' + item.p_date.substring(5, 7) + '-' + item.p_date.substring(8, 10),
//         TaxAmount: item.tax_amount,
//         Description: item.description
//     }));


//     const handleDeleteProduct = (item_id) => {

//         setLoading(true);
//         const user_id = id;
//         fetch(`https://exciting-spice-armadillo.glitch.me/deleteProducts/${parseInt(item_id)}/${user_id}`, {
//             method: 'DELETE',
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 if (response.ok) {
//                     toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
//                     const updatedProdductsData = productsData.filter((pro) => pro.id !== item_id);
//                     setProductsData(updatedProdductsData);

//                 }
//             })
//             .catch((error) => {
//                 // Handle error
//                 console.error('Error deleting category:', error);
//                 toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
//             })
//             .finally(() => {
//                 // Reset loading state
//                 setLoading(false);
//             });
//     };



//     const handleDeleteCategory = (item_id) => {

//         setLoading(true);
//         const user_id = id;
//         fetch(`https://exciting-spice-armadillo.glitch.me/deleteCategories/${parseInt(item_id)}/${user_id}`, {
//             method: 'DELETE',
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 if (response.ok) {
//                     toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
//                     const updatedCategoriesData = categoriesData.filter((category) => category.id !== item_id);
//                     setCategoriesData(updatedCategoriesData);

//                 }
//             })
//             .catch((error) => {
//                 // Handle error
//                 console.error('Error deleting category:', error);
//                 toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
//             })
//             .finally(() => {
//                 // Reset loading state
//                 setLoading(false);
//             });
//     };



//     const handleDeleteExpence = (item_id) => {

//         setLoading(true);
//         const user_id = id;
//         fetch(`https://exciting-spice-armadillo.glitch.me/deleteExpence/${parseInt(item_id)}/${user_id}`, {
//             method: 'DELETE',
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 if (response.ok) {

//                     console.log("deleted Succesfully")
//                     toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
//                     const updatedExpenceData = totalCostData.filter((category) => category.id !== item_id);
//                     setExpenseCost(updatedExpenceData);

//                 }
//             })

//             .catch((error) => {
//                 // Handle error
//                 console.error('Error deleting category:', error);
//                 toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete Expence' });
//             })

//             .finally(() => {
//                 // Reset loading state
//                 setLoading(false);
//             });
//     };
//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };



//     const filteredDataForTotalCost = filteredTotalCostData.filter((d) =>
//         searchTerm === "" ||
//         d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         new Date(d.p_date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//         d.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         d.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         d.description.toLowerCase().includes(searchTerm.toLowerCase())


//     );

//     const totalCost = filteredDataForTotalCost.reduce((acc, d) => acc + parseFloat(d.cost), 0);
//     const totalTaxAmount = filteredDataForTotalCost.reduce((acc, curr) => acc + parseFloat(curr.tax_amount), 0);

//     const imageClick = (imageUrl) => {
//         // window.open(imageUrl, '_blank');
//         // setViewImageComponent(true)
//         setImage(imageUrl)

//         navigate("/image", { state: imageUrl })

//     }

//     //   useEffect(() => {
//     //     {showImageComponent && (
//     //         <>
//     //             <ImageComponent image={image}  />
//     //             {window.open('', '_blank').document.body.innerHTML = `
//     //                 <div>
//     //                     <h2>Image</h2>
//     //                     <img src=${image} alt="Image" />
//     //                 </div>
//     //             `}
//     //         </>
//     //     )}
//     // })

//     // useEffect(() => {
//     //     if (showImageComponent && image) {
//     //         const newTab = window.open('', '_blank');
//     //         newTab.document.body.innerHTML = `
//     //             <div>
//     //                 <h2>Image</h2>
//     //                 <img src=${image} alt="Image" />
//     //             </div>
//     //         `;
//     //     }
//     // }, [showImageComponent, image]);

//     // useEffect(() => {
//     //     if (showImageComponent && image) {
//     //         const newTab = window.open('', '_blank');
//     //         newTab.addEventListener('load', () => {
//     //             newTab.document.body.innerHTML = `
//     //                 <div>
//     //                     <h2>Image</h2>
//     //                     <img src=${image} alt="Image" />
//     //                 </div>
//     //             `;
//     //         });
//     //     }
//     // }, [showImageComponent, image]);


//     const [currentPage, setCurrentPage] = useState(1);
//     const [currentPagepro, setCurrentPagePro] = useState(1);
//     const [currentPageItems, setCurrentPageitems] = useState(1);
//     const rowsPerPage = 6;

//     const totalPages = Math.ceil(categoriesData.length / rowsPerPage);

//     const handleNextPage = () => {
//         setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//     };

//     const handlePrevPage = () => {
//         setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//     };

//     const totalPagesforPro = Math.ceil(productsData.length / rowsPerPage);

//     const handleNextPagepro = () => {
//         setCurrentPagePro((prevPagpro) => Math.min(prevPagpro + 1, totalPagesforPro));
//     };

//     const handlePrevPagepro = () => {
//         setCurrentPagePro((prevPagpro) => Math.max(prevPagpro - 1, 1));
//     };


//     const totalPagesforItems = Math.ceil(filteredTotalCostData.length / rowsPerPage);

//     const handleNextPageitems = () => {
//         setCurrentPageitems((prevPag) => Math.min(prevPag + 1, totalPagesforItems));
//     };

//     const handlePrevPageitems = () => {
//         setCurrentPageitems((prevPag) => Math.max(prevPag - 1, 1));
//     };


//     const currentData = categoriesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//     const currentProductData = productsData.slice((currentPagepro - 1) * rowsPerPage, currentPagepro * rowsPerPage);

//     const itemsData = filteredTotalCostData.slice((currentPageItems - 1) * rowsPerPage, currentPageItems * rowsPerPage);

//     return (

//         <div className="d-flex flex-column">
//             <Toast ref={toast} />
//             <div>
//                 <div class="d-flex">
//                     {!isMobile && (
//                         <div style={{ width: "15%" }}>

//                             <div>
//                                 <Slidebar isdark={isdark} />
//                             </div>
//                         </div>
//                     )}
//                     <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: isMobile ? "100%" : "85%", minHeight: "100vh" }}>

//                         {loading &&
//                             <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
//                                 <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
//                             </div>}
//                         {!loading &&
//                             <div className="d-flex flex-column" style={{ width: isMobile ? "100%" : "100%", backgroundColor: isdark ? "black" : "whitesmoke", height: "100%", }}>


//                                 <div class="d-flex justify-content-between p-5">


//                                     {!showItems && !showCategories && <div class="d-flex">
//                                         <select
//                                             name="month"
//                                             style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", marginLeft: "20px" }}
//                                             className="form-control"
//                                             value={Month}
//                                             onChange={handleSelectChange}

//                                         >
//                                             {months.map((month, index) => (
//                                                 <option key={index} value={index + 1}>{month}</option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             name="year"
//                                             style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", marginLeft: "20px" }}
//                                             className="form-control"
//                                             value={Year}
//                                             onChange={handleSelectChange}
//                                         >
//                                             {years.map((year, index) => (
//                                                 <option key={index} value={year}>{year}</option>
//                                             ))}
//                                         </select>

//                                     </div>
//                                     }


//                                 </div>
//                                 {!showTable && !showItems && !showCategories &&


//                                     <div className="d-flex flex-column justify-content-center" >
//                                         <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>
//                                         <div className="d-flex  justify-content-center align-items-center" style={{flexDirection:isMobile?"column":"row"}}>

//                                             <div className="card px-2 mt-5 mx-5 pt-2" style={{ width: isMobile ? "200px" : "300px" }}>
//                                                 <h1 style={{ fontSize: isMobile ? '18px' : '24px' }}>Sources of Income From</h1>
//                                                 <ol>
//                                                     {Object.entries(aggregatedData).map(([source, amount]) => (
//                                                         <li key={source} style={{ fontSize: isMobile ? '16px' : '20px' }}>
//                                                             {source}: {amount}
//                                                         </li>

//                                                     ))}
//                                                 </ol>

//                                                 <h3 style={{ fontSize: isMobile ? '18px' : '24px' }}>Total Income: {totalAmount}</h3>
//                                             </div>


//                                             <div className="card3  mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px" }}>
//                                                 <h4 style={{ fontSize: isMobile ? '18px' : '24px' }}>Expences</h4>
//                                                 <h2>{totalCost} RS/-</h2>
//                                             </div>
//                                             <div className="card4 mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px" }}>
//                                                 <h4 style={{ fontSize: isMobile ? '16px' : '24px' }}>Tax Amount</h4>
//                                                 <h2>{totalTaxAmount} RS/-</h2>
//                                             </div>

//                                         </div>

//                                         <div class="mt-5 mx-5" style={{ display: "flex", justifyContent: "space-between", marginBottom: "100px" }}>
//                                             <button onClick={onClickCat} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Categories</button>
//                                             <button onClick={onClickProducts} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Products</button>
//                                             <button onClick={click} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Expences</button>
//                                         </div>
//                                     </div>
//                                 }
//                                 {showTable &&
//                                     <div style={{ display: "flex", flexDirection: "column" }}>
//                                         <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>
//                                         <input type="text" class="form-control mx-2" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} style={{ marginRight: "10px", padding: "5px", width: "50vw" }} />
//                                         {/* <div style={{ maxWidth: isMobile ? "600px" : "1000px", overflowX: "auto" }}>

//                                             <table className="table table-bordered mx-5 mt-2" style={{ width: isMobile ? "300px" : "800px", textAlign: "center" }}> */}

//                                         <div style={{ maxWidth: isMobile ? "100vw" : "80vw", overflowX: "auto" }} className="mx-2">
//                                             <table className="table table-bordered mt-2" >
//                                                 <thead style={{ color: isdark ? "white" : "navy" }}>
//                                                     <th >Category</th>
//                                                     <th>Product</th>
//                                                     <th>cost</th>
//                                                     <th>Source</th>
//                                                     <th>purchaseDate</th>
//                                                     <th>taxAmount</th>
//                                                     <th>Description</th>

//                                                     <th>Image</th>
//                                                     <th>Action</th>
//                                                 </thead>
//                                                 <tbody>
//                                                     {itemsData.filter((d) => searchTerm === "" || d.category.toLowerCase().includes(searchTerm.toLowerCase()) || new Date(d.p_date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) || d.product.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase())).map((d, i) => {

//                                                         const date = new Date(d.p_date);
//                                                         const formattedDate = `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
//                                                         return (
//                                                             <tr key={i} >
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.cost}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.source}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{formattedDate}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.tax_amount}</td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.description}</td>

//                                                                 <td style={{ position: 'relative', backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>
//                                                                     {d.image && (
//                                                                         <>
//                                                                             <img src={d.image} alt={`error for ${d.name}`} style={{ maxWidth: "100px", maxHeight: "50px" }} />
//                                                                             <FiEye
//                                                                                 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer', color: 'white', zIndex: 1 }}
//                                                                                 onClick={() => imageClick(d.image)}

//                                                                             />

//                                                                         </>
//                                                                     )}
//                                                                 </td>
//                                                                 <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}><button onClick={() => handleDeleteExpence(d.id)} className="btn btn-danger"><FaTrash /></button></td>

//                                                             </tr>
//                                                         )
//                                                     })}

//                                                 </tbody>
//                                                 {/* <tfoot>
//                                                     <tr>

//                                                         <td colSpan="3" style={{ textAlign: "right" }}>Total Cost: <b>{totalCost}</b></td>

//                                                         <td colSpan="3" style={{ textAlign: "right" }}>Total Tax Amount: <b>{totalTaxAmount}</b></td>
//                                                     </tr>
//                                                 </tfoot> */}

//                                             </table>
//                                         </div>

//                                         <div class="d-flex mx-5" style={{color:isdark?"white":"black"}}>

//                                             <p className="px-2">Total Cost: <b>{totalCost}</b></p>

//                                             <p className="px-2">Total Tax Amount: <b>{totalTaxAmount}</b></p>
//                                         </div>

//                                         <div className="pagination mt-3" class="mt-5 mb-5 mx-5" style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <button onClick={handlePrevPageitems} disabled={currentPageItems === 1} className="btn btn-primary mx-1">
//                                                 Previous
//                                             </button>
//                                             <span style={{ color: isdark ? "white" : "black" }}>{currentPageItems} / {totalPagesforItems}</span>
//                                             <button onClick={handleNextPageitems} disabled={currentPageItems === totalPagesforItems} className="btn btn-primary mx-1">
//                                                 Next
//                                             </button>
//                                         </div>


//                                         <div class="mt-2 mx-5" style={{ display: "flex", justifyContent: "space-between",marginBottom:"100px" }}>
//                                             <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>


//                                             <CSVLink
//                                                 data={csvData}
//                                                 filename={"reports.csv"}
//                                                 className={`btn btn-success ${isMobile ? "btn-sm" : "btn-lg"}`}
//                                             >
//                                                 Download Reports <FaDownload />
//                                             </CSVLink>
//                                         </div>



//                                     </div>
//                                 }


//                                 {showItems &&
//                                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                                         <div style={{ overflowX: "auto" }}>
//                                             <table className="table table-bordered mt-5" style={{ width: isMobile ? "100vw" : "80vw", textAlign: "center" }}>
//                                                 <thead style={{ color: isdark ? "white" : "navy" }}>
//                                                     <th>Category</th>
//                                                     <th>Product</th>
//                                                     <th>Action</th>
//                                                 </thead>
//                                                 <tbody>
//                                                     {currentProductData.map((d, i) => (
//                                                         <tr key={i} >
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product}</td>
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}><button onClick={() => handleDeleteProduct(d.id)} className="btn btn-danger"><FaTrash /></button></td>
//                                                         </tr>
//                                                     )
//                                                     )}

//                                                 </tbody>


//                                             </table>
//                                         </div>
//                                         <div className="pagination mt-3">
//                                             <button onClick={handlePrevPagepro} disabled={currentPagepro === 1} className="btn btn-primary mx-1">
//                                                 Previous
//                                             </button>
//                                             <span style={{ color: isdark ? "white" : "black" }}>{currentPagepro} / {totalPagesforPro}</span>
//                                             <button onClick={handleNextPagepro} disabled={currentPagepro === totalPagesforPro} className="btn btn-primary mx-1">
//                                                 Next
//                                             </button>
//                                         </div>

//                                         <button onClick={onBack} className={`btn btn-info mt-5 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
//                                     </div>
//                                 }


//                                 {showCategories &&

//                                     <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                                         <div style={{ overflowX: "auto" }}>
//                                             <table className="table table-bordered mt-5" style={{ width: isMobile ? "100vw" : "80vw", textAlign: "center" }}>
//                                                 <thead style={{ color: isdark ? "white" : "navy" }}>
//                                                     <tr>
//                                                         <th>ID</th>
//                                                         <th>Category</th>
//                                                         <th>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {currentData.map((d, i) => (
//                                                         <tr key={i} >
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.id}</td>
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
//                                                             <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>
//                                                                 <button onClick={() => handleDeleteCategory(d.id)} className="btn btn-danger">
//                                                                     <FaTrash />
//                                                                 </button>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className="pagination mt-3">
//                                             <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn btn-primary mx-1">
//                                                 Previous
//                                             </button>
//                                             <span style={{ color: isdark ? "white" : "black" }}>{currentPage} / {totalPages}</span>
//                                             <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn btn-primary mx-1">
//                                                 Next
//                                             </button>
//                                         </div>
//                                         <button onClick={onBack} className={`btn btn-info mt-5 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
//                                     </div>
//                                 }


//                                 {/* {showImageComponent && <ImageComponent />} */}




//                             </div>
//                         }
//                     </div>

//                 </div>
//             </div>

//         </div>

//     )
// }

// export default Reports


import { useState, useEffect, useRef } from "react"
import Slidebar from "./Slidebar"
import { ProgressSpinner } from 'primereact/progressspinner';
import "./Reports.css"
import useMediaQuery from '@mui/material/useMediaQuery';
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { FaTrash } from 'react-icons/fa';
import { Toast } from 'primereact/toast';
import { FiEye } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import ImageComponent from "./ImageComponent";
import Category from "./Category";

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => (currentYear - 3 + index).toString());

function Reports({ id, isdark }) {
    const [Month, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [Year, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [totalCostData, setExpenseCost] = useState([])
    const [sourceData, setSourceData] = useState([])
    // const [totalMinusExpenseData, setFilteredSourceData] = useState([])
    const [showTable, setViewTable] = useState(false)
    const [showItems, setViewItems] = useState(false)
    const [showCategories, setViewCategories] = useState(false)
    const [productsData, setProductsData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [showImageComponent, setViewImageComponent] = useState(false)
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const toast = useRef(null);

    const [fromdashboard, setfromdashboard] = useState("")


    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const category = params.get('category');
    //     if (category) {
    //         setSearchTerm(category);
    //     }
    // }, [location.search]);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const month = params.get('month');
        const year = params.get('year');
        setfromdashboard(category)

        if (category) {
            setSearchTerm(category);
        }
        if (month) {
            setSelectedMonth(month);
        }
        if (year) {
            setSelectedYear(year);
        }
        setViewTable(true)
    }, [location.search, setSearchTerm, setSelectedMonth, setSelectedYear]);

    const [loading, setLoading] = useState(false)

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        if (name === "month") {
            setSelectedMonth(value);
        } else if (name === "year") {
            setSelectedYear(value);
        }
    };

    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getExpenseCost/${userId}`)
            .then(res => res.json())
            .then(data => setExpenseCost(data))
            .catch(err => console.log(err))
    }, [id]);

    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getReportSource/${userId}`)
            .then(res => res.json())
            .then(data => setSourceData(data))
            .catch(err => console.log(err))
    }, [id]);


    useEffect(() => {
        const userId = id;

        fetch(`https://exciting-spice-armadillo.glitch.me/getCategoriesAndProducts/${userId}`)
            .then(res => res.json())
            .then(data => setProductsData(data))
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        const userId = id;

        fetch(`https://exciting-spice-armadillo.glitch.me/getCategories/${userId}`)
            .then(res => res.json())
            .then(data => setCategoriesData(data))
            .catch(err => console.log(err));
    }, [id]);

    const filteredSourceData = sourceData.filter((item) => {
        return item.month === parseInt(Month) && item.year === Year;
    });
    const aggregatedData = filteredSourceData.reduce((acc, curr) => {
        if (acc[curr.source]) {
            acc[curr.source] += parseInt(curr.amount);
        } else {
            acc[curr.source] = parseInt(curr.amount);
        }
        return acc;
    }, {});
    const totalAmount = filteredSourceData.reduce((total, item) => {
        let totalamount = total + parseInt(item.amount);
        return totalamount;
    }, 0);
    const filteredTotalCostData = totalCostData.filter((d) => {
        return d.month.toString() === Month & d.year.toString() === Year;
    });

    const click = () => {
        setViewTable(true)
    }
    const onClickCat = () => {
        setViewCategories(true)
    }

    const onClickProducts = () => {

        setViewItems(true)
    }

    const onBack = () => {
        setViewTable(false)
        setViewItems(false)
        setViewCategories(false)

    }

    const todashboard = () => {
        navigate('/dashBoard')
    }
    const csvData = filteredTotalCostData.map(item => ({
        Category: item.category,
        Product: item.product,
        Cost: item.cost,
        Source: item.source,
        PurchaseDate: item.p_date,
        // PurchaseDate:item.p_date.substring(2, 4) + '-' + item.p_date.substring(5, 7) + '-' + item.p_date.substring(8, 10),
        TaxAmount: item.tax_amount,
        Description: item.description
    }));

    const handleDeleteProduct = (item_id) => {

        setLoading(true);
        const user_id = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/deleteProducts/${parseInt(item_id)}/${user_id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
                    const updatedProdductsData = productsData.filter((pro) => pro.id !== item_id);
                    setProductsData(updatedProdductsData);

                }
            })
            .catch((error) => {
                // Handle error
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
            })
            .finally(() => {
                // Reset loading state
                setLoading(false);
            });
    };
    const handleDeleteCategory = (item_id) => {

        setLoading(true);
        const user_id = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/deleteCategories/${parseInt(item_id)}/${user_id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
                    const updatedCategoriesData = categoriesData.filter((category) => category.id !== item_id);
                    setCategoriesData(updatedCategoriesData);

                }
            })
            .catch((error) => {
                // Handle error
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
            })
            .finally(() => {
                // Reset loading state
                setLoading(false);
            });
    };
    const handleDeleteExpence = (item_id) => {

        setLoading(true);
        const user_id = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/deleteExpence/${parseInt(item_id)}/${user_id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.ok) {

                    console.log("deleted Succesfully")
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
                    const updatedExpenceData = totalCostData.filter((category) => category.id !== item_id);
                    setExpenseCost(updatedExpenceData);

                }
            })

            .catch((error) => {
                // Handle error
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete Expence' });
            })

            .finally(() => {
                // Reset loading state
                setLoading(false);
            });
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredDataForTotalCost = filteredTotalCostData.filter((d) =>
        searchTerm === "" ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(d.p_date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())


    );

    const totalCost = filteredDataForTotalCost.reduce((acc, d) => acc + parseFloat(d.cost), 0);
    const totalTaxAmount = filteredDataForTotalCost.reduce((acc, curr) => acc + parseFloat(curr.tax_amount), 0);

    const imageClick = (imageUrl) => {
        // window.open(imageUrl, '_blank');
        // setViewImageComponent(true)
        setImage(imageUrl)

        navigate("/image", { state: imageUrl })

    }

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPagepro, setCurrentPagePro] = useState(1);
    const [currentPageItems, setCurrentPageitems] = useState(1);
    const rowsPerPage = 6;

    const totalPages = Math.ceil(categoriesData.length / rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const totalPagesforPro = Math.ceil(productsData.length / rowsPerPage);

    const handleNextPagepro = () => {
        setCurrentPagePro((prevPagpro) => Math.min(prevPagpro + 1, totalPagesforPro));
    };

    const handlePrevPagepro = () => {
        setCurrentPagePro((prevPagpro) => Math.max(prevPagpro - 1, 1));
    };


    const totalPagesforItems = Math.ceil(filteredTotalCostData.length / rowsPerPage);

    const handleNextPageitems = () => {
        setCurrentPageitems((prevPag) => Math.min(prevPag + 1, totalPagesforItems));
    };

    const handlePrevPageitems = () => {
        setCurrentPageitems((prevPag) => Math.max(prevPag - 1, 1));
    };


    const currentData = categoriesData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const currentProductData = productsData.slice((currentPagepro - 1) * rowsPerPage, currentPagepro * rowsPerPage);

    const itemsData = filteredTotalCostData.slice((currentPageItems - 1) * rowsPerPage, currentPageItems * rowsPerPage);

    return (

        <div className="d-flex flex-column">
            <Toast ref={toast} />
            <div>
                <div class="d-flex">
                    {!isMobile && (
                        <div style={{ width: "15%" }}>

                            <div>
                                <Slidebar isdark={isdark} />
                            </div>
                        </div>
                    )}
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: isMobile ? "100%" : "85%", minHeight: "100vh" }}>

                        {loading &&
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                            </div>}
                        {!loading &&
                            <div className="d-flex flex-column" style={{ width: isMobile ? "100%" : "100%", backgroundColor: isdark ? "black" : "whitesmoke", height: "100%", }}>


                                <div class="d-flex justify-content-between p-5">
                                    {!fromdashboard && !showItems && !showCategories && <div class="d-flex">
                                        <select
                                            name="month"
                                            style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", marginLeft: "20px" }}
                                            className="form-control"
                                            value={Month}
                                            onChange={handleSelectChange}

                                        >
                                            {months.map((month, index) => (
                                                <option key={index} value={index + 1}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            name="year"
                                            style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", marginLeft: "20px" }}
                                            className="form-control"
                                            value={Year}
                                            onChange={handleSelectChange}
                                        >
                                            {years.map((year, index) => (
                                                <option key={index} value={year}>{year}</option>
                                            ))}
                                        </select>

                                    </div>
                                    }
                                </div>

                                {!fromdashboard && !showTable && !showItems && !showCategories &&
                                    <div className="d-flex flex-column justify-content-center" >
                                        <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>
                                        <div className="d-flex  justify-content-center align-items-center" style={{ flexDirection: isMobile ? "column" : "row" }}>

                                            <div className="card px-2 mt-5 mx-5 pt-2" style={{ width: isMobile ? "200px" : "300px" }}>
                                                <h1 style={{ fontSize: isMobile ? '18px' : '24px' }}>Sources of Income From</h1>
                                                <ol>
                                                    {Object.entries(aggregatedData).map(([source, amount]) => (
                                                        <li key={source} style={{ fontSize: isMobile ? '16px' : '20px' }}>
                                                            {source}: {amount}
                                                        </li>

                                                    ))}
                                                </ol>

                                                <h3 style={{ fontSize: isMobile ? '18px' : '24px' }}>Total Income: {totalAmount}</h3>
                                            </div>


                                            <div className="card3  mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px" }}>
                                                <h4 style={{ fontSize: isMobile ? '18px' : '24px' }}>Expences</h4>
                                                <h2>{totalCost} RS/-</h2>
                                            </div>
                                            <div className="card4 mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px" }}>
                                                <h4 style={{ fontSize: isMobile ? '16px' : '24px' }}>Tax Amount</h4>
                                                <h2>{totalTaxAmount} RS/-</h2>
                                            </div>

                                        </div>

                                        <div class="mt-5 mx-5" style={{ display: "flex", justifyContent: "space-between", marginBottom: "100px" }}>
                                            <button onClick={onClickCat} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Categories</button>
                                            <button onClick={onClickProducts} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Products</button>
                                            <button onClick={click} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Expences</button>
                                        </div>
                                    </div>
                                }

                                {showTable &&
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {!fromdashboard && <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>}
                                        {!fromdashboard && <input type="text" className={isMobile ? "form-control mx-1" : "form-control mx-5"} placeholder="Search..." value={searchTerm} onChange={handleSearchChange} style={{ marginRight: "10px", padding: "5px", width: "50vw" }} />}

                                        {/* <div style={{ maxWidth: isMobile ? "600px" : "1000px", overflowX: "auto" }}>

                                            <table className="table table-bordered mx-5 mt-2" style={{ width: isMobile ? "300px" : "800px", textAlign: "center" }}> */}

                                        <div style={{ maxWidth: isMobile ? "100vw" : "80vw", overflowX: "auto" }} className={isMobile ? "mx-1" : "mx-5"}>
                                            {fromdashboard && <button onClick={todashboard}>Back</button>}

                                            <table className="table table-bordered mt-2" >
                                                <thead style={{ color: isdark ? "white" : "navy" }}>
                                                    <th >Category</th>
                                                    <th>Product</th>
                                                    <th>cost</th>
                                                    <th>Source</th>
                                                    <th>purchaseDate</th>
                                                    <th>taxAmount</th>
                                                    <th>Description</th>

                                                    <th>Image</th>
                                                    {!fromdashboard && <th>Action</th>}
                                                </thead>
                                                <tbody>
                                                    {itemsData.filter((d) => searchTerm === "" || d.category.toLowerCase().includes(searchTerm.toLowerCase()) || new Date(d.p_date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) || d.product.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase())).map((d, i) => {

                                                        const date = new Date(d.p_date);
                                                        const formattedDate = `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                                                        return (
                                                            <tr key={i} >
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.cost}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.source}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{formattedDate}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.tax_amount}</td>
                                                                <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.description}</td>

                                                                <td style={{ position: 'relative', backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>
                                                                    {d.image && (
                                                                        <>
                                                                            <img src={d.image} alt={`error for ${d.name}`} style={{ maxWidth: "100px", maxHeight: "50px" }} />
                                                                            <FiEye
                                                                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer', color: 'white', zIndex: 1 }}
                                                                                onClick={() => imageClick(d.image)}

                                                                            />

                                                                        </>
                                                                    )}
                                                                </td>
                                                                {!fromdashboard && <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}><button onClick={() => handleDeleteExpence(d.id)} className="btn btn-danger"><FaTrash /></button></td>}

                                                            </tr>
                                                        )
                                                    })}

                                                </tbody>
                                                {/* <tfoot>
                                                    <tr>

                                                        <td colSpan="3" style={{ textAlign: "right" }}>Total Cost: <b>{totalCost}</b></td>

                                                        <td colSpan="3" style={{ textAlign: "right" }}>Total Tax Amount: <b>{totalTaxAmount}</b></td>
                                                    </tr>
                                                </tfoot> */}

                                            </table>
                                        </div>

                                        <div className={isMobile ? "d-flex mx-1" : "d-flex mx-5"} style={{ color: isdark ? "white" : "black" }}>

                                            <p className="px-2">Total Cost: <b>{totalCost}</b></p>

                                            <p className="px-2">Total Tax Amount: <b>{totalTaxAmount}</b></p>
                                        </div>

                                        <div className="pagination mt-3" class="mt-5 mb-5 mx-5" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <button onClick={handlePrevPageitems} disabled={currentPageItems === 1} className="btn btn-primary mx-1">
                                                Previous
                                            </button>
                                            <span style={{ color: isdark ? "white" : "black" }}>{currentPageItems} / {totalPagesforItems}</span>
                                            <button onClick={handleNextPageitems} disabled={currentPageItems === totalPagesforItems} className="btn btn-primary mx-1">
                                                Next
                                            </button>
                                        </div>
                                        {!fromdashboard &&
                                                <div class="mt-2 mx-5" style={{ display: "flex", justifyContent: "space-between", marginBottom: "100px" }}>
                                                    <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back To Reports</button>


                                                    <CSVLink
                                                        data={csvData}
                                                        filename={"reports.csv"}
                                                        className={`btn btn-success ${isMobile ? "btn-sm" : "btn-lg"}`}
                                                    >
                                                        Download Reports <FaDownload />
                                                    </CSVLink>
                                                </div>

                                            }
                                    </div>
                                }


                                {!fromdashboard && showItems &&
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="table table-bordered mt-5" style={{ width: isMobile ? "100vw" : "80vw", textAlign: "center" }}>
                                                <thead style={{ color: isdark ? "white" : "navy" }}>
                                                    <th>Category</th>
                                                    <th>Product</th>
                                                    <th>Action</th>
                                                </thead>
                                                <tbody>
                                                    {currentProductData.map((d, i) => (
                                                        <tr key={i} >
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.product}</td>
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}><button onClick={() => handleDeleteProduct(d.id)} className="btn btn-danger"><FaTrash /></button></td>
                                                        </tr>
                                                    )
                                                    )}

                                                </tbody>


                                            </table>
                                        </div>
                                        <div className="pagination mt-3">
                                            <button onClick={handlePrevPagepro} disabled={currentPagepro === 1} className="btn btn-primary mx-1">
                                                Previous
                                            </button>
                                            <span style={{ color: isdark ? "white" : "black" }}>{currentPagepro} / {totalPagesforPro}</span>
                                            <button onClick={handleNextPagepro} disabled={currentPagepro === totalPagesforPro} className="btn btn-primary mx-1">
                                                Next
                                            </button>
                                        </div>

                                        <button onClick={onBack} className={`btn btn-info mt-5 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
                                    </div>
                                }


                                {!fromdashboard && showCategories &&

                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="table table-bordered mt-5" style={{ width: isMobile ? "100vw" : "80vw", textAlign: "center" }}>
                                                <thead style={{ color: isdark ? "white" : "navy" }}>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Category</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.map((d, i) => (
                                                        <tr key={i} >
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.id}</td>
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.category}</td>
                                                            <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>
                                                                <button onClick={() => handleDeleteCategory(d.id)} className="btn btn-danger">
                                                                    <FaTrash />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="pagination mt-3">
                                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn btn-primary mx-1">
                                                Previous
                                            </button>
                                            <span style={{ color: isdark ? "white" : "black" }}>{currentPage} / {totalPages}</span>
                                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn btn-primary mx-1">
                                                Next
                                            </button>
                                        </div>
                                        <button onClick={onBack} className={`btn btn-info mt-5 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
                                    </div>
                                }


                                {/* {showImageComponent && <ImageComponent />} */}




                            </div>
                        }
                    </div>

                </div>
            </div>

        </div>

    )
}

export default Reports
