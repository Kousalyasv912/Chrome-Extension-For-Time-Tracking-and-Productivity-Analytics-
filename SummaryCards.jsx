import React, { useEffect, useState } from "react";

function SummaryCards() {
  const [stats, setStats] = useState({
    productiveMinutes: 0,
    unproductiveMinutes: 0,
    sessionCount: 0
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/debug/sessions")
      .then(res => res.json())
      .then(data => {
        let productive = 0;
        let unproductive = 0;
        let count = 0;

        data.forEach(site => {
          productive += site.productiveMinutes;
          unproductive += site.unproductiveMinutes;
          if (site.productiveMinutes > 0 || site.unproductiveMinutes > 0) {
            count++;
          }
        });

        setStats({
          productiveMinutes: Math.round(productive),
          unproductiveMinutes: Math.round(unproductive),
          sessionCount: count
        });
      })
      .catch(err => console.error("Failed to load summary stats:", err));
  }, []);

  const cards = [
    {
      label: "Total Productive Minutes",
      value: stats.productiveMinutes,
      color: "#d1fae5", // green background
      textColor: "#065f46" // green text
    },
    {
      label: "Total Unproductive Minutes",
      value: stats.unproductiveMinutes,
      color: "#fee2e2", // red background
      textColor: "#991b1b" // red text
    },
    {
      label: "Sessions Tracked",
      value: stats.sessionCount,
      color: "#e0f2fe", // blue background
      textColor: "#1e3a8a" // blue text
    }
  ];

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            backgroundColor: card.color,
            color: card.textColor,
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{card.value}</h2>
          <p style={{ fontSize: "1rem" }}>{card.label}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
