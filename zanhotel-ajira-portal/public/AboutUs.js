import React, { useEffect } from "react";

const AboutUs = () => {
  useEffect(() => {
    // Add animation styles to document head
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes textShine {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={styles.outerContainer}>
      <div style={styles.animatedBackground}></div>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          <span style={styles.headingText}>Kuhusu ZanHotel-Ajira Portal</span>
        </h1>

        <div style={styles.content}>
          <p style={styles.paragraph}>
            <strong style={styles.highlight}>ZanHotel-Ajira Portal</strong> ni mfumo wa kidigitali uliobuniwa mahsusi
            kusaidia wananchi wa Tanzania kupata fursa za ajira katika sekta ya hoteli kwa njia rahisi, ya kisasa,
            na yenye uwazi. Mfumo huu unalenga kuunganisha waombaji wa kazi na hoteli mbalimbali nchini kwa kutumia
            teknolojia ya kisasa ya mtandao.
          </p>

          <p style={{...styles.paragraph, animationDelay: '0.2s'}}>
            Kwa muda mrefu, waombaji wa kazi wamekuwa wakikumbana na changamoto kama:
            kutokujua wapi pa kupeleka maombi ya kazi hivyo inawalazimu kutumia mawakala (Agents) hali ambayo ilipelekea kudhurumiwa, Unyanyasaji wa kijinsia (Sexual Harasment), kukosa taarifa za nafasi za kazi mpya,
            au kulazimika kwenda moja kwa moja kwenye hoteli bila uhakika wa kupokelewa.
          </p>

          <p style={{...styles.paragraph, animationDelay: '0.4s'}}>
            Kupitia ZanHotel-Ajira Portal, waombaji wa kazi sasa wanaweza:
            kuunda akaunti, kupakia CV, vyeti vya taaluma, uzoefu wa kazi, na picha rasmi.
            Pia wanaweza kutuma maombi ya kazi moja kwa moja mtandaoni kwa hoteli zilizochapisha nafasi.
            Kwa upande wa hoteli, mfumo huu huwasaidia kupokea, kuhifadhi, na kupitia taarifa zote za waombaji kwa urahisi na haraka.
          </p>

          <p style={{...styles.paragraph, animationDelay: '0.6s'}}>
            Zaidi ya hayo, mfumo unajumuisha mafunzo ya Maadili na Elimu ya Ajira pamoja na
            sehemu ya kuripoti malalamiko au changamoto zinazojitokeza — yote haya kwa lengo la kuboresha uwajibikaji na haki kazini.
          </p>

          <p style={{...styles.paragraph, animationDelay: '0.8s'}}>
            Tunaamini kuwa kupitia ZanHotel-Ajira Portal, tutachangia kwa kiasi kikubwa
            kupunguza tatizo la ukosefu wa ajira na kukuza sekta ya utalii na huduma nchini.
          </p>
        </div>

        <p style={styles.signature}>
          Kwa pamoja, tuijenge Zanzibar-Tanzania yenye fursa sawa kwa wote.  
          <br />
          <span style={styles.teamSignature}>— Timu ya ZanHotel-Ajira</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    position: 'relative',
    minHeight: '100vh',
    padding: '40px 20px',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #007bff, #00bfff, #1e90ff, #00bfff, #007bff)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    zIndex: -1,
    opacity: 0.1,
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    position: 'relative',
    overflow: 'hidden',
  },
  heading: {
    textAlign: "center",
    marginBottom: "40px",
    position: 'relative',
  },
  headingText: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #007bff, #00bfff, #007bff)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontSize: '2.5rem',
    fontWeight: '700',
    paddingBottom: '10px',
    animation: 'textShine 3s linear infinite',
  },
  content: {
    marginBottom: '30px',
  },
  paragraph: {
    fontSize: "18px",
    color: "#333",
    lineHeight: "1.8",
    marginBottom: '25px',
    opacity: 0,
    animation: 'fadeInUp 0.8s ease-out forwards',
    animationDelay: '0s',
  },
  highlight: {
    color: '#007bff',
    fontWeight: '600',
    background: 'linear-gradient(to right, #007bff, #00bfff)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline',
  },
  signature: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "40px",
    color: "#555",
    fontSize: '18px',
    animation: 'fadeInUp 0.8s ease-out forwards',
    animationDelay: '1s',
    opacity: 0,
  },
  teamSignature: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: '20px',
  },
};

export default AboutUs;