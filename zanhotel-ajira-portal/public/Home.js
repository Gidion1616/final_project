// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();
  
//   // Local background images from public folder
//   const backgrounds = [
//     "url('/ht1.jpg')",
//     "url('/ht2.jpg')",
//     "url('/ht3.jpg')",
//     "url('/ht4.jpg')",
//     "url('/ht5.jpg')",
//     "url('/ht6.jpg')"
//   ];

//   // Enhanced transition effect
//   useEffect(() => {
//     let current = 0;
//     const bgElement = document.querySelector(".bg-container");
//     const bgInterval = setInterval(() => {
//       bgElement.style.opacity = 0;
//       setTimeout(() => {
//         bgElement.style.backgroundImage = 
//           backgrounds[(current = (current + 1) % backgrounds.length)];
//         bgElement.style.opacity = 1;
//       }, 1000);
//     }, 5000);
//     return () => clearInterval(bgInterval);
//   }, []);

//   // Handle CTA button click
//   const handleGetStarted = () => {
//     navigate("/select-user");
//   };

//   // Inline CSS with enhanced effects
//   const styles = {
//     homeContainer: {
//       position: "relative",
//       minHeight: "100vh",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "space-between",
//       overflow: "hidden",
//     },
//     bgContainer: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: "60px",
//       backgroundImage: "url('/ht1.jpg')",
//       backgroundSize: "cover",
//       backgroundRepeat: "no-repeat",
//       backgroundPosition: "center center",
//       transition: "opacity 1s ease-in-out",
//       zIndex: -1,
//       opacity: 1,
//     },
//     contentWrapper: {
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//     },
//     content: {
//       padding: "2rem",
//       color: "white",
//       textAlign: "center",
//       maxWidth: "900px",
//       margin: "0 auto",
//       width: "100%",
//       textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
//     },
//     mainTitle: {
//       fontSize: "clamp(2rem, 5vw, 3.5rem)",
//       marginBottom: "1rem",
//       fontWeight: 700,
//     },
//     subtitle: {
//       fontSize: "clamp(1rem, 2vw, 1.5rem)",
//       marginBottom: "2rem",
//       fontWeight: 300,
//     },
//     featuresGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//       gap: "1.5rem",
//       margin: "2rem auto",
//       maxWidth: "900px",
//     },
//     featureCard: {
//       background: "rgba(255,255,255,0.15)",
//       backdropFilter: "blur(10px)",
//       padding: "1.5rem",
//       borderRadius: "15px",
//       border: "1px solid rgba(255,255,255,0.2)",
//       transition: "all 0.4s ease",
//       boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//     },
//     featureIcon: {
//       fontSize: "2.2rem",
//       marginBottom: "1rem",
//       filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
//     },
//     ctaButton: {
//       background: "linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%)",
//       border: "none",
//       padding: "1rem 2rem",
//       fontSize: "1rem",
//       borderRadius: "50px",
//       color: "white",
//       cursor: "pointer",
//       marginTop: "1.5rem",
//       boxShadow: "0 6px 20px rgba(110, 69, 226, 0.4)",
//       fontWeight: 600,
//       letterSpacing: "0.5px",
//       transition: "all 0.3s ease",
//     },
//     footer: {
//       height: "60px",
//       backgroundColor: "rgba(0,0,0,0.7)",
//       color: "white",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1,
//     },
//   };

//   // Reduced to 3 features
//   const features = [
//     {
//       icon: "🚀",
//       title: "Blazing Fast",
//       desc: "Optimized for instant loading"
//     },
//     {
//       icon: "✨",
//       title: "Modern Design",
//       desc: "Sleek and intuitive interface"
//     },
//     {
//       icon: "🛡️",
//       title: "Secure",
//       desc: "Enterprise-grade protection"
//     }
//   ];

//   return (
//     <div style={styles.homeContainer}>
//       {/* Full-screen background ending at footer */}
//       <div className="bg-container" style={styles.bgContainer}></div>
      
//       {/* Content overlay */}
//       <div style={styles.contentWrapper}>
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1.5 }}
//           style={styles.content}
//         >
//           <motion.h1
//             animate={{ y: [-30, 0] }}
//             transition={{ duration: 0.8, type: "spring" }}
//             style={styles.mainTitle}
//           >
//             Karibu ZanHotel-Ajira Portal
//           </motion.h1>

//           <motion.p
//             animate={{ x: [-60, 0] }}
//             transition={{ delay: 0.4, duration: 0.8 }}
//             style={styles.subtitle}
//           >
//             Pata fursa za ajira katika hoteli mbalimbali za Zanzibar. Unganisha na
//             waajiri na fursa za mafunzo kwa urahisi.
//           </motion.p>

//           {/* Features Grid */}
//           <div style={styles.featuresGrid}>
//             {features.map((feature, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.15, duration: 0.6 }}
//                 whileHover={{ 
//                   scale: 1.05,
//                   boxShadow: "0 12px 40px rgba(0,0,0,0.3)"
//                 }}
//                 style={styles.featureCard}
//               >
//                 <div style={styles.featureIcon}>{feature.icon}</div>
//                 <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem" }}>{feature.title}</h3>
//                 <p style={{ opacity: 0.9, fontSize: "0.9rem" }}>{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>

//           {/* CTA Button */}
//           <motion.button
//             whileHover={{ 
//               scale: 1.05,
//               boxShadow: "0 8px 25px rgba(110, 69, 226, 0.6)"
//             }}
//             whileTap={{ scale: 0.95 }}
//             style={styles.ctaButton}
//             onClick={handleGetStarted}
//           >
//             Anza Sasa
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <footer style={styles.footer}>
//         <p>&copy; {new Date().getFullYear()} ZanHotel-Ajira Portal</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;