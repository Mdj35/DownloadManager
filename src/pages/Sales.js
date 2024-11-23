import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Header from './SuperAdminHeader';
import '../styles/SalesPage.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const SalesPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );
    const [salesData, setSalesData] = useState([]);
    const [totalSalesPerMonth, setTotalSalesPerMonth] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            const username = prompt('Enter username:');
            const password = prompt('Enter password:');
            if (username === 'admin' && password === 'password123') {
                setIsAuthenticated(true);
                localStorage.setItem('isAuthenticated', 'true');
            } else {
                alert('Invalid credentials! Redirecting...');
                window.location.href = '/';
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetch('https://vynceianoani.helioho.st/getsales.php')
                .then(response => response.json())
                .then(data => {
                    setSalesData(data.sales);
                    const formattedServiceData = data.services.map(item => ({
                        service: item.service_name,
                        count: item.service_count,
                    }));
                    setServiceData(formattedServiceData);

                    const totalSales = data.sales.reduce((acc, curr) => {
                        acc[curr.month_year] = (acc[curr.month_year] || 0) + parseFloat(curr.total_sales);
                        return acc;
                    }, {});
                    const totalSalesArray = Object.keys(totalSales).map(monthYear => ({
                        monthYear,
                        total: totalSales[monthYear].toFixed(2),
                    }));
                    setTotalSalesPerMonth(totalSalesArray);
                })
                .catch(error => console.error('Error fetching sales data:', error));
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    if (!isAuthenticated) return null;

    const lineChartData = {
        labels: salesData.map(item => item.month_year),
        datasets: [
            {
                label: 'Total Sales',
                data: salesData.map(item => item.total_sales),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    };

    const barChartData = {
        labels: totalSalesPerMonth.map(item => item.monthYear),
        datasets: [
            {
                label: 'Total Sales per Month',
                data: totalSalesPerMonth.map(item => item.total),
                backgroundColor: 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const doughnutData = {
        labels: serviceData.map(item => item.service),
        datasets: [
            {
                data: serviceData.map(item => item.count),
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    };

    return (
        <div className="sales-page-container">
            <Header />
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <div className="dashboard">
                <div className="card">
                    <h2>Weekly Sales</h2>
                    <Line data={lineChartData} />
                </div>
                <div className="card">
                    <h2>Sales per Month</h2>
                    <Bar data={barChartData} />
                </div>
                <div className="card">
                    <h2>Service Categories</h2>
                    <Doughnut data={doughnutData} />
                </div>
                <div className="card summary">
                    <h3>Sales Summary</h3>
                    <ul>
                        {totalSalesPerMonth.length === 0 ? (
                            <li>No sales data available.</li>
                        ) : (
                            totalSalesPerMonth.map((item, index) => (
                                <li key={index}>
                                    {item.monthYear}: ₱{item.total}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;