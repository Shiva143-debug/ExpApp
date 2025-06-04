import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { CSVLink } from "react-csv";
import { FaDownload, FaTrash, FaFilter, FaChartBar, FaTable, FaArrowLeft } from "react-icons/fa";
import { FiEye, FiSearch } from 'react-icons/fi';
import { Toast } from 'primereact/toast';
import { useNavigate, useLocation } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import Slidebar from "./Micilinious/Slidebar";
import { useAuth } from '../context/AuthContext';
import { categoryService, productService, expenseService, sourceService } from '../api/apiService';
import "../styles/Reports.css";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => (currentYear - 3 + index).toString());

function Reports({ id, isdark }) {
  // State management
  const [month, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [totalCostData, setExpenseCost] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [mainSourceData, setMainSourceData] = useState([]);
  const [categoryFromDashboard, setCategoryFromDashboard] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState({ expenses: true, sources: true, categories: true, products: true });

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const monthParam = params.get('month');
    const yearParam = params.get('year');

    if (category) {
      setCategoryFromDashboard(category);
      setSearchTerm(category);
    }

    if (monthParam) {
      setSelectedMonth(monthParam);
    }

    if (yearParam) {
      setSelectedYear(yearParam);
    }

    if (category || monthParam || yearParam) {
      setActiveView("expenses");
    }
  }, [location.search]);

  // Fetch expense data
  useEffect(() => {
    const fetchExpenseCost = async () => {
      setComponentLoading(prev => ({ ...prev, expenses: true }));
      try {
        const data = await expenseService.getExpenseCost(id);
        setExpenseCost(data);
      } catch (error) {
        console.error("Error fetching expense cost:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load expense data' });
      } finally {
        setComponentLoading(prev => ({ ...prev, expenses: false }));
      }
    };

    if (id) {
      fetchExpenseCost();
    }
  }, [id]);

  // Fetch source data
  useEffect(() => {
    const fetchSourceData = async () => {
      setComponentLoading(prev => ({ ...prev, sources: true }));
      try {
        const data = await sourceService.getReportSourceData(id);
        setSourceData(data);
      } catch (error) {
        console.error("Error fetching source data:", error);
        toast.current.show({
          severity: 'error', summary: 'Error', detail: 'Failed to load source data'
        });
      } finally {
        setComponentLoading(prev => ({ ...prev, sources: false }));
      }
    };

    if (id) {
      fetchSourceData();
    }
  }, [id]);

  // Fetch categories and products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setComponentLoading(prev => ({ ...prev, categories: true, products: true }));

      try {
        const categoriesData = await categoryService.getAllCategoriesAndProducts(id);
        setProductsData(categoriesData);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load product data' });
      } finally {
        setComponentLoading(prev => ({ ...prev, products: false }));
      }

      try {
        const categories = await categoryService.getCategories(id);
        setCategoriesData(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.current.show({
          severity: 'error', summary: 'Error', detail: 'Failed to load category data'
        });
      } finally {
        setComponentLoading(prev => ({ ...prev, categories: false }));
      }

      try {
        const sourceData = await sourceService.getAllSourceData(id);
        setMainSourceData(sourceData);
      } catch (error) {
        console.error("Error fetching all source data:", error);
      }
    };

    if (id) {
      fetchCategoriesAndProducts();
    }
  }, [id]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "month") {
      setSelectedMonth(value);
    } else if (name === "year") {
      setSelectedYear(value);
    }
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle view image click
  const handleImageClick = (imageUrl) => {
    navigate("/image", { state: imageUrl });
  };

  // Handle delete expense
  const handleDeleteExpense = async (itemId) => {
    setLoading(true);
    try {
      await expenseService.deleteExpense(itemId, id);
      toast.current.show({
        severity: 'success', summary: 'Success', detail: 'Expense deleted successfully'
      });
      setExpenseCost(prevData => prevData.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.current.show({
        severity: 'error', summary: 'Error', detail: 'Failed to delete expense'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (itemId) => {
    setLoading(true);
    try {
      await categoryService.deleteCategory(itemId, id);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
      setCategoriesData(prevData => prevData.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (itemId) => {
    setLoading(true);
    try {
      await productService.deleteProduct(itemId, id);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
      setProductsData(prevData => prevData.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.current.show({
        severity: 'error', summary: 'Error', detail: 'Failed to delete product'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete source
  const handleDeleteSource = async (itemId) => {
    setLoading(true);
    try {
      await sourceService.deleteSource(itemId, id);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Source deleted successfully' });
      setMainSourceData(prevData => prevData.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting source:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete source' });
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected month and year
  const filteredExpenseData = totalCostData.filter(item =>
    item.month.toString() === month && item.year.toString() === year
  );

  // Filter data based on search term
  // const filteredSearchData = filteredExpenseData.filter(item => {
  //   if (categoryFromDashboard) {
  //     return item.category.toLowerCase() === categoryFromDashboard.toLowerCase();
  //   }

  //   const searchLower = searchTerm.toLowerCase();
  //   return (
  //     item.category.toLowerCase().includes(searchLower) ||
  //     item.product.toLowerCase().includes(searchLower) ||
  //     item.source.toLowerCase().includes(searchLower) ||
  //     (item.description && item.description.toLowerCase().includes(searchLower))
  //   );
  // });

  const filteredSearchData = useMemo(() => {
    return filteredExpenseData.filter(item => {
      // if (categoryFromDashboard) {
      //   return item?.category?.toLowerCase() === categoryFromDashboard.toLowerCase();
      // }

      const searchLower = searchTerm.toLowerCase();
      return (
        item?.category?.toLowerCase().includes(searchLower) ||
        item?.product?.toLowerCase().includes(searchLower) ||
        item?.source?.toLowerCase().includes(searchLower) ||
        item?.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [filteredExpenseData, searchTerm, categoryFromDashboard]);


  // Calculate total cost
  const totalCost = filteredSearchData.reduce((total, item) =>
    total + parseFloat(item.cost), 0
  );

  // Prepare CSV data
  const csvData = filteredSearchData.map(item => ({
    Category: item.category,
    Expence: item.product,
    Amount: item.cost,
    PurchaseDate: item.p_date,
    TaxAmount: item.tax_amount,
    Description: item.description || ''
  }));

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header background (blue)
    const headerHeight = 25;
    doc.setFillColor(0, 102, 204); // blue
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // 2. Title (centered in white)
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const titleText = `Expense Report for ${months[parseInt(month) - 1]} ${year}`;
    const titleX = (pageWidth - doc.getTextWidth(titleText)) / 2;
    doc.text(titleText, titleX, 13);

    // 4. Prepare table columns and rows
    const tableColumn = ["Category", "Product", "Amount", "Purchase Date", "Tax Amount", "Description"];
    const tableRows = filteredSearchData.map(item => [
      item.category,
      item.product,
      item.cost,
      item.p_date,
      item.tax_amount,
      item.description
    ]);

    // 5. Add the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: headerHeight + 10,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        // 4. Add Total Expense text after the table
        const totalText = `Total Expense: ₹${totalCost.toFixed(2)}`;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const totalX = (pageWidth - doc.getTextWidth(totalText)) / 2;
        doc.text(totalText, totalX, data.cursor.y + 10);
      }
    });

    // 6. Save the file
    doc.save(`Expense_Report_${months[parseInt(month) - 1]}_${year}.pdf`);
  };

  // DataTable templates
  const actionTemplate = useCallback((rowData) => (
    <button onClick={() => handleDeleteExpense(rowData.id)} className="report-action-btn danger" aria-label="Delete expense">
      <FaTrash />
    </button>
  ), []);

  const categoryActionTemplate = useCallback((rowData) => (
    <button onClick={() => handleDeleteCategory(rowData.id)} className="report-action-btn danger" aria-label="Delete category">
      <FaTrash />
    </button>
  ), []);

  const productActionTemplate = useCallback((rowData) => (
    <button onClick={() => handleDeleteProduct(rowData.id)} className="report-action-btn danger" aria-label="Delete product">
      <FaTrash />
    </button>
  ), []);

  const sourceActionTemplate = useCallback((rowData) => (
    <button onClick={() => handleDeleteSource(rowData.id)} className="report-action-btn danger" aria-label="Delete source" >
      <FaTrash />
    </button>
  ), []);

  const imageTemplate = useCallback((rowData) => {
    if (!rowData.image) return <span>No Image</span>;

    return (
      <div className="image-preview-container">
        <img src={rowData.image} alt={`Preview for ${rowData.product}`} className="image-preview" />
        <FiEye className="image-preview-icon" onClick={() => handleImageClick(rowData.image)} />
      </div>
    );
  }, []);

  const descriptionTemplate = useCallback((rowData) => {
    if (!rowData.description) return <span>No Description</span>;
    return <span>{rowData.description}</span>;
  }, []);

  return (
    <div className={`reports-container ${isdark ? 'dark' : ''}`}>
      <div className="d-flex">
        {!isMobile && (
          <div className="sidebar-container" style={{ width: "15%" }}>
            <Slidebar isdark={isdark} />
          </div>
        )}

        <div className="content-container" style={{ width: isMobile ? "100%" : "85%" }}>
          <Toast ref={toast} />

          {loading && (
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
          )}

          <div className="reports-header">
            {/* <h2 className="reports-title">Reports</h2> */}

            {activeView === "dashboard" ? (
              <>
                <h2 className="reports-title">Reports</h2>
                <div className="summary-cards">

                  <div className="report-card" onClick={() => setActiveView("expenses")} >
                    <div className="report-card-body">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "180px" }}>
                        <FaTable size={48} className="mb-3" color={isdark ? "#f8f9fa" : "#0b69ff"} />
                        <h3 className="report-card-title">Expense Reports</h3>
                        <p className="report-card-sub-title">manage your expense records</p>
                      </div>
                    </div>
                  </div>

                  <div className="report-card" onClick={() => setActiveView("categories")}  >
                    <div className="report-card-body">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "180px" }}>
                        <FaChartBar size={48} className="mb-3" color={isdark ? "#f8f9fa" : "#38ef7d"} />
                        <h3 className="report-card-title">Categories</h3>
                        <p className="report-card-sub-title">Manage your expense categories</p>
                      </div>
                    </div>
                  </div>

                  <div className="report-card" onClick={() => setActiveView("products")}>
                    <div className="report-card-body">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "180px" }}>
                        <FaChartBar size={48} className="mb-3" color={isdark ? "#f8f9fa" : "#f5af19"} />
                        <h3 className="report-card-title">Category Expence</h3>
                        <p className="report-card-sub-title">manage your Categoy Expences </p>
                      </div>
                    </div>
                  </div>

                  <div className="report-card" onClick={() => setActiveView("sources")}>
                    <div className="report-card-body">
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "180px" }}>
                        <FaChartBar size={48} className="mb-3" color={isdark ? "#f8f9fa" : "#8e2de2"} />
                        <h3 className="report-card-title">Income Sources</h3>
                        <p className="report-card-sub-title">Manage your income sources</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <button className="report-action-btn outline" onClick={() => setActiveView("dashboard")}>
                  <FaArrowLeft className="me-2" /> Back to Reports
                </button>
              </div>
            )}

            {activeView === "expenses" && (
              <>
                <div className="reports-filters">
                  <div className="filter-group">
                    <label className="filter-label">Month</label>
                    <select name="month" className="filter-control" value={month} onChange={handleFilterChange}>
                      {months.map((monthName, index) => (
                        <option key={index} value={index + 1}>{monthName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Year</label>
                    <select name="year" className="filter-control" value={year} onChange={handleFilterChange}>
                      {years.map((yearValue) => (
                        <option key={yearValue} value={yearValue}>{yearValue}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Search</label>
                    <div className="position-relative">
                      <input type="text" className="filter-control" placeholder="Search expenses..." value={searchTerm} onChange={handleSearchChange} />
                      <FiSearch style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button className="report-action-btn success" onClick={exportPDF}>
                      <FaDownload className="me-2" /> PDF
                    </button>
                    <CSVLink data={csvData} filename={`Expense_Report_${months[parseInt(month) - 1]}_${year}.csv`} className="report-action-btn primary" target="_blank" >
                      <FaDownload className="me-2" /> Excel
                    </CSVLink>
                  </div>
                </div>

                <div className="report-card mb-4">
                  <div className="report-card-header">
                    <h3 className="report-card-title"> Expense Summary for {months[parseInt(month) - 1]} {year} </h3>
                  </div>
                  <div className="report-card-body">
                    <div className="summary-cards">
                      <div className="summary-card expense-card">
                        <div className="summary-card-title">Total Expenses</div>
                        <div className="summary-card-value">₹{totalCost.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {componentLoading.expenses ? (
                  <div className="component-loader">
                    <div className="component-spinner"></div>
                  </div>
                ) : (
                  <div className="reports-table-container">
                    <DataTable value={filteredSearchData} paginator rows={6} tableStyle={{ minWidth: '100%' }} className={isdark ? "dark-theme-table" : ""}
                      emptyMessage="No expenses found" sortField="p_date" sortOrder={-1} responsiveLayout="scroll">
                      <Column field="category" header="Category" sortable style={{ width: '15%' }} />
                      <Column field="product" header="Expence Name" sortable style={{ width: '15%' }} />
                      <Column field="cost" header="Amount" sortable style={{ width: '10%' }} />
                      <Column field="p_date" header="Purchase Date" sortable style={{ width: '15%' }} />
                      <Column field="tax_amount" header="Tax Amount" sortable style={{ width: '10%' }} />
                      <Column body={descriptionTemplate} header="Description" style={{ width: '15%' }} />
                      <Column body={imageTemplate} header="Image" style={{ width: '10%' }} />
                      <Column body={actionTemplate} header="Actions" style={{ width: '10%' }} />
                    </DataTable>
                  </div>
                )}
              </>
            )}

            {activeView === "categories" && (
              <>
                <div className="report-card mb-4">
                  <div className="report-card-header">
                    <h3 className="report-card-title">Categories</h3>
                  </div>
                  <div className="report-card-body">
                    {componentLoading.categories ? (
                      <div className="component-loader"><div className="component-spinner"></div></div>
                    ) : (
                      <DataTable value={categoriesData} paginator rows={6} tableStyle={{ minWidth: '100%' }} className={isdark ? "dark-theme-table" : ""} emptyMessage="No categories found" responsiveLayout="scroll" >
                        <Column field="id" header="ID" sortable />
                        <Column field="category" header="Category" sortable />
                        <Column body={categoryActionTemplate} header="Actions" />
                      </DataTable>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeView === "products" && (
              <>
                <div className="report-card mb-4">
                  <div className="report-card-header">
                    <h3 className="report-card-title">Category Wise Expences</h3>
                  </div>
                  <div className="report-card-body">
                    {componentLoading.products ? (
                      <div className="component-loader"> <div className="component-spinner"></div></div>
                    ) : (
                      <DataTable value={productsData} paginator rows={6} tableStyle={{ minWidth: '100%' }} className={isdark ? "dark-theme-table" : ""} emptyMessage="No Category Expences found" responsiveLayout="scroll" >
                        <Column field="id" header="ID" sortable style={{ width: '10%' }} />
                        <Column field="category" header="Category" sortable style={{ width: '30%' }} />
                        <Column field="product" header="Product" sortable style={{ width: '30%' }} />
                        <Column body={productActionTemplate} header="Action" style={{ width: '10%' }} />
                      </DataTable>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeView === "sources" && (
              <>
                <div className="report-card mb-4">
                  <div className="report-card-header"><h3 className="report-card-title">Income Sources</h3></div>
                  <div className="report-card-body">
                    {componentLoading.sources ? (
                      <div className="component-loader"> <div className="component-spinner"></div>
                      </div>
                    ) : (
                      <DataTable value={mainSourceData} paginator rows={6} tableStyle={{ minWidth: '100%' }} className={isdark ? "dark-theme-table" : ""} emptyMessage="No sources found" responsiveLayout="scroll">
                        <Column field="id" header="ID" sortable style={{ width: '10%' }} />
                        <Column field="source" header="Source" sortable style={{ width: '20%' }} />
                        <Column field="amount" header="Amount" sortable style={{ width: '15%' }} />
                        <Column field="date" header="Date" sortable style={{ width: '15%' }} />
                        <Column body={sourceActionTemplate} header="Actions" style={{ width: '10%' }} />
                      </DataTable>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;