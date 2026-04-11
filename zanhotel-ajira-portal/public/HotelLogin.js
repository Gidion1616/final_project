import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HotelLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    return () => { document.body.style.overflow = "visible"; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/hotel/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for session cookie
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("hotelName", data.hotel_name);
        localStorage.setItem("hotel_id", data.hotel_id);
        localStorage.setItem("email", data.email);

        navigate("/hotel-dashboard"); // redirect after login
      } else {
        alert(data.error || "Login failed. Check credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.background}>
        <div style={styles.particles}></div>
        <div
          style={{
            ...styles.formBox,
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.5s ease-in-out",
          }}
        >
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🏨</div>
            <h2 style={styles.title}>Hotel Login</h2>
          </div>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Hotel Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  background: { flex: 1, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center",
    background: "linear-gradient(-45deg, #0d2b57, #1a4b8c, #247ba0, #1b98e0)", backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite", position: "relative"
  },
  particles: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: "url('https://www.transparenttextures.com/patterns/diagmonds.png')",
    opacity: 0.1, zIndex: 1
  },
  formBox: { backgroundColor: "rgba(255,255,255,0.95)", padding: "25px", borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)", width: "90%", maxWidth: "350px", textAlign: "center", zIndex: 2
  },
  logoContainer: { marginBottom: "15px" },
  logo: { fontSize: "36px", marginBottom: "8px", animation: "bounce 2s infinite" },
  title: { margin: 0, color: "#0d2b57", fontSize: "20px", fontWeight: "600" },
  form: { display: "flex", flexDirection: "column" },
  input: { width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
  button: { padding: "10px", backgroundColor: "#1a98e0", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }
};

// Animations
const globalStyles = `
@keyframes gradient {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes bounce {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
`;
const styleEl = document.createElement("style"); styleEl.innerHTML = globalStyles; document.head.appendChild(styleEl);

export default HotelLogin;
