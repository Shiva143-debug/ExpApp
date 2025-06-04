// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';


// const MyPieChart = ({ combinedData }) => {
//     const colors = [
//         '#ffcc00', // January
//         '#ff6600', // February
//         '#ff5050', // March
//         '#ff3399', // April
//         '#cc33ff', // May
//         '#9966ff', // June
//         '#6699ff', // July
//         '#99ccff', // August
//         '#66ff99', // September
//         '#33cc33', // October
//         'gray', // November
//         'red'  // December
//     ];
//     const data = {
//         labels: combinedData.map(d => d.month),
//         datasets: [{
//             data: combinedData.map(() => 1), // Equal parts for each month
//             // backgroundColor: combinedData.map((_, i) => i % 2 === 0 ? '#f2f2f2' : '#e6e6e6'),
//             backgroundColor: combinedData.map((_, i) => colors[i % colors.length]),
//             hoverOffset: 8
//         }]
//     };

//     const options = {
//         plugins: {
//             tooltip: {
//                 callbacks: {
//                     label: (context) => {
//                         const index = context.dataIndex;
//                         const d = combinedData[index];
//                         return [
//                             `Month: ${d.month}`,
//                             `Income: ${d.income}`,
//                             `Expense: ${d.expense}`,
//                             `Balance: ${d.balance}`
//                         ];
//                     }
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ width: '100%', height: '400px' }}>
//             <Doughnut data={data} options={options} />
//         </div>
//     );
// };

// export default MyPieChart;

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MyPieChart = ({ combinedData }) => {
    const colors = [
        '#ffcc00', // January
        '#ff6600', // February
        '#ff5050', // March
        '#ff3399', // April
        '#cc33ff', // May
        '#9966ff', // June
        '#6699ff', // July
        '#99ccff', // August
        '#66ff99', // September
        '#33cc33', // October
        'gray', // November
        'red'  // December
    ];

    const data = {
        labels: combinedData.map(d => d.month),
        datasets: [{
            data: combinedData.map(() => 1), // Equal parts for each month
            backgroundColor: combinedData.map((_, i) => colors[i % colors.length]),
            hoverOffset: 8
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const index = context.dataIndex;
                        const d = combinedData[index];
                        return [
                            `Month: ${d.month}`,
                            `Income: ${d.income}`,
                            `Expense: ${d.expense}`,
                            `Savings: ${d.savings}`,
                            `Balance: ${d.balance}`
                        ];
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default MyPieChart;
