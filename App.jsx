import React from "react";
import SummaryCards from "./components/SummaryCards";
import WeeklyChart from "./components/WeeklyChart";
import SiteBreakdown from "./components/SiteBreakdown";

function App() {
  const userId = "kousalya@local"; // static for now, can be dynamic later

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>FocusFlow Dashboard</h1>

      {/* Summary cards */}
      <SummaryCards userId={userId} />

      {/* Weekly productivity chart */}
      <WeeklyChart userId={userId} />

      {/* Site breakdown table */}
      <SiteBreakdown userId={userId} />
    </div>
  );
}

export default App;
