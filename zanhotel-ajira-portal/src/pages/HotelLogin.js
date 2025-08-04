import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HotelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/hotel-login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, // DRF token auth uses 'username' even for email login
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("hotel_id", data.hotel_id);
      localStorage.setItem("hotel_name", data.hotel_name);
      localStorage.setItem("email", data.email);
      alert("Login successful!");
      navigate("/dashboard"); // or /hotel-home etc.
    } else {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Hotel Login</h2>
      <form onSubmit={handleLogin}>
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          className="w-full border p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default HotelLogin;
