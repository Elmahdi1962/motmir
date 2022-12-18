import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

export const baseUrl = "https://motmir-api.onrender.com"; // 'http://localhost:5000' Api's base url
export const imagesUrl = "https://ik.imagekit.io/motmir/";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
