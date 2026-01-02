import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WeeklyChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p>Loading chart...</p>;
  }

  // Filter out undefined or empty domains
  const filteredEntries = Object.entries(data).filter(
    ([site]) => site && site !== "undefined"
  );

  const labels = filteredEntries.map(([site]) => site);
  const productive = filteredEntries.map(
    ([, stats]) => stats.productiveMinutes ?? 0
  );
  const unproductive = filteredEntries.map(
    ([, stats]) => stats.unproductiveMinutes ?? 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Productive Minutes",
        data: productive,
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      },
      {
        label: "Unproductive Minutes",
        data: unproductive,
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Productivity by Site" }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 }
      }
    }
  };

  return (
    <div className="weekly-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default WeeklyChart;
