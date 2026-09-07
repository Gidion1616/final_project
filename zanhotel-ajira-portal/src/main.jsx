import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./portal/App";
import "./portal/style.css";

// Hapa React inaanzishwa ndani ya div yenye id="root" iliyopo index.html.
// BrowserRouter huwezesha App kubadilisha page bila browser kuload upya.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
