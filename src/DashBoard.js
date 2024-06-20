
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
            .then(data => setTotalIncome(data))
            .catch(err => console.log(err))

    }, [Month, Year, id])


    // useEffect(() => {
    //     const userId = id;
    //     fetch(`https://exciting-spice-armadillo.glitch.me/getYearWiseData/${userId}/${year}`)
    //         .then(res => res.json())
    //         .then(data => setYearData(data))
    //         .catch(err => console.log(err))

    // }, [year, id])
 
      
    useEffect(() => {
        const userId = id;
        fetch(`https://exciting-spice-armadillo.glitch.me/getYearWiseData/${userId}/${year}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setYearData(data);
                } else {
                    console.error('Expected array but got', data);
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

                    <div className={isMobile ? "d-flex flex-column p-3" : "d-flex flex-column p-5"} style={{ width: isMobile ? "100%" : "85%", backgroundColor: isdark ? "black" : "whitesmoke", minHeight: "100vh" }}>


                        <div class="d-flex mb-5 ">
                            <select
                                name="month"
                                style={{ width: isMobile ? "100px" : "300px", marginTop: "100px" }}
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
                                const percentage = ((item.TotalCost / totalAmount) * 100).toFixed(2);

                                return (
                                    <div key={index} class="m-2 d-flex justify-content-around p-2" style={{ backgroundColor: colors[index % colors.length], width: isMobile ? "43%" : "250px", height: isMobile ? "120px" : "150px", borderRadius: "12px" }}>
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

                        {!showYearlyReport &&

                            <button class="btn btn-primary mx-2 mt-5 mb-5" style={{ width: "150px" }} onClick={yearlyReport}>Show YearWise Expenditure</button>
                        }


                        {showYearlyReport &&

                            <>
                                <button class="btn btn-primary mx-2 mt-5 mb-5" style={{ width: "150px" }} onClick={yearlyReport}>Hide YearWise Expenditure</button>
                                <div className="d-flex">
                                    <label style={{ color: isdark ? "white" : "black", width: isMobile ? "100px" : "300px" }}><b>Select year:</b></label>
                                    <select
                                        name="year"
                                        style={{ width: isMobile ? "100px" : "300px" }}
                                        className="form-control"
                                        value={year}
                                        onChange={handleSelectYearChange}
                                    >
                                        {years.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {!isMobile &&

                                    <div style={{ maxWidth: isMobile ? "600px" : "800px", overflowX: "auto" }}>

                                        <table className="table table-bordered mt-5 mb-5" style={{ width: isMobile ? "500px" : "800px", textAlign: "center" }}>
                                            <thead>
                                                <tr>
                                                    <th>Month</th>
                                                    <th>Income</th>
                                                    <th>Expense</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {combinedData.map((d, i) => (
                                                    <tr key={i} >
                                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.month}</td>
                                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.income}</td>
                                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.expense}</td>
                                                        <td style={{ backgroundColor: i % 2 === 0 ? '#f2f2f2' : '#e6e6e6' }}>{d.balance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="2" style={{ textAlign: "right" }}><b>Total Income: {totalIncome}</b></td>
                                                    <td style={{ textAlign: "right" }}><b>Total Expences:{totalExpense}</b></td>
                                                    <td style={{ textAlign: "right" }}> <b>Available Balance:{totalBalance}</b></td>

                                                </tr>
                                            </tfoot>
                                        </table>




                                    </div>
                                }
                                {isMobile &&
                                    <div style={{marginBottom:"100px",display:"flex",flexDirection:"column"}}>
                                        <MyPieChart combinedData={combinedData} />
                                        <b style={{color:isdark?"white":"black"}}>Total Income: {totalIncome}</b>
                                        <b style={{color:isdark?"white":"black"}}>Total Expences:{totalExpense}</b>
                                        <b style={{color:isdark?"white":"black"}}>Available Balance:{totalBalance}</b>
                                    </div>
                                }

                            </>
                        }


                    </div>

                </div>

            </div>


        </div>

    )
}

export default Dashboard
