import React from "react";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Kuhusu ZanHotel-Ajira Portal</h1>

      <p style={styles.paragraph}>
        <strong>ZanHotel-Ajira Portal</strong> ni mfumo wa kidigitali uliobuniwa mahsusi
        kusaidia wananchi wa Tanzania kupata fursa za ajira katika sekta ya hoteli kwa njia rahisi, ya kisasa,
        na yenye uwazi. Mfumo huu unalenga kuunganisha waombaji wa kazi na hoteli mbalimbali nchini kwa kutumia
        teknolojia ya kisasa ya mtandao.
      </p>

      <p style={styles.paragraph}>
        Kwa muda mrefu, waombaji wa kazi wamekuwa wakikumbana na changamoto kama:
        kutokujua wapi pa kupeleka maombi ya kazi hivyo inawalazimu kutumia mawakala (Agents) hali ambayo ilipelekea kudhurumiwa, Unyanyasaji wa kijinsia (Sexual Harasment), kukosa taarifa za nafasi za kazi mpya,
        au kulazimika kwenda moja kwa moja kwenye hoteli bila uhakika wa kupokelewa.
      </p>

      <p style={styles.paragraph}>
        Kupitia ZanHotel-Ajira Portal, waombaji wa kazi sasa wanaweza:
        kuunda akaunti, kupakia CV, vyeti vya taaluma, uzoefu wa kazi, na picha rasmi.
        Pia wanaweza kutuma maombi ya kazi moja kwa moja mtandaoni kwa hoteli zilizochapisha nafasi.
        Kwa upande wa hoteli, mfumo huu huwasaidia kupokea, kuhifadhi, na kupitia taarifa zote za waombaji kwa urahisi na haraka.
      </p>

      <p style={styles.paragraph}>
        Zaidi ya hayo, mfumo unajumuisha mafunzo ya Maadili na Elimu ya Ajira pamoja na
        sehemu ya kuripoti malalamiko au changamoto zinazojitokeza — yote haya kwa lengo la kuboresha uwajibikaji na haki kazini.
      </p>

      <p style={styles.paragraph}>
        Tunaamini kuwa kupitia ZanHotel-Ajira Portal, tutachangia kwa kiasi kikubwa
        kupunguza tatizo la ukosefu wa ajira na kukuza sekta ya utalii na huduma nchini.
      </p>

      <p style={styles.signature}>
        Kwa pamoja, tuijenge Zanzibar-Tanzania yenye fursa sawa kwa wote.  
        <br />
        — Timu ya ZanHotel-Ajira
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    lineHeight: "1.7",
  },
  heading: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: "30px",
  },
  paragraph: {
    fontSize: "17px",
    color: "#333",
    marginBottom: "20px",
  },
  signature: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "40px",
    color: "#555",
  },
};

export default AboutUs;
