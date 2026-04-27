import React, { useState } from "react";

const HomeSettings = () => {
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState("");

  const saveSettings = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/admin/settings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ title, banner }),
    });

    alert("Settings updated");
  };

  return (
    <div>
      <h2>Home Page Settings</h2>

      <input
        placeholder="Homepage Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Banner Text"
        value={banner}
        onChange={(e) => setBanner(e.target.value)}
      />

      <button onClick={saveSettings}>Save</button>
    </div>
  );
};

export default HomeSettings;