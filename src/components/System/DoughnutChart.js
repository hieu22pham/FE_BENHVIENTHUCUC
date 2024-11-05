import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const DoughnutChart = ({ totalBooking, totalCancleBooking }) => {
    const data = {
        labels: ["Lịch đặt", "Lịch hủy"],
        datasets: [
            {
                data: [totalBooking, totalCancleBooking],
                backgroundColor: [
                    "rgba(53, 162, 235, 0.5)",
                    "rgba(255, 99, 132, 0.5)",
                ],
                hoverBackgroundColor: [
                    "rgba(53, 162, 235, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
            },
        ],
    };

    const options = {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const total = dataset.data.reduce(
                        (previousValue, currentValue) =>
                            previousValue + currentValue
                    );
                    const currentValue = dataset.data[tooltipItem.index];
                    const percentage = ((currentValue / total) * 100).toFixed(
                        2
                    );
                    return `${data.labels[tooltipItem.index]}: ${percentage}%`;
                },
            },
        },
    };

    return (
        <div className="chart-item mt-5">
            <div className="chart-header">
                <span>Tỉ lệ</span>
            </div>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;
