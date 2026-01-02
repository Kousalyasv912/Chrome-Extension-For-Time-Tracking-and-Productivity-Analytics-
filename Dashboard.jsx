import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeChart, setActiveChart] = useState("none");

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/sessions/summary");
      const data = await res.json();
      setSummary(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  const productiveTotal = summary.reduce((acc, s) => acc + s.productiveMinutes, 0);
  const unproductiveTotal = summary.reduce((acc, s) => acc + s.unproductiveMinutes, 0);

  const pieData = {
    labels: ["Productive", "Unproductive"],
    datasets: [
      {
        data: [productiveTotal, unproductiveTotal],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const barData = {
    labels: summary.map((s) => s.site || "(unknown)"),
    datasets: [
      {
        label: "Productive Minutes",
        data: summary.map((s) => s.productiveMinutes),
        backgroundColor: "#4caf50",
      },
      {
        label: "Unproductive Minutes",
        data: summary.map((s) => s.unproductiveMinutes),
        backgroundColor: "#f44336",
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <h1 style={{ color: "#8a2be2", textAlign: "center", marginBottom: "20px" }}>FocusFlow Dashboard</h1>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <p>Last updated: {lastUpdated}</p>
        <button
          onClick={fetchSummary}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #8a2be2",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Main Content: Table + Charts */}
      <div style={{ display: "flex", flexGrow: 1, gap: "40px" }}>
        {/* Table Section */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#111" }}>
            <thead>
              <tr style={{ backgroundColor: "#222" }}>
                <th>Site</th>
                <th>Productive Minutes</th>
                <th>Unproductive Minutes</th>
                <th>Total Minutes</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.site || "(unknown)"}</td>
                  <td>{row.productiveMinutes}</td>
                  <td>{row.unproductiveMinutes}</td>
                  <td>{row.totalMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
          {activeChart === "none" && (
            <p style={{ color: "#888", fontSize: "18px", marginBottom: "20px" }}>
              Select a chart to view productivity insights.
            </p>
          )}

          {activeChart === "pie" && (
            <div style={{ width: "100%", maxWidth: "400px", height: "300px", marginBottom: "20px" }}>
              <h2 style={{ color: "#8a2be2", textAlign: "center" }}>Pie Chart</h2>
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          )}

          {activeChart === "bar" && (
            <div style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
              <h2 style={{ color: "#8a2be2", textAlign: "center" }}>Bar Chart</h2>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { labels: { color: "#fff" } } },
                  scales: {
                    x: { ticks: { color: "#fff" } },
                    y: { ticks: { color: "#fff" } },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chart Switch Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setActiveChart("pie")}
          style={{
            backgroundColor: "#8a2be2",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Show Pie Chart
        </button>
        <button
          onClick={() => setActiveChart("bar")}
          style={{
            backgroundColor: "#8a2be2",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Show Bar Chart
        </button>
      </div>
    </div>
  );
}
