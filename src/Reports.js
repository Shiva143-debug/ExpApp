import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { FiEye } from 'react-icons/fi';
import { Toast } from 'primereact/toast';
import { CSVLink } from "react-csv";
import Additems from "./Additems"
import AddCategory from "./AddCategory"
import Category from "./Category"
import Slidebar from "./Slidebar"
import Source from "./Source"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./Reports.css"


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
    const [showTable, setViewTable] = useState(false)
    const [showItems, setViewItems] = useState(false)
    const [showSource, setViewSource] = useState(false)
    const [showCategories, setViewCategories] = useState(false)
    const [productsData, setProductsData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [mainsourceData, setMainSourceData] = useState([]);
    const [fromdashboard, setfromdashboard] = useState("")
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false)
    const [ShowProductDialogue, setShowProductDialogue] = useState(false)
    const [ShowCategoryDialogue, setShowCategoryDialogue] = useState(false)
    const [ShowSourceDialogue, setShowSourceDialogue] = useState(false)
    const [ShowExpenceDialogue, setShowExpenceDialogue] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);
    const [selectedExpence, setSelectedExpence] = useState(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');
    const location = useLocation();
    const toast = useRef(null);

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

    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getSourceData/${userId}`)
            .then(res => res.json())
            .then(data => setMainSourceData(data))
            .catch(err => console.log(err));
    }, [id]);

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        if (name === "month") {
            setSelectedMonth(value);
        } else if (name === "year") {
            setSelectedYear(value);
        }
    };

    const click = () => {
        setViewTable(true)
    }

    const onClickCat = () => {
        setViewCategories(true)
    }

    const onClickProducts = () => {
        setViewItems(true)
    }

    const onclickSource = () => {
        setViewSource(true)
    }

    const onBack = () => {
        setViewTable(false)
        setViewItems(false)
        setViewCategories(false)
        setViewSource(false)
    }

    const todashboard = () => {
        navigate('/dashBoard')
    }

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
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpdateProduct = (rowData) => {
        setShowProductDialogue(true)
        setSelectedCategory(rowData);
    }

    const handleUpdateCategory = (rowData) => {
        setShowCategoryDialogue(true)
        setSelectedCategory(rowData);
    }

    const handleUpdateSource = (rowData) => {
        setShowSourceDialogue(true)
        setSelectedSource(rowData);
    }

    const handleUpdateExpence = (rowData) => {
        setShowExpenceDialogue(true)
        setSelectedExpence(rowData);
    }


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
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
            })
            .finally(() => {

                setLoading(false);
            });
    };

    const handleDeleteSource = (item_id) => {
        setLoading(true);
        const user_id = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/deleteSource/${parseInt(item_id)}/${user_id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'deleted successfully' });
                    const updatedSourceData = sourceData.filter((source) => source.id !== item_id);
                    setMainSourceData(updatedSourceData);
                }
            })
            .catch((error) => {
                console.error('Error deleting source:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete source' });
            })
            .finally(() => {
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
                console.error('Error deleting category:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete Expence' });
            })

            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const imageClick = (imageUrl) => {
        navigate("/image", { state: imageUrl })
    }

    const dateFilterTemplate = (date) => {
        return `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex flex-shrink">
                <button onClick={() => handleUpdateExpence(rowData)} className="btn btn-primary mx-2"><MdOutlineDriveFileRenameOutline /></button>
                <button onClick={() => handleDeleteExpence(rowData.id)} className="btn btn-danger"><FaTrash /></button>
            </div>
        )
    }

    const actionBodyTemplateForCategory = (rowData) => {
        return (
            <div className="d-flex flex-shrink">
                <button onClick={() => handleUpdateCategory(rowData)} className="btn btn-primary mx-2"><MdOutlineDriveFileRenameOutline /></button>
                <button onClick={() => handleDeleteCategory(rowData.id)} className="btn btn-danger"><FaTrash /></button>
            </div>
        )
    }

    const actionBodyTemplateForSource = (rowData) => {
        return (
            <div className="d-flex flex-shrink">
                <button onClick={() => handleUpdateSource(rowData)} className="btn btn-primary mx-2"><MdOutlineDriveFileRenameOutline /></button>
                <button onClick={() => handleDeleteSource(rowData.id)} className="btn btn-danger"><FaTrash /></button>
            </div>
        )
    }

    const actionBodyTemplateForProduct = (rowData) => {
        return (
            <div className="d-flex flex-shrink">
                <button onClick={() => handleUpdateProduct(rowData)} className="btn btn-primary mx-2"><MdOutlineDriveFileRenameOutline /></button>
                <button onClick={() => handleDeleteProduct(rowData.id)} className="btn btn-danger"><FaTrash /></button>
            </div>
        )
    }

    const imageBodyTemplate = (rowData) => {
        if (!rowData.image) return <p>No Image</p>;
        return (
            <div style={{ position: "relative", display: "inline-block", maxWidth: "100px", maxHeight: "50px" }}>
                <img src={rowData.image} alt={`error for ${rowData.name}`} style={{ width: "100px", maxHeight: "50px" }} />
                <FiEye style={{ position: 'absolute', cursor: 'pointer', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, color: isdark ? "white" : "red" }} className="eye-icon" onClick={() => imageClick(rowData.image)} />
            </div>
        )
    }

    const descriptionBodyTemplate = (rowData) => {
        if (!rowData.description) return <p>No Description</p>
        return (
            <p>{rowData.description}</p>
        )
    }

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

    const csvData = filteredTotalCostData.map(item => ({ Category: item.category, Product: item.product, Cost: item.cost, Source: item.source, PurchaseDate: item.p_date, TaxAmount: item.tax_amount, Description: item.description }));

    const filteredDataForTotalCost = filteredTotalCostData.filter((d) => {
        if (fromdashboard) {
            return d.category.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return (
                d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(d.p_date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    });

    const filteredItems = filteredTotalCostData.filter((d) => {
        const dateObject = new Date(d.p_date);
        const formattedDate = dateFilterTemplate(dateObject);
        const searchTermLower = searchTerm.toLowerCase();
        const formattedDateLower = formattedDate.toLowerCase();
        if (!fromdashboard) {
            return (
                d.category.toLowerCase().includes(searchTermLower) ||
                formattedDateLower.includes(searchTermLower) ||
                d.product.toLowerCase().includes(searchTermLower) ||
                d.description.toLowerCase().includes(searchTermLower)
            );
        } else {
            return d.category.toLowerCase().includes(searchTermLower);
        }
    });

    const totalCost = filteredDataForTotalCost.reduce((acc, d) => acc + parseFloat(d.cost), 0);
    const totalTaxAmount = filteredDataForTotalCost.reduce((acc, curr) => acc + parseFloat(curr.tax_amount), 0);


    const exportPdf = () => {
        let exportColumns = [
            { header: 'Category', dataKey: 'category' },
            { header: 'Product', dataKey: 'product' },
            { header: 'Cost', dataKey: 'cost' },
            { header: 'Date', dataKey: 'p_date' },
            { header: 'Tax Amount', dataKey: 'tax_amount' },
            { header: 'Description', dataKey: 'description' },
        ];
        const assets = filteredItems.map(item => ({ category: item.category, product: item.product, cost: item.cost, p_date: item.p_date, tax_amount: item.tax_amount, description: item.description }));
        const doc = new jsPDF({
            orientation: 'portrait', unit: 'mm', format: [210, 297],
        });

        let yPos = 40;
        Object.entries(aggregatedData).forEach(([source, amount], index) => {
            doc.setFontSize(12);
            doc.text(`${source}: ${amount}`, 10, yPos);
            yPos += 7;
        });

        doc.autoTable({
            columns: exportColumns,
            body: assets,
            startY: yPos + 10,
            margin: { top: 50 },
            styles: { overflow: 'linebreak' },
            columnStyles: {
                cost: { halign: 'right' },
                tax_amount: { halign: 'right' },
            },
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            showHead: 'everyPage',
            foot: [[
                { content: 'Total:', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: totalCost, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '', },
                { content: totalTaxAmount, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: '' },
            ]]
        });

        const addHeaders = doc => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(25);
                doc.text(`${months[Month - 1]} - ${Year} Report`, 10, 30);
                doc.setFontSize(14);
                doc.setFont('', 'bold');
                doc.setFontSize(25);
                doc.text('Expenditure', doc.internal.pageSize.width - 68, 25);
                doc.setLineWidth(1);
                doc.line(10, 32, doc.internal.pageSize.width - 10, 32);
            }
        };

        const addFooters = doc => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
            }
        };

        addHeaders(doc);
        addFooters(doc);
        doc.save(`${months[Month - 1]}_${Year}_Report.pdf`);
    };

    const onHide = () => {
        setShowProductDialogue(false)
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getCategoriesAndProducts/${userId}`)
            .then(res => res.json())
            .then(data => setProductsData(data))
            .catch(err => console.log(err));

    }

    const onHideCategory = () => {
        setShowCategoryDialogue(false)
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getCategories/${userId}`)
            .then(res => res.json())
            .then(data => setCategoriesData(data))
            .catch(err => console.log(err));
    }

    const onHideSource = () => {
        setShowSourceDialogue(false)
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getSourceData/${userId}`)
            .then(res => res.json())
            .then(data => setMainSourceData(data))
            .catch(err => console.log(err));
    }

    const onHideExpence = () => {
        setShowExpenceDialogue(false)
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getExpenseCost/${userId}`)
            .then(res => res.json())
            .then(data => setExpenseCost(data))
            .catch(err => console.log(err))
    }
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
                        {loading && (
                            <div className="spinner-container">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                            </div>
                        )}
                        <div className="d-flex flex-column" style={{ width: isMobile ? "100%" : "100%", backgroundColor: isdark ? "black" : "whitesmoke", height: "100%", }}>
                            <div class="d-flex justify-content-between p-5">
                                {!fromdashboard && !showItems && !showCategories && !showSource && <div class="d-flex">
                                    <select name="month" style={{ width: isMobile ? "100px" : "300px", marginTop: "50px", backgroundColor: "transparent", color: isdark ? "white" : "black" }} className="form-control" value={Month} onChange={handleSelectChange}>
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1} style={{ color: "black" }}>{month}</option>
                                        ))}
                                    </select>
                                    <select name="year" style={{ width: isMobile ? "100px" : "300px", marginTop: "50px", marginLeft: "20px", backgroundColor: "transparent", color: isdark ? "white" : "black" }} className="form-control" value={Year} onChange={handleSelectChange}>
                                        {years.map((year, index) => (
                                            <option key={index} value={year} style={{ color: "black" }}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                }
                            </div>
                            {!fromdashboard && !showTable && !showItems && !showCategories && !showSource &&
                                <div className="d-flex flex-column justify-content-center" >
                                    <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>
                                    <div className="d-flex  justify-content-center align-items-center" style={{ flexDirection: isMobile ? "column" : "row" }}>
                                        <div className="card px-2 mt-5 mx-5 pt-2" style={{ width: isMobile ? "200px" : "300px", backgroundColor: isdark ? "black" : "", border: isdark ? "1px solid white" : "", color: isdark ? "white" : "" }}>
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
                                        <div className="card3  mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px", backgroundColor: isdark ? "black" : "", border: isdark ? "1px solid white" : "", color: isdark ? "white" : "" }}>
                                            <h4 style={{ fontSize: isMobile ? '18px' : '24px' }}>Expences</h4>
                                            <h2>{totalCost} RS/-</h2>
                                        </div>
                                        <div className="card4 mx-5  mt-5 p-4" style={{ width: isMobile ? "200px" : "300px", backgroundColor: isdark ? "black" : "", border: isdark ? "1px solid white" : "", color: isdark ? "white" : "" }}>
                                            <h4 style={{ fontSize: isMobile ? '16px' : '24px' }}>Tax Amount</h4>
                                            <h2>{totalTaxAmount.toFixed(1)} RS/-</h2>
                                        </div>
                                    </div>
                                    <div class="mt-5" style={{ display: "flex", justifyContent: "space-between", marginBottom: "100px" }}>
                                        <button onClick={onClickCat} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Categories</button>
                                        <button onClick={onClickProducts} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Products</button>
                                        <button onClick={click} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Expences</button>
                                        <button onClick={onclickSource} className={`btn btn-primary mx-2 ${isMobile ? "btn-sm" : "btn-lg"}`}>View Source</button>
                                    </div>
                                </div>
                            }
                            {showTable &&
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {!fromdashboard && <center><h1 style={{ color: isdark ? "white" : "navy" }}> {months[Month - 1]} - {Year} Report</h1></center>}
                                    {!fromdashboard && <input type="text" className={isMobile ? "form-control mx-1" : "form-control mx-5"} placeholder="Search..." value={searchTerm} onChange={handleSearchChange} style={{ marginRight: "10px", padding: "5px", width: isMobile ? "50vw" : "20vw", backgroundColor: "transparent", color: isdark ? "white" : "black" }} />}
                                    <div style={{ maxWidth: isMobile ? "100vw" : "80vw", overflowX: "auto" }} className={isMobile ? "mx-1" : "mx-5"}>
                                        {fromdashboard && <button onClick={todashboard} className="report-back-button">Back</button>}
                                        {/* {!fromdashboard && <p style={{ color: isdark ? "white" : "black" }}>If you want filter the rows based on DATE 2024/08/04 use this format**</p>} */}
                                        <div className={` ${isdark ? 'dark-theme-table' : ''}`}>
                                            <DataTable value={filteredItems} stripedRows paginator rows={3} className="dataTable-pagination mt-2" style={{ width: isMobile ? "100vw" : "80vw" }}>
                                                <Column field="category" header="CATEGORY" style={{ width: '10%' }}></Column>
                                                <Column field="product" header="PRODUCT" style={{ width: '10%' }}></Column>
                                                <Column field="cost" header="COST" style={{ width: '10%' }}></Column>
                                                <Column field="p_date" header="DATE" style={{ width: '15%' }} filterElement={dateFilterTemplate} ></Column>
                                                <Column field="tax_amount" header="TAX AMOUNT" style={{ width: '15%' }}></Column>
                                                <Column field="description" header="DESCRIPTION" body={descriptionBodyTemplate} style={{ width: '15%' }}></Column>
                                                <Column header="IMAGE" body={imageBodyTemplate} style={{ width: '10%' }}></Column>
                                                {!fromdashboard && <Column header="ACTIONS" body={actionBodyTemplate} style={{ width: '35%'}}></Column>}
                                            </DataTable>
                                        </div>
                                    </div>
                                    <div className={isMobile ? "d-flex mx-1" : "d-flex mx-5"} style={{ color: isdark ? "white" : "black" }}>
                                        <p className="px-2">Total Cost: <b>{totalCost}</b></p>
                                        <p className="px-2">Total Tax Amount: <b>{totalTaxAmount.toFixed(1)}</b></p>
                                    </div>
                                    {!fromdashboard &&
                                        <div class="mt-2 mx-5" style={{ display: "flex", justifyContent: "space-between", marginBottom: "100px" }}>
                                            <button onClick={onBack} className={`btn btn-info ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back To Reports</button>
                                            <div >
                                                <CSVLink data={csvData} filename={"reports.csv"} className={`btn btn-success ${isMobile ? "btn-sm" : "btn-lg"}`}> Excel <FaDownload />
                                                </CSVLink>
                                                <button onClick={exportPdf} className={`btn btn-success ${isMobile ? "btn-sm" : "btn-lg"} mx-2`}>PDF <FaDownload /></button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }

                            {!fromdashboard && showItems &&
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <div className={` ${isdark ? 'dark-theme-table' : ''}`}>
                                        <DataTable value={productsData} stripedRows paginator rows={5} className="dataTable-pagination" style={{ width: isMobile ? "100vw" : "80vw" }}>
                                            <Column field="id" header="ID" style={{ width: '20%' }}></Column>
                                            <Column field="category" header="CATEGORY" style={{ width: '25%', overflowX: "hidden" }}></Column>
                                            <Column field="product" header="PRODUCT" style={{ width: '25%', overflowX: "hidden" }}></Column>
                                            <Column header="ACTIONS" body={actionBodyTemplateForProduct} style={{ width: '20%' }} ></Column>
                                        </DataTable>
                                    </div>
                                    <button onClick={onBack} className={`btn btn-info mt-2 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
                                </div>
                            }
                            {!fromdashboard && showCategories &&
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <div className={` ${isdark ? 'dark-theme-table' : ''}`} >
                                        <DataTable value={categoriesData} stripedRows paginator rows={5} className="dataTable-pagination" style={{ width: isMobile ? "100%" : "80vw" }}>
                                            <Column field="id" header="ID" style={{ width: '25%' }}></Column>
                                            <Column field="category" header="CATEGORY" style={{ width: '25%' }}></Column>
                                            <Column header="ACTIONS" body={actionBodyTemplateForCategory} style={{ width: '25%' }}></Column>
                                        </DataTable>
                                    </div>
                                    <button onClick={onBack} className={`btn btn-info mt-2 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
                                </div>
                            }
                            {!fromdashboard && showSource &&
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <div className={` ${isdark ? 'dark-theme-table' : ''}`} >
                                        <DataTable value={mainsourceData} stripedRows paginator rows={5} className="dataTable-pagination" style={{ width: isMobile ? "100%" : "80vw" }}>
                                            <Column field="source" header="SOURCE" style={{ width: '25%' }}></Column>
                                            <Column field="amount" header="AMOUNT" style={{ width: '25%' }}></Column>
                                            <Column field="date" header="DATE" style={{ width: '25%' }}></Column>
                                            <Column header="ACTIONS" body={actionBodyTemplateForSource} style={{ width: '25%' }}></Column>
                                        </DataTable>
                                    </div>
                                    <button onClick={onBack} className={`btn btn-info mt-2 mb-5 ${isMobile ? "btn-sm" : "btn-lg"}`} style={{ marginRight: "20px" }}>Back</button>
                                </div>
                            }
                        </div>
                        <Dialog visible={ShowProductDialogue} style={{ width: '90vw',height:"60vh" }} onHide={() => { if (!ShowProductDialogue) return; setShowProductDialogue(false); }}>
                            <AddCategory selectedCategory={selectedCategory} isdark={isdark} id={id} close={onHide} />
                        </Dialog>

                        <Dialog visible={ShowCategoryDialogue} style={{ width: '90vw',height:"30vh" }} onHide={() => { if (!ShowCategoryDialogue) return; setShowCategoryDialogue(false); }}>
                            <Category selectedCategory={selectedCategory} isdark={isdark} id={id} close={onHideCategory} />
                        </Dialog>

                        <Dialog visible={ShowSourceDialogue} style={{ width: '90vw',height:"90vh" }} onHide={() => { if (!ShowSourceDialogue) return; setShowSourceDialogue(false); }}>
                            <Source selectedSource={selectedSource} isdark={isdark} id={id} close={onHideSource} />
                        </Dialog>

                        <Dialog visible={ShowExpenceDialogue} style={{ width: '95vw',height:"90vh" }}  onHide={() => { if (!ShowExpenceDialogue) return; setShowExpenceDialogue(false); }}>
                            <Additems selectedExpence={selectedExpence} isdark={isdark} id={id} close={onHideExpence} />
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports
