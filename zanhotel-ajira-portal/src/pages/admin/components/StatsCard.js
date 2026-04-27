import React, { useEffect, useState } from "react";

const StatsCards = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    jobs: 0,
    applications: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/admin/stats/", {
        headers: { Authorization: `Token ${token}` },
      });

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.grid}>
      <Card title="Hotels" value={stats.hotels} />
      <Card title="Jobs" value={stats.jobs} />
      <Card title="Applications" value={stats.applications} />
      <Card title="Users" value={stats.users} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};

export default StatsCards;