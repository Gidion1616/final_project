// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const JobseekerLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/api/jobseeker/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store the authentication token and user info
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user_id", data.user_id);
//         localStorage.setItem("email", data.email);
//         localStorage.setItem("userRole", "jobseeker");

//         // Redirect to User Dashboard
//         navigate("/dashboard");
//       } else {
//         alert(data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Server error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Jobseeker Login</h2>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <button
//           type="submit"
//           style={styles.button}
//           disabled={isLoading}
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "60px auto",
//     padding: "30px",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     marginBottom: "15px",
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//   },
//   button: {
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "16px",
//     transition: "background-color 0.3s",
//   },
// };

// export default JobseekerLogin;
