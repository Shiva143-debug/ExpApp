
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect, useMemo } from "react"
import Slidebar from "./Micilinious/Slidebar";
import { FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import MyPieChart from './Micilinious/MyPieChart';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { expenseService, sourceService, savingsService } from '../api/apiService';
import "../styles/Dashboard.css"
import { useAuth } from '../context/AuthContext';

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => (currentYear - 3 + index).toString());

function Dashboard() {
    const { userId, isdark } = useAuth();
    const [Month, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [Year, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [totalCostData, setExpenseCost] = useState([])
    const [savingsData, setSavingsData] = useState([])
    const [totalIncomeData, setTotalIncome] = useState([])
    const [yearsdata, setYearData] = useState([])
    const [yearWiseExpenceData, setYearExpenceData] = useState([])
    const [yearWiseSavingsData, setYearSavingsData] = useState([]);
    const [year, setSelectedYearr] = useState(new Date().getFullYear().toString());
    const [showYearlyReport, setShowYearlyReport] = useState(false)
    const [showDropdowns, setShowDropdowns] = useState(false);
    const navigate = useNavigate();

    const toggleDropdowns = () => {
        setShowDropdowns(!showDropdowns);
    };


    const handleCategoryClick = (category) => {
        const month = encodeURIComponent(Month);
        const year = encodeURIComponent(Year);
        navigate(`/reports?category=${encodeURIComponent(category)}&month=${month}&year=${year}`);
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        if (name === "month") {
            setSelectedMonth(value);
        } else if (name === "year") {
            setSelectedYear(value);
        }
        toggleDropdowns()
    };

    const handleSelectYearChange = (event) => {
        const { name, value } = event.target;
        if (name === "month") {
            setSelectedMonth(value);
        } else if (name === "year") {
            setSelectedYearr(value);
        }
    }

    // Fetch expense cost data
    useEffect(() => {
        const fetchExpenseCost = async () => {
            try {
                const data = await expenseService.getExpenseCost(userId);
                setExpenseCost(data);
            } catch (err) {
                console.error("Error fetching expense cost:", err);
            }
        };

        if (userId) {
            fetchExpenseCost();
        }
    }, [userId]);

    // Fetch year-wise expense data
    useEffect(() => {
        const fetchYearWiseExpenseData = async () => {
            try {
                const data = await expenseService.getYearWiseExpenseData(userId, year);
                setYearExpenceData(data);
            } catch (err) {
                console.error("Error fetching year-wise expense data:", err);
            }
        };

        if (userId && year) {
            fetchYearWiseExpenseData();
        }
    }, [year, userId]);


    // Fetch year-wise savings data
    useEffect(() => {
        const fetchYearWiseSavingsData = async () => {
            try {
                const data = await savingsService.getYearWiseSavingsData(userId, year);
                setYearSavingsData(data);
            } catch (err) {
                console.error("Error fetching year-wise savings data:", err);
            }
        };

        if (userId && year) {
            fetchYearWiseSavingsData();
        }
    }, [year, userId]);
    // Fetch source/income data
    useEffect(() => {
        const fetchSourceData = async () => {
            try {
                const data = await sourceService.getSourceData(userId, Month, Year);
                setTotalIncome(data);
            } catch (err) {
                console.error("Error fetching source data:", err);
                setTotalIncome([]);
            }
        };

        if (userId && Month && Year) {
            fetchSourceData();
        }
    }, [Month, Year, userId]);

    useEffect(() => {
        const fetchSavingsData = async () => {
            try {
                const data = await savingsService.getSavingData(userId, Month, Year);
                setSavingsData(data);
            } catch (err) {
                console.error("Error fetching savings data:", err);
                setSavingsData([]);
            }
        };

        if (userId && Month && Year) {
            fetchSavingsData();
        }
    }, [Month, Year, userId]);

    // Fetch year-wise data
    useEffect(() => {
        const fetchYearData = async () => {
            try {
                const data = await sourceService.getYearWiseData(userId, year);
                setYearData(data);
            } catch (err) {
                console.error("Error fetching year-wise data:", err);
                setYearData([]);
            }
        };

        if (userId && year) {
            fetchYearData();
        }
    }, [year, userId]);

    const grandTotal = totalIncomeData.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
    const savingsAmount = savingsData.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
    const colors = ["#f0f0f0", "#e6f7ff", "#ffcccc", "#ccffcc", "#f9f9f9"];
    const isMobile = useMediaQuery('(max-width:768px)');

    const filteredTotalCostData = totalCostData.filter((d) => {
        return d.month.toString() === Month & d.year.toString() === Year;
    });
    const totalAmount = parseFloat(filteredTotalCostData.reduce((acc, curr) => acc + parseFloat(curr.cost), 0)).toFixed(0);

    const groupedData = filteredTotalCostData.reduce((acc, curr) => {
        const { category, cost } = curr;
        acc[category] = (acc[category] || 0) + parseFloat(cost);
        return acc;
    }, {});

    const groupedArray = Object.keys(groupedData).map((key) => ({
        category: key,
        TotalCost: groupedData[key],
    }));

    const monthMap = {};
    yearsdata.forEach((d) => {
        const monthName = months[d.month - 1]; // Convert month number to name
        if (!monthMap[monthName]) {
            monthMap[monthName] = parseInt(d.amount);
        } else {
            monthMap[monthName] += parseInt(d.amount);
        }
    });

    months.forEach((monthName) => {
        if (!monthMap[monthName]) {
            monthMap[monthName] = 0;
        }
    });

    const monthData = months.map((monthName) => ({
        month: monthName,
        amount: monthMap[monthName],
    }));

    const expenseMap = {};
    yearWiseExpenceData.forEach((d) => {
        const monthName = months[d.month - 1]; // Convert month number to name
        if (!expenseMap[monthName]) {
            expenseMap[monthName] = parseInt(d.cost);
        } else {
            expenseMap[monthName] += parseInt(d.cost);
        }
    });

    const savingsMap = {};
    yearWiseSavingsData.forEach((d) => {
        const monthName = months[d.month - 1]; // Convert month number to name
        if (!savingsMap[monthName]) {
            savingsMap[monthName] = parseInt(d.cost);
        } else {
            savingsMap[monthName] += parseInt(d.cost);
        }
    });


    months.forEach((monthName) => {
        if (!expenseMap[monthName]) {
            expenseMap[monthName] = 0;
        }
    });

    const monthExpensesData = months.map((monthName) => ({
        month: monthName,
        cost: expenseMap[monthName],
    }));


    // const combinedData = monthData.map((incomeItem) => {
    //     const expenseItem = monthExpensesData.find((expense) => expense.month === incomeItem.month);
    //     return {
    //         month: incomeItem.month,
    //         income: parseInt(incomeItem.amount),
    //         expense: expenseItem ? expenseItem.cost : 0,
    //         balance: incomeItem.amount - expenseItem.cost
    //     };
    // });

    const combinedData = useMemo(() => {
        if (!savingsData) return [];

        const incomeMap = {};
        yearsdata.forEach(d => {
            const monthName = months[d.month - 1];
            incomeMap[monthName] = (incomeMap[monthName] || 0) + parseInt(d.amount);
        });

        const expenseMap = {};
        yearWiseExpenceData.forEach(d => {
            const monthName = months[d.month - 1];
            expenseMap[monthName] = (expenseMap[monthName] || 0) + parseInt(d.cost);
        });

        yearWiseSavingsData.forEach(d => {
            const monthName = months[d.month - 1];
            savingsMap[monthName] = (savingsMap[monthName] || 0) + parseInt(d.amount);
        });
        // Ensure all months are covered
        return months.map(monthName => {
            const income = incomeMap[monthName] || 0;
            const expense = expenseMap[monthName] || 0;
            const savings = savingsMap[monthName] || 0;
            const balance = income - expense - savings;

            return { month: monthName, income, expense, savings, balance };
        });
    }, [yearsdata, yearWiseExpenceData, savingsData, months]);



    const totalIncome = combinedData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = combinedData.reduce((sum, d) => sum + d.expense, 0);
    const totalSavings = combinedData.reduce((sum, d) => sum + d.savings, 0);
    const totalBalance = combinedData.reduce((sum, d) => sum + d.balance, 0);


    const yearlyReport = () => {
        setShowYearlyReport(!showYearlyReport)
    }

    return (
        <div className="d-flex flex-column">
            <div>
                <div class="d-flex">
                    {!isMobile && (
                        <div style={{ width: "15%" }}>
                            <Slidebar isdark={isdark} />
                        </div>
                    )}
                    <div className={isMobile ? "d-flex flex-column p-3" : "d-flex flex-column p-3"} style={{ height: isMobile ? "100%" : "", width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "white" }}>
                        {!showYearlyReport &&
                            <div style={{ minHeight: "100vh" }}>

                                <div className="d-flex flex-column align-items-start mb-2" style={{ marginTop: "100px" }}>
                                    {/* Date Toggle Button */}
                                    <div onClick={toggleDropdowns} className="d-flex align-items-center px-3 py-2 rounded"
                                        style={{ cursor: "pointer", backgroundColor: isdark ? "#333" : "#f8f9fa", color: isdark ? "white" : "black", border: "1px solid #ccc", minWidth: isMobile ? "200px" : "300px", justifyContent: "space-between", width: isMobile ? "200px" : "300px" }}>
                                        <FaCalendarAlt style={{ marginRight: "10px" }} />
                                        <small>{`${months[Month - 1]} ${Year}`}</small>
                                    </div>

                                    {/* Dropdowns (conditionally visible) */}
                                    {showDropdowns && (
                                        <div className="d-flex flex-wrap mt-2" style={{ gap: "10px" }}>
                                            <select name="month" className="form-control"
                                                style={{ width: isMobile ? "100px" : "140px", backgroundColor: "transparent", color: isdark ? "white" : "black" }} value={Month} onChange={handleSelectChange}>
                                                {months.map((month, index) => (
                                                    <option key={index} value={index + 1} style={{ color: "black" }}>{month}</option>
                                                ))}
                                            </select>

                                            <select name="year" className="form-control" style={{ width: isMobile ? "100px" : "140px", backgroundColor: "transparent", color: isdark ? "white" : "black" }} value={Year} onChange={handleSelectChange}>
                                                {years.map((year, index) => (
                                                    <option key={index} value={year} style={{ color: "black" }}>{year} </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between flex-wrap gap-3">

                                    <div className="card text-white p-3 flex-fill" style={{ background: "linear-gradient(to right,rgb(105, 213, 33),rgb(97, 248, 16))", minWidth: "200px" }}>
                                        <h5 style={{ fontSize: isMobile ? "14px" : "18px" }}>Income</h5>
                                        <h4 style={{ fontSize: isMobile ? "16px" : "22px" }}><b><FaRupeeSign />{grandTotal}</b></h4>
                                    </div>

                                    <div className="card text-white p-3 flex-fill" style={{ background: "linear-gradient(to right, #f12711, #f5af19)", minWidth: "200px" }}>
                                        <h5 style={{ fontSize: isMobile ? "14px" : "18px" }}>Expenses</h5>
                                        <h4 style={{ fontSize: isMobile ? "16px" : "22px" }}><b><FaRupeeSign />{totalAmount}</b></h4>
                                    </div>


                                    <div className="card text-white p-3 flex-fill" style={{ background: "linear-gradient(to right,rgb(45, 99, 4),rgb(7, 179, 15))", minWidth: "200px" }}>
                                        <h5 style={{ fontSize: isMobile ? "14px" : "18px" }}>Savings</h5>
                                        <h4 style={{ fontSize: isMobile ? "16px" : "22px" }}><b><FaRupeeSign />{savingsAmount}</b></h4>
                                    </div>

                                    <div className="card text-white p-3 flex-fill" style={{ background: "linear-gradient(to right, #11998e, #38ef7d)", minWidth: "200px" }}>
                                        <h5 style={{ fontSize: isMobile ? "14px" : "18px" }}>Remaining Balance</h5>
                                        <h4 style={{ fontSize: isMobile ? "16px" : "22px" }}> <b><FaRupeeSign />{grandTotal - totalAmount - savingsAmount}</b></h4>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }} class="mt-2">
                                    {groupedArray.map((item, index) => {
                                        const percentage = ((item.TotalCost / totalAmount) * 100).toFixed(1);

                                        return (
                                            <div onClick={() => handleCategoryClick(item.category)} key={index} className="m-2 d-flex justify-content-between align-items-center p-3"
                                                style={{
                                                    backgroundColor: isdark ? "black" : "white", color: isdark ? "white" : "", width: isMobile ? "43%" : "18%", height: isMobile ? "120px" : "150px", borderRadius: "12px",
                                                    boxShadow: isdark ? "8px 8px 12px rgba(255, 255, 255, 0.1)" : "8px 8px 12px rgba(0, 0, 0, 0.1)",
                                                }}>

                                                <div className="d-flex flex-column justify-content-center">
                                                    <p style={{ fontWeight: "bold", fontSize: isMobile ? "14px" : "18px" }}>{item.category}</p>
                                                    <p style={{ fontWeight: "bold", fontSize: isMobile ? "14px" : "18px", }}><FaRupeeSign /> {parseFloat(item.TotalCost).toFixed(2)}</p>
                                                </div>

                                                {/* Right circle */}
                                                <div className={isMobile ? "mobile-image-circle" : "image-circle"}>
                                                    <p style={{ color: "white", fontSize: isMobile ? "12px" : "20px", margin: 0, }}>{percentage}%</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <button class="btn btn-primary mx-2 mt-2 mb-5" style={{ width: "150px" }} onClick={yearlyReport}>Show YearWise Expenditure</button>
                            </div>
                        }

                        {showYearlyReport &&
                            <div style={{ height: isMobile ? "100vh" : "" }}>
                                <div className="d-flex mb-3" style={{ marginTop: isMobile ? "80px" : "80px" }}>
                                    <label style={{ color: isdark ? "white" : "black", width: isMobile ? "100px" : "300px", paddingTop: "5px" }}><b>Select year:</b></label>
                                    <select name="year" style={{ width: isMobile ? "100px" : "300px", backgroundColor: "transparent", color: isdark ? "white" : "black" }} className="form-control" value={year} onChange={handleSelectYearChange}>
                                        {years.map((year, index) => (
                                            <option key={index} value={year} style={{ color: "black" }}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {!isMobile &&
                                    <div >
                                        <div className={`card mb-5 ${isdark ? 'dark-theme' : ''}`}>
                                            <DataTable value={combinedData} stripedRows tableStyle={{ minWidth: '50rem' }}>
                                                <Column field="month" header="MONTH"></Column>
                                                <Column field="income" header="INCOME"></Column>
                                                <Column field="expense" header="EXPENCE"></Column>
                                                <Column field="savings" header="SAVINGS"></Column>
                                                <Column field="balance" header="BALANCE"></Column>
                                            </DataTable>
                                            <div className='d-flex'>
                                                <div style={{ color: isdark ? "white" : "black", paddingRight: "200px" }}></div>
                                                <b style={{ width: "50rem" }}>Total Income: {totalIncome}</b>
                                                <b style={{  width: "50rem" }}>Total Expences:{totalExpense}</b>
                                                <b style={{ width: "50rem" }}>Total Savings:{totalSavings}</b>
                                                <b style={{ width: "50rem" }}>Available Balance:{totalBalance}</b>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {isMobile &&

                                    <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column" }}>
                                        <MyPieChart combinedData={combinedData} />
                                        <div className='d-flex flex-wrap'>
                                            <b style={{ color: isdark ? "white" : "black", paddingRight: "10px" }}>Total Income: {totalIncome}</b>
                                            <b style={{ color: isdark ? "white" : "black", paddingRight: "10px" }}>Total Expences:{totalExpense}</b>
                                            <b style={{ color: isdark ? "white" : "black", paddingRight: "10px" }}>Total Savings:{totalSavings}</b>
                                            <b style={{ color: isdark ? "white" : "black", paddingRight: "10px" }}>Available Balance:{totalBalance}</b>
                                        </div>
                                    </div>
                                }
                                <button class="btn btn-primary mb-5 mx-2" style={{ width: "150px" }} onClick={yearlyReport}>Show  Monthly Expenditure</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Dashboard
