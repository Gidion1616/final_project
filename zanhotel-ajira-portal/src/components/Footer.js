import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3>ZanHotel-Ajira Portal</h3>
          <p>
            Jukwaa la kidijitali linalowezesha vijana kutuma maombi ya kazi katika hoteli mbalimbali Tanzania kwa urahisi.
          </p>
        </div>

        <div style={styles.section}>
          <h4>Viungo vya Haraka</h4>
          <ul style={styles.links}>
            <li><a href="/" style={styles.link}>Home</a></li>
            <li><a href="/register" style={styles.link}>Register</a></li>
            <li><a href="/login" style={styles.link}>Login</a></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4>Wasiliana Nasi</h4>
          <p>Email: support@zanhotelajira.tz</p>
          <p>Simu: +255 712 345 678</p>
          <p>Zanzibar, Tanzania</p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} ZanHotel-Ajira Portal. Haki zote zimehifadhiwa.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0d2b57ff",
    color: "#fff",
    paddingTop: "30px",
    marginTop: "50px",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: "0 20px 30px",
  },
  section: {
    flex: "1",
    minWidth: "250px",
    margin: "10px",
  },
  links: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
  bottomBar: {
    borderTop: "1px solid #444",
    textAlign: "center",
    padding: "15px 10px",
    fontSize: "14px",
    backgroundColor: "#05193fff",
  },
};

export default Footer;
