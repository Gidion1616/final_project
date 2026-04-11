import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  
  const backgrounds = [
    "linear-gradient(135deg, rgba(13,43,87,0.9) 0%, rgba(0,123,255,0.7) 100%), url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')",
    "linear-gradient(135deg, rgba(40,167,69,0.9) 0%, rgba(110,69,226,0.7) 100%), url('https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')",
    "linear-gradient(135deg, rgba(220,53,69,0.9) 0%, rgba(253,126,20,0.7) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')"
  ];

  useEffect(() => {
    let isActive = true;
    const timer = setTimeout(() => {
      if (isActive) {
        setCurrentBg(prev => (prev + 1) % backgrounds.length);
      }
    }, 8000);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [currentBg]);

  const handleSelection = (userType, action) => {
    navigate(`/${userType}/${action}`);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Background with optimized transition */}
      <div style={{
        ...styles.background,
        backgroundImage: backgrounds[currentBg],
        transition: "background-image 1.2s ease-in-out",
        willChange: "background-image"
      }}></div>
      
      {/* Main content */}
      <div style={styles.contentWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.contentContainer}
        >
          <motion.h1
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={styles.heading}
          >
            Welcome to ZanHotel Ajira Portal
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={styles.subtitle}
          >
            Please select your user type and action
          </motion.p>

          <div style={styles.cardGroup}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={styles.card}
            >
              <h2 style={styles.cardTitle}>JobSeeker</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.button}
                onClick={() => handleSelection("jobseeker", "register")}
              >
                Register
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ ...styles.button, ...styles.loginBtn }}
                onClick={() => handleSelection("jobseeker", "login")}
              >
                Login
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={styles.card}
            >
              <h2 style={styles.cardTitle}>Hotel</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.button}
                onClick={() => handleSelection("hotel", "register")}
              >
                Register
              </motion.button>
              <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  style={{ ...styles.button, ...styles.loginBtn }}
  onClick={() => window.location.href = "/hotel-login"}
>
  Login
</motion.button>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100px",
    position: "relative",
    color: "white"
  },
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1,
    willChange: "transform"
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    marginBottom: "60px" // Space for footer
  },
  contentContainer: {
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: "20px",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
  },
  heading: {
    marginBottom: "15px",
    fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "clamp(1rem, 2vw, 1.1rem)",
    color: "rgba(255,255,255,0.9)",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
  },
  cardGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap"
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "25px",
    borderRadius: "15px",
    width: "240px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  cardTitle: {
    color: "white",
    marginBottom: "20px",
    fontSize: "1.4rem"
  },
  button: {
    marginTop: "12px",
    width: "100%",
    padding: "12px 0",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  },
  loginBtn: {
    backgroundColor: "#28a745"
  },
  // Footer styles
  footer: {
    backgroundColor: "#0d2b57",
    color: "#fff",
    paddingTop: "20px",
    width: "100%",
    flexShrink: 0
  },
  footerContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "0 15px 15px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  footerSection: {
    textAlign: "center"
  },
  footerHeading: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "white"
  },
  footerText: {
    fontSize: "13px",
    lineHeight: "1.4",
    margin: "5px 0",
    color: "rgba(255,255,255,0.8)"
  },
  footerBottomBar: {
    borderTop: "1px solid #444",
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    backgroundColor: "#05193f"
  },
  footerCopyright: {
    margin: 0,
    color: "rgba(255,255,255,0.8)"
  }
};

export default UserTypeSelection;