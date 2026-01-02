import React from "react";

function SiteBreakdown({ data }) {
  const entries = Object.entries(data).filter(
    ([site]) => site && site !== "undefined"
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Site Breakdown</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Site</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Productive Minutes</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Unproductive Minutes</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([site, stats]) => (
            <tr key={site}>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{site}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                {stats.productiveMinutes ?? 0}
              </td>
              <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
                {stats.unproductiveMinutes ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SiteBreakdown;
