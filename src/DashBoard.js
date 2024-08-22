
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from "react"
import Slidebar from "./Slidebar";
import { FaRupeeSign } from "react-icons/fa";
// import { Chart } from 'primereact/chart';
// import PieChart from './PieChart';
import Chart from 'chart.js/auto';
import "./Dashboard.css"
import MyPieChart from './MyPieChart';
// import MyPieChart from './MyPieChart';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => (currentYear - 3 + index).toString());

function Dashboard({ id, isdark }) {

    const [Month, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [Year, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [totalCostData, setExpenseCost] = useState([])
    const [totalIncomeData, setTotalIncome] = useState([])

    const [yearsdata, setYearData] = useState([])
    const [yearWiseExpenceData, setYearExpenceData] = useState([])

    const [year, setSelectedYearr] = useState("2024");
    const [showYearlyReport, setShowYearlyReport] = useState(false)

    const navigate = useNavigate();

    
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
    };

    const handleSelectYearChange = (event) => {
        const { name, value } = event.target;
        if (name === "month") {
            setSelectedMonth(value);
        } else if (name === "year") {
            setSelectedYearr(value);
        }
    }


    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getExpenseCost/${userId}`)

            .then(res => res.json())
            .then(data => setExpenseCost(data))
            .catch(err => console.log(err))

    }, [id])

    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getYearWiseExpenceData/${userId}/${year}`)
            .then(res => res.json())
            .then(data => setYearExpenceData(data))
            .catch(err => console.log(err))

    }, [year, id])


    useEffect(() => {
        const userId = id;
        // fetch(`http://localhost:3005/getSource/${userId}`)
        fetch(`https://exciting-spice-armadillo.glitch.me/getSource/${userId}/${Month}/${Year}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTotalIncome(data);
                } else {
                    setTotalIncome([])
                }
            })
        

    }, [Month, Year, id])


    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getYearWiseData/${userId}/${year}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setYearData(data);
                } else {
                    setYearData([])
                }
            })
            .catch(err => console.log(err));
    }, [year, id]);





    const filteredTotalCostData = totalCostData.filter((d) => {
        return d.month.toString() === Month & d.year.toString() === Year;
    });

    const totalAmount = parseFloat(filteredTotalCostData.reduce((acc, curr) => acc + parseFloat(curr.cost), 0)).toFixed(2);


    const groupedData = filteredTotalCostData.reduce((acc, curr) => {
        const { category, cost } = curr;
        acc[category] = (acc[category] || 0) + parseFloat(cost);
        return acc;
    }, {});


    // Convert the grouped data into an array of objects
    const groupedArray = Object.keys(groupedData).map((key) => ({
        category: key,
        TotalCost: groupedData[key],
    }));

    const grandTotal = totalIncomeData.reduce((acc, curr) => acc + parseInt(curr.amount), 0);


    const monthMap = {};
    yearsdata.forEach((d) => {
        const monthName = months[d.month - 1]; // Convert month number to name
        if (!monthMap[monthName]) {
            monthMap[monthName] = parseInt(d.amount);
        } else {
            monthMap[monthName] += parseInt(d.amount);
        }
    });

    // Fill in missing months with 0 amount
    months.forEach((monthName) => {
        if (!monthMap[monthName]) {
            monthMap[monthName] = 0;
        }
    });

    // Convert the map to an array of objects and sort by month order
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

    // Fill in missing months with 0 cost
    months.forEach((monthName) => {
        if (!expenseMap[monthName]) {
            expenseMap[monthName] = 0;
        }
    });

    // Convert the map to an array of objects and sort by month order
    const monthExpensesData = months.map((monthName) => ({
        month: monthName,
        cost: expenseMap[monthName],
    }));


    const combinedData = monthData.map((incomeItem) => {
        const expenseItem = monthExpensesData.find((expense) => expense.month === incomeItem.month);
        return {
            month: incomeItem.month,
            income: parseInt(incomeItem.amount),
            expense: expenseItem ? expenseItem.cost : 0,
            balance: incomeItem.amount - expenseItem.cost
        };
    });


    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;

    combinedData.forEach((d) => {
        totalIncome += parseInt(d.income);
        totalExpense += parseInt(d.expense);
        totalBalance += parseInt(d.balance);
    });


    const yearlyReport = () => {
        setShowYearlyReport(!showYearlyReport)
    }

    const colors = ["#f0f0f0", "#e6f7ff", "#ffcccc", "#ccffcc", "#f9f9f9"];


    const isMobile = useMediaQuery('(max-width:768px)');

    return (

        <div className="d-flex flex-column">
            <div>
                <div class="d-flex">
                    {!isMobile && (

                        <div style={{ width: "15%" }}>
                            <Slidebar isdark={isdark} />
                        </div>
                    )}

                    <div className={isMobile ? "d-flex flex-column p-3" : "d-flex flex-column p-3"} style={{height:isMobile?"100%":"", width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "whitesmoke" }}>
                        {!showYearlyReport &&
                            <div style={{ minHeight: "100vh" }}>

                                <div class="d-flex mb-5 ">
                                    <select
                                        name="month"
                                        style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", backgroundColor: "transparent", color: isdark ? "white" : "black" }}
                                        className="form-control"
                                        value={Month}
                                        onChange={handleSelectChange}
                                    >
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1} style={{ color: "black" }}> {month}</option>
                                        ))}
                                    </select>
                                    <select
                                        name="year"
                                        style={{ width: isMobile ? "100px" : "300px", marginTop: "100px", marginLeft: "20px", backgroundColor: "transparent", color: isdark ? "white" : "black" }}
                                        className="form-control"
                                        value={Year}
                                        onChange={handleSelectChange}
                                    >
                                        {years.map((year, index) => (
                                            <option key={index} value={year} style={{ color: "black" }}>{year}</option>
                                        ))}
                                    </select>

                                </div>
                                <div class="d-flex justify-content-between">
                                    <div >
                                        <h3 style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '14px' : '20px' }}>{months[Month - 1]} Spend</h3>
                                        <h4 style={{ color: isdark ? "white" : "navy", fontSize: isMobile ? '14px' : '20px' }}><FaRupeeSign />{totalAmount}</h4>
                                    </div>

                                    <div>
                                        <h4 style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '14px' : '20px' }} >Total Earned Income:<b>{grandTotal}</b></h4>
                                        <h4 style={{ color: isdark ? "white" : "black", fontSize: isMobile ? '14px' : '20px' }}>Available Balance:<b>{grandTotal - totalAmount}</b></h4>
                                    </div>

                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }} class="mt-2">
                                    {groupedArray.map((item, index) => {
                                        const percentage = ((item.TotalCost / totalAmount) * 100).toFixed(1);

                                        return (
                                            <div onClick={() => handleCategoryClick(item.category)} key={index} class="m-2 d-flex justify-content-around p-2" style={{ backgroundColor: isdark ? "black" : colors[index % colors.length], color: isdark ? "white" : "", border: isdark ? "1px solid white" : "", width: isMobile ? "43%" : "250px", height: isMobile ? "120px" : "150px", borderRadius: "12px" }}>
                                                <div>
                                                    <p style={{ fontWeight: "bold", fontSize: isMobile ? '18px' : '20px' }}>{item.category}</p><br />
                                                    <p style={{ fontWeight: "bold", fontSize: isMobile ? '14px' : '20px' }}><FaRupeeSign />{parseFloat(item.TotalCost).toFixed(2)}</p>
                                                </div>
                                                <div className={isMobile ? "mobile-image-circle" : "image-circle"}>
                                                    <p style={{ color: "white", fontSize: isMobile ? '12px' : '20px' }}>{percentage}%</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>



                                <button class="btn btn-primary mx-2 mt-2 mb-5" style={{ width: "150px" }} onClick={yearlyReport}>Show YearWise Expenditure</button>
                            </div>
                        }


                        {showYearlyReport &&

                            <div style={{height:isMobile?"100vh":""}}>

                                <div className="d-flex mb-3" style={{ marginTop: isMobile ? "80px" : "80px" }}>
                                    <label style={{ color: isdark ? "white" : "black", width: isMobile ? "100px" : "300px", paddingTop: "5px" }}><b>Select year:</b></label>
                                    <select
                                        name="year"
                                        style={{ width: isMobile ? "100px" : "300px", backgroundColor: "transparent", color: isdark ? "white" : "black" }}
                                        className="form-control"
                                        value={year}
                                        onChange={handleSelectYearChange}
                                    >
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
                                                <Column field="expense" header="CATEGORY"></Column>
                                                <Column field="balance" header="BALANCE"></Column>
                                            </DataTable>
                              </div>
                                    </div>
                                }
                                {isMobile &&
                                    <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column" }}>
                                        <MyPieChart combinedData={combinedData} />
                                        <b style={{ color: isdark ? "white" : "black" }}>Total Income: {totalIncome}</b>
                                        <b style={{ color: isdark ? "white" : "black" }}>Total Expences:{totalExpense}</b>
                                        <b style={{ color: isdark ? "white" : "black" }}>Available Balance:{totalBalance}</b>
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
