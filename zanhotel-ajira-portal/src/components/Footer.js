import React, { useState } from "react";

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Social media icons from public folder
  const socialMedia = [
    { name: "facebook", icon: "/facebook.png", url: "#" },
    { name: "instagram", icon: "/instagram.png", url: "#" },
    { name: "twitter", icon: "/twitter.png", url: "#" },
    { name: "youtube", icon: "/youtube.png", url: "#" },
    { name: "tiktok", icon: "/tiktok.png", url: "#" },
    { name: "linkedin", icon: "/linkedin.png", url: "#" },
    { name: "google", icon: "/google.png", url: "#" },
    { name: "gmail", icon: "/gmail.png", url: "mailto:support@zanhotelajira.tz" },
    { name: "whatsapp", icon: "/whatsapp.png", url: "https://wa.me/255654598085" },
    
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>
            <span style={styles.logoText}>ZanHotel-Ajira Portal</span>
          </h3>
          <p style={styles.text}>
            Jukwaa la kidijitali linalowezesha vijana kutuma maombi ya kazi katika hoteli mbalimbali Tanzania kwa urahisi.
          </p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Viungo vya Haraka</h4>
          <div style={styles.horizontalLinks}>
            {['Home', 'Register', 'Login', 'About', 'Contact'].map((link) => (
              <a 
                key={link}
                href={`/${link.toLowerCase()}`}
                style={{
                  ...styles.horizontalLink,
                  transform: hoveredLink === link ? 'translateY(-3px)' : 'none',
                  color: hoveredLink === link ? '#1a98e0' : '#ccc',
                  boxShadow: hoveredLink === link ? '0 2px 0 #1a98e0' : 'none'
                }}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div style={styles.section}>
  <h4 style={styles.heading}>Wasiliana Nasi</h4>

  <div style={styles.contactItem}>
    <img
      src="/gmail.png"
      alt="Gmail"
      style={{ width: "20px", height: "20px", marginRight: "8px" }}
    />
    <p style={styles.text}>support@zanhotelajira.tz</p>
  </div>

  <div style={styles.contactItem}>
    <img
      src="/phone-call.png"
      alt="Phone"
      style={{ width: "20px", height: "20px", marginRight: "8px" }}
    />
    <p style={styles.text}>+255 712 345 678</p>
  </div>

  <div style={styles.contactItem}>
    <img
      src="/map.png"
      alt="Location"
      style={{ width: "20px", height: "20px", marginRight: "8px" }}
    />
    <p style={styles.text}>Zanzibar, Tanzania</p>
  </div>
</div>

      </div>

      <div style={styles.socialMediaBar}>
        <div style={styles.socialIcons}>
          {socialMedia.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.socialIcon,
                transform: hoveredIcon === social.name ? 'scale(1.2)' : 'none',
                backgroundColor: hoveredIcon === social.name ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
              onMouseEnter={() => setHoveredIcon(social.name)}
              onMouseLeave={() => setHoveredIcon(null)}
              aria-label={social.name}
            >
              <img
                src={social.icon}
                alt={social.name}
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
            </a>
          ))}
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          &copy; {new Date().getFullYear()} ZanHotel-Ajira Portal. Haki zote zimehifadhiwa.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0d2b57",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: "20px 0",
  },
  section: {
    flex: 1,
    minWidth: "150px",
    margin: "0 10px",
  },
  heading: {
    fontSize: "16px",
    marginBottom: "8px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  logoText: {
    background: 'linear-gradient(90deg, #fff, #1a98e0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: '600'
  },
  text: { fontSize: "13px", lineHeight: "1.5", opacity: 0.9, margin: "6px 0" },
  horizontalLinks: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
  horizontalLink: { color: "#ccc", textDecoration: "none", fontSize: "13px", transition: 'all 0.2s ease', fontWeight: '500' },
  contactItem: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  contactIcon: { marginRight: '8px', fontSize: '14px' },
  socialMediaBar: { display: 'flex', justifyContent: 'center', padding: '10px 0', backgroundColor: '#05193f' },
  socialIcons: { display: 'flex', gap: '15px' },
  socialIcon: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' },
  bottomBar: { textAlign: "center", padding: "10px 0", fontSize: "13px", backgroundColor: "#05193f" },
  copyright: { margin: 0, opacity: 0.8 }
};

export default Footer;
